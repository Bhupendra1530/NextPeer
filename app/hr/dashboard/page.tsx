
"use client";

import { useEffect, useState } from "react";
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

export default function HRDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
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

      const response = await fetch("/api/hr/dashboard", {
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
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  function formatTime(value: string | null) {
    if (!value) return "—";

    return new Date(value).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-blue-600">
            NextPeer / HR Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Attendance Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Daily employee attendance overview
          </p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && (
        <p role="status">Loading attendance...</p>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          <p className="mb-5 text-gray-600">
            Attendance date: {data.date}
          </p>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Total Employees",
                value: data.summary.totalEmployees,
              },
              {
                title: "Present Today",
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

          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-xl font-bold">
                Today's Attendance
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4">Employee</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Check In</th>
                    <th className="p-4">Check Out</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {data.employees.map((employee) => {
                    const record = data.attendance.find(
                      (row) =>
                        row.employee_id === employee.id
                    );

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
                        <td className="p-4">
                          <p className="font-semibold">
                            {employee.full_name}
                          </p>
                          <p className="text-gray-500">
                            {employee.employee_code}
                          </p>
                        </td>

                        <td className="p-4">
                          {employee.department || "—"}
                        </td>

                        <td className="p-4">
                          {formatTime(
                            record?.check_in_at ?? null
                          )}
                        </td>

                        <td className="p-4">
                          {formatTime(
                            record?.check_out_at ?? null
                          )}
                        </td>

                        <td className="p-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
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
