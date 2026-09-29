import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Lightbulb,
  Users,
  Rocket,
  MapPin,
  Clock3,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Careers at NextPeer | Join Our Team",
  description:
    "Explore career opportunities at NextPeer and help us build practical, career-focused learning experiences for college students.",
  alternates: {
    canonical: "https://nextpeer.in/careers",
  },
};

const values = [
  {
    icon: Rocket,
    title: "Build with purpose",
    description:
      "Work on ideas and experiences designed to help students build practical career skills.",
  },
  {
    icon: Lightbulb,
    title: "Keep learning",
    description:
      "Experiment, improve and learn continuously while solving meaningful problems.",
  },
  {
    icon: Users,
    title: "Grow together",
    description:
      "Collaborate with people who care about students, technology and better learning experiences.",
  },
  {
    icon: HeartHandshake,
    title: "Create real impact",
    description:
      "Your work directly contributes to the learning journey of college students.",
  },
];

const openings = [
  {
    title: "Business Development Manager",
    team: "Business Development",
    location: "Remote",
    type: "Full-Time",
  },
  {
    title: "Business Development Executive",
    team: "Business Development",
    location: "Remote",
    type: "Full-Time",
  },
  {
    title: "Lead Generation Specialist",
    team: "Growth",
    location: "Remote",
    type: "Full-Time",
  },
  {
    title: "Business Development Intern",
    team: "Business Development",
    location: "Remote",
    type: "Internship",
  },
  {
    title: "Campus Growth Intern",
    team: "Growth",
    location: "Remote",
    type: "Internship",
  },
];

export default function CareersPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        {/* HERO */}

        <section className="relative overflow-hidden border-b border-slate-100">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={23} />
            </div>

            <span className="mt-6 inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
              Careers at NextPeer
            </span>

            <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              Build the future of learning
              <span className="text-blue-600"> with us.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Join a team focused on helping college students learn practical
              skills, build real projects and become career ready.
            </p>

            <a
              href="#open-roles"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Explore Open Roles
              <ArrowRight size={17} />
            </a>
          </div>
        </section>

        {/* WHY NEXTPeer */}

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
                Life at NextPeer
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Do work that
                <span className="text-blue-600"> matters.</span>
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                We&apos;re building NextPeer with a simple mindset: stay
                curious, move fast and keep students at the center of what we do.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-5 text-base font-extrabold text-slate-900">
                      {value.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* OPEN ROLES */}

        <section id="open-roles" className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
                  Opportunities
                </span>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Open roles
                </h2>
              </div>

              <p className="max-w-md text-sm leading-6 text-slate-500">
                Find an opportunity where your skills and curiosity can make an
                impact.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {openings.map((role) => (
                <div
                  key={role.title}
                  className="group flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <GraduationCap
                        size={18}
                        className="text-blue-600"
                      />

                      <span className="text-xs font-bold text-blue-600">
                        {role.team}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                      {role.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {role.location}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock3 size={14} />
                        {role.type}
                      </span>
                    </div>
                  </div>

                 <Link
  href={`/careers/apply?role=${encodeURIComponent(role.title)}`}
  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white"
>
  Apply Now
  <ArrowRight size={16} />
</Link>
                </div>
              ))}
            </div>

            {/* GENERAL APPLICATION */}

            <div className="mt-12 rounded-3xl bg-slate-950 px-6 py-10 text-center sm:px-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-400">
                Don&apos;t see your role?
              </p>

              <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                We&apos;d still like to hear from you.
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                If you believe you can contribute to NextPeer, send us a general
                application and tell us how you&apos;d like to help.
              </p>

              <Link
                href="/careers/apply"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
              >
                Send General Application
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
