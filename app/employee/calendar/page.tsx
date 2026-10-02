
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CalendarDay = {
  date: string;
  status:
    | "present"
    | "leave"
    | "holiday"
    | "no_check_in"
    | "future";
  checkIn: string | null;
  checkOut: string | null;
  lateMinutes: number;
  leaveType: string | null;
};

type CalendarReport = {
  success: boolean;
  month: string;
  employeeName: string;
  weeklyHoliday: string;
  days: CalendarDay[];
};

const statusStyles: Record<
  CalendarDay["status"],
  string
> = {
  present: "border-green-300 bg-green-50 text-green-800",
  leave: "border-blue-300 bg-blue-50 text-blue-800",
  holiday: "border-gray-200 bg-gray-100 text-gray-600",
  no_check_in: "border-red-200 bg-red-50 text-red-700",
  future: "border-gray-100 bg-white text-gray-400",
};

const statusLabels: Record<
  CalendarDay["status"],
  string
> = {
  present: "Present",
  leave: "Approved leave",
  holiday: "Monday holiday",
  no_check_in: "No check-in",
  future: "Upcoming",
};

function currentMonthIST() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}`;
}

function formatTime(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString(
    "en-IN",
    {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default function EmployeeCalendarPage() {
  const currentMonth = currentMonthIST();

  const [month, setMonth] = useState(currentMonth);
  const [report, setReport] =
    useState<CalendarReport | null>(null);
  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    setError("");
    setReport(null);
    setSelectedDate(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Please log in first.");
      }

      const response = await fetch(
        `/api/employee/calendar?month=${encodeURIComponent(
          month
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
          result.error || "Unable to load calendar."
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
  }, [month]);

  useEffect(() => {
    void loadCalendar();
  }, [loadCalendar]);

  const selectedDay = report?.days.find(
    (day) => day.date === selectedDate
  );

  const firstWeekday = report
    ? (new Date(
        `${report.month}-01T00:00:00Z`
      ).getUTCDay() +
        6) %
      7
    : 0;

  const presentCount =
    report?.days.filter(
      (day) => day.status === "present"
    ).length ?? 0;

  const leaveCount =
    report?.days.filter(
      (day) => day.status === "leave"
    ).length ?? 0;

  const noCheckInCount =
    report?.days.filter(
      (day) => day.status === "no_check_in"
    ).length ?? 0;

  const lateCount =
    report?.days.filter(
      (day) =>
        day.status === "present" &&
        day.lateMinutes > 0
    ).length ?? 0;

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-8">
        <p className="font-semibold text-blue-600">
          NextPeer / Employee Portal
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Attendance Calendar
        </h1>

        <p className="mt-2 text-gray-500">
          View your check-ins, approved leave and weekly
          holidays.
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a
            href="/employee/leave"
            className="font-medium text-blue-600 hover:underline"
          >
            Apply for Leave
          </a>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border bg-white p-5">
        <div>
          <label
            htmlFor="calendar-month"
            className="mb-2 block text-sm font-medium"
          >
            Select Month
          </label>

          <input
            id="calendar-month"
            type="month"
            value={month}
            max={currentMonth}
            onChange={(event) => {
              if (event.target.value) {
                setMonth(event.target.value);
              }
            }}
            className="rounded-lg border px-4 py-3"
          />
        </div>

        <button
          type="button"
          onClick={() => void loadCalendar()}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </div>
      )}

      {loading && (
        <p role="status" className="text-gray-500">
          Loading attendance calendar...
        </p>
      )}

      {report && !loading && (
        <>
          <h2 className="mb-5 text-xl font-bold">
            {new Date(
              `${report.month}-01T00:00:00Z`
            ).toLocaleDateString("en-IN", {
              timeZone: "UTC",
              month: "long",
              year: "numeric",
            })}
          </h2>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Present",
                value: presentCount,
              },
              {
                label: "Approved Leave",
                value: leaveCount,
              },
              {
                label: "No Check-in",
                value: noCheckInCount,
              },
              {
                label: "Late Arrivals",
                value: lateCount,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border bg-white p-4"
              >
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-white p-3 shadow-sm sm:p-6">
            <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 sm:text-sm">
              {[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from(
                { length: firstWeekday },
                (_, index) => (
                  <div key={`empty-${index}`} />
                )
              )}

              {report.days.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() =>
                    setSelectedDate(day.date)
                  }
                  aria-label={`${formatDate(
                    day.date
                  )}: ${statusLabels[day.status]}`}
                  aria-pressed={
                    selectedDate === day.date
                  }
                  className={`min-h-20 rounded-lg border p-1 text-left transition sm:min-h-28 sm:p-3 ${
                    statusStyles[day.status]
                  } ${
                    selectedDate === day.date
                      ? "ring-2 ring-blue-600"
                      : ""
                  }`}
                >
                  <span className="block text-sm font-bold sm:text-lg">
                    {Number(day.date.slice(-2))}
                  </span>

                  <span className="mt-2 block break-words text-[10px] leading-tight sm:text-xs">
                    {statusLabels[day.status]}
                  </span>

                  {day.status === "present" &&
                    day.lateMinutes > 0 && (
                      <span className="mt-1 block text-[10px] text-orange-700 sm:text-xs">
                        Late: {day.lateMinutes}m
                      </span>
                    )}
                </button>
              ))}
            </div>
          </div>

          {selectedDay && (
            <section className="mt-6 rounded-2xl border bg-white p-6">
              <h3 className="text-xl font-bold">
                {formatDate(selectedDay.date)}
              </h3>

              <p className="mt-2 font-medium">
                {statusLabels[selectedDay.status]}
              </p>

              {selectedDay.status === "present" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Check-in
                    </p>
                    <p className="font-semibold">
                      {formatTime(selectedDay.checkIn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Check-out
                    </p>
                    <p className="font-semibold">
                      {formatTime(selectedDay.checkOut)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Late Minutes
                    </p>
                    <p className="font-semibold">
                      {selectedDay.lateMinutes}
                    </p>
                  </div>
                </div>
              )}

              {selectedDay.status === "leave" && (
                <p className="mt-3 capitalize text-gray-600">
                  Leave type:{" "}
                  {selectedDay.leaveType ?? "Approved"}
                </p>
              )}
            </section>
          )}

          <p className="mt-5 text-sm text-gray-500">
            Monday is your weekly holiday. No check-in
            means no attendance record was found; it
            does not automatically mean an unpaid
            absence. Approved leave is shown separately.
          </p>
        </>
      )}
    </main>
  );
}
