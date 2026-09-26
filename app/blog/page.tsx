import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/blog/BlogHero";
import FeaturedArticle from "@/components/sections/blog/FeaturedArticle";
import CategoryGrid from "@/components/sections/blog/CategoryGrid";
import LatestArticles from "@/components/sections/blog/LatestArticles";
import NewsletterCTA from "@/components/sections/blog/NewsletterCTA";

export const metadata: Metadata = {
  title: "NextPeer Blog | AI, Tech Careers & Interview Preparation",
  description:
    "Explore NextPeer articles on AI, programming, career growth, interview preparation and technology trends to help college students build job-ready skills.",
  alternates: {
    canonical: "https://nextpeer.in/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <BlogHero />
        <FeaturedArticle />
        <CategoryGrid />
        <LatestArticles />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
