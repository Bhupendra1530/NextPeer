
"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function EmployeeAttendancePage() {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);

  const captureSelfie = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setSelfie(reader.result as string);
      setMessage("Selfie captured successfully.");
    };

    reader.readAsDataURL(file);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage("GPS is not supported on this device.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        setMessage("Location captured successfully.");
        setLoading(false);
      },
      () => {
        setMessage("Please enable location permission.");
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
    if (!selfie || !location) {
      setMessage("Selfie and GPS location are required.");
      return;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setMessage("Please log in to your NextPeer account.");
      return;
    }

    setMessage(
      "Selfie and GPS are ready. Secure attendance submission will be connected next."
    );
  };

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-2 text-3xl font-bold">
        NextPeer Attendance
      </h1>

      <p className="mb-6 text-gray-500">
        Office timing: 11:00 AM – 7:00 PM
      </p>

      <div className="space-y-5 rounded-xl border p-5">
        <div>
          <h2 className="mb-3 text-lg font-semibold">
            Step 1: Capture Selfie
          </h2>

          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={captureSelfie}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            Open Camera
          </button>

          {selfie && (
            <img
              src={selfie}
              alt="Attendance selfie"
              className="mt-4 h-48 w-48 rounded-lg object-cover"
            />
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">
            Step 2: Capture GPS Location
          </h2>

          <button
            type="button"
            onClick={getLocation}
            disabled={loading}
            className="rounded-lg bg-gray-900 px-5 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Getting location..." : "Get My Location"}
          </button>

          {location && (
            <p className="mt-3 text-sm text-green-600">
              GPS captured. Accuracy:{" "}
              {Math.round(location.coords.accuracy)} metres
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={checkIn}
          disabled={!selfie || !location}
          className="w-full rounded-lg bg-green-600 p-4 font-semibold text-white disabled:opacity-50"
        >
          Clock In
        </button>

        {message && (
          <p role="status" className="text-sm">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
