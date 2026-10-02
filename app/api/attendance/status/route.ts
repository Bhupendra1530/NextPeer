
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
        { error: "Please log in." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

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
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: "Employee account not found." },
        { status: 403 }
      );
    }

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const { data: attendance, error } = await admin
      .from("hr_attendance")
      .select(
        "id, check_in_at, check_out_at, late_minutes, worked_minutes, status"
      )
      .eq("employee_id", employee.id)
      .eq("attendance_date", today)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        checkedIn: Boolean(attendance),
        checkedOut: Boolean(attendance?.check_out_at),
        attendance,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Attendance status error:", error);

    return NextResponse.json(
      { error: "Unable to load attendance status." },
      { status: 500 }
    );
  }
}
