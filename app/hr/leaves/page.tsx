
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type LeaveRequest = {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  employee: {
    id: string;
    employee_code: string;
    full_name: string;
    department: string | null;
  } | null;
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString(
    "en-IN",
    {
      timeZone: "UTC",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default function HRLeavesPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState("pending");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

      const response = await fetch("/api/hr/leaves", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load leave requests."
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

  async function reviewLeave(
    leave: LeaveRequest,
    status: "approved" | "rejected"
  ) {
    const action =
      status === "approved" ? "approve" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${action} this leave request?`
      )
    ) {
      return;
    }

    setProcessingId(leave.id);
    setError("");
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Please log in first.");
      }

      const response = await fetch("/api/hr/leaves", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leave.id,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to review request."
        );
      }

      setRequests((previous) =>
        previous.map((item) =>
          item.id === leave.id
            ? {
                ...item,
                status,
                reviewed_at: result.request.reviewed_at,
              }
            : item
        )
      );

      setMessage(
        `Leave request ${
          status === "approved" ? "approved" : "rejected"
        } successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setProcessingId(null);
    }
  }

  const pendingCount = requests.filter(
    (request) => request.status === "pending"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "rejected"
  ).length;

  const visibleRequests = requests.filter(
    (request) =>
      filter === "all" || request.status === filter
  );

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-blue-600">
            NextPeer / HR Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Leave Management
          </h1>

          <p className="mt-2 text-gray-500">
            Review and manage employee leave requests.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/hr/dashboard"
            className="rounded-lg border px-5 py-3 font-medium"
          >
            Attendance Dashboard
          </a>

          <button
            type="button"
            onClick={() => void loadRequests()}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
        >
          {message}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Pending", value: pendingCount },
          { title: "Approved", value: approvedCount },
          { title: "Rejected", value: rejectedCount },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {item.title}
            </p>

            <p className="mt-3 text-4xl font-bold text-blue-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {["pending", "approved", "rejected", "all"].map(
          (option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-lg px-4 py-2 font-medium capitalize ${
                filter === option
                  ? "bg-blue-600 text-white"
                  : "border bg-white text-gray-700"
              }`}
            >
              {option}
            </button>
          )
        )}
      </div>

      {loading ? (
        <p role="status">Loading leave requests...</p>
      ) : visibleRequests.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
          No {filter === "all" ? "" : `${filter} `}
          leave requests found.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleRequests.map((leave) => (
            <div
              key={leave.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    {leave.employee?.full_name ??
                      "Employee unavailable"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {leave.employee?.employee_code ?? "—"}
                    {" · "}
                    {leave.employee?.department ??
                      "No department"}
                  </p>

                  <p className="mt-4 font-medium capitalize">
                    {leave.leave_type} Leave
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {formatDate(leave.start_date)} –{" "}
                    {formatDate(leave.end_date)}
                  </p>

                  <p className="mt-3 whitespace-pre-wrap break-words text-gray-700">
                    {leave.reason}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    Submitted:{" "}
                    {new Date(
                      leave.created_at
                    ).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                    leave.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : leave.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {leave.status}
                </span>
              </div>

              {leave.status === "pending" && (
                <div className="mt-6 flex flex-wrap gap-3 border-t pt-5">
                  <button
                    type="button"
                    disabled={processingId !== null}
                    onClick={() =>
                      void reviewLeave(leave, "approved")
                    }
                    className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white disabled:opacity-50"
                  >
                    {processingId === leave.id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={processingId !== null}
                    onClick={() =>
                      void reviewLeave(leave, "rejected")
                    }
                    className="rounded-lg border border-red-500 px-5 py-2 font-medium text-red-600 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-gray-500">
        Showing up to 500 recent leave requests. Approved
        leave is not yet deducted from monthly attendance
        calculations.
      </p>
    </main>
  );
}
