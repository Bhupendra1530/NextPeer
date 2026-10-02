
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorizeHR(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      error: "Please log in first.",
      status: 401,
    } as const;
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
    return {
      error: "Invalid session.",
      status: 401,
    } as const;
  }

  const admin = getSupabaseAdmin();

  const { data: hrAdmin, error: hrError } = await admin
    .from("hr_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (hrError) throw hrError;

  if (!hrAdmin) {
    return {
      error: "HR access required.",
      status: 403,
    } as const;
  }

  return { admin, user } as const;
}

// View employee leave requests.
export async function GET(request: NextRequest) {
  try {
    const result = await authorizeHR(request);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const { admin } = result;

    const { data: leaves, error: leavesError } =
      await admin
        .from("hr_leave_requests")
        .select(
          "id, employee_id, start_date, end_date, leave_type, reason, status, created_at, reviewed_at"
        )
        .order("created_at", { ascending: false })
        .limit(500);

    if (leavesError) throw leavesError;

    const { data: employees, error: employeesError } =
      await admin
        .from("hr_employees")
        .select(
          "id, employee_code, full_name, department"
        );

    if (employeesError) throw employeesError;

    const employeeMap = new Map(
      (employees ?? []).map((employee) => [
        employee.id,
        employee,
      ])
    );

    const requests = (leaves ?? []).map((leave) => ({
      ...leave,
      employee: employeeMap.get(leave.employee_id) ?? null,
    }));

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("HR leaves GET error:", error);

    return NextResponse.json(
      { error: "Unable to load leave requests." },
      { status: 500 }
    );
  }
}

// Approve or reject a pending leave request.
export async function PATCH(request: NextRequest) {
  try {
    const result = await authorizeHR(request);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const body = await request.json().catch(() => null);

    const id = body?.id;
    const status = body?.status;

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (
      typeof id !== "string" ||
      !uuidPattern.test(id) ||
      (status !== "approved" && status !== "rejected")
    ) {
      return NextResponse.json(
        { error: "Invalid leave request or decision." },
        { status: 400 }
      );
    }

    const { data: updated, error: updateError } =
      await result.admin
        .from("hr_leave_requests")
        .update({
          status,
          reviewed_by: result.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("status", "pending")
        .select(
          "id, employee_id, start_date, end_date, leave_type, status, reviewed_at"
        )
        .maybeSingle();

    if (updateError) throw updateError;

    if (!updated) {
      return NextResponse.json(
        {
          error:
            "This request was already reviewed or could not be found.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      request: updated,
    });
  } catch (error) {
    console.error("HR leaves PATCH error:", error);

    return NextResponse.json(
      { error: "Unable to review leave request." },
      { status: 500 }
    );
  }
}
