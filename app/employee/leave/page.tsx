
"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type LeaveRequest = {
  id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const LEAVE_TYPES = [
  { value: "casual", label: "Casual Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "emergency", label: "Emergency Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(
    "en-IN",
    {
      timeZone: "UTC",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default function EmployeeLeavePage() {
  const [leaveType, setLeaveType] = useState("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [requests, setRequests] = useState<
    LeaveRequest[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Please log in first.");
      }

      const response = await fetch(
        "/api/employee/leave",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to load leave requests."
        );
      }

      setRequests(result.requests ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  async function submitLeave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (!startDate || !endDate) {
        throw new Error(
          "Please select your leave dates."
        );
      }

      if (endDate < startDate) {
        throw new Error(
          "End date cannot be before start date."
        );
      }

      if (reason.trim().length < 5) {
        throw new Error(
          "Please enter a reason of at least 5 characters."
        );
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Please log in first.");
      }

      const response = await fetch(
        "/api/employee/leave",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            leave_type: leaveType,
            start_date: startDate,
            end_date: endDate,
            reason: reason.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to submit leave request."
        );
      }

      setSuccess(
        "Your leave request has been submitted successfully."
      );

      setLeaveType("casual");
      setStartDate("");
      setEndDate("");
      setReason("");

      await loadRequests();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}

      <div className="mb-8">
        <p className="font-semibold text-blue-600">
          NextPeer / Employee Portal
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Leave Management
        </h1>

        <p className="mt-2 text-gray-500">
          Apply for leave and track your application
          status.
        </p>

        <p className="mt-2 text-sm text-blue-600">
          Weekly holiday: Monday
        </p>

        <a
          href="/employee/attendance"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Attendance
        </a>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Leave application form */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Apply for Leave
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Fill in the details below to send your
            request to HR.
          </p>

          <form
            onSubmit={submitLeave}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="leave-type"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Leave Type
              </label>

              <select
                id="leave-type"
                value={leaveType}
                onChange={(event) =>
                  setLeaveType(event.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900"
              >
                {LEAVE_TYPES.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="start-date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                id="start-date"
                type="date"
                required
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="end-date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                End Date
              </label>

              <input
                id="end-date"
                type="date"
                required
                min={startDate || undefined}
                value={endDate}
                onChange={(event) =>
                  setEndDate(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="leave-reason"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Reason for Leave
              </label>

              <textarea
                id="leave-reason"
                required
                minLength={5}
                maxLength={1000}
                rows={4}
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Explain why you need leave..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Leave Request"}
            </button>
          </form>
        </section>

        {/* Leave request history */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                My Leave Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track your submitted applications.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadRequests()}
              disabled={loading}
              className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p
              role="status"
              className="mt-6 text-gray-500"
            >
              Loading your leave requests...
            </p>
          ) : requests.length === 0 ? (
            <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center">
              <p className="font-medium text-gray-700">
                No leave requests yet
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Your submitted applications will
                appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold capitalize text-gray-900">
                      {request.leave_type} Leave
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : request.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    {formatDate(
                      request.start_date
                    )}{" "}
                    –{" "}
                    {formatDate(request.end_date)}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-600">
                    {request.reason}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    Submitted:{" "}
                    {new Date(
                      request.created_at
                    ).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Notifications */}

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
        >
          {success}
        </div>
      )}
    </main>
  );
}

