import { Award } from "lucide-react";
import type { ProgramDetail } from "@/types";

export default function CertificationJourney({ p }: { p: ProgramDetail }) {
  return (
    <section className="bg-slate-50 py-7">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Certificate */}
        <div>
          <h3 className="text-sm font-bold text-slate-900">Certification</h3>
          <div className="mt-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-6 text-center">
            <Award className="mx-auto h-12 w-12 text-amber-500" />
            <p className="mt-2 text-sm font-bold text-slate-900">{p.certificateTitle}</p>
            <p className="mt-1 text-xs text-slate-500">
              Awarded to learners who successfully complete the program and industry projects.
            </p>
          </div>
        </div>

        {/* Journey */}
        <div>
          <h3 className="text-sm font-bold text-slate-900">Student Journey</h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {p.journeySteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-indigo-400 text-indigo-600">
                      <Icon size={24} />
                    </div>
                    <p className="text-[10px] text-slate-500">{step.label}</p>
                  </div>
                  {i < p.journeySteps.length - 1 && (
                    <div className="hidden h-px w-4 bg-indigo-200 sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
