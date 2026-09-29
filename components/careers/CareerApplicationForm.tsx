"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
} from "lucide-react";

const ROLES = [
  "Business Development Manager",
  "Business Development Executive",
  "Lead Generation Specialist",
  "Business Development Intern",
  "Campus Growth Intern",
  "General Application",
];

export default function CareerApplicationForm() {
  const searchParams = useSearchParams();

  const selectedRole =
    searchParams.get("role") || "General Application";

  const validRole = ROLES.includes(selectedRole)
    ? selectedRole
    : "General Application";

  const [role, setRole] = useState(validRole);

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Backend connection will be added next.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={28} />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
            Application ready
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            The application form is working. We&apos;ll connect the submission
            system next so applications are saved securely.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">

          <div className="mb-8 flex items-start gap-4 border-b border-slate-100 pb-7">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                Application
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                {role}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid gap-6 sm:grid-cols-2">

              <FormField label="Full Name" required>
                <input
                  name="full_name"
                  required
                  type="text"
                  placeholder="Your full name"
                  className={inputStyles}
                />
              </FormField>

              <FormField label="Email Address" required>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="you@example.com"
                  className={inputStyles}
                />
              </FormField>

              <FormField label="Phone Number" required>
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={inputStyles}
                />
              </FormField>

              <FormField label="Current Location" required>
                <input
                  name="location"
                  required
                  type="text"
                  placeholder="City, State"
                  className={inputStyles}
                />
              </FormField>

            </div>

            <FormField label="Role Applied For" required>
              <select
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className={inputStyles}
              >
                {ROLES.map((jobRole) => (
                  <option key={jobRole} value={jobRole}>
                    {jobRole}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid gap-6 sm:grid-cols-2">

              <FormField label="Experience Level" required>
                <select
                  name="experience"
                  required
                  defaultValue=""
                  className={inputStyles}
                >
                  <option value="" disabled>
                    Select experience
                  </option>

                  <option value="Fresher">Fresher</option>
                  <option value="0-1 Year">0–1 Year</option>
                  <option value="1-2 Years">1–2 Years</option>
                  <option value="2-4 Years">2–4 Years</option>
                  <option value="4+ Years">4+ Years</option>
                </select>
              </FormField>

              <FormField label="LinkedIn Profile">
                <input
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  className={inputStyles}
                />
              </FormField>

            </div>

            <FormField label="Resume / CV">
              <input
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-blue-600 hover:border-blue-300"
              />

              <p className="mt-2 text-xs text-slate-400">
                PDF, DOC or DOCX.
              </p>
            </FormField>

            <FormField
              label="Why do you want to join NextPeer?"
              required
            >
              <textarea
                name="why_nextpeer"
                required
                rows={5}
                placeholder="Tell us why you're interested in this role and how you can contribute..."
                className={`${inputStyles} resize-none`}
              />
            </FormField>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs leading-5 text-slate-500">
                By submitting this application, you agree that NextPeer may use
                the information you provide to review and process your
                application.
              </p>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Submit Application

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}

const inputStyles =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}
