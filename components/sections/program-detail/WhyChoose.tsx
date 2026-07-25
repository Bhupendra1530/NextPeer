import type { ProgramDetail } from "@/types";

export default function WhyChoose({ p }: { p: ProgramDetail }) {
  return (
    <section className="bg-white py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900">Why Choose NextPeer?</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {p.whyChoosePoints.map((pt) => {
            const Icon = pt.icon;
            return (
              <div key={pt.label} className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
                  <Icon size={26} className="text-indigo-500" />
                </div>
                <p className="text-xs font-medium leading-tight text-slate-600">{pt.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
