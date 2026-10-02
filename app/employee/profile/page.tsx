"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  employee: { full_name: string; employee_code: string; email: string; department: string | null };
  schedule: { name: string; start_time: string; end_time: string; grace_minutes: number; timezone: string } | null;
  month: string;
  weeklyHoliday: string;
  summary: { presentDays: number; lateDays: number; approvedLeaveDays: number };
  recentAttendance: { attendance_date: string; check_in_at: string | null; check_out_at: string | null; late_minutes: number | null }[];
  recentLeaves: { start_date: string; end_date: string; leave_type: string; status: string }[];
};

function timeIST(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(value));
}

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in first.");
      const response = await fetch("/api/employee/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load profile.");
      setProfile(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void loadProfile(); }, [loadProfile]);
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-blue-600">NextPeer / Employee Portal</p>
          <h1 className="mt-2 text-3xl font-bold">My Profile</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/employee/calendar" className="rounded-lg border px-4 py-2">Attendance Calendar</a>
          <a href="/employee/leave" className="rounded-lg border px-4 py-2">My Leave</a>
          <button onClick={() => void loadProfile()} disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50">Refresh</button>
        </div>
      </div>
      {loading && <p role="status">Loading profile...</p>}
      {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
      {profile && !loading && (
        <div className="space-y-6">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">{profile.employee.full_name}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-sm text-gray-500">Employee Code</dt><dd className="font-medium">{profile.employee.employee_code}</dd></div>
              <div><dt className="text-sm text-gray-500">Email</dt><dd className="break-all font-medium">{profile.employee.email}</dd></div>
              <div><dt className="text-sm text-gray-500">Department</dt><dd className="font-medium">{profile.employee.department || "Not assigned"}</dd></div>
              <div><dt className="text-sm text-gray-500">Weekly Holiday</dt><dd className="font-medium">{profile.weeklyHoliday}</dd></div>
            </dl>
          </section>
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">My Work Schedule</h2>
            {profile.schedule ? (
              <p className="mt-3 text-gray-700">{profile.schedule.name} · {profile.schedule.start_time.slice(0, 5)}–{profile.schedule.end_time.slice(0, 5)} · {profile.schedule.timezone} · {profile.schedule.grace_minutes}-minute grace period</p>
            ) : <p className="mt-3 text-gray-500">No schedule assigned.</p>}
          </section>
          <section>
            <h2 className="mb-3 text-lg font-bold">Attendance Summary — {profile.month}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Days Present", value: profile.summary.presentDays },
                { label: "Late Check-ins", value: profile.summary.lateDays },
                { label: "Approved Leave Days", value: profile.summary.approvedLeaveDays },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{item.label}</p><p className="mt-2 text-3xl font-bold text-blue-600">{item.value}</p></div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Recent Attendance</h2>
            {profile.recentAttendance.length === 0 ? <p className="mt-3 text-gray-500">No attendance records this month.</p> : (
              <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="py-2 pr-4">Date</th><th className="py-2 pr-4">Check-in</th><th className="py-2 pr-4">Check-out</th><th className="py-2">Late</th></tr></thead><tbody>{profile.recentAttendance.map((record) => <tr key={record.attendance_date} className="border-b"><td className="py-3 pr-4">{record.attendance_date}</td><td className="py-3 pr-4">{timeIST(record.check_in_at)}</td><td className="py-3 pr-4">{timeIST(record.check_out_at)}</td><td className="py-3">{record.late_minutes ?? 0} min</td></tr>)}</tbody></table></div>
            )}
          </section>
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Recent Leave Requests</h2>
            {profile.recentLeaves.length === 0 ? <p className="mt-3 text-gray-500">No leave requests found.</p> : (
              <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="py-2 pr-4">Dates</th><th className="py-2 pr-4">Type</th><th className="py-2">Status</th></tr></thead><tbody>{profile.recentLeaves.map((leave, index) => <tr key={`${leave.start_date}-${index}`} className="border-b"><td className="py-3 pr-4">{leave.start_date} to {leave.end_date}</td><td className="py-3 pr-4">{leave.leave_type}</td><td className="py-3 capitalize">{leave.status}</td></tr>)}</tbody></table></div>
            )}
            <p className="mt-4 text-xs text-gray-500">Remaining leave balance is not shown because a leave-entitlement policy has not yet been configured.</p>
          </section>
        </div>
      )}
    </main>
  );
}
