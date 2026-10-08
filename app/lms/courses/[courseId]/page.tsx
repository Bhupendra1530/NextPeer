import { notFound } from "next/navigation";
import LmsPortal from "@/components/lms/LmsPortal";
export default async function LmsCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      courseId,
    )
  )
    notFound();
  return <LmsPortal courseId={courseId} />;
}
