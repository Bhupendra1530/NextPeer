import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function todayIST() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export async function GET(request: NextRequest) {
  try {
    const header = request.headers.get("authorization");
    if (!header?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    const auth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { data: { user }, error: authError } = await auth.auth.getUser(header.slice(7));
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }
    const admin = getSupabaseAdmin();
    const { data: employee, error: employeeError } = await admin
      .from("hr_employees")
      .select("id, employee_code, full_name, email, department, schedule_id")
      .eq("user_id", user.id).eq("is_active", true).maybeSingle();
    if (employeeError) throw employeeError;
    if (!employee) {
      return NextResponse.json({ error: "Active employee not found." }, { status: 403 });
    }
    let schedule = null;
    if (employee.schedule_id) {
      const { data, error } = await admin.from("hr_work_schedules")
        .select("name, start_time, end_time, grace_minutes, timezone")
        .eq("id", employee.schedule_id).maybeSingle();
      if (error) throw error;
      schedule = data;
    }
    const today = todayIST();
    const month = today.slice(0, 7);
    const { data: attendance, error: attendanceError } = await admin
      .from("hr_attendance")
      .select("attendance_date, check_in_at, check_out_at, late_minutes")
      .eq("employee_id", employee.id)
      .gte("attendance_date", `${month}-01`)
      .lte("attendance_date", today)
      .order("attendance_date", { ascending: false });
    if (attendanceError) throw attendanceError;
    const { data: leaves, error: leaveError } = await admin
      .from("hr_leave_requests")
      .select("start_date, end_date, leave_type, status")
      .eq("employee_id", employee.id)
      .order("start_date", { ascending: false })
      .limit(100);
    if (leaveError) throw leaveError;
    const approvedLeaves = (leaves ?? []).filter((leave) => leave.status === "approved");
    const monthEnd = `${month}-31`;
    const approvedLeaveDaysThisMonth = new Set<string>();
    for (const leave of approvedLeaves) {
      let cursor = new Date(`${leave.start_date}T00:00:00Z`);
      const end = new Date(`${leave.end_date}T00:00:00Z`);
      while (cursor <= end) {
        const date = cursor.toISOString().slice(0, 10);
        if (date >= `${month}-01` && date <= today && date <= monthEnd && cursor.getUTCDay() !== 1) {
          approvedLeaveDaysThisMonth.add(date);
        }
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }
    }
    const presentDays = new Set((attendance ?? []).map((a) => a.attendance_date));
    return NextResponse.json({
      success: true,
      employee: {
        full_name: employee.full_name,
        employee_code: employee.employee_code,
        email: employee.email,
        department: employee.department,
      },
      schedule,
      month,
      weeklyHoliday: "Monday",
      summary: {
        presentDays: presentDays.size,
        lateDays: (attendance ?? []).filter((a) => (a.late_minutes ?? 0) > 0).length,
        approvedLeaveDays: [...approvedLeaveDaysThisMonth].filter((date) => !presentDays.has(date)).length,
      },
      recentAttendance: (attendance ?? []).slice(0, 10),
      recentLeaves: (leaves ?? []).slice(0, 10),
      leaveBalance: null,
    });
  } catch (error) {
    console.error("Employee profile GET:", error);
    return NextResponse.json({ error: "Unable to load employee profile." }, { status: 500 });
  }
}
