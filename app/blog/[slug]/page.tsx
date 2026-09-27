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

  const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is DSA still important in the AI era?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Data Structures and Algorithms remain important because they help developers understand problem solving, efficiency, optimization, and how software works beyond AI-generated code.",
      },
    },
    {
      "@type": "Question",
      name: "Should students learn DSA even when AI can generate code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AI can help generate code, but understanding DSA helps students evaluate solutions, debug problems, improve performance, and make better technical decisions.",
      },
    },
    {
      "@type": "Question",
      name: "Is DSA useful for software engineering interviews?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DSA is commonly used in technical interview preparation because it develops problem-solving skills and helps candidates understand common programming patterns and algorithms.",
      },
    },
  ],
};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(faqSchema),
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
  {post.content ? (
    post.content.split("\n").map((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return null;
      }
      
if (trimmed.startsWith("### ")) {
  return (
    <h3
      key={index}
      className="mt-8 mb-3 text-xl font-semibold tracking-tight"
    >
      {trimmed.replace("### ", "")}
    </h3>
  );
}
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="mt-10 mb-4 text-2xl font-bold tracking-tight"
          >
            {trimmed.replace("## ", "")}
          </h2>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <p key={index} className="ml-4 mb-2">
            {trimmed}
          </p>
        );
      }

      return (
        <p key={index} className="mb-5 leading-8 text-gray-700">
          {trimmed}
        </p>
      );
    })
  ) : (
    <p>
      More detailed content and practical learning resources will be
      added soon.
    </p>
  )}
</div>
        </article>
      </main>

      <Footer />
    </>
  );
}
