import type { ProgramDetail } from "@/types";
import { TechTile } from "@/components/icons/TechIcons";

export default function IndustryProjects({ p }: { p: ProgramDetail }) {
  return (
    <section className="bg-white py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900">Build Industry Projects</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.projects.map((proj) => {
            if (proj.key) {
              return (
                <div key={proj.title} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <TechTile name={proj.key} size="md" />
                  <p className="text-sm font-medium text-slate-700">{proj.title}</p>
                </div>
              );
            }
            const Icon = proj.icon;
            return (
              <div key={proj.title} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  <Icon size={26} className="text-indigo-500" />
                </div>
                <p className="text-sm font-medium text-slate-700">{proj.title}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <button className="rounded-full border border-indigo-300 px-5 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">
            View All Projects →
          </button>
        </div>
      </div>
    </section>
  );
}
