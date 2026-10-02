
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getTodayInIndia() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

export async function GET(request: NextRequest) {
  try {
    // Step 1: Verify employee session.
    const authorization =
      request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    const auth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await auth.auth.getUser(
      authorization.slice(7)
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid session." },
        { status: 401 }
      );
    }

    const admin = getSupabaseAdmin();

    // Step 2: Only authorized HR users.
    const { data: hrAdmin, error: hrError } =
      await admin
        .from("hr_admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (hrError) throw hrError;

    if (!hrAdmin) {
      return NextResponse.json(
        { error: "HR access required." },
        { status: 403 }
      );
    }

    // Step 3: Get the selected attendance date.
    // Default to today in Indian Standard Time.
    const today = getTodayInIndia();

    const selectedDate =
      request.nextUrl.searchParams.get("date") ?? today;

    if (!isValidDate(selectedDate)) {
      return NextResponse.json(
        { error: "Invalid date. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    // Step 4: Retrieve employees.
    const { data: employees, error: employeeError } =
      await admin
        .from("hr_employees")
        .select(
          "id, employee_code, full_name, email, department"
        )
        .order("full_name", { ascending: true });

    if (employeeError) throw employeeError;

    // Step 5: Retrieve attendance for selected date.
    const { data: attendance, error: attendanceError } =
      await admin
        .from("hr_attendance")
        .select(
          "id, employee_id, attendance_date, check_in_at, check_out_at"
        )
        .eq("attendance_date", selectedDate);

    if (attendanceError) throw attendanceError;

    // Step 6: Calculate attendance summary.
    const presentIds = new Set(
      (attendance ?? []).map((row) => row.employee_id)
    );

    const totalEmployees = employees?.length ?? 0;

    const presentToday = (employees ?? []).filter(
      (employee) => presentIds.has(employee.id)
    ).length;

    const notCheckedIn =
      totalEmployees - presentToday;

    // Step 7: Return dashboard data.
    // Existing response fields remain compatible.
    return NextResponse.json({
      success: true,
      date: selectedDate,
      summary: {
        totalEmployees,
        presentToday,
        notCheckedIn,
      },
      employees: employees ?? [],
      attendance: attendance ?? [],
    });
  } catch (error) {
    console.error("HR dashboard error:", error);

    return NextResponse.json(
      { error: "Unable to load HR dashboard." },
      { status: 500 }
    );
  }
}
