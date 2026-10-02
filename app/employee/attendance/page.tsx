"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EmployeeAttendancePage() {
  const [selfie, setSelfie] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] =
    useState<GeolocationPosition | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewRef = useRef<string | null>(null);
  const submittingRef = useRef(false);

  // Release camera and preview resources.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(
        (track) => track.stop()
      );
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  // Attach the camera stream after video is rendered.
  useEffect(() => {
    if (
      cameraOpen &&
      videoRef.current &&
      streamRef.current
    ) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {
        setMessage("Unable to start the camera preview.");
      });
    }
  }, [cameraOpen]);

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(
      (track) => track.stop()
    );
    streamRef.current = null;
    setCameraOpen(false);
  };

  const openCamera = async () => {
    try {
      setMessage("Opening your camera...");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Your browser does not support camera access."
        );
      }

      closeCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

      streamRef.current = stream;
      setCameraOpen(true);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Camera access failed."
      );
    }
  };

  const takeSelfie = () => {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0) {
      setMessage("Camera is not ready. Try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setMessage("Unable to capture your selfie.");
      return;
    }

    context.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setMessage("Selfie capture failed.");
          return;
        }

        if (blob.size > 5 * 1024 * 1024) {
          setMessage("Selfie exceeds the 5 MB limit.");
          return;
        }

        const file = new File(
          [blob],
          "attendance-selfie.jpg",
          { type: "image/jpeg" }
        );

        if (previewRef.current) {
          URL.revokeObjectURL(previewRef.current);
        }

        const url = URL.createObjectURL(file);
        previewRef.current = url;

        setSelfie(file);
        setPreview(url);
        setLocation(null);
        closeCamera();
        setMessage(
          "Selfie captured! Now verify your GPS location."
        );
      },
      "image/jpeg",
      0.85
    );
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
            "GPS accuracy is too low. Try moving near a window or outdoors."
          );
        } else {
          setLocation(position);
          setMessage("Location captured successfully.");
        }

        setLoading(false);
      },
      () => {
        setMessage(
          "Unable to get location. Enable location permissions and try again."
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
    if (submittingRef.current || checkedIn) return;

    if (!selfie || !location) {
      setMessage("Capture your selfie and GPS location first.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setMessage("Recording your attendance...");

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

      if (Date.now() - location.timestamp > 60000) {
        setLocation(null);
        throw new Error(
          "GPS location expired. Please verify again."
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
        if (response.status === 409) {
          setCheckedIn(true);
        }

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
      submittingRef.current = false;
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

          {!cameraOpen && !checkedIn && (
            <button
              type="button"
              onClick={openCamera}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
            >
              {selfie ? "Retake Selfie" : "Open Camera"}
            </button>
          )}

          {cameraOpen && (
            <div className="mt-4 space-y-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-xl bg-black"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={takeSelfie}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-white"
                >
                  Take Selfie
                </button>

                <button
                  type="button"
                  onClick={closeCamera}
                  className="rounded-lg border px-5 py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {preview && !cameraOpen && (
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
            cameraOpen ||
            !selfie ||
            !location
          }
          className="w-full rounded-xl bg-green-600 p-4 font-semibold text-white disabled:opacity-50"
        >
          {checkedIn
            ? "Already Checked In"
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
