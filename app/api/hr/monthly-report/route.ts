
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IST_OFFSET = "+05:30";
const OFFICE_START_HOUR = 11;
const PAGE_SIZE = 500;

function todayInIndia() {
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

function datesInMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const days = new Date(
    Date.UTC(year, monthNumber, 0)
  ).getUTCDate();

  return Array.from({ length: days }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${month}-${day}`;
  });
}

function isMonday(date: string) {
  return (
    new Date(`${date}T00:00:00Z`).getUTCDay() === 1
  );
}

function lateMinutes(date: string, checkIn: string) {
  const start = new Date(
    `${date}T${String(OFFICE_START_HOUR).padStart(
      2,
      "0"
    )}:00:00${IST_OFFSET}`
  ).getTime();

  const arrival = new Date(checkIn).getTime();

  if (!Number.isFinite(arrival)) return 0;

  return Math.max(
    0,
    Math.floor((arrival - start) / 60000)
  );
}

function workedMinutes(
  checkIn: string,
  checkOut: string | null
) {
  if (!checkOut) return 0;

  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    end < start
  ) {
    return 0;
  }

  return Math.floor((end - start) / 60000);
}

type AttendanceRow = {
  id: string;
  employee_id: string;
  attendance_date: string;
  check_in_at: string;
  check_out_at: string | null;
};

type LeaveRow = {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
};

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

    const today = todayInIndia();

    const month =
      request.nextUrl.searchParams.get("month") ??
      today.slice(0, 7);

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return NextResponse.json(
        { error: "Invalid month. Use YYYY-MM." },
        { status: 400 }
      );
    }

    if (month > today.slice(0, 7)) {
      return NextResponse.json(
        { error: "Future months are not available." },
        { status: 400 }
      );
    }

    const allDates = datesInMonth(month);

    const scheduledDates = allDates.filter(
      (date) => date <= today && !isMonday(date)
    );

    const scheduledDateSet = new Set(
      scheduledDates
    );

    const reportEnd =
      allDates[allDates.length - 1];

    const { data: employees, error: employeeError } =
      await admin
        .from("hr_employees")
        .select(
          "id, employee_code, full_name, email, department"
        )
        .order("full_name", { ascending: true });

    if (employeeError) throw employeeError;

    // Fetch all attendance records for the month.
    const attendance: AttendanceRow[] = [];

    for (
      let offset = 0;
      ;
      offset += PAGE_SIZE
    ) {
      const { data: page, error } = await admin
        .from("hr_attendance")
        .select(
          "id, employee_id, attendance_date, check_in_at, check_out_at"
        )
        .gte("attendance_date", `${month}-01`)
        .lte("attendance_date", reportEnd)
        .order("attendance_date", {
          ascending: true,
        })
        .order("id", { ascending: true })
        .range(
          offset,
          offset + PAGE_SIZE - 1
        );

      if (error) throw error;

      attendance.push(...(page ?? []));

      if (!page || page.length < PAGE_SIZE) {
        break;
      }
    }

    // Fetch approved leave that overlaps this month.
    const approvedLeaves: LeaveRow[] = [];

    for (
      let offset = 0;
      ;
      offset += PAGE_SIZE
    ) {
      const { data: page, error } = await admin
        .from("hr_leave_requests")
        .select(
          "id, employee_id, start_date, end_date, leave_type"
        )
        .eq("status", "approved")
        .lte("start_date", reportEnd)
        .gte("end_date", `${month}-01`)
        .order("start_date", {
          ascending: true,
        })
        .order("id", { ascending: true })
        .range(
          offset,
          offset + PAGE_SIZE - 1
        );

      if (error) throw error;

      approvedLeaves.push(...(page ?? []));

      if (!page || page.length < PAGE_SIZE) {
        break;
      }
    }

    // Group records by employee to avoid repeatedly
    // searching the complete attendance and leave lists.
    const attendanceByEmployee = new Map<
      string,
      AttendanceRow[]
    >();

    for (const record of attendance) {
      const existing =
        attendanceByEmployee.get(
          record.employee_id
        ) ?? [];

      existing.push(record);

      attendanceByEmployee.set(
        record.employee_id,
        existing
      );
    }

    const leavesByEmployee = new Map<
      string,
      LeaveRow[]
    >();

    for (const leave of approvedLeaves) {
      const existing =
        leavesByEmployee.get(
          leave.employee_id
        ) ?? [];

      existing.push(leave);

      leavesByEmployee.set(
        leave.employee_id,
        existing
      );
    }

    const rows = (employees ?? []).map(
      (employee) => {
        const records =
          attendanceByEmployee.get(
            employee.id
          ) ?? [];

        const scheduledRecords =
          records.filter((record) =>
            scheduledDateSet.has(
              record.attendance_date
            )
          );

        const presentDates = new Set(
          scheduledRecords.map(
            (record) =>
              record.attendance_date
          )
        );

        const lateRecords =
          scheduledRecords.filter(
            (record) =>
              lateMinutes(
                record.attendance_date,
                record.check_in_at
              ) > 0
          );

        const totalMinutes =
          scheduledRecords.reduce(
            (total, record) =>
              total +
              workedMinutes(
                record.check_in_at,
                record.check_out_at
              ),
            0
          );

        const mondayRecords =
          records.filter((record) =>
            isMonday(
              record.attendance_date
            )
          );

        const employeeLeaves =
          leavesByEmployee.get(
            employee.id
          ) ?? [];

        // A Set prevents overlapping approved
        // requests from counting the same day twice.
        const approvedLeaveDates =
          new Set<string>();

        const leaveDatesByType: Record<
          string,
          Set<string>
        > = {
          sick: new Set<string>(),
          casual: new Set<string>(),
          emergency: new Set<string>(),
          unpaid: new Set<string>(),
        };

        for (const leave of employeeLeaves) {
          for (const date of scheduledDates) {
            if (
              date >= leave.start_date &&
              date <= leave.end_date &&
              !presentDates.has(date)
            ) {
              approvedLeaveDates.add(
                date
              );

              leaveDatesByType[
                leave.leave_type
              ]?.add(date);
            }
          }
        }

        const daysWithoutCheckIn =
          Math.max(
            0,
            scheduledDates.length -
              presentDates.size -
              approvedLeaveDates.size
          );

        return {
          employeeId: employee.id,
          employeeCode:
            employee.employee_code,
          fullName: employee.full_name,
          email: employee.email,
          department:
            employee.department,

          scheduledDays:
            scheduledDates.length,

          presentDays:
            presentDates.size,

          // New field: distinct approved
          // leave dates without attendance.
          approvedLeaveDays:
            approvedLeaveDates.size,

          // Existing field retained for
          // compatibility with the current UI.
          // Now excludes approved leave.
          absentDays:
            daysWithoutCheckIn,

          // Explicit alias for clarity.
          daysWithoutCheckIn,

          // Optional breakdown for a
          // future leave summary UI.
          approvedLeaveBreakdown: {
            sick:
              leaveDatesByType.sick.size,
            casual:
              leaveDatesByType.casual.size,
            emergency:
              leaveDatesByType.emergency
                .size,
            unpaid:
              leaveDatesByType.unpaid.size,
          },

          lateDays: new Set(
            lateRecords.map(
              (record) =>
                record.attendance_date
            )
          ).size,

          totalLateMinutes:
            lateRecords.reduce(
              (total, record) =>
                total +
                lateMinutes(
                  record.attendance_date,
                  record.check_in_at
                ),
              0
            ),

          totalWorkingMinutes:
            totalMinutes,

          mondayAttendanceDays:
            new Set(
              mondayRecords.map(
                (record) =>
                  record.attendance_date
              )
            ).size,
        };
      }
    );

    return NextResponse.json({
      success: true,
      month,
      asOfDate: today,
      officeHours:
        "11:00 AM – 7:00 PM IST",
      weeklyHoliday: "Monday",

      summary: {
        totalEmployees:
          rows.length,

        scheduledDays:
          scheduledDates.length,

        totalPresentDays:
          rows.reduce(
            (sum, row) =>
              sum + row.presentDays,
            0
          ),

        totalApprovedLeaveDays:
          rows.reduce(
            (sum, row) =>
              sum +
              row.approvedLeaveDays,
            0
          ),

        totalAbsentDays:
          rows.reduce(
            (sum, row) =>
              sum + row.absentDays,
            0
          ),
      },

      employees: rows,
    });
  } catch (error) {
    console.error(
      "Monthly HR report error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load monthly report.",
      },
      { status: 500 }
    );
  }
}
