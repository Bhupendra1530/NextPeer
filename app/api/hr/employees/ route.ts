
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorizeHR(request: NextRequest) {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return { error: "Please log in.", status: 401 } as const;
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
    error,
  } = await auth.auth.getUser(header.slice(7));

  if (error || !user) {
    return { error: "Invalid session.", status: 401 } as const;
  }

  const admin = getSupabaseAdmin();

  const { data: hr, error: hrError } = await admin
    .from("hr_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (hrError) throw hrError;

  if (!hr) {
    return { error: "HR access required.", status: 403 } as const;
  }

  return { admin, user } as const;
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Get employees and available work schedules.
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

    const { data: schedules, error: scheduleError } =
      await admin
        .from("hr_work_schedules")
        .select(
          "id, name, start_time, end_time, grace_minutes, timezone"
        )
        .order("name");

    if (scheduleError) throw scheduleError;

    // Paginate to avoid Supabase's default row limit.
    type Employee = {
      id: string;
      user_id: string;
      employee_code: string;
      full_name: string;
      email: string;
      department: string | null;
      schedule_id: string | null;
      is_active: boolean;
    };

    const employees: Employee[] = [];
    const pageSize = 500;

    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await admin
        .from("hr_employees")
        .select(
          "id, user_id, employee_code, full_name, email, department, schedule_id, is_active"
        )
        .order("full_name", { ascending: true })
        .order("id", { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error) throw error;

      employees.push(...(data ?? []));

      if (!data || data.length < pageSize) break;
    }

    return NextResponse.json({
      success: true,
      employees,
      schedules: schedules ?? [],
    });
  } catch (error) {
    console.error("HR employees GET:", error);

    return NextResponse.json(
      { error: "Unable to load employees." },
      { status: 500 }
    );
  }
}

// Update an employee's department, schedule or active status.
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

    if (typeof id !== "string" || !uuidPattern.test(id)) {
      return NextResponse.json(
        { error: "Invalid employee ID." },
        { status: 400 }
      );
    }

    const changes: {
      department?: string | null;
      schedule_id?: string;
      is_active?: boolean;
    } = {};

    if (Object.prototype.hasOwnProperty.call(body, "department")) {
      if (
        body.department !== null &&
        (typeof body.department !== "string" ||
          body.department.trim().length > 100)
      ) {
        return NextResponse.json(
          { error: "Invalid department." },
          { status: 400 }
        );
      }

      changes.department =
        typeof body.department === "string"
          ? body.department.trim() || null
          : null;
    }

    if (Object.prototype.hasOwnProperty.call(body, "schedule_id")) {
      if (
        typeof body.schedule_id !== "string" ||
        !uuidPattern.test(body.schedule_id)
      ) {
        return NextResponse.json(
          { error: "Please select a valid schedule." },
          { status: 400 }
        );
      }

      const { data: schedule, error } = await result.admin
        .from("hr_work_schedules")
        .select("id")
        .eq("id", body.schedule_id)
        .maybeSingle();

      if (error) throw error;

      if (!schedule) {
        return NextResponse.json(
          { error: "Work schedule not found." },
          { status: 400 }
        );
      }

      changes.schedule_id = body.schedule_id;
    }

    if (Object.prototype.hasOwnProperty.call(body, "is_active")) {
      if (typeof body.is_active !== "boolean") {
        return NextResponse.json(
          { error: "Invalid employee status." },
          { status: 400 }
        );
      }

      changes.is_active = body.is_active;
    }

    if (Object.keys(changes).length === 0) {
      return NextResponse.json(
        { error: "No changes provided." },
        { status: 400 }
      );
    }

    const { data: employee, error: updateError } =
      await result.admin
        .from("hr_employees")
        .update(changes)
        .eq("id", id)
        .select(
          "id, user_id, employee_code, full_name, email, department, schedule_id, is_active"
        )
        .maybeSingle();

    if (updateError) throw updateError;

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("HR employees PATCH:", error);

    return NextResponse.json(
      { error: "Unable to update employee." },
      { status: 500 }
    );
  }
}
