import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { TRENDING_TOPICS, topicSlug } from "@/data/blog";
import { RESOURCES } from "@/data/resources";

export default function BlogSidebar() {
  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-xl border border-slate-100 bg-white p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Explore Topics</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {TRENDING_TOPICS.map((topic) => <Link key={topic.label} href={`/blog?tag=${topicSlug(topic.label)}#latest-articles`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600">{topic.label}</Link>)}
        </div>
        <Link href="/blog#latest-articles" className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">All Articles <ArrowRight size={14} /></Link>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Build Your Portfolio</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">Learn how to choose a practical project, test your work and explain your contribution.</p>
        <Link href="/blog/build-your-first-portfolio-project" className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">Read the Project Guide <ArrowRight size={14} /></Link>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Free Resources</h3>
        <p className="mt-2 text-xs text-slate-500">Editable text guides · no sign-up required</p>
        <ul className="mt-4 space-y-3">
          {RESOURCES.map((resource) => <li key={resource.slug}>
            <a href={`/resources/${resource.slug}/download`} className="flex items-center justify-between gap-2 text-sm text-slate-600 hover:text-blue-600">
              {resource.title}<Download size={14} aria-hidden="true" className="shrink-0" />
              <span className="sr-only">Download text file</span>
            </a>
          </li>)}
        </ul>
        <Link href="/resources" className="mt-4 flex items-center justify-center rounded-lg border border-slate-200 py-2 text-sm font-semibold text-blue-600 hover:border-blue-300">View All Resources</Link>
      </div>
    </aside>
  );
}
