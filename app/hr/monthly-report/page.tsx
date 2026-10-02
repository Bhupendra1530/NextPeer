
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EmployeeReport = {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  department: string | null;
  scheduledDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalLateMinutes: number;
  totalWorkingMinutes: number;
  mondayAttendanceDays: number;
};

type MonthlyReport = {
  success: boolean;
  month: string;
  asOfDate: string;
  officeHours: string;
  weeklyHoliday: string;
  summary: {
    totalEmployees: number;
    scheduledDays: number;
    totalPresentDays: number;
    totalAbsentDays: number;
  };
  employees: EmployeeReport[];
};

function getCurrentMonthIST() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find(
    (part) => part.type === "year"
  )?.value;

  const month = parts.find(
    (part) => part.type === "month"
  )?.value;

  return `${year}-${month}`;
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return `${hours}h ${remaining}m`;
}

function formatMonth(month: string) {
  return new Date(`${month}-01T00:00:00Z`)
    .toLocaleDateString("en-IN", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    });
}

function csvCell(value: string | number) {
  // Prevent spreadsheet formula injection from employee fields.
  const text = String(value);

  const safeText = /^[\s]*[=+\-@]/.test(text)
    ? `'${text}`
    : text;

  return `"${safeText.replace(/"/g, '""')}"`;
}

export default function MonthlyReportPage() {
  const currentMonth = getCurrentMonthIST();

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [report, setReport] =
    useState<MonthlyReport | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Please log in first.");
      }

      const response = await fetch(
        `/api/hr/monthly-report?month=${encodeURIComponent(
          selectedMonth
        )}`,
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
          result.error || "Unable to load monthly report."
        );
      }

      setReport(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  function exportCSV() {
    if (!report) return;

    const headers = [
      "Employee Code",
      "Employee Name",
      "Email",
      "Department",
      "Scheduled Days",
      "Present Days",
      "Days Without Check-in",
      "Late Days",
      "Total Late Minutes",
      "Total Working Minutes",
      "Monday Attendance Days",
    ];

    const rows = report.employees.map((employee) => [
      employee.employeeCode,
      employee.fullName,
      employee.email,
      employee.department ?? "",
      employee.scheduledDays,
      employee.presentDays,
      employee.absentDays,
      employee.lateDays,
      employee.totalLateMinutes,
      employee.totalWorkingMinutes,
      employee.mondayAttendanceDays,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");

    // UTF-8 BOM helps Excel display names correctly.
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `NextPeer_Attendance_${report.month}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-blue-600">
            NextPeer / HR Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Monthly Attendance Report
          </h1>

          <p className="mt-2 text-gray-500">
            Employee attendance, working hours and late
            arrivals
          </p>
        </div>

        <a
          href="/hr/dashboard"
          className="rounded-lg border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
        >
          Daily Dashboard
        </a>
      </div>

      {/* Month selector */}

      <div className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div>
          <label
            htmlFor="report-month"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select Month
          </label>

          <input
            id="report-month"
            type="month"
            value={selectedMonth}
            max={currentMonth}
            onChange={(event) => {
              if (event.target.value) {
                setSelectedMonth(event.target.value);
              }
            }}
            className="rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <button
          type="button"
          onClick={() => void loadReport()}
          disabled={loading}
          className="rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-600 disabled:opacity-50"
        >
          Refresh
        </button>

        <button
          type="button"
          onClick={exportCSV}
          disabled={loading || !report}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Export to Excel (CSV)
        </button>
      </div>

      {loading && (
        <p role="status" className="text-gray-600">
          Loading monthly report...
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

      {report && !loading && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              {formatMonth(report.month)}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Office hours: {report.officeHours}
              {" · "}
              Weekly holiday: {report.weeklyHoliday}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Attendance calculated through{" "}
              {report.asOfDate}
            </p>
          </div>

          {/* Summary cards */}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Employees",
                value: report.summary.totalEmployees,
              },
              {
                title: "Scheduled Working Days",
                value: report.summary.scheduledDays,
              },
              {
                title: "Total Days Present",
                value: report.summary.totalPresentDays,
              },
              {
                title: "Days Without Check-in",
                value: report.summary.totalAbsentDays,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <p className="mt-3 text-3xl font-bold text-blue-600">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Employee report */}

          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-xl font-bold">
                Employee Attendance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {formatMonth(report.month)}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-4">Employee</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Working Days</th>
                    <th className="p-4">Present</th>
                    <th className="p-4">No Check-in</th>
                    <th className="p-4">Late Days</th>
                    <th className="p-4">Late Time</th>
                    <th className="p-4">Working Hours</th>
                    <th className="p-4">Monday Attendance</th>
                  </tr>
                </thead>

                <tbody>
                  {report.employees.map((employee) => (
                    <tr
                      key={employee.employeeId}
                      className="border-t"
                    >
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">
                          {employee.fullName}
                        </p>

                        <p className="text-gray-500">
                          {employee.employeeCode}
                        </p>
                      </td>

                      <td className="p-4">
                        {employee.department || "—"}
                      </td>

                      <td className="p-4">
                        {employee.scheduledDays}
                      </td>

                      <td className="p-4 font-semibold text-green-700">
                        {employee.presentDays}
                      </td>

                      <td className="p-4 font-semibold text-red-600">
                        {employee.absentDays}
                      </td>

                      <td className="p-4">
                        {employee.lateDays}
                      </td>

                      <td className="p-4">
                        {formatMinutes(
                          employee.totalLateMinutes
                        )}
                      </td>

                      <td className="p-4 font-semibold">
                        {formatMinutes(
                          employee.totalWorkingMinutes
                        )}
                      </td>

                      <td className="p-4">
                        {employee.mondayAttendanceDays}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {report.employees.length === 0 && (
                <p className="p-6 text-gray-500">
                  No employees found.
                </p>
              )}
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Mondays and future dates are excluded from
            scheduled working days. Days without a check-in
            are not necessarily payroll absences; approved
            leave and employee joining dates are not yet
            included. Working hours exclude ongoing shifts
            and do not deduct breaks.
          </p>
        </>
      )}
    </main>
  );
}
