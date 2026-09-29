"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  AlertCircle,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      role: formData.get("role"),
      experience: formData.get("experience"),
      linkedin: formData.get("linkedin"),
      why_nextpeer: formData.get("why_nextpeer"),
    };

    const scriptUrl =
      process.env.NEXT_PUBLIC_CAREER_SCRIPT_URL;

    if (!scriptUrl) {
      setError(
        "Application service is currently unavailable. Please try again later."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Application submission failed.");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Application submission failed."
        );
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Career application error:", err);

      setError(
        "We couldn't submit your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={28} />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
            Application received!
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Thank you for your interest in NextPeer. Your application has
            been received successfully. Our team will review your profile
            and contact you if your experience matches the opportunity.
          </p>

        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">

      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">

          {/* Application heading */}

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

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Personal information */}

            <div className="grid gap-6 sm:grid-cols-2">

              <FormField label="Full Name" required>
                <input
                  name="full_name"
                  required
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  className={inputStyles}
                />
              </FormField>

              <FormField label="Email Address" required>
                <input
                  name="email"
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputStyles}
                />
              </FormField>

              <FormField label="Phone Number" required>
                <input
                  name="phone"
                  required
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  className={inputStyles}
                />
              </FormField>

              <FormField label="Current Location" required>
                <input
                  name="location"
                  required
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City, State"
                  className={inputStyles}
                />
              </FormField>

            </div>

            {/* Role */}

            <FormField label="Role Applied For" required>

              <select
                name="role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value)
                }
                className={inputStyles}
              >

                {ROLES.map((jobRole) => (
                  <option
                    key={jobRole}
                    value={jobRole}
                  >
                    {jobRole}
                  </option>
                ))}

              </select>

            </FormField>

            {/* Experience + LinkedIn */}

            <div className="grid gap-6 sm:grid-cols-2">

              <FormField
                label="Experience Level"
                required
              >

                <select
                  name="experience"
                  required
                  defaultValue=""
                  className={inputStyles}
                >

                  <option value="" disabled>
                    Select experience
                  </option>

                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="0-1 Year">
                    0–1 Year
                  </option>

                  <option value="1-2 Years">
                    1–2 Years
                  </option>

                  <option value="2-4 Years">
                    2–4 Years
                  </option>

                  <option value="4+ Years">
                    4+ Years
                  </option>

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

            {/* Resume */}

            <FormField label="Resume / CV">

              <input
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-blue-600 hover:border-blue-300"
              />

              <p className="mt-2 text-xs text-slate-400">
                PDF, DOC or DOCX. Resume upload will be
                connected separately.
              </p>

            </FormField>

            {/* Why NextPeer */}

            <FormField
              label="Why do you want to join NextPeer?"
              required
            >

              <textarea
                name="why_nextpeer"
                required
                rows={5}
                maxLength={1500}
                placeholder="Tell us why you're interested in this role and how you can contribute..."
                className={`${inputStyles} resize-none`}
              />

            </FormField>

            {/* Consent */}

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs leading-5 text-slate-500">
                By submitting this application, you agree
                that NextPeer may use the information you
                provide to review and process your
                application.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>

              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >

              {isSubmitting
                ? "Submitting..."
                : "Submit Application"}

              {!isSubmitting && (
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}

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
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
}
