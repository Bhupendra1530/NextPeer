
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getEmployee(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return { error: "Please log in first.", status: 401 };
  }

  const auth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser(authorization.slice(7));

  if (authError || !user) {
    return { error: "Invalid session.", status: 401 };
  }

  const admin = getSupabaseAdmin();

  const { data: employee, error: employeeError } = await admin
    .from("hr_employees")
    .select("id, full_name")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (employeeError) {
    throw employeeError;
  }

  if (!employee) {
    return { error: "Active employee record not found.", status: 403 };
  }

  return { employee, admin };
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function todayInIndia() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

// Retrieve the logged-in employee's leave requests.
export async function GET(request: NextRequest) {
  try {
    const result = await getEmployee(request);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const { data, error } = await result.admin
      .from("hr_leave_requests")
      .select(
        "id, start_date, end_date, leave_type, reason, status, created_at"
      )
      .eq("employee_id", result.employee.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      requests: data ?? [],
    });
  } catch (error) {
    console.error("Employee leave GET error:", error);

    return NextResponse.json(
      { error: "Unable to load leave requests." },
      { status: 500 }
    );
  }
}

// Submit a new leave request.
export async function POST(request: NextRequest) {
  try {
    const result = await getEmployee(request);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const body = await request.json();

    const { start_date, end_date, leave_type, reason } = body;

    const allowedTypes = [
      "sick",
      "casual",
      "emergency",
      "unpaid",
    ];

    if (
      typeof start_date !== "string" ||
      typeof end_date !== "string" ||
      !isValidDate(start_date) ||
      !isValidDate(end_date) ||
      end_date < start_date
    ) {
      return NextResponse.json(
        { error: "Please enter valid leave dates." },
        { status: 400 }
      );
    }

    if (start_date < todayInIndia()) {
      return NextResponse.json(
        { error: "Leave cannot start in the past." },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(leave_type)) {
      return NextResponse.json(
        { error: "Please select a valid leave type." },
        { status: 400 }
      );
    }

    if (
      typeof reason !== "string" ||
      reason.trim().length < 5 ||
      reason.trim().length > 1000
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a reason between 5 and 1000 characters.",
        },
        { status: 400 }
      );
    }

    // Avoid duplicate or overlapping pending/approved requests.
    const { data: overlapping, error: overlapError } =
      await result.admin
        .from("hr_leave_requests")
        .select("id")
        .eq("employee_id", result.employee.id)
        .in("status", ["pending", "approved"])
        .lte("start_date", end_date)
        .gte("end_date", start_date)
        .limit(1);

    if (overlapError) throw overlapError;

    if (overlapping && overlapping.length > 0) {
      return NextResponse.json(
        {
          error:
            "You already have a pending or approved request for these dates.",
        },
        { status: 409 }
      );
    }

    const { data, error } = await result.admin
      .from("hr_leave_requests")
      .insert({
        employee_id: result.employee.id,
        start_date,
        end_date,
        leave_type,
        reason: reason.trim(),
        status: "pending",
      })
      .select(
        "id, start_date, end_date, leave_type, reason, status, created_at"
      )
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, request: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Employee leave POST error:", error);

    return NextResponse.json(
      { error: "Unable to submit leave request." },
      { status: 500 }
    );
  }
}
