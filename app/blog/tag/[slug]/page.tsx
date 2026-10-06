import { notFound, redirect } from "next/navigation";
import { ALL_ARTICLES, topicSlug } from "@/data/blog";

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = topicSlug((await params).slug);
  if (!ALL_ARTICLES.some((post) => post.tags.some((tag) => topicSlug(tag) === slug))) notFound();
  redirect(`/blog?tag=${encodeURIComponent(slug)}#latest-articles`);
}
