import Link from "next/link";
import type { Article } from "@/data/blog";
import ArticleCard from "./ArticleCard";
import BlogSidebar from "./BlogSidebar";

export default function LatestArticles({ posts, total, page, pageCount, filters }: {
  posts: Article[]; total: number; page: number; pageCount: number;
  filters: { q: string; category: string; tag: string };
}) {
  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value);
    params.set("page", String(nextPage));
    return `/blog?${params.toString()}#latest-articles`;
  }
  const filtered = Object.values(filters).some(Boolean);
  return (
    <section id="latest-articles" className="scroll-mt-24 bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">{filtered ? "Article Results" : "Latest Articles"}</h2>
              {filtered && <Link href="/blog#latest-articles" className="text-sm font-semibold text-blue-600 hover:underline">Clear filters</Link>}
            </div>
            <p className="mt-2 text-sm text-slate-600" aria-live="polite">
              {total} {total === 1 ? "article" : "articles"}
              {filters.q && ` matching “${filters.q}”`}
              {filters.category && ` · ${filters.category.replace(/-/g, " ")}`}
              {filters.tag && ` · ${filters.tag.replace(/-/g, " ")}`}
            </p>
            {posts.length ? <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {posts.map((post) => <ArticleCard key={post.slug} post={post} />)}
            </div> : <div className="mt-5 rounded-xl border border-slate-200 bg-white p-8">
              <h3 className="font-semibold text-slate-900">No matching articles</h3>
              <p className="mt-2 text-sm text-slate-600">Try a shorter search or browse all articles.</p>
              <Link href="/blog#latest-articles" className="mt-4 inline-block font-semibold text-blue-600">Browse all articles</Link>
            </div>}
            {pageCount > 1 && <nav aria-label="Article pagination" className="mt-8 flex items-center justify-between gap-4 text-sm">
              {page > 1 ? <Link href={pageHref(page - 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-blue-600">Previous</Link> : <span />}
              <span className="text-slate-600">Page {page} of {pageCount}</span>
              {page < pageCount ? <Link href={pageHref(page + 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-blue-600">Next</Link> : <span />}
            </nav>}
          </div>
          <BlogSidebar />
        </div>
      </div>
    </section>
  );
}
