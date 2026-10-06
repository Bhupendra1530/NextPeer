import Link from "next/link";
import { BLOG_CATEGORIES } from "@/data/blog";

export default function CategoryGrid({ selected = "" }: { selected?: string }) {
  return (
    <section className="bg-slate-50 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          Browse by Category
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
          {BLOG_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}#latest-articles`}
                aria-current={selected === cat.slug ? "page" : undefined}
                className={`flex flex-col items-center gap-2 rounded-xl border bg-white px-3 py-5 text-center transition-colors hover:border-blue-300 ${selected === cat.slug ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-100"}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon size={18} />
                </div>
                <p className="text-xs font-medium leading-tight text-slate-700">
                  {cat.label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
