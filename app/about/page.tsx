import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/about/AboutHero";
import MissionVision from "@/components/sections/about/MissionVision";
import WhatMakesDifferent from "@/components/sections/about/WhatMakesDifferent";
import PhilosophyAndValues from "@/components/sections/about/PhilosophyAndValues";
import WhoWeServeAndPrograms from "@/components/sections/about/WhoWeServeAndPrograms";
import OurCommitment from "@/components/sections/about/OurCommitment";
import AboutCTA from "@/components/sections/about/AboutCTA";

export const metadata: Metadata = {
  title: "About NextPeer | Career-Focused Learning for College Students",
  description:
    "Learn about NextPeer's mission to help college students build job-ready skills through practical training, real-world projects, mentorship and career support.",
  alternates: {
    canonical: "https://nextpeer.in/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <MissionVision />
        <WhatMakesDifferent />
        <PhilosophyAndValues />
        <WhoWeServeAndPrograms />
        <OurCommitment />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}
