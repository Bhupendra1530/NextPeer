"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BookOpen,
  LogOut,
  Rocket,
  Target,
  UserRound,
  Zap,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your NextPeer dashboard...
          </p>
        </div>
      </main>
    );
  }

  const fullName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Student";

  const firstName = fullName.split(" ")[0];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="NextPeer Logo"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
            />

            <div className="leading-tight">
              <p className="font-bold text-slate-900">
                Next<span className="text-blue-600">Peer</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Student Dashboard
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {fullName}
              </p>
              <p className="max-w-[180px] truncate text-xs text-slate-400">
                {user?.email}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <Zap size={14} />
              YOUR LEARNING SPACE
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Hey, {firstName} 👋
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Welcome to your NextPeer dashboard. Your courses, projects,
              progress and certificates will live here.
            </p>

            <Link
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              Explore Programs
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardStat
            icon={<BookOpen size={22} />}
            title="My Courses"
            value="0 Active"
            description="Your enrolled programs"
          />

          <DashboardStat
            icon={<Award size={22} />}
            title="Certificates"
            value="0 Earned"
            description="Your achievements"
          />

          <DashboardStat
            icon={<Target size={22} />}
            title="Learning Progress"
            value="Start learning"
            description="Build your first skill"
          />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Continue Learning */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  My Learning
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Continue Learning
                </h2>
              </div>

              <BookOpen className="text-blue-600" size={24} />
            </div>

            {/* Empty state */}
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Rocket size={25} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                Your journey starts here
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                You haven't enrolled in a program yet. Explore NextPeer
                programs and start building real-world skills.
              </p>

              <Link
                href="/courses"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                Browse Programs
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Quick Access
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-5 space-y-3">
              <QuickAction
                href="/courses"
                icon={<BookOpen size={19} />}
                title="Explore Programs"
                description="Discover what to learn next"
              />

              <QuickAction
                href="/profile"
                icon={<UserRound size={19} />}
                title="My Profile"
                description="Manage your account"
              />

              <QuickAction
                href="/certificates"
                icon={<Award size={19} />}
                title="Certificates"
                description="View your achievements"
              />
            </div>
          </section>
        </div>

        {/* Learning Journey */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              The NextPeer Journey
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Learn → Build → Prove → Grow
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your dashboard will track your journey as you complete courses,
              build projects, finish assessments and earn certificates.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Learn", "Build strong foundations"],
              ["02", "Build", "Create real projects"],
              ["03", "Prove", "Complete assessments"],
              ["04", "Grow", "Earn certificates"],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <span className="text-xs font-extrabold text-blue-600">
                  {number}
                </span>

                <h3 className="mt-3 font-bold text-slate-900">
                  {title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="py-8 text-center text-xs text-slate-400">
          NextPeer • Learn today. Build tomorrow.
        </p>
      </div>
    </main>
  );
}

function DashboardStat({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-xl font-extrabold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {description}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="shrink-0 text-slate-300"
      />
    </Link>
  );
}
