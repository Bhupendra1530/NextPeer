"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Link as LinkIcon,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);

      setFullName(user.user_metadata?.full_name || "");
      setPhone(user.user_metadata?.phone || "");
      setCollege(user.user_metadata?.college || "");
      setGraduationYear(user.user_metadata?.graduation_year || "");
      setLinkedin(user.user_metadata?.linkedin || "");

      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
        college: college.trim(),
        graduation_year: graduationYear.trim(),
        linkedin: linkedin.trim(),
      },
    });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    if (data.user) {
      setUser(data.user);
    }

    setSuccess("Profile updated successfully.");
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  const displayName =
    fullName || user?.email?.split("@")[0] || "Student";

  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="NextPeer Logo"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />

            <div className="leading-tight">
              <p className="font-bold text-slate-900">
                Next<span className="text-blue-600">Peer</span>
              </p>

              <p className="text-[10px] text-slate-400">
                Student Profile
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Heading */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            My Account
          </p>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Student Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Keep your NextPeer profile up to date.
          </p>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Profile Summary */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-extrabold text-white shadow-lg shadow-blue-200">
              {firstLetter}
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {displayName}
            </h2>

            <p className="mt-1 break-all text-sm text-slate-500">
              {user?.email}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
              <CheckCircle2 size={14} />
              Verified Student
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs leading-5 text-slate-400">
                Your profile information helps NextPeer personalize your
                learning experience.
              </p>
            </div>
          </aside>

          {/* Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your student details below.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Full name */}
              <ProfileField
                label="Full name"
                icon={<UserRound size={18} />}
              >
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </ProfileField>

              {/* Email */}
              <ProfileField
                label="Email address"
                icon={<Mail size={18} />}
              >
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed bg-transparent text-sm text-slate-500 outline-none"
                />
              </ProfileField>

              <p className="-mt-3 text-xs text-slate-400">
                Your verified login email cannot be changed from this page.
              </p>

              {/* Phone */}
              <ProfileField
                label="Phone number"
                icon={<Phone size={18} />}
              >
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </ProfileField>

              {/* College */}
              <ProfileField
                label="College / University"
                icon={<Building2 size={18} />}
              >
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="Enter your college or university"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </ProfileField>

              {/* Graduation Year */}
              <ProfileField
                label="Graduation year"
                icon={<CalendarDays size={18} />}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={graduationYear}
                  onChange={(e) =>
                    setGraduationYear(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder="2027"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </ProfileField>

              {/* LinkedIn */}
              <ProfileField
                label="LinkedIn profile"
                icon={<LinkIcon size={18} />}
              >
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </ProfileField>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm font-medium text-green-700">
                    {success}
                  </p>
                </div>
              )}

              {/* Save */}
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </section>
        </div>

        <p className="py-8 text-center text-xs text-slate-400">
          NextPeer • Learn today. Build tomorrow.
        </p>
      </div>
    </main>
  );
}

function ProfileField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
        <span className="shrink-0 text-slate-400">
          {icon}
        </span>

        {children}
      </div>
    </div>
  );
}
