import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/blog/BlogHero";
import FeaturedArticle from "@/components/sections/blog/FeaturedArticle";
import CategoryGrid from "@/components/sections/blog/CategoryGrid";
import LatestArticles from "@/components/sections/blog/LatestArticles";
import NewsletterCTA from "@/components/sections/blog/NewsletterCTA";
import { ALL_ARTICLES, filterArticles } from "@/data/blog";

const blogMetadata: Metadata = {
  title: "Blog | AI, Tech Careers & Interview Preparation",
  description:
    "Explore NextPeer articles on AI, programming, career growth, interview preparation and technology trends to help college students build job-ready skills.",
  alternates: {
    canonical: "https://nextpeer.in/blog",
  },
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const search = await searchParams;
  return { ...blogMetadata, robots: { index: !["q", "category", "tag", "page"].some((key) => Boolean(search[key])), follow: true } };
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const search = await searchParams;
  const value = (key: string) => typeof search[key] === "string" ? search[key] as string : "";
  const filters = { q: value("q").slice(0, 200), category: value("category"), tag: value("tag") };
  const filtered = Object.values(filters).some(Boolean);
  const articles = filtered ? filterArticles(filters) : ALL_ARTICLES.filter((post) => post.number !== 0);
  const pageCount = Math.max(1, Math.ceil(articles.length / 6));
  const requested = Number(value("page"));
  const page = Number.isSafeInteger(requested) ? Math.min(pageCount, Math.max(1, requested)) : 1;
  return (
    <>
      <Header />
      <main>
        <BlogHero query={filters.q} category={filters.category} tag={filters.tag} />
        {!filtered && <FeaturedArticle />}
        <CategoryGrid selected={filters.category} />
        <LatestArticles posts={articles.slice((page - 1) * 6, page * 6)} total={articles.length} page={page} pageCount={pageCount} filters={filters} />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
