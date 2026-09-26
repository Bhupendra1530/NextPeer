import type { MetadataRoute } from "next";
import { PROGRAMS } from "@/data/programs";
import { FEATURED_POST, LATEST_ARTICLES } from "@/data/blog";

const siteUrl = "https://nextpeer.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const programPages: MetadataRoute.Sitemap = PROGRAMS.map((program) => ({
    url: `${siteUrl}/programs/${program.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPosts = [FEATURED_POST, ...LATEST_ARTICLES];

const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
  url: `${siteUrl}/blog/${post.slug}`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.7,
}));

return [...staticPages, ...programPages, ...blogPages];
}
