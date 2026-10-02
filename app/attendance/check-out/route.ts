
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const admin = getSupabaseAdmin();
  let uploadedPath: string | null = null;

  try {
    // 1. Verify the employee's login.
    const header = request.headers.get("authorization");

    if (!header?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Please log in." },
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
    } = await auth.auth.getUser(header.slice(7));

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid login session." },
        { status: 401 }
      );
    }

    // 2. Find the employee.
    const { data: employee } = await admin
      .from("hr_employees")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!employee) {
      return NextResponse.json(
        { error: "Active employee account not found." },
        { status: 403 }
      );
    }

    // 3. Validate the selfie and GPS coordinates.
    const form = await request.formData();
    const selfie = form.get("selfie");
    const latRaw = form.get("latitude");
    const lngRaw = form.get("longitude");
    const accuracyRaw = form.get("accuracy");

    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    const accuracy = Number(accuracyRaw);

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
      latRaw === null ||
      lngRaw === null ||
      accuracyRaw === null ||
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

    // 4. Find today's open attendance.
    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);

    const part = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? "";

    const today =
      `${part("year")}-${part("month")}-${part("day")}`;

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
        { error: "Please clock in before clocking out." },
        { status: 400 }
      );
    }

    if (attendance.check_out_at) {
      return NextResponse.json(
        { error: "You have already clocked out." },
        { status: 409 }
      );
    }

    // 5. Calculate elapsed working time.
    const workedMinutes = Math.max(
      0,
      Math.floor(
        (now.getTime() -
          new Date(attendance.check_in_at).getTime()) /
          60000
      )
    );

    // 6. Upload the clock-out selfie.
    const extension = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    }[selfie.type];

    const path =
      `${employee.id}/${today}/` +
      `checkout-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await admin.storage
      .from("employee-selfies")
      .upload(path, selfie, {
        contentType: selfie.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    uploadedPath = path;

    // 7. Update the existing attendance record.
    const { data: updated, error: updateError } =
      await admin
        .from("hr_attendance")
        .update({
          check_out_at: now.toISOString(),
          check_out_selfie: path,
          check_out_lat: lat,
          check_out_lng: lng,
          check_out_accuracy_m: accuracy,
          worked_minutes: workedMinutes,
          status: "checked_out",
        })
        .eq("id", attendance.id)
        .is("check_out_at", null)
        .select("id, check_out_at, worked_minutes")
        .maybeSingle();

    if (updateError) throw updateError;

    if (!updated) {
      await admin.storage
        .from("employee-selfies")
        .remove([path]);

      uploadedPath = null;

      return NextResponse.json(
        { error: "Attendance was already updated." },
        { status: 409 }
      );
    }

    uploadedPath = null;

    return NextResponse.json({
      success: true,
      message: "Clock-out recorded successfully.",
      attendance: updated,
    });
  } catch (error) {
    if (uploadedPath) {
      await admin.storage
        .from("employee-selfies")
        .remove([uploadedPath]);
    }

    console.error("Clock-out error:", error);

    return NextResponse.json(
      { error: "Unable to record clock-out." },
      { status: 500 }
    );
  }
}
