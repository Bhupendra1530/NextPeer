import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CareerApplicationForm from "@/components/careers/CareerApplicationForm";

export const metadata: Metadata = {
  title: "Apply to NextPeer | Careers",
  description:
    "Apply for career opportunities at NextPeer and help us build practical, career-focused learning experiences for college students.",
  alternates: {
    canonical: "https://nextpeer.in/careers/apply",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CareerApplyPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-100 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-18">
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
              Careers at NextPeer
            </span>

            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Join the <span className="text-blue-600">NextPeer team.</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Tell us a little about yourself, your experience and how you
              would like to contribute to NextPeer.
            </p>
          </div>
        </section>

        <CareerApplicationForm />
      </main>

      <Footer />
    </>
  );
}
