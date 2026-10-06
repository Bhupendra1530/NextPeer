import type { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RESOURCES } from "@/data/resources";

export const metadata: Metadata = {
  title: "Free Student Resources",
  description: "Download editable resume templates, interview preparation guides, DSA notes, and web development, JavaScript and Python study resources.",
  alternates: { canonical: "https://nextpeer.in/resources" },
};

export default function ResourcesPage() {
  return <><Header /><main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <Link href="/blog" className="text-sm font-semibold text-blue-600">Back to Blog</Link>
    <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Free Student Resources</h1>
    <p className="mt-4 max-w-2xl leading-8 text-slate-600">Practical study guides you can read online or download as editable text files. No sign-up required. Open a guide and use your browser’s Print option to save a PDF.</p>
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {RESOURCES.map((resource) => <article key={resource.slug} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">{resource.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{resource.description}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-blue-600">
          <Link href={`/resources/${resource.slug}`} className="inline-flex items-center gap-1">Read guide <ArrowRight size={14} /></Link>
          <a href={`/resources/${resource.slug}/download`} className="inline-flex items-center gap-1">Download TXT <Download size={14} /></a>
        </div>
      </article>)}
    </div>
  </main><Footer /></>;
}
