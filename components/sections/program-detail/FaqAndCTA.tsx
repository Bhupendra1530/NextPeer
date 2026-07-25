"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Send, PhoneCall } from "lucide-react";
import type { FaqItem } from "@/types";

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {faqs.map((faq, i) => (
            <div key={faq.question} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-2 text-left"
              >
                <span className="text-sm font-medium text-slate-800">{faq.question}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-slate-400 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DetailCTA() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:px-8">
        <div>
          <p className="text-xl font-bold text-white sm:text-2xl">Ready to Become an AI Engineer?</p>
          <p className="mt-1 text-sm text-indigo-100">
            Join thousands of learners preparing for the future with practical AI skills.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
            <Send size={16} /> Enroll Now
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
            <PhoneCall size={16} /> Talk to an Expert
          </Link>
        </div>
      </div>
    </section>
  );
}
