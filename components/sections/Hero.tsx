import Link from "next/link";
import { ArrowRight, Calendar, GraduationCap } from "lucide-react";
import { HERO_FLOATING_CARDS } from "@/data/content";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-20">
        {/* Left: Copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700">
            🚀 India&apos;s Career Launch Platform for College Students
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Learn. Build.
            <br />
            <span className="text-blue-600">Get Hired.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-slate-600 sm:text-lg">
            Industry-ready training, real-world projects, mentorship,
            internships and placement support to accelerate your career.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Explore Programs
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/book-session"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
            >
              <Calendar size={16} />
              Book Free Career Session
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                "bg-blue-200",
                "bg-amber-200",
                "bg-rose-200",
                "bg-emerald-200",
              ].map((color, i) => (
                <div
                  key={i}
                  className={`h-10 w-10 rounded-full border-2 border-white ${color}`}
                />
              ))}

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[11px] font-bold text-white">
                10K+
              </div>
            </div>

            <p className="text-sm text-slate-600">
              10,000+ students
              <br />
              already transforming their careers
            </p>
          </div>
        </div>

        {/* Right: Visual + floating cards */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-10 lg:max-w-none lg:py-0">
          <div className="relative flex aspect-square w-full max-w-sm items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-400">
            <GraduationCap
              className="h-28 w-28 text-white/90"
              strokeWidth={1.25}
            />
          </div>

          {/* Floating info cards */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {HERO_FLOATING_CARDS.map((card, i) => {
              const Icon = card.icon;

              const positions = [
                "top-4 -right-6",
                "top-1/2 -left-10 -translate-y-1/2",
                "bottom-6 -right-2",
              ];

              return (
                <div
                  key={card.title}
                  className={`pointer-events-auto absolute ${positions[i]} w-56 rounded-xl border border-slate-100 bg-white p-4 shadow-lg`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon size={16} />
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      {card.title}
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {card.description}
                  </p>

                  {card.badge && (
                    <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                      ✓ {card.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: stacked cards below visual */}
          <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:hidden">
            {HERO_FLOATING_CARDS.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon size={16} />
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      {card.title}
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
