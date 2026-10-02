
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
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

    // Only authorized HR users can access this API.
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

    // Today's date in India.
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const part = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? "";

    const today =
      `${part("year")}-${part("month")}-${part("day")}`;

    const { data: employees, error: employeeError } =
      await admin
        .from("hr_employees")
        .select(
          "id, employee_code, full_name, email, department"
        );

    if (employeeError) throw employeeError;

    const { data: attendance, error: attendanceError } =
      await admin
        .from("hr_attendance")
        .select(
          "id, employee_id, attendance_date, check_in_at, check_out_at"
        )
        .eq("attendance_date", today);

    if (attendanceError) throw attendanceError;

    const presentIds = new Set(
      (attendance ?? []).map((row) => row.employee_id)
    );

    return NextResponse.json({
      success: true,
      date: today,
      summary: {
        totalEmployees: employees?.length ?? 0,
        presentToday: presentIds.size,
        notCheckedIn: (employees ?? []).filter(
          (employee) => !presentIds.has(employee.id)
        ).length,
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
