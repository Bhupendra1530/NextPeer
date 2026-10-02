
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

  return { admin } as const;
}

export async function POST(request: NextRequest) {
  try {
    const result = await authorizeHR(request);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const { admin } = result;
    const body = await request.json().catch(() => null);

    const fullName =
      typeof body?.full_name === "string"
        ? body.full_name.trim()
        : "";

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const employeeCode =
      typeof body?.employee_code === "string"
        ? body.employee_code.trim()
        : "";

    const department =
      typeof body?.department === "string"
        ? body.department.trim()
        : "";

    const scheduleId = body?.schedule_id;

    if (!fullName || fullName.length > 150) {
      return NextResponse.json(
        { error: "Enter a valid employee name." },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254
    ) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (!employeeCode || employeeCode.length > 50) {
      return NextResponse.json(
        { error: "Enter a valid employee code." },
        { status: 400 }
      );
    }

    if (department.length > 100) {
      return NextResponse.json(
        { error: "Department must be under 100 characters." },
        { status: 400 }
      );
    }

    if (
      typeof scheduleId !== "string" ||
      !uuidPattern.test(scheduleId)
    ) {
      return NextResponse.json(
        { error: "Select a valid work schedule." },
        { status: 400 }
      );
    }

    // Verify that the selected schedule exists.
    const { data: schedule, error: scheduleError } = await admin
      .from("hr_work_schedules")
      .select("id")
      .eq("id", scheduleId)
      .maybeSingle();

    if (scheduleError) throw scheduleError;

    if (!schedule) {
      return NextResponse.json(
        { error: "Work schedule not found." },
        { status: 400 }
      );
    }

    // Check for an existing employee with this email.
    const { data: existingEmail, error: emailError } = await admin
      .from("hr_employees")
      .select("id")
      .ilike("email", email)
      .limit(1);

    if (emailError) throw emailError;

    if (existingEmail?.length) {
      return NextResponse.json(
        { error: "An employee with this email already exists." },
        { status: 409 }
      );
    }

    // Check for an existing employee code.
    const { data: existingCode, error: codeError } = await admin
      .from("hr_employees")
      .select("id")
      .eq("employee_code", employeeCode)
      .limit(1);

    if (codeError) throw codeError;

    if (existingCode?.length) {
      return NextResponse.json(
        { error: "This employee code is already in use." },
        { status: 409 }
      );
    }

    // Send the invitation using the server-side admin client.
    // The destination page will be implemented in the next step.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
      : "https://nextpeer.in";

    const { data: invitation, error: inviteError } =
      await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${siteUrl}/employee/set-password`,
        data: {
          full_name: fullName,
          employee_code: employeeCode,
        },
      });

    if (inviteError) {
      console.error("Employee invitation:", inviteError);

      const duplicate =
        /already|registered|exists/i.test(inviteError.message);

      return NextResponse.json(
        {
          error: duplicate
            ? "This email already has a Supabase account. Contact your administrator."
            : "Unable to send invitation. Check your Supabase email settings.",
        },
        { status: duplicate ? 409 : 502 }
      );
    }

    const invitedUserId = invitation.user?.id;

    if (!invitedUserId) {
      return NextResponse.json(
        { error: "Invitation did not return a user ID." },
        { status: 502 }
      );
    }

    // Create the employee profile.
    const { data: employee, error: insertError } = await admin
      .from("hr_employees")
      .insert({
        user_id: invitedUserId,
        employee_code: employeeCode,
        full_name: fullName,
        email,
        department: department || null,
        schedule_id: scheduleId,
        is_active: true,
      })
      .select(
        "id, user_id, employee_code, full_name, email, department, schedule_id, is_active"
      )
      .single();

    if (insertError) {
      console.error("Employee profile creation:", insertError);

      // The invitation has already been sent. Keep the invited
      // auth user so HR can recover the account safely.
      return NextResponse.json(
        {
          error:
            "Invitation sent, but the employee profile could not be created. Contact your administrator before retrying.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Employee invitation sent.",
        employee,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("HR employee invitation:", error);

    return NextResponse.json(
      { error: "Unable to invite employee." },
      { status: 500 }
    );
  }
}
