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

  return (
    <>
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
