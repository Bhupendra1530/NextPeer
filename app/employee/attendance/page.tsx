
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Attendance = {
  id: string;
  check_in_at: string;
  check_out_at: string | null;
  late_minutes: number;
  worked_minutes: number;
  status: string;
};

export default function EmployeeAttendancePage() {
  const [attendance, setAttendance] =
    useState<Attendance | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] =
    useState<GeolocationPosition | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewRef = useRef<string | null>(null);
  const submittingRef = useRef(false);

  const checkedIn = Boolean(attendance);
  const checkedOut = Boolean(attendance?.check_out_at);

  const loadAttendance = useCallback(async () => {
    setStatusLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "Please log in to your NextPeer account."
        );
      }

      const response = await fetch(
        "/api/attendance/status",
        {
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load attendance."
        );
      }

      setAttendance(data.attendance ?? null);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load attendance."
      );
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAttendance();

    return () => {
      streamRef.current?.getTracks().forEach(
        (track) => track.stop()
      );

      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, [loadAttendance]);

  useEffect(() => {
    if (
      cameraOpen &&
      videoRef.current &&
      streamRef.current
    ) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {
        setMessage("Unable to start camera preview.");
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
      setMessage("");

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

    if (!video || !video.videoWidth) {
      setMessage("Camera is not ready.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob || blob.size > 5 * 1024 * 1024) {
          setMessage("Unable to capture a valid selfie.");
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
          "Selfie captured. Verify your location."
        );
      },
      "image/jpeg",
      0.85
    );
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage("GPS is not supported.");
      return;
    }

    setLoading(true);
    setLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position.coords.accuracy > 200) {
          setMessage(
            "GPS accuracy is too low. Please try again."
          );
        } else {
          setLocation(position);
          setMessage("Location verified.");
        }

        setLoading(false);
      },
      () => {
        setMessage(
          "Enable location permission and try again."
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

  const submitAttendance = async () => {
    if (submittingRef.current || checkedOut) return;

    if (!selfie || !location) {
      setMessage("Selfie and GPS are required.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      if (Date.now() - location.timestamp > 60000) {
        setLocation(null);
        throw new Error(
          "GPS location expired. Verify again."
        );
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Please log in first.");
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

      const endpoint = checkedIn
        ? "/api/attendance/check-out"
        : "/api/attendance/check-in";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${session.access_token}`,
        },
        body: form,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Attendance submission failed."
        );
      }

      setSelfie(null);
      setLocation(null);

      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }

      setPreview(null);

      await loadAttendance();

      setMessage(
        checkedIn
          ? "Clock-out recorded successfully!"
          : "Clock-in recorded successfully!"
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

  const formatTime = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));

  const formatDuration = (minutes: number) =>
    `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

  return (
    <main className="mx-auto max-w-xl p-6">
      <p className="text-sm font-semibold text-blue-600">
        NEXTPeer / Employee Portal
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Employee Attendance
      </h1>

      <p className="mt-2 text-gray-500">
        Office timing: 11:00 AM – 7:00 PM
      </p>

      <div className="mt-6 space-y-5 rounded-2xl border p-5">
        {statusLoading ? (
          <p>Loading attendance...</p>
        ) : (
          <>
            {attendance && (
              <section className="rounded-xl bg-gray-50 p-4">
                <h2 className="mb-4 text-lg font-semibold">
                  Today&apos;s Attendance
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Clock In
                    </p>
                    <p className="font-semibold">
                      {formatTime(attendance.check_in_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Clock Out
                    </p>
                    <p className="font-semibold">
                      {attendance.check_out_at
                        ? formatTime(
                            attendance.check_out_at
                          )
                        : "Not yet"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Late Arrival
                    </p>
                    <p className="font-semibold">
                      {attendance.late_minutes} min
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Working Hours
                    </p>
                    <p className="font-semibold">
                      {checkedOut
                        ? formatDuration(
                            attendance.worked_minutes
                          )
                        : "In progress"}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {!checkedOut && (
              <>
                <section>
                  <h2 className="mb-3 text-lg font-semibold">
                    1. Capture your selfie
                  </h2>

                  {!cameraOpen && (
                    <button
                      type="button"
                      onClick={openCamera}
                      disabled={loading}
                      className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
                    >
                      {selfie
                        ? "Retake Selfie"
                        : "Open Camera"}
                    </button>
                  )}

                  {cameraOpen && (
                    <div className="space-y-3">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full rounded-xl bg-black"
                      />

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={takeSelfie}
                          className="rounded-lg bg-blue-600 px-4 py-3 text-white"
                        >
                          Take Selfie
                        </button>

                        <button
                          type="button"
                          onClick={closeCamera}
                          className="rounded-lg border px-4 py-3"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {preview && !cameraOpen && (
                    <img
                      src={preview}
                      alt="Attendance selfie"
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
                    disabled={loading}
                    className="rounded-lg bg-gray-900 px-5 py-3 text-white disabled:opacity-50"
                  >
                    Get My Location
                  </button>

                  {location && (
                    <p className="mt-3 text-sm text-green-600">
                      GPS captured. Accuracy:{" "}
                      {Math.round(
                        location.coords.accuracy
                      )}{" "}
                      metres
                    </p>
                  )}
                </section>

                <button
                  type="button"
                  onClick={submitAttendance}
                  disabled={
                    loading ||
                    cameraOpen ||
                    !selfie ||
                    !location
                  }
                  className={`w-full rounded-xl p-4 font-semibold text-white disabled:opacity-50 ${
                    checkedIn
                      ? "bg-red-600"
                      : "bg-green-600"
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : checkedIn
                      ? "Clock Out"
                      : "Clock In"}
                </button>
              </>
            )}

            {checkedOut && (
              <p className="rounded-xl bg-green-50 p-4 text-center font-semibold text-green-700">
                Today&apos;s attendance is complete.
              </p>
            )}
          </>
        )}

        {message && (
          <p role="status" className="text-sm">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={loadAttendance}
          disabled={statusLoading || loading}
          className="text-sm text-blue-600 disabled:opacity-50"
        >
          Refresh Attendance
        </button>
      </div>
    </main>
  );
}
