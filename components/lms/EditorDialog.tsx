"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

export type EditorField = {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "url"
    | "textarea"
    | "number"
    | "datetime-local"
    | "checkbox"
    | "select";
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
};
export type Editor = {
  title: string;
  action: string;
  values?: Record<string, unknown>;
  fields: EditorField[];
};

export function istInput(value: string | null) {
  if (!value) return "";
  return new Date(new Date(value).getTime() + 330 * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function EditorDialog({
  editor,
  onClose,
  onSave,
}: {
  editor: Editor;
  onClose: () => void;
  onSave: (body: Record<string, unknown>) => Promise<void>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const body: Record<string, unknown> = {
      ...editor.values,
      action: editor.action,
    };
    for (const field of editor.fields) {
      const raw = String(form.get(field.name) ?? "");
      body[field.name] =
        field.type === "number"
          ? Number(raw)
          : field.type === "checkbox"
            ? form.has(field.name)
            : field.type === "datetime-local"
              ? raw
                ? new Date(raw + ":00+05:30").toISOString()
                : null
              : raw;
    }
    try {
      await onSave(body);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-slate-900/50"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <h2 id={titleId} className="text-lg font-bold text-slate-900">
          {editor.title}
        </h2>
        <button
          aria-label="Close form"
          disabled={busy}
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
        >
          <X size={19} />
        </button>
      </div>
      <form onSubmit={submit} className="space-y-5 p-6">
        {editor.fields.map((field) => {
          const value = editor.values?.[field.name];
          const inputId = `${titleId}-${field.name}`;
          const style =
            "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
          return (
            <div key={field.name}>
              <label
                htmlFor={inputId}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                {field.label}
                {field.required && " *"}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={inputId}
                  name={field.name}
                  required={field.required}
                  maxLength={field.maxLength ?? 6000}
                  defaultValue={String(value ?? "")}
                  rows={5}
                  className={style}
                />
              ) : field.type === "select" ? (
                <select
                  id={inputId}
                  name={field.name}
                  required={field.required}
                  defaultValue={String(value ?? "")}
                  className={style}
                >
                  <option value="">Select a program</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  id={inputId}
                  name={field.name}
                  type="checkbox"
                  defaultChecked={value === true}
                  className="h-5 w-5 accent-blue-600"
                />
              ) : (
                <input
                  id={inputId}
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  maxLength={field.maxLength ?? 160}
                  defaultValue={
                    field.type === "datetime-local"
                      ? istInput(typeof value === "string" ? value : null)
                      : String(value ?? "")
                  }
                  className={style}
                />
              )}
              {field.type === "datetime-local" && (
                <p className="mt-1 text-xs text-slate-500">
                  India Standard Time (IST)
                </p>
              )}
              {field.type === "url" && (
                <p className="mt-1 text-xs text-slate-500">
                  Use an HTTPS link. Ensure your enrolled students can access
                  it.
                </p>
              )}
            </div>
          );
        })}
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
