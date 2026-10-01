
"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EmployeeAttendancePage() {
  const [selfie, setSelfie] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] =
    useState<GeolocationPosition | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);

  const captureSelfie = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(
        file.type
      )
    ) {
      setMessage("Please capture a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Selfie must be smaller than 5 MB.");
      return;
    }

    setSelfie(file);
    setPreview(URL.createObjectURL(file));
    setLocation(null);
    setMessage("Selfie captured. Now verify your location.");
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage("GPS is not supported on this device.");
      return;
    }

    setLoading(true);
    setLocation(null);
    setMessage("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position.coords.accuracy > 200) {
          setMessage(
            "GPS accuracy is too low. Move to an open area and try again."
          );
        } else {
          setLocation(position);
          setMessage("Location verified successfully.");
        }
        setLoading(false);
      },
      () => {
        setMessage(
          "Unable to get location. Enable GPS and allow location access."
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const checkIn = async () => {
    if (loading || checkedIn) return;

    if (!selfie || !location) {
      setMessage("Selfie and GPS location are required.");
      return;
    }

    setLoading(true);
    setMessage("Submitting your attendance...");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error(
          "Please log in to your NextPeer account."
        );
      }

      // Require a recent location reading.
      if (Date.now() - location.timestamp > 60000) {
        setLocation(null);
        throw new Error(
          "Your location has expired. Please verify GPS again."
        );
      }

      const form = new FormData();

      form.append("selfie", selfie);
      form.append(
        "latitude",
        String(location.coords.latitude)
      );
      form.append(
        "longitude",
        String(location.coords.longitude)
      );
      form.append(
        "accuracy",
        String(location.coords.accuracy)
      );

      const response = await fetch(
        "/api/attendance/check-in",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: form,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to record attendance."
        );
      }

      setCheckedIn(true);
      setMessage(
        "Attendance recorded successfully! Have a productive day."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-blue-600">
          NEXTPeer / Employee Portal
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Employee Attendance
        </h1>

        <p className="mt-2 text-gray-500">
          Office timing: 11:00 AM – 7:00 PM
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border p-5 shadow-sm">
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            1. Capture your selfie
          </h2>

          <input
            ref={cameraRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="user"
            onChange={captureSelfie}
            className="hidden"
          />

          <button
            type="button"
            disabled={loading || checkedIn}
            onClick={() => cameraRef.current?.click()}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
          >
            Open Camera
          </button>

          {preview && (
            <img
              src={preview}
              alt="Your attendance selfie"
              className="mt-4 h-48 w-48 rounded-xl object-cover"
            />
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">
            2. Verify your location
          </h2>

          <button
            type="button"
            onClick={getLocation}
            disabled={loading || checkedIn}
            className="rounded-lg bg-gray-900 px-5 py-3 text-white disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : "Get My Location"}
          </button>

          {location && (
            <p className="mt-3 text-sm text-green-600">
              Location captured. Accuracy:{" "}
              {Math.round(location.coords.accuracy)} metres
            </p>
          )}
        </section>

        <button
          type="button"
          onClick={checkIn}
          disabled={
            loading ||
            checkedIn ||
            !selfie ||
            !location
          }
          className="w-full rounded-xl bg-green-600 p-4 font-semibold text-white disabled:opacity-50"
        >
          {checkedIn
            ? "Checked In Successfully"
            : loading
              ? "Processing..."
              : "Clock In"}
        </button>

        {message && (
          <p
            role="status"
            className={
              checkedIn
                ? "text-sm text-green-600"
                : "text-sm text-gray-700"
            }
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
