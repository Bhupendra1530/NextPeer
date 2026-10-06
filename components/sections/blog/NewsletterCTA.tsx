import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function NewsletterCTA() {
  return (
    <section className="bg-slate-50 pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <BookOpen size={28} className="shrink-0 text-blue-600" />
            <div><h2 className="text-base font-bold text-slate-900">Turn reading into practical skills</h2>
              <p className="mt-1 max-w-md text-sm text-slate-600">Download a free study guide or talk to NextPeer about a training path that fits your goals.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/resources" className="rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-600">Free Resources</Link>
            <Link href="/book-session" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Book Counselling <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
