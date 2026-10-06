import { notFound, redirect } from "next/navigation";
import { BLOG_CATEGORIES } from "@/data/blog";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  let { slug } = await params;
  if (slug === "success-stories") slug = "project-guides";
  if (!BLOG_CATEGORIES.some((category) => category.slug === slug)) notFound();
  redirect(`/blog?category=${encodeURIComponent(slug)}#latest-articles`);
}
