import type { ProgramDetail } from "@/types";
import { TechTile } from "@/components/icons/TechIcons";

export default function ToolsCareerSalary({ p }: { p: ProgramDetail }) {
  return (
    <section className="bg-slate-50 py-7">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Tools */}
        <div className="rounded-xl border border-slate-100 bg-white p-5">
          <h3 className="text-sm font-bold text-slate-900">Tools You&apos;ll Master</h3>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {p.tools.map((t) => {
              if (t.key) {
                return <TechTile key={t.label} name={t.key} size="md" />;
              }
              const Icon = t.icon;
              return (
                <div key={t.label} title={t.label} className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50">
                  <Icon size={26} className="text-indigo-500" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Career */}
        <div className="rounded-xl border border-slate-100 bg-white p-5">
          <h3 className="text-sm font-bold text-slate-900">Career Opportunities</h3>
          <ul className="mt-4 space-y-2">
            {p.careerRoles.map((r) => (
              <li key={r.label} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {r.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Salary */}
        <div className="rounded-xl border border-slate-100 bg-white p-5">
          <h3 className="text-sm font-bold text-slate-900">Salary Insights (India)</h3>
          <table className="mt-4 w-full text-xs">
            <thead>
              <tr className="text-left text-indigo-500">
                <th className="pb-2 font-semibold">Experience</th>
                <th className="pb-2 font-semibold">Average Salary</th>
              </tr>
            </thead>
            <tbody>
              {p.salaryRows.map((row) => (
                <tr key={row.experience} className="border-t border-slate-100">
                  <td className="py-2 text-slate-600">{row.experience}</td>
                  <td className="py-2 font-semibold text-slate-900">{row.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
