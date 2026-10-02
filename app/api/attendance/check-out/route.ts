
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Verify the logged-in employee.
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

    const { data: employee, error: employeeError } =
      await admin
        .from("hr_employees")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: "Active employee not found." },
        { status: 403 }
      );
    }

    // Read selfie and GPS data.
    const form = await request.formData();

    const selfie = form.get("selfie");
    const latitude = form.get("latitude");
    const longitude = form.get("longitude");
    const accuracy = form.get("accuracy");

    const lat = Number(latitude);
    const lng = Number(longitude);
    const gpsAccuracy = Number(accuracy);

    if (
      !(selfie instanceof File) ||
      selfie.size === 0 ||
      selfie.size > 5 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(
        selfie.type
      )
    ) {
      return NextResponse.json(
        { error: "A valid selfie under 5 MB is required." },
        { status: 400 }
      );
    }

    if (
      latitude === null ||
      longitude === null ||
      accuracy === null ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      !Number.isFinite(gpsAccuracy) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180 ||
      gpsAccuracy < 0 ||
      gpsAccuracy > 200
    ) {
      return NextResponse.json(
        { error: "Please verify your GPS location." },
        { status: 400 }
      );
    }

    // Get today's date in India.
    const now = new Date();

    const dateParts = new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(now);

    const getPart = (type: string) =>
      dateParts.find((p) => p.type === type)?.value ?? "";

    const today =
      `${getPart("year")}-${getPart("month")}-${getPart("day")}`;

    // Find today's existing clock-in record.
    const { data: attendance, error: lookupError } =
      await admin
        .from("hr_attendance")
        .select("id, check_in_at, check_out_at")
        .eq("employee_id", employee.id)
        .eq("attendance_date", today)
        .maybeSingle();

    if (lookupError) throw lookupError;

    if (!attendance) {
      return NextResponse.json(
        { error: "Please clock in first." },
        { status: 400 }
      );
    }

    if (attendance.check_out_at) {
      return NextResponse.json(
        { error: "You have already clocked out." },
        { status: 409 }
      );
    }

    // Calculate elapsed working minutes.
    const workedMinutes = Math.max(
      0,
      Math.floor(
        (now.getTime() -
          new Date(attendance.check_in_at).getTime()) /
          60000
      )
    );

    // Save the clock-out selfie.
    const extension =
      selfie.type === "image/png"
        ? "png"
        : selfie.type === "image/webp"
          ? "webp"
          : "jpg";

    const path =
      `${employee.id}/${today}/` +
      `checkout-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } =
      await admin.storage
        .from("employee-selfies")
        .upload(path, selfie, {
          contentType: selfie.type,
          upsert: false,
        });

    if (uploadError) throw uploadError;

    // Update today's attendance record.
    const { data: updated, error: updateError } =
      await admin
        .from("hr_attendance")
        .update({
          check_out_at: now.toISOString(),
          check_out_selfie: path,
          check_out_lat: lat,
          check_out_lng: lng,
          check_out_accuracy_m: gpsAccuracy,
          worked_minutes: workedMinutes,
          status: "checked_out",
        })
        .eq("id", attendance.id)
        .is("check_out_at", null)
        .select("id, check_out_at, worked_minutes")
        .maybeSingle();

    if (updateError || !updated) {
      await admin.storage
        .from("employee-selfies")
        .remove([path]);

      if (updateError) throw updateError;

      return NextResponse.json(
        { error: "Attendance was already updated." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Clock-out successful!",
      attendance: updated,
    });
  } catch (error) {
    console.error("Clock-out error:", error);

    return NextResponse.json(
      { error: "Unable to record clock-out." },
      { status: 500 }
    );
  }
}

