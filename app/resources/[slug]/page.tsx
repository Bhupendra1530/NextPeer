import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleBody from "@/components/sections/blog/ArticleBody";
import { RESOURCES } from "@/data/resources";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return RESOURCES.map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = RESOURCES.find((resource) => resource.slug === slug);
  return item ? { title: item.title, description: item.description, alternates: { canonical: `https://nextpeer.in/resources/${item.slug}` } } : { title: "Resource Not Found", robots: { index: false } };
}
export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const item = RESOURCES.find((resource) => resource.slug === slug);
  if (!item) notFound();
  return <><Header /><main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
    <Link href="/resources" className="text-sm font-semibold text-blue-600">All Resources</Link>
    <h1 className="mt-4 text-3xl font-extrabold text-slate-900">{item.title}</h1>
    <p className="mt-3 leading-8 text-slate-600">{item.description}</p>
    <a href={`/resources/${item.slug}/download`} className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Download editable TXT</a>
    <ArticleBody content={item.content.replace(/^# .*\n/, "")} />
  </main><Footer /></>;
}
