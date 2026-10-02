
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function todayIST() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export async function GET(request: NextRequest) {
  try {
    const header = request.headers.get("authorization");

    if (!header?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Please log in." },
        { status: 401 }
      );
    }

    const auth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await auth.auth.getUser(header.slice(7));

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid session." },
        { status: 401 }
      );
    }

    const admin = getSupabaseAdmin();

    const { data: employee, error: employeeError } =
      await admin
        .from("hr_employees")
        .select("id, full_name")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

    if (employeeError) throw employeeError;

    if (!employee) {
      return NextResponse.json(
        { error: "Active employee not found." },
        { status: 403 }
      );
    }

    const today = todayIST();
    const month =
      request.nextUrl.searchParams.get("month") ??
      today.slice(0, 7);

    if (
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
      month > today.slice(0, 7)
    ) {
      return NextResponse.json(
        { error: "Please select a valid month." },
        { status: 400 }
      );
    }

    const [year, monthNumber] = month.split("-").map(Number);
    const daysInMonth = new Date(
      Date.UTC(year, monthNumber, 0)
    ).getUTCDate();

    const monthStart = `${month}-01`;
    const monthEnd = `${month}-${String(daysInMonth).padStart(
      2,
      "0"
    )}`;

    const { data: attendance, error: attendanceError } =
      await admin
        .from("hr_attendance")
        .select(
          "attendance_date, check_in_at, check_out_at, late_minutes"
        )
        .eq("employee_id", employee.id)
        .gte("attendance_date", monthStart)
        .lte("attendance_date", monthEnd);

    if (attendanceError) throw attendanceError;

    const { data: leaves, error: leaveError } =
      await admin
        .from("hr_leave_requests")
        .select("start_date, end_date, leave_type")
        .eq("employee_id", employee.id)
        .eq("status", "approved")
        .lte("start_date", monthEnd)
        .gte("end_date", monthStart);

    if (leaveError) throw leaveError;

    const attendanceByDate = new Map(
      (attendance ?? []).map((record) => [
        record.attendance_date,
        record,
      ])
    );

    const days = Array.from(
      { length: daysInMonth },
      (_, index) => {
        const date = `${month}-${String(index + 1).padStart(
          2,
          "0"
        )}`;

        const weekday = new Date(
          `${date}T00:00:00Z`
        ).getUTCDay();

        const record = attendanceByDate.get(date);

        const leave = (leaves ?? []).find(
          (item) =>
            date >= item.start_date &&
            date <= item.end_date
        );

        let status:
          | "present"
          | "leave"
          | "holiday"
          | "no_check_in"
          | "future";

        if (record) {
          status = "present";
        } else if (date > today) {
          status = "future";
        } else if (weekday === 1) {
          status = "holiday";
        } else if (leave) {
          status = "leave";
        } else {
          status = "no_check_in";
        }

        return {
          date,
          status,
          checkIn: record?.check_in_at ?? null,
          checkOut: record?.check_out_at ?? null,
          lateMinutes: record?.late_minutes ?? 0,
          leaveType:
            status === "leave"
              ? leave?.leave_type ?? null
              : null,
        };
      }
    );

    return NextResponse.json({
      success: true,
      month,
      employeeName: employee.full_name,
      weeklyHoliday: "Monday",
      days,
    });
  } catch (error) {
    console.error("Employee calendar error:", error);

    return NextResponse.json(
      { error: "Unable to load attendance calendar." },
      { status: 500 }
    );
  }
}
