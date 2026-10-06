import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | NextPeer",
  description:
    "Read the terms and conditions governing the use of NextPeer's website, programs, training services and platform.",
  alternates: {
    canonical: "https://nextpeer.in/terms",
  },
};

export default function TermsPage() {
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
                Terms & Conditions
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
                These terms explain the rules and conditions that apply
                when you access or use NextPeer&apos;s website,
                programs, training services and related platforms.
              </p>

              <p className="mt-5 text-sm font-medium text-gray-500">
                Last updated: 6 October 2026
              </p>
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="font-semibold text-gray-950">
                  Terms & Conditions
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

            {/* Content */}
            <div className="max-w-3xl">
              <div className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
                <p className="leading-7 text-gray-600">
                  These Terms & Conditions (&quot;Terms&quot;) govern
                  your access to and use of the website, educational
                  programs, training services, counselling services,
                  employee portal and other services provided by
                  NextPeer Private Limited (&quot;NextPeer&quot;,
                  &quot;we&quot;, &quot;us&quot; or &quot;our&quot;).
                </p>

                <p className="mt-4 leading-7 text-gray-600">
                  By accessing or using our services, you agree to these
                  Terms. If you do not agree, you should not use the
                  relevant NextPeer services.
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
                  <h2>1. Eligibility and Registration</h2>

                  <p>
                    You must provide accurate and current information
                    when registering for a NextPeer program, submitting
                    an enquiry or creating an account.
                  </p>

                  <p>
                    You are responsible for ensuring that information
                    provided to NextPeer is accurate and for notifying
                    us if important information changes.
                  </p>

                  <p>
                    Where a user is legally required to obtain the
                    permission of a parent or guardian, such permission
                    should be obtained before using the applicable
                    service.
                  </p>
                </section>

                <section>
                  <h2>2. NextPeer Programs and Services</h2>

                  <p>
                    NextPeer provides educational and career-focused
                    services that may include:
                  </p>

                  <ul>
                    <li>Live or instructor-led training</li>
                    <li>Projects and practical assignments</li>
                    <li>Mentorship and counselling</li>
                    <li>Career guidance</li>
                    <li>Internship-related opportunities</li>
                    <li>Placement assistance</li>
                    <li>Certificates for eligible programs</li>
                  </ul>

                  <p>
                    Program structure, duration, instructors, schedules,
                    projects and other components may vary depending on
                    the particular program.
                  </p>
                </section>

                <section>
                  <h2>3. Fees and Payments</h2>

                  <p>
                    Where a NextPeer service requires payment, the
                    applicable price and payment terms will be
                    communicated before purchase or enrollment.
                  </p>

                  <p>
                    Payments may be processed through third-party
                    payment service providers. Users are responsible
                    for providing valid payment information to the
                    applicable payment provider.
                  </p>

                  <p>
                    Any applicable taxes or charges may be added where
                    required.
                  </p>
                </section>

                <section>
                  <h2>4. Refunds and Cancellations</h2>

                  <p>
                    Refund eligibility, cancellations and related
                    requests are governed by the refund or cancellation
                    terms applicable to the purchased service or
                    program.
                  </p>

                  <p>
                    Users should review the applicable refund policy
                    before making payment.
                  </p>
                </section>

                <section>
                  <h2>5. Certificates</h2>

                  <p>
                    Certificates may be issued only when the applicable
                    program requirements have been satisfied.
                  </p>

                  <p>
                    Requirements may include attendance, assignments,
                    assessments, projects or other criteria communicated
                    for the relevant program.
                  </p>

                  <p>
                    NextPeer may decline or withhold certification where
                    required program conditions have not been completed
                    or where fraudulent activity is identified.
                  </p>
                </section>

                <section>
                  <h2>6. Placement and Career Assistance</h2>

                  <p>
                    Where a program includes placement assistance,
                    career support, interview preparation or internship
                    assistance, these services are intended to help
                    learners prepare for and identify opportunities.
                  </p>

                  <p>
                    Unless expressly stated otherwise in a separate
                    written agreement, NextPeer does not guarantee a
                    particular job, internship, employer, salary,
                    interview or employment outcome.
                  </p>

                  <p>
                    Hiring decisions remain with the relevant employer
                    or organization.
                  </p>
                </section>

                <section>
                  <h2>7. User Accounts</h2>

                  <p>
                    Where an account is provided, you are responsible
                    for keeping your login credentials confidential.
                  </p>

                  <p>
                    You must not share your account with another person
                    or attempt to access another user&apos;s account
                    without authorization.
                  </p>

                  <p>
                    You should contact NextPeer promptly if you believe
                    your account has been compromised.
                  </p>
                </section>

                <section>
                  <h2>8. Acceptable Use</h2>

                  <p>You must not use NextPeer services to:</p>

                  <ul>
                    <li>Engage in unlawful activity</li>
                    <li>Attempt unauthorized access to our systems</li>
                    <li>Disrupt or interfere with our services</li>
                    <li>
                      Upload malicious software or harmful material
                    </li>
                    <li>
                      Misrepresent your identity or impersonate another
                      person
                    </li>
                    <li>
                      Copy or redistribute protected course material
                      without authorization
                    </li>
                    <li>
                      Use another person&apos;s account or credentials
                    </li>
                  </ul>
                </section>

                <section>
                  <h2>9. Intellectual Property</h2>

                  <p>
                    NextPeer&apos;s website, branding, course materials,
                    training content, designs, graphics and other
                    proprietary materials may be protected by
                    intellectual property rights.
                  </p>

                  <p>
                    Access to a program does not transfer ownership of
                    NextPeer&apos;s intellectual property to the user.
                  </p>

                  <p>
                    Materials provided for learning purposes should not
                    be reproduced, sold, publicly distributed or
                    commercially exploited without appropriate
                    permission.
                  </p>
                </section>

                <section>
                  <h2>10. Employee and HR Portal</h2>

                  <p>
                    Employee and HR accounts are intended only for
                    authorized NextPeer personnel.
                  </p>

                  <p>
                    Employees must use their own accounts when
                    submitting attendance, leave requests or other
                    employment-related information.
                  </p>

                  <p>
                    False attendance submissions, unauthorized account
                    access or deliberate manipulation of HR records may
                    result in appropriate administrative action.
                  </p>
                </section>

                <section>
                  <h2>11. Attendance Verification</h2>

                  <p>
                    NextPeer&apos;s employee attendance system may use
                    information such as attendance selfies, location
                    information, timestamps and assigned work schedules
                    to verify attendance.
                  </p>

                  <p>
                    Employees should submit accurate information and
                    must not attempt to falsify attendance records or
                    location information.
                  </p>
                </section>

                <section>
                  <h2>12. Privacy</h2>

                  <p>
                    Personal information is handled in accordance with
                    our Privacy Policy.
                  </p>

                  <a
                    href="/privacy-policy"
                    className="mt-4 inline-flex font-semibold text-blue-600 hover:underline"
                  >
                    Read our Privacy Policy →
                  </a>
                </section>

                <section>
                  <h2>13. Third-Party Services</h2>

                  <p>
                    NextPeer may rely on third-party services for
                    hosting, authentication, communications, payment
                    processing and other functionality.
                  </p>

                  <p>
                    Third-party services may be governed by their own
                    terms and privacy policies.
                  </p>
                </section>

                <section>
                  <h2>14. Service Availability</h2>

                  <p>
                    We aim to keep NextPeer services available and
                    reliable, but uninterrupted or error-free operation
                    cannot be guaranteed.
                  </p>

                  <p>
                    Services may occasionally be unavailable because of
                    maintenance, upgrades, technical issues or
                    circumstances outside our reasonable control.
                  </p>
                </section>

                <section>
                  <h2>15. Changes to Programs or Services</h2>

                  <p>
                    NextPeer may update or modify features, schedules,
                    instructors, learning materials or service
                    components where reasonably necessary.
                  </p>

                  <p>
                    Where a material change affects an enrolled user,
                    we will seek to communicate relevant information
                    through appropriate channels.
                  </p>
                </section>

                <section>
                  <h2>16. Limitation of Liability</h2>

                  <p>
                    To the extent permitted by applicable law,
                    NextPeer&apos;s liability arising from use of our
                    services will be subject to applicable legal
                    limitations.
                  </p>

                  <p>
                    Nothing in these Terms is intended to exclude or
                    restrict rights or liabilities that cannot legally
                    be excluded or restricted.
                  </p>
                </section>

                <section>
                  <h2>17. Suspension or Termination</h2>

                  <p>
                    NextPeer may restrict or suspend access where
                    reasonably necessary because of misuse, fraud,
                    security concerns, material violation of these
                    Terms or applicable legal requirements.
                  </p>
                </section>

                <section>
                  <h2>18. Changes to These Terms</h2>

                  <p>
                    We may update these Terms when our services,
                    business practices or applicable requirements
                    change.
                  </p>

                  <p>
                    The latest version will be published on this page
                    with an updated revision date.
                  </p>
                </section>

                <section>
                  <h2>19. Contact Us</h2>

                  <p>
                    If you have questions about these Terms, contact
                    NextPeer at:
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

                {/* Bottom CTA */}
                <section className="rounded-3xl bg-gray-950 p-7 text-white sm:p-9">
                  <p className="text-sm font-semibold !text-blue-300">
                    Need help?
                  </p>

                  <h2 className="!mt-3 !text-white">
                    Questions about these terms?
                  </h2>

                  <p className="max-w-xl !text-gray-300">
                    Contact the NextPeer team and we&apos;ll help with
                    questions relating to our programs, services or
                    policies.
                  </p>

                  <a
                    href="mailto:support@nextpeer.in"
                    className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-gray-950 transition hover:bg-gray-100"
                  >
                    Contact NextPeer
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
