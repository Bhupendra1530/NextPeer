import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PROGRAMS } from "@/data/programs";
import { PROGRAM_DETAILS } from "@/data/programDetails";
import DetailHero from "@/components/sections/program-detail/DetailHero";
import WhyLearnStats from "@/components/sections/program-detail/WhyLearnStats";
import Curriculum from "@/components/sections/program-detail/Curriculum";
import IndustryProjects from "@/components/sections/program-detail/IndustryProjects";
import ToolsCareerSalary from "@/components/sections/program-detail/ToolsCareerSalary";
import WhyChoose from "@/components/sections/program-detail/WhyChoose";
import CertificationJourney from "@/components/sections/program-detail/CertificationJourney";
import { FaqSection, DetailCTA } from "@/components/sections/program-detail/FaqAndCTA";

export function generateStaticParams() {
  return PROGRAMS.map((prog) => ({ slug: prog.slug }));
}  
const siteUrl = "https://nextpeer.in";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const program = PROGRAMS.find((prog) => prog.slug === slug);

  if (!program) {
    return {};
  }

  const title = `${program.title} Course for College Students`;

  const description =
    `Learn ${program.title} with NextPeer through practical training, hands-on projects and career-focused learning designed for college students.`;

  return {
    title,
    description,

    alternates: {
      canonical: `${siteUrl}/programs/${program.slug}`,
    },

    openGraph: {
      title: `${title} | NextPeer`,
      description,
      url: `${siteUrl}/programs/${program.slug}`,
      type: "website",
    },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = PROGRAM_DETAILS[slug];
  const program = PROGRAMS.find((prog) => prog.slug === slug);

  if (!detail || !program) {
    notFound();
  }
  
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: program.title,
  description: `Learn ${program.title} with NextPeer through practical training, hands-on projects and career-focused learning.`,
  url: `https://nextpeer.in/programs/${program.slug}`,
  provider: {
    "@type": "Organization",
    name: "NextPeer",
    sameAs: "https://nextpeer.in",
  },
};
  return (
    <>
     <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(courseSchema),
  }}
/>
      <Header />
      <main>
        <DetailHero p={detail} />
        <WhyLearnStats p={detail} />
        <Curriculum p={detail} />
        <IndustryProjects p={detail} />
        <ToolsCareerSalary p={detail} />
        <WhyChoose p={detail} />
        <CertificationJourney p={detail} />
        <FaqSection faqs={detail.faqs} />
        <DetailCTA />
      </main>
      <Footer />
    </>
  );
}
