import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | NextPeer",
  description:
    "Read NextPeer's refund and cancellation policy for training programs, courses and other paid services.",
  alternates: {
    canonical: "https://nextpeer.in/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-blue-50/70 to-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                Legal
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                Refund & Cancellation Policy
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
                This policy explains when a refund may be requested for
                NextPeer programs, courses and other eligible paid services.
              </p>

              <p className="mt-5 text-sm font-medium text-gray-500">
                Last updated: 6 October 2026
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="font-semibold text-gray-950">
                  Refund Policy
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  NextPeer Private Limited
                </p>

                <a
                  href="mailto:support@nextpeer.in"
                  className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline"
                >
                  support@nextpeer.in
                </a>
              </div>
            </aside>

            {/* Policy */}
            <div className="max-w-3xl">
              {/* Important notice */}
              <div className="mb-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                  Important
                </p>

                <h2 className="mt-3 text-2xl font-bold text-gray-950">
                  7-Day Refund Window
                </h2>

                <p className="mt-4 leading-7 text-gray-700">
                  A student may request a refund within{" "}
                  <strong>7 calendar days from the date of registration
                  or enrollment</strong>, subject to the terms described
                  below.
                </p>

                <p className="mt-3 leading-7 text-gray-700">
                  <strong>
                    After the 7-day refund period has expired, the fees
                    paid to NextPeer are non-refundable.
                  </strong>
                </p>
              </div>

              <div
                className="
                  space-y-12
                  [&_h2]:mb-4
                  [&_h2]:text-2xl
                  [&_h2]:font-bold
                  [&_h2]:tracking-tight
                  [&_h2]:text-gray-950
                  [&_li]:leading-7
                  [&_p]:leading-7
                  [&_p]:text-gray-600
                  [&_p+p]:mt-4
                  [&_ul]:mt-4
                  [&_ul]:list-disc
                  [&_ul]:space-y-2
                  [&_ul]:pl-6
                  [&_ul]:text-gray-600
                "
              >
                <section>
                  <h2>1. Scope of This Policy</h2>

                  <p>
                    This Refund & Cancellation Policy applies to eligible
                    programs, courses, training services and other paid
                    educational services purchased directly from NextPeer
                    Private Limited.
                  </p>

                  <p>
                    By registering for or purchasing an eligible NextPeer
                    service, you acknowledge this Refund & Cancellation
                    Policy.
                  </p>
                </section>

                <section>
                  <h2>2. Refund Eligibility</h2>

                  <p>
                    A refund request must be submitted within{" "}
                    <strong>7 calendar days from the date of registration
                    or enrollment</strong>.
                  </p>

                  <p>
                    Requests received after this 7-day period will not
                    ordinarily be eligible for a refund, except where
                    otherwise required by applicable law.
                  </p>

                  <p>
                    The date recorded in NextPeer&apos;s registration,
                    enrollment or payment records may be used to determine
                    the applicable refund period.
                  </p>
                </section>

                <section>
                  <h2>3. No Refund After 7 Days</h2>

                  <p>
                    Once 7 calendar days have passed from the applicable
                    registration or enrollment date, fees paid for the
                    relevant program or service become{" "}
                    <strong>non-refundable</strong>.
                  </p>

                  <p>
                    This applies even if a student later decides not to
                    attend classes, stops participating in the program,
                    changes personal plans or does not complete the course,
                    subject to applicable law.
                  </p>
                </section>

                <section>
                  <h2>4. How to Request a Refund</h2>

                  <p>
                    Eligible refund requests should be submitted by email
                    to:
                  </p>

                  <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <a
                      href="mailto:support@nextpeer.in"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      support@nextpeer.in
                    </a>
                  </div>

                  <p>
                    To help us review the request, please include:
                  </p>

                  <ul>
                    <li>Student&apos;s full name</li>
                    <li>Registered email address</li>
                    <li>Registered phone number</li>
                    <li>Program or course name</li>
                    <li>Registration or enrollment date</li>
                    <li>Payment or transaction details</li>
                    <li>Reason for requesting the refund</li>
                  </ul>
                </section>

                <section>
                  <h2>5. Review of Refund Requests</h2>

                  <p>
                    NextPeer may verify registration, enrollment and payment
                    information before processing a refund request.
                  </p>

                  <p>
                    Submitting a refund request does not automatically mean
                    that a refund has been approved. We may contact the
                    student if additional information is reasonably required
                    to verify the request.
                  </p>
                </section>

                <section>
                  <h2>6. Approved Refunds</h2>

                  <p>
                    If a refund request is approved, NextPeer will initiate
                    the refund using an appropriate payment method.
                  </p>

                  <p>
                    The time required for the refunded amount to appear may
                    depend on the bank, payment provider or payment method
                    used for the original transaction.
                  </p>
                </section>

                <section>
                  <h2>7. Program Cancellation by NextPeer</h2>

                  <p>
                    If NextPeer cancels a paid program and does not provide
                    an appropriate alternative, affected students may be
                    offered an alternative batch, program credit or a refund,
                    as appropriate to the circumstances and applicable law.
                  </p>
                </section>

                <section>
                  <h2>8. Batch or Schedule Changes</h2>

                  <p>
                    Reasonable changes to class schedules, instructors,
                    sessions, learning formats or program arrangements do not
                    automatically create a right to a refund.
                  </p>

                  <p>
                    Where a significant change materially affects a
                    student&apos;s enrollment, the student may contact
                    NextPeer support to discuss available options.
                  </p>
                </section>

                <section>
                  <h2>9. Duplicate or Incorrect Payments</h2>

                  <p>
                    If you believe that you were charged more than once for
                    the same transaction or that an incorrect amount was
                    charged, contact us as soon as possible.
                  </p>

                  <p>
                    We will review the relevant transaction records and take
                    appropriate action where an incorrect or duplicate
                    payment is verified.
                  </p>
                </section>

                <section>
                  <h2>10. Chargebacks and Payment Disputes</h2>

                  <p>
                    Students are encouraged to contact NextPeer first if
                    there is a payment or refund concern so that we can
                    review the matter.
                  </p>

                  <p>
                    Fraudulent or abusive payment disputes may result in
                    suspension of access to the applicable services, subject
                    to applicable law.
                  </p>
                </section>

                <section>
                  <h2>11. Changes to This Policy</h2>

                  <p>
                    NextPeer may update this Refund & Cancellation Policy
                    from time to time. The latest version will be published
                    on this page with an updated revision date.
                  </p>

                  <p>
                    Refund requests will be handled in accordance with the
                    applicable terms and legal requirements.
                  </p>
                </section>

                <section>
                  <h2>12. Contact Us</h2>

                  <p>
                    For questions or refund-related requests, contact:
                  </p>

                  <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="font-bold !text-gray-950">
                      NextPeer Private Limited
                    </p>

                    <p className="mt-2">
                      Email:{" "}
                      <a
                        href="mailto:support@nextpeer.in"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        support@nextpeer.in
                      </a>
                    </p>

                    <p>
                      Website:{" "}
                      <a
                        href="https://www.nextpeer.in"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        www.nextpeer.in
                      </a>
                    </p>
                  </div>
                </section>

                {/* CTA */}
                <section className="rounded-3xl bg-gray-950 p-7 text-white sm:p-9">
                  <p className="text-sm font-semibold !text-blue-300">
                    Refund assistance
                  </p>

                  <h2 className="!mt-3 !text-white">
                    Need help with a refund request?
                  </h2>

                  <p className="max-w-xl !text-gray-300">
                    Contact our support team within 7 calendar days of
                    registration or enrollment if you wish to request an
                    eligible refund.
                  </p>

                  <a
                    href="mailto:support@nextpeer.in?subject=Refund%20Request"
                    className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-gray-950 transition hover:bg-gray-100"
                  >
                    Request a Refund
                  </a>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
