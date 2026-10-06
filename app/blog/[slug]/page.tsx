import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ALL_ARTICLES, BLOG_CATEGORIES, topicSlug } from "@/data/blog";
import ArticleBody, { headingId } from "@/components/sections/blog/ArticleBody";
import ArticleCard from "@/components/sections/blog/ArticleCard";

type Props = { params: Promise<{ slug: string }> };
const getPost = (slug: string) => ALL_ARTICLES.find((post) => post.slug === slug);

export function generateStaticParams() {
  return ALL_ARTICLES.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Article Not Found | NextPeer", robots: { index: false } };
  const url = `https://nextpeer.in/blog/${post.slug}`;
  return {
    title: post.title, description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.excerpt, url, type: "article" },
    twitter: { card: "summary", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const category = BLOG_CATEGORIES.find((item) => item.slug === post.category);
  const related = ALL_ARTICLES.filter((item) => item.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);
  const headings = (post.content ?? "").split("\n").filter((line) => line.startsWith("## ")).map((line) => line.slice(3));
  const schema = {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title, description: post.excerpt,
    mainEntityOfPage: `https://nextpeer.in/blog/${post.slug}`,
    author: { "@type": "Organization", name: "NextPeer", url: "https://nextpeer.in" },
    publisher: { "@type": "Organization", name: "NextPeer", url: "https://nextpeer.in" },
  };
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-sm text-slate-500">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span className="text-slate-700">{category?.label}</span>
        </nav>
        <article>
          <Link href={`/blog?category=${post.category}#latest-articles`} className="text-sm font-semibold text-blue-600">{category?.label}</Link>
          <h1 className="mb-5 mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{post.title}</h1>
          <p className="mb-5 text-lg leading-8 text-slate-600">{post.excerpt}</p>
          <p className="mb-6 text-sm text-slate-500">By NextPeer Editorial · {post.readTime}</p>
          <div className="mb-8 flex flex-wrap gap-2">{post.tags.map((tag) => <Link key={tag} href={`/blog?tag=${topicSlug(tag)}#latest-articles`} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{tag}</Link>)}</div>
          {headings.length > 0 && <nav aria-label="Table of contents" className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-900">In this article</h2>
            <ul className="mt-3 space-y-2 text-sm">{headings.map((heading) => <li key={heading}><a href={`#${headingId(heading)}`} className="text-blue-600 hover:underline">{heading}</a></li>)}</ul>
          </nav>}
          <ArticleBody content={post.content ?? ""} />
          <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-slate-900">Put your learning into practice</h2>
            <p className="mt-2 leading-7 text-slate-600">Explore NextPeer training or download a free guide for your next study session.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/programs" className="font-semibold text-blue-600 hover:underline">Explore Programs</Link>
              <Link href="/resources" className="font-semibold text-blue-600 hover:underline">Free Resources</Link>
              <Link href="/book-session" className="font-semibold text-blue-600 hover:underline">Book Counselling</Link>
            </div>
          </div>
        </article>
        <section className="mt-12"><h2 className="mb-5 text-xl font-bold text-slate-900">Continue Reading</h2>
          <div className="grid gap-5 sm:grid-cols-3">{related.map((item) => <ArticleCard key={item.slug} post={item} />)}</div>
        </section>
        <Link href="/blog#latest-articles" className="mt-8 inline-block font-semibold text-blue-600 hover:underline">Back to all articles</Link>
      </main>
      <Footer />
    </>
  );
}
