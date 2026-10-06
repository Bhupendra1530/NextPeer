import { RESOURCES } from "@/data/resources";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = RESOURCES.find((item) => item.slug === slug);
  if (!resource) return new Response("Resource not found", { status: 404 });
  return new Response(resource.content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="nextpeer-${resource.slug}.txt"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
