"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const programs = [
  "Artificial Intelligence & Data Science",
  "Cloud Computing",
  "Machine Learning with Python",
  "Data Analytics",
  "Cyber Security",
  "Web Development",
  "Other Program",
];

const timeSlots = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
  "7:00 PM",
];

export default function BookSessionPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    college_name: "",
    current_year: "",
    program_name: "",
    preferred_date: "",
    preferred_time: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------------------------------------
  // BOOK SESSION
  // Saves booking to:
  // 1. Supabase
  // 2. Google Sheets through Google Apps Script
  // ---------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // STEP 1: Save booking in Supabase
      const { error: supabaseError } = await supabase
        .from("counselling_bookings")
        .insert([
          {
            full_name: form.full_name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            college_name: form.college_name.trim() || null,
            current_year: form.current_year || null,
            program_name: form.program_name,
            preferred_date: form.preferred_date,
            preferred_time: form.preferred_time,
            message: form.message.trim() || null,
            status: "new",
          },
        ]);

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);

        setError(
          "We couldn't book your session. Please try again in a moment."
        );

        return;
      }

      // STEP 2: Send booking to Google Sheets
      const googleScriptUrl =
        "https://script.google.com/macros/s/AKfycbzM1A-H-cRpvlHh6RGET3NJJfQufSfsnMOaVXjHbcOatkCa49VuSAkXuuZ3HrAywshp/exec";

      try {
        await fetch(googleScriptUrl, {
          method: "POST",

          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },

          body: JSON.stringify({
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            college_name: form.college_name.trim(),
            current_year: form.current_year,
            program_name: form.program_name,
            preferred_date: form.preferred_date,
            preferred_time: form.preferred_time,
            message: form.message.trim(),
            status: "new",
          }),
        });
      } catch (googleSheetError) {
        // Supabase already has the booking,
        // so don't show the student a failed booking.
        console.error("Google Sheets error:", googleSheetError);
      }

      // STEP 3: Show confirmation screen
      setSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);

      setError(
        "We couldn't book your session. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // SUCCESS SCREEN
  // ---------------------------------------------------------

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
              Booking confirmed
            </p>

            <h1 className="text-3xl font-bold text-slate-950 md:text-4xl">
              Your counselling session request is submitted!
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-slate-600">
              Thank you, {form.full_name}. The NextPeer team has received your
              request for <strong>{form.program_name}</strong>.
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl bg-slate-50 p-6 text-left">
              <p className="text-sm text-slate-500">Preferred date</p>

              <p className="mt-1 font-semibold text-slate-900">
                {form.preferred_date}
              </p>

              <p className="mt-4 text-sm text-slate-500">Preferred time</p>

              <p className="mt-1 font-semibold text-slate-900">
                {form.preferred_time}
              </p>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Our team will contact you to confirm the session.
            </p>

            <Link
              href="/programs"
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------
  // BOOKING PAGE
  // ---------------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="NextPeer"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <Link
            href="/programs"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            ← Back to Programs
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        {/* LEFT SIDE */}

        <div className="lg:pt-8">
          <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            Free Career Counselling
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-950 md:text-5xl">
            Build the right
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              career roadmap.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Speak with the NextPeer team and understand the program, learning
            roadmap, live training, projects and career support that fits your
            goals.
          </p>

          <div className="mt-10 space-y-5">
            <Feature
              number="01"
              title="Personalised Guidance"
              description="Discuss your career goals and understand which learning path suits you."
            />

            <Feature
              number="02"
              title="Program Walkthrough"
              description="Understand the curriculum, live classes, practical projects and learning journey."
            />

            <Feature
              number="03"
              title="Career Roadmap"
              description="Get clarity on the skills and practical experience required for your target domain."
            />

            <Feature
              number="04"
              title="Ask Your Questions"
              description="Discuss training, projects, certification and career assistance directly with our team."
            />
          </div>

          <div className="mt-10 rounded-2xl bg-slate-950 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
              NextPeer
            </p>

            <h3 className="mt-2 text-xl font-bold">
              Learn Today. Build Tomorrow.
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Live instructor-led learning with practical projects designed to
              help students build industry-relevant skills.
            </p>
          </div>
        </div>

        {/* FORM */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 md:p-9">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Book your session
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Free Counselling Session
            </h2>

            <p className="mt-3 text-slate-500">
              Fill in your details and select your preferred date and time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <Input
              label="College / University"
              name="college_name"
              value={form.college_name}
              onChange={handleChange}
              placeholder="Enter your college name"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Select
                label="Current Year"
                name="current_year"
                value={form.current_year}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
                <option value="Working Professional">
                  Working Professional
                </option>
              </Select>

              <Select
                label="Interested Program"
                name="program_name"
                value={form.program_name}
                onChange={handleChange}
                required
              >
                <option value="">Select program</option>

                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Preferred Date"
                name="preferred_date"
                type="date"
                value={form.preferred_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />

              <Select
                label="Preferred Time"
                name="preferred_time"
                value={form.preferred_time}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>

                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Anything you'd like to discuss?
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your career goals or questions..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Booking your session..."
                : "Book Free Counselling →"}
            </button>

            <p className="text-center text-xs leading-5 text-slate-400">
              By submitting this form, you agree to be contacted by the
              NextPeer team regarding your counselling session.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------
// FEATURE COMPONENT
// ---------------------------------------------------------

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
        {number}
      </div>

      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// INPUT COMPONENT
// ---------------------------------------------------------

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

// ---------------------------------------------------------
// SELECT COMPONENT
// ---------------------------------------------------------

function Select({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {children}
      </select>
    </div>
  );
}
