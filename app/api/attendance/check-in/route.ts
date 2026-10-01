
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  let uploadedPath: string | null = null;
  const admin = getSupabaseAdmin();

  try {
    // Verify the user's Supabase access token.
    const header = request.headers.get("authorization");

    if (!header?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Please log in." },
        { status: 401 }
      );
    }

    const token = header.slice(7);
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
      error: authError,
    } = await auth.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid login session." },
        { status: 401 }
      );
    }

    // Find the active employee.
    const { data: employee, error: employeeError } =
      await admin
        .from("hr_employees")
        .select("id, schedule_id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: "Active employee account not found." },
        { status: 403 }
      );
    }

    // Validate selfie and GPS information.
    const form = await request.formData();
    const selfie = form.get("selfie");
    const lat = Number(form.get("latitude"));
    const lng = Number(form.get("longitude"));
    const accuracy = Number(form.get("accuracy"));

    if (!(selfie instanceof File)) {
      return NextResponse.json(
        { error: "Selfie is required." },
        { status: 400 }
      );
    }

    if (
      selfie.size === 0 ||
      selfie.size > MAX_SIZE ||
      !["image/jpeg", "image/png", "image/webp"]
        .includes(selfie.type)
    ) {
      return NextResponse.json(
        { error: "Invalid selfie format or size." },
        { status: 400 }
      );
    }

    if (
      form.get("latitude") === null ||
      form.get("longitude") === null ||
      form.get("accuracy") === null ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      !Number.isFinite(accuracy) ||
      Math.abs(lat) > 90 ||
      Math.abs(lng) > 180 ||
      accuracy < 0 ||
      accuracy > 200
    ) {
      return NextResponse.json(
        { error: "Valid GPS location is required." },
        { status: 400 }
      );
    }

    // Read the assigned work schedule.
    const { data: schedule } = await admin
      .from("hr_work_schedules")
      .select("start_time, grace_minutes, timezone")
      .eq("id", employee.schedule_id)
      .single();

    if (!schedule) {
      return NextResponse.json(
        { error: "Employee work schedule not configured." },
        { status: 400 }
      );
    }

    if (schedule.timezone !== "Asia/Kolkata") {
      return NextResponse.json(
        { error: "This version supports IST shifts only." },
        { status: 400 }
      );
    }

    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);

    const value = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? "";

    const date =
      `${value("year")}-${value("month")}-${value("day")}`;

    const currentMinutes =
      Number(value("hour")) * 60 +
      Number(value("minute"));

    const [hours, minutes] = schedule.start_time
      .split(":")
      .map(Number);

    const shiftStart = hours * 60 + minutes;

    const lateMinutes = Math.max(
      0,
      currentMinutes -
        shiftStart -
        schedule.grace_minutes
    );

    // Check for an existing record.
    const { data: existing } = await admin
      .from("hr_attendance")
      .select("id")
      .eq("employee_id", employee.id)
      .eq("attendance_date", date)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You have already clocked in today." },
        { status: 409 }
      );
    }

    // Store the selfie in the private bucket.
    const extension = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    }[selfie.type];

    const path =
      `${employee.id}/${date}/` +
      `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } =
      await admin.storage
        .from("employee-selfies")
        .upload(path, selfie, {
          contentType: selfie.type,
          upsert: false,
        });

    if (uploadError) {
      throw uploadError;
    }

    uploadedPath = path;

    // Save attendance using the server's timestamp.
    const { data: attendance, error: insertError } =
      await admin
        .from("hr_attendance")
        .insert({
          employee_id: employee.id,
          attendance_date: date,
          check_in_at: now.toISOString(),
          check_in_selfie: path,
          check_in_lat: lat,
          check_in_lng: lng,
          check_in_accuracy_m: accuracy,
          late_minutes: lateMinutes,
          status: "checked_in",
        })
        .select("id, check_in_at, late_minutes")
        .single();

    if (insertError) {
      await admin.storage
        .from("employee-selfies")
        .remove([path]);

      uploadedPath = null;

      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Already checked in today." },
          { status: 409 }
        );
      }

      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: "Attendance recorded successfully.",
      attendance,
    });
  } catch (error) {
    if (uploadedPath) {
      await admin.storage
        .from("employee-selfies")
        .remove([uploadedPath]);
    }

    console.error("Attendance check-in failed:", error);

    return NextResponse.json(
      { error: "Unable to record attendance." },
      { status: 500 }
    );
  }
}
