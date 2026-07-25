import type { ProgramDetail } from "@/types";

const COLORS = [
  { bg: "bg-purple-50", text: "text-purple-500" },
  { bg: "bg-blue-50", text: "text-blue-500" },
  { bg: "bg-indigo-50", text: "text-indigo-500" },
  { bg: "bg-teal-50", text: "text-teal-500" },
];

export default function WhyLearnStats({ p }: { p: ProgramDetail }) {
  return (
    <section className="bg-white py-7">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{p.whyLearnTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {p.whyLearnDescription}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {p.whyLearnStats.map((s, i) => {
            const Icon = s.icon;
            const c = COLORS[i % COLORS.length];
            return (
              <div key={s.label} className={`rounded-xl ${c.bg} p-4 text-center`}>
                <Icon className={`mx-auto h-9 w-9 ${c.text}`} />
                <p className="mt-2 text-lg font-extrabold text-slate-900">{s.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-slate-500">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
