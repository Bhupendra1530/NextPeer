
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Employee = {
  id: string;
  user_id: string;
  employee_code: string;
  full_name: string;
  email: string;
  department: string | null;
  schedule_id: string | null;
  is_active: boolean;
};

type Schedule = {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  grace_minutes: number;
  timezone: string;
};

export default function HREmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [department, setDepartment] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Please log in first.");

      const response = await fetch("/api/hr/employees", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load employees."
        );
      }

      setEmployees(result.employees ?? []);
      setSchedules(result.schedules ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  async function updateEmployee(
    employee: Employee,
    changes: {
      department?: string | null;
      schedule_id?: string;
      is_active?: boolean;
    }
  ) {
    setSavingId(employee.id);
    setError("");
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Please log in first.");

      const response = await fetch("/api/hr/employees", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: employee.id,
          ...changes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to update employee."
        );
      }

      setEmployees((previous) =>
        previous.map((item) =>
          item.id === employee.id ? result.employee : item
        )
      );

      setEditingId(null);
      setMessage(`${employee.full_name} updated successfully.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSavingId(null);
    }
  }

  function startEditing(employee: Employee) {
    setEditingId(employee.id);
    setDepartment(employee.department ?? "");
    setScheduleId(employee.schedule_id ?? "");
    setError("");
    setMessage("");
  }

  function toggleActive(employee: Employee) {
    const action = employee.is_active ? "deactivate" : "activate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${employee.full_name}?`
      )
    ) {
      return;
    }

    void updateEmployee(employee, {
      is_active: !employee.is_active,
    });
  }

  const visibleEmployees = employees.filter((employee) => {
    const query = search.toLowerCase().trim();

    const matchesSearch = [
      employee.full_name,
      employee.employee_code,
      employee.email,
      employee.department ?? "",
    ].some((value) => value.toLowerCase().includes(query));

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && employee.is_active) ||
      (filter === "inactive" && !employee.is_active);

    return matchesSearch && matchesFilter;
  });

  const activeCount = employees.filter(
    (employee) => employee.is_active
  ).length;

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-blue-600">
            NextPeer / HR Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Employee Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage employee departments, shifts and account status.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/hr/dashboard"
            className="rounded-lg border px-4 py-3 font-medium"
          >
            HR Dashboard
          </a>

          <button
            type="button"
            onClick={() => void loadEmployees()}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            Refresh
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

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Employees", value: employees.length },
          { label: "Active", value: activeCount },
          {
            label: "Inactive",
            value: employees.length - activeCount,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search employees..."
          aria-label="Search employees"
          className="min-w-0 flex-1 rounded-lg border px-4 py-3"
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter by employee status"
          className="rounded-lg border px-4 py-3"
        >
          <option value="all">All employees</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <p role="status">Loading employees...</p>
      ) : visibleEmployees.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          No employees found.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleEmployees.map((employee) => {
            const assignedSchedule = schedules.find(
              (schedule) => schedule.id === employee.schedule_id
            );

            return (
              <section
                key={employee.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">
                      {employee.full_name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {employee.employee_code} · {employee.email}
                    </p>

                    <p className="mt-3 text-sm">
                      <strong>Department:</strong>{" "}
                      {employee.department || "Not assigned"}
                    </p>

                    <p className="mt-1 text-sm">
                      <strong>Shift:</strong>{" "}
                      {assignedSchedule
                        ? `${assignedSchedule.name} (${assignedSchedule.start_time.slice(
                            0,
                            5
                          )}–${assignedSchedule.end_time.slice(0, 5)})`
                        : "Not assigned"}
                    </p>

                    {assignedSchedule && (
                      <p className="mt-1 text-xs text-gray-500">
                        Grace period:{" "}
                        {assignedSchedule.grace_minutes} minutes ·{" "}
                        {assignedSchedule.timezone}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      employee.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {employee.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {editingId === employee.id && (
                  <div className="mt-5 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`department-${employee.id}`}
                        className="mb-2 block text-sm font-medium"
                      >
                        Department
                      </label>

                      <input
                        id={`department-${employee.id}`}
                        value={department}
                        onChange={(event) =>
                          setDepartment(event.target.value)
                        }
                        maxLength={100}
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`schedule-${employee.id}`}
                        className="mb-2 block text-sm font-medium"
                      >
                        Work Schedule
                      </label>

                      <select
                        id={`schedule-${employee.id}`}
                        value={scheduleId}
                        onChange={(event) =>
                          setScheduleId(event.target.value)
                        }
                        className="w-full rounded-lg border px-3 py-2"
                      >
                        <option value="">Select a schedule</option>
                        {schedules.map((schedule) => (
                          <option
                            key={schedule.id}
                            value={schedule.id}
                          >
                            {schedule.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3 sm:col-span-2">
                      <button
                        type="button"
                        disabled={savingId !== null || !scheduleId}
                        onClick={() =>
                          void updateEmployee(employee, {
                            department: department.trim() || null,
                            schedule_id: scheduleId,
                          })
                        }
                        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-50"
                      >
                        {savingId === employee.id
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        disabled={savingId !== null}
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border px-5 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3 border-t pt-4">
                  <button
                    type="button"
                    disabled={savingId !== null}
                    onClick={() => startEditing(employee)}
                    className="rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 disabled:opacity-50"
                  >
                    Edit Employee
                  </button>

                  <button
                    type="button"
                    disabled={savingId !== null}
                    onClick={() => toggleActive(employee)}
                    className={`rounded-lg border px-4 py-2 font-medium disabled:opacity-50 ${
                      employee.is_active
                        ? "border-red-500 text-red-600"
                        : "border-green-600 text-green-700"
                    }`}
                  >
                    {savingId === employee.id
                      ? "Updating..."
                      : employee.is_active
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-sm text-gray-500">
        Deactivating an employee prevents access to employee
        attendance and leave APIs that check active status.
        It does not delete the employee's login or past records.
      </p>
    </main>
  );
}
