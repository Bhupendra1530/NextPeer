"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type DashboardData = {
  today: string;
  employee: { full_name: string; employee_code: string; department: string | null };
  schedule: { name: string; start_time: string; end_time: string; grace_minutes: number; timezone: string } | null;
  todayAttendance: { check_in_at: string | null; check_out_at: string | null; late_minutes: number } | null;
  monthlySummary: { presentDays: number; lateDays: number };
  upcomingLeave: { start_date: string; end_date: string; leave_type: string }[];
};

function formatIST(timestamp: string | null | undefined) {
  if (!timestamp) return "Not recorded";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true,
  }).format(new Date(timestamp));
}

export default function EmployeeDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in first.");
      const response = await fetch("/api/employee/dashboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load dashboard.");
      setData(result as DashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-blue-600">NextPeer / Employee Portal</p>
          <h1 className="mt-2 text-3xl font-bold">Employee Dashboard</h1>
          <p className="mt-2 text-gray-500">Your attendance, shift and upcoming leave in one place.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50">
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
      {loading && <p role="status">Loading your dashboard...</p>}

      {!loading && data && (
        <>
          <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Welcome, {data.employee.full_name}</h2>
            <p className="mt-2 text-gray-600">
              {data.employee.employee_code} · {data.employee.department || "Department not assigned"}
            </p>
            <p className="mt-1 text-sm text-gray-500">Today: {data.today} · Times shown in IST</p>
          </section>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Today's Check-in</p>
              <p className="mt-2 text-xl font-bold">{formatIST(data.todayAttendance?.check_in_at)}</p>
            </section>
            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Today's Check-out</p>
              <p className="mt-2 text-xl font-bold">{formatIST(data.todayAttendance?.check_out_at)}</p>
            </section>
            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Days Present This Month</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{data.monthlySummary.presentDays}</p>
            </section>
            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Late Check-ins This Month</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{data.monthlySummary.lateDays}</p>
            </section>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Assigned Work Schedule</h2>
              {data.schedule ? (
                <div className="mt-3 space-y-2 text-gray-700">
                  <p className="font-semibold">{data.schedule.name}</p>
                  <p>{data.schedule.start_time.slice(0, 5)}–{data.schedule.end_time.slice(0, 5)} ({data.schedule.timezone})</p>
                  <p>Grace period: {data.schedule.grace_minutes} minutes</p>
                  <p>Weekly holiday: Monday</p>
                </div>
              ) : <p className="mt-3 text-gray-500">No work schedule assigned.</p>}
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Upcoming Approved Leave</h2>
              {data.upcomingLeave.length ? (
                <ul className="mt-3 space-y-3">
                  {data.upcomingLeave.map((leave, index) => (
                    <li key={`${leave.start_date}-${index}`} className="rounded-lg bg-gray-50 p-3">
                      <p className="font-medium">{leave.leave_type}</p>
                      <p className="text-sm text-gray-600">{leave.start_date} to {leave.end_date}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-gray-500">No upcoming approved leave.</p>}
            </section>
          </div>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Quick Links</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { href: "/employee/profile", label: "My Profile" },
                { href: "/employee/calendar", label: "Attendance Calendar" },
                { href: "/employee/leave", label: "Apply for Leave" },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="rounded-lg border border-blue-600 px-4 py-3 font-medium text-blue-600 hover:bg-blue-50">
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Use your existing attendance page to check in or check out with your selfie and GPS.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
