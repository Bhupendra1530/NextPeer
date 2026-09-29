import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  BarChart3,
} from "lucide-react";
import type { Program } from "@/types";

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-amber-50 text-amber-700 border-amber-200",
  Popular: "bg-emerald-50 text-emerald-700 border-emerald-200",
  New: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function ProgramCard({
  program,
}: {
  program: Program;
}) {
  const Icon = program.icon;

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(37,99,235,0.10)]"
    >
      {/* Top */}

      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${program.gradient} text-white shadow-sm`}
        >
          <Icon
            size={23}
            strokeWidth={1.8}
          />
        </div>

        {program.badge && (
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${
              BADGE_STYLES[program.badge] ??
              "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {program.badge}
          </span>
        )}
      </div>

      {/* Program information */}

      <div className="mt-6">
        <h3 className="text-lg font-extrabold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
          {program.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {program.subtitle}
        </p>
      </div>

      {/* Program metadata */}

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">
          <Clock3
            size={13}
            className="text-blue-600"
          />

          {program.duration}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">
          <BarChart3
            size={13}
            className="text-blue-600"
          />

          {program.level}
        </span>
      </div>

      {/* Bottom */}

      <div className="mt-auto pt-7">
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-end justify-between gap-4">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Program fee
              </p>

              <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
                ₹{program.price.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-600">
              View Program

              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Hover decoration */}

      <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-50 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
}
