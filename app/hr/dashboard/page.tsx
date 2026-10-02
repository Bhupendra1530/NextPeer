
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Employee = {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  department: string | null;
};

type Attendance = {
  id: string;
  employee_id: string;
  attendance_date: string;
  check_in_at: string;
  check_out_at: string | null;
};

type Dashboard = {
  date: string;
  summary: {
    totalEmployees: number;
    presentToday: number;
    notCheckedIn: number;
  };
  employees: Employee[];
  attendance: Attendance[];
};

const OFFICE_START_HOUR = 11;

function formatTime(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLateMinutes(record?: Attendance) {
  if (!record) return null;

  // Office starts at 11:00 AM Indian Standard Time.
  const officeStart = new Date(
    `${record.attendance_date}T${String(
      OFFICE_START_HOUR
    ).padStart(2, "0")}:00:00+05:30`
  );

  const checkIn = new Date(record.check_in_at);

  if (
    !Number.isFinite(officeStart.getTime()) ||
    !Number.isFinite(checkIn.getTime())
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.floor(
      (checkIn.getTime() - officeStart.getTime()) / 60000
    )
  );
}

function getWorkingHours(record?: Attendance) {
  if (!record) return "—";

  if (!record.check_out_at) {
    return "In progress";
  }

  const start = new Date(record.check_in_at).getTime();
  const end = new Date(record.check_out_at).getTime();

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    end < start
  ) {
    return "—";
  }

  const minutes = Math.floor((end - start) / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

export default function HRDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const loadDashboard = useCallback(async () => {
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

      const url = selectedDate
        ? `/api/hr/dashboard?date=${encodeURIComponent(
            selectedDate
          )}`
        : "/api/hr/dashboard";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load dashboard."
        );
      }

      setData(result);
    } catch (err) {
      setData(null);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <main className="mx-auto max-w-7xl p-6">
      {/* Page heading */}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-blue-600">
            NextPeer / HR Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Attendance Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Employee attendance and history
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Office timing: 11:00 AM – 7:00 PM IST
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadDashboard()}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Attendance date filter */}

      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div>
          <label
            htmlFor="attendance-date"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select Attendance Date
          </label>

          <input
            id="attendance-date"
            type="date"
            value={selectedDate || data?.date || ""}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900"
          />
        </div>

        <button
          type="button"
          onClick={() => setSelectedDate("")}
          disabled={loading || selectedDate === ""}
          className="rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
        >
          Today
        </button>

        {data && (
          <p className="pb-3 text-sm text-gray-500">
            Showing attendance for {data.date}
          </p>
        )}
      </div>

      {/* Loading and errors */}

      {loading && (
        <p role="status" className="text-gray-600">
          Loading attendance...
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
        >
          {error}
        </div>
      )}

      {/* Dashboard content */}

      {data && !loading && (
        <>
          {/* Summary cards */}

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Total Employees",
                value: data.summary.totalEmployees,
              },
              {
                title: "Present",
                value: data.summary.presentToday,
              },
              {
                title: "Not Checked In",
                value: data.summary.notCheckedIn,
              },
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

          {/* Attendance table */}

          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-xl font-bold">
                Attendance Records
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {data.date}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-4">Employee</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Check In</th>
                    <th className="p-4">Check Out</th>
                    <th className="p-4">Late Arrival</th>
                    <th className="p-4">Working Hours</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {data.employees.map((employee) => {
                    const record = data.attendance.find(
                      (row) =>
                        row.employee_id === employee.id
                    );

                    const lateMinutes =
                      getLateMinutes(record);

                    const status = !record
                      ? "Not checked in"
                      : record.check_out_at
                        ? "Checked out"
                        : "Working";

                    return (
                      <tr
                        key={employee.id}
                        className="border-t"
                      >
                        {/* Employee */}

                        <td className="p-4">
                          <p className="font-semibold text-gray-900">
                            {employee.full_name}
                          </p>

                          <p className="text-gray-500">
                            {employee.employee_code}
                          </p>
                        </td>

                        {/* Department */}

                        <td className="p-4">
                          {employee.department || "—"}
                        </td>

                        {/* Check in */}

                        <td className="p-4">
                          {formatTime(
                            record?.check_in_at ?? null
                          )}
                        </td>

                        {/* Check out */}

                        <td className="p-4">
                          {formatTime(
                            record?.check_out_at ?? null
                          )}
                        </td>

                        {/* Late arrival */}

                        <td className="p-4">
                          {lateMinutes === null ? (
                            "—"
                          ) : lateMinutes === 0 ? (
                            <span className="font-medium text-green-600">
                              On time
                            </span>
                          ) : (
                            <span className="font-medium text-red-600">
                              {lateMinutes} min late
                            </span>
                          )}
                        </td>

                        {/* Working hours */}

                        <td className="p-4 font-medium">
                          {getWorkingHours(record)}
                        </td>

                        {/* Attendance status */}

                        <td className="p-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-3 py-1 ${
                              status === "Checked out"
                                ? "bg-blue-50 text-blue-700"
                                : status === "Working"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {data.employees.length === 0 && (
                <p className="p-6 text-gray-500">
                  No employees found.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
