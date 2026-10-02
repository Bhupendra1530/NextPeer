import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function todayIST() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const value = (key: string) => parts.find((p) => p.type === key)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export async function GET(request: NextRequest) {
  try {
    const header = request.headers.get("authorization");
    if (!header?.startsWith("Bearer ")) return NextResponse.json({ error: "Please log in." }, { status: 401 });
    const auth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { data: { user }, error: authError } = await auth.auth.getUser(header.slice(7));
    if (authError || !user) return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    const admin = getSupabaseAdmin();
    const { data: employee, error: employeeError } = await admin
      .from("hr_employees")
      .select("id, full_name, employee_code, department, schedule_id")
      .eq("user_id", user.id).eq("is_active", true).maybeSingle();
    if (employeeError) throw employeeError;
    if (!employee) return NextResponse.json({ error: "Active employee not found." }, { status: 403 });

    const today = todayIST();
    const monthStart = `${today.slice(0, 7)}-01`;
    const [scheduleResult, attendanceResult, leaveResult] = await Promise.all([
      employee.schedule_id
        ? admin.from("hr_work_schedules")
            .select("name, start_time, end_time, grace_minutes, timezone")
            .eq("id", employee.schedule_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      admin.from("hr_attendance")
        .select("attendance_date, check_in_at, check_out_at, late_minutes")
        .eq("employee_id", employee.id).gte("attendance_date", monthStart)
        .lte("attendance_date", today).order("attendance_date", { ascending: false }),
      admin.from("hr_leave_requests")
        .select("start_date, end_date, leave_type")
        .eq("employee_id", employee.id).eq("status", "approved")
        .gte("end_date", today).order("start_date", { ascending: true }).limit(5),
    ]);
    if (scheduleResult.error) throw scheduleResult.error;
    if (attendanceResult.error) throw attendanceResult.error;
    if (leaveResult.error) throw leaveResult.error;

    const attendance = attendanceResult.data ?? [];
    const presentDays = new Set(attendance.map((row) => row.attendance_date)).size;
    const lateDays = attendance.filter((row) => row.late_minutes > 0).length;
    const todayAttendance = attendance.find((row) => row.attendance_date === today) ?? null;

    return NextResponse.json({
      success: true,
      today,
      employee: {
        full_name: employee.full_name,
        employee_code: employee.employee_code,
        department: employee.department,
      },
      schedule: scheduleResult.data,
      todayAttendance,
      monthlySummary: { presentDays, lateDays },
      upcomingLeave: leaveResult.data ?? [],
    });
  } catch (error) {
    console.error("Employee dashboard GET:", error);
    return NextResponse.json({ error: "Unable to load employee dashboard." }, { status: 500 });
  }
}
