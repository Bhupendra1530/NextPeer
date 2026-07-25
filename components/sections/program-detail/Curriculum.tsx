import type { ProgramDetail } from "@/types";

export default function Curriculum({ p }: { p: ProgramDetail }) {
  return (
    <section className="bg-slate-50 py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900">What You&apos;ll Learn</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.curriculum.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.number} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-300">{m.number}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50">
                    <Icon size={22} className="text-indigo-500" />
                  </div>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{m.title}</p>
                <ul className="mt-2 space-y-1">
                  {m.topics.map((t) => (
                    <li key={t} className="text-xs text-slate-500">• {t}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
