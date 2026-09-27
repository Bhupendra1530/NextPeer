import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgramsHero from "@/components/sections/programs/ProgramsHero";
import ProgramsExplorer from "@/components/sections/programs/ProgramsExplorer";
import ProgramsTrustBar from "@/components/sections/programs/ProgramsTrustBar";

export const metadata: Metadata = {
  title: "Career-Focused Courses for College Students | NextPeer",
  description:
    "Explore NextPeer courses in AI, Machine Learning, Cloud Computing and more. Build job-ready skills through practical training, real-world projects, mentorship and career support.",
  alternates: {
    canonical: "https://nextpeer.in/programs",
  },
};

export default function ProgramsPage() {
 const programsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Career-Focused Courses for College Students",
  description:
    "Explore NextPeer courses in AI, Machine Learning, Cloud Computing and other career-focused skills for college students.",
  url: "https://nextpeer.in/programs",
  isPartOf: {
    "@type": "WebSite",
    name: "NextPeer",
    url: "https://nextpeer.in",
  },
}; 
  
  return (
    <>
     <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(programsSchema),
  }}
/> 
      <Header />
      <main>
        <ProgramsHero />
        <ProgramsExplorer />
        <ProgramsTrustBar />
      </main>
      <Footer />
    </>
  );
}
