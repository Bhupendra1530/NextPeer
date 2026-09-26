import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextPeer | Career-Focused Courses for College Students",
  description:
    "Learn AI, Machine Learning, Cloud Computing and more with NextPeer. Gain practical skills through industry-focused training, real-world projects, mentorship and career support.",
  alternates: {
    canonical: "https://nextpeer.in/",
  },
};
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import StatsBar from "@/components/sections/StatsBar";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureHighlights />
        <StatsBar />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
