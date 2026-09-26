import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FEATURED_POST, LATEST_ARTICLES } from "@/data/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

function getPost(slug: string) {
  if (FEATURED_POST.slug === slug) {
    return FEATURED_POST;
  }

  return LATEST_ARTICLES.find((post) => post.slug === slug);
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | NextPeer",
    };
  }

  return {
    title: `${post.title} | NextPeer`,
    description: post.excerpt,
    alternates: {
      canonical: `https://nextpeer.in/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `https://nextpeer.in/blog/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "NextPeer",
      url: "https://nextpeer.in",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <article>
          <p className="mb-4 text-sm font-medium text-blue-600">
            NextPeer Blog
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight">
            {post.title}
          </h1>

          <p className="mb-8 text-lg text-gray-600">
            {post.excerpt}
          </p>

          {"readTime" in post && (
            <p className="mb-10 text-sm text-gray-500">
              {post.readTime}
            </p>
          )}

          <div className="prose prose-lg max-w-none">
            <p>
              This article is part of NextPeer&apos;s learning resources for
              college students. More detailed content, practical examples and
              career guidance will be added here.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
