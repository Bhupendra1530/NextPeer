import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  BrainCircuit,
  Code2,
  BarChart3,
  Cloud,
  Sparkles,
  CheckCircle2,
  BriefcaseBusiness,
  FolderKanban,
  Users,
} from "lucide-react";

const skills = [
  {
    name: "Artificial Intelligence",
    icon: BrainCircuit,
  },
  {
    name: "Full Stack",
    icon: Code2,
  },
  {
    name: "Data Analytics",
    icon: BarChart3,
  },
  {
    name: "Cloud",
    icon: Cloud,
  },
];

const journey = [
  {
    title: "Learn",
    description: "Industry-relevant skills",
    icon: BrainCircuit,
  },
  {
    title: "Build",
    description: "Real-world projects",
    icon: FolderKanban,
  },
  {
    title: "Grow",
    description: "Mentorship & guidance",
    icon: Users,
  },
  {
    title: "Career Ready",
    description: "Prepare for opportunities",
    icon: BriefcaseBusiness,
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(#2563eb 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl grid-cols-1 items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">

        {/* =====================================
            LEFT
        ====================================== */}

        <div className="max-w-2xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
            <Sparkles size={14} />

            Built for ambitious college students
          </div>

          <h1 className="mt-6 text-[44px] font-extrabold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[68px]">

            Don&apos;t just learn.

            <br />

            <span className="text-blue-600">
              Build what&apos;s next.
            </span>

          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">

            Learn industry-relevant skills, build real projects
            and get the guidance you need to become career ready.

          </p>

          {/* CTA */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Link
              href="/programs"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Explore Programs

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/book-session"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600"
            >
              <Calendar size={17} />

              Book Free Career Session
            </Link>

          </div>

          {/* Small trust/value row */}

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2
                size={17}
                className="text-emerald-500"
              />
              Live learning
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2
                size={17}
                className="text-emerald-500"
              />
              Real projects
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2
                size={17}
                className="text-emerald-500"
              />
              Career guidance
            </div>

          </div>

          {/* Skills */}

          <div className="mt-10">

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Explore career paths
            </p>

            <div className="flex flex-wrap gap-2">

              {skills.map((skill) => {
                const Icon = skill.icon;

                return (
                  <div
                    key={skill.name}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm"
                  >
                    <Icon
                      size={14}
                      className="text-blue-600"
                    />

                    {skill.name}
                  </div>
                );
              })}

            </div>

          </div>

        </div>

        {/* =====================================
            RIGHT VISUAL
        ====================================== */}

        <div className="relative mx-auto w-full max-w-[520px]">

          {/* Decorative floating pill */}

          <div className="absolute -right-2 -top-5 z-20 hidden items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-lg sm:flex">

            <Sparkles size={14} />

            Your career starts here

          </div>

          {/* Main card */}

          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(37,99,235,0.12)] sm:p-8">

            {/* Header */}

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                  Your NextPeer Journey
                </p>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                  Learn → Build → Grow
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">

                <Sparkles size={21} />

              </div>

            </div>

            {/* Journey */}

            <div className="relative mt-8 space-y-3">

              <div className="absolute bottom-7 left-[23px] top-7 w-px bg-blue-100" />

              {journey.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group relative flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition-all hover:border-blue-100 hover:bg-blue-50/60"
                  >

                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-100">

                      <Icon size={20} />

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-2">

                        <span className="text-[10px] font-extrabold tracking-wider text-blue-500">
                          0{index + 1}
                        </span>

                        <h3 className="text-sm font-extrabold text-slate-900">
                          {item.title}
                        </h3>

                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.description}
                      </p>

                    </div>

                    <ArrowRight
                      size={16}
                      className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500"
                    />

                  </div>
                );
              })}

            </div>

            {/* Bottom */}

            <div className="mt-6 rounded-2xl bg-blue-600 p-5 text-white">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-medium text-blue-100">
                    Start building your future
                  </p>

                  <p className="mt-1 text-base font-extrabold">
                    Choose your career path
                  </p>

                </div>

                <Link
                  href="/programs"
                  aria-label="Explore NextPeer programs"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition-transform hover:scale-105"
                >
                  <ArrowRight size={18} />
                </Link>

              </div>

            </div>

          </div>

          {/* Floating project card */}

          <div className="absolute -bottom-5 -left-6 hidden rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl lg:block">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

                <FolderKanban size={17} />

              </div>

              <div>

                <p className="text-xs font-extrabold text-slate-900">
                  Project-based
                </p>

                <p className="text-[11px] text-slate-500">
                  Learn by building
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
