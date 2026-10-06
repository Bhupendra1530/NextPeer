import Link from "next/link";
import { PenLine, Search, ArrowRight, Code2, BarChart3, Lightbulb } from "lucide-react";

export default function BlogHero({ query = "", category = "", tag = "" }: { query?: string; category?: string; tag?: string }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
              <PenLine size={14} />
              NEXTPEER BLOG
            </span>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Learn. Build.
              <br />
              Get <span className="text-blue-600">Hired.</span>
            </h1>

            <p className="mt-4 max-w-md text-sm text-slate-600 sm:text-base">
              Actionable insights on programming, AI, career growth,
              interview preparation, and industry trends from the mentors at
              NextPeer.
            </p>

            <form action="/blog#latest-articles" method="get" role="search" className="relative mt-6 flex max-w-md gap-2">
              {category && <input type="hidden" name="category" value={category} />}
              {tag && <input type="hidden" name="tag" value={tag} />}
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                name="q"
                aria-label="Search blog articles"
                defaultValue={query}
                placeholder="Search articles, technologies, career tips..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button type="submit" className="rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">Search</button>
            </form>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#latest-articles"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Explore Articles
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                Join Training
              </Link>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-6 lg:max-w-none">
            <div className="relative flex aspect-square w-full max-w-xs items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-100 to-blue-50 sm:max-w-sm">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-extrabold text-white shadow-lg">
                NP
              </div>
            </div>
            <div className="absolute -left-2 top-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md sm:left-2">
              <Code2 size={18} className="text-blue-500" />
            </div>
            <div className="absolute -right-2 top-16 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md sm:right-4">
              <BarChart3 size={18} className="text-emerald-500" />
            </div>
            <div className="absolute bottom-6 right-0 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md sm:right-6">
              <Lightbulb size={18} className="text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
