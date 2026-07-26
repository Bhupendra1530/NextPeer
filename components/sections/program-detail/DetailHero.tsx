import Link from "next/link";
import { Send, PhoneCall, Sparkles } from "lucide-react";
import type { ProgramDetail } from "@/types";
import { TechTile } from "@/components/icons/TechIcons";

export default function DetailHero({ p }: { p: ProgramDetail }) {
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
              {p.tagline}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {p.titleLine1}
              </span>
              <br />
              <span className="text-slate-900">{p.titleLine2}</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm text-slate-600 sm:text-base">
              {p.description}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700">
                <Send size={16} /> Enroll Now
              </Link>
              <Link href="/book-session" className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-300 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
                <PhoneCall size={16} /> Book Free Counselling
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {p.quickHighlights.map((h) => (
                <div key={h} className="rounded-lg border border-slate-100 bg-white p-2.5 text-center text-[10px] font-medium leading-tight text-slate-600 shadow-sm">
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Visual column: graphic + badges stacked in normal flow (no absolute overlap, safe on every screen) */}
          <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 py-2 lg:max-w-none">
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 shadow-xl shadow-indigo-200">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative flex flex-col items-center gap-2">
                <Sparkles className="h-10 w-10 text-white/90" strokeWidth={1.5} />
                <p className="text-4xl font-extrabold tracking-wide text-white">{p.heroInitials}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              {p.heroBadges.map((b) => {
                if (b.key) return <TechTile key={b.label} name={b.key} size="md" />;
                const Icon = b.icon;
                return (
                  <div key={b.label} title={b.label} className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-slate-100">
                    <Icon size={22} className="text-indigo-500" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
