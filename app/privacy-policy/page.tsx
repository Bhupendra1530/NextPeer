import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | NextPeer",
  description:
    "Learn how NextPeer collects, uses, stores and protects personal information.",
  alternates: {
    canonical: "https://nextpeer.in/privacy-policy",
  },
};

const sections = [
  {
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          The information we collect depends on how you interact with
          NextPeer.
        </p>

        <h3>Students, learners and website users</h3>
        <ul>
          <li>Full name, email address and phone number</li>
          <li>College or institution name and current year of study</li>
          <li>Program, course and counselling interests</li>
          <li>Information submitted through NextPeer forms</li>
          <li>Training, project and certification information</li>
          <li>Payment and transaction-related information</li>
          <li>Communications with NextPeer</li>
          <li>Account and authentication information</li>
          <li>Technical information associated with website usage</li>
        </ul>

        <h3>Employees and HR portal users</h3>
        <ul>
          <li>Name, employee code, email and department</li>
          <li>Assigned work schedule and account status</li>
          <li>Attendance dates, check-in and check-out times</li>
          <li>Attendance selfies</li>
          <li>GPS/location information submitted during attendance</li>
          <li>Location accuracy and late-arrival information</li>
          <li>Leave requests, dates, leave type and approval status</li>
          <li>Authentication and account information</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>We may use personal information to:</p>

        <ul>
          <li>Provide educational and training services</li>
          <li>Respond to counselling and program enquiries</li>
          <li>Register learners for NextPeer programs</li>
          <li>Manage learner accounts and participation</li>
          <li>Process and verify payments</li>
          <li>Issue applicable certificates</li>
          <li>Send service-related communications</li>
          <li>Operate and secure our website and systems</li>
          <li>Manage employee accounts and work schedules</li>
          <li>Maintain and verify attendance records</li>
          <li>Process employee leave applications</li>
          <li>Generate HR and attendance reports</li>
          <li>Prevent misuse or unauthorized access</li>
          <li>Comply with applicable legal requirements</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Attendance Selfies & Location",
    content: (
      <>
        <p>
          NextPeer&apos;s employee attendance system may require
          employees to provide a selfie and device location when
          marking attendance.
        </p>

        <p>
          This information is used for attendance verification,
          workplace administration and prevention of fraudulent
          attendance.
        </p>

        <p>
          Location information is collected when an employee performs
          an attendance action requiring location verification.
          NextPeer does not intend to continuously track an
          employee&apos;s location in the background.
        </p>

        <p>
          Attendance selfies and location information are not intended
          to be used for unrelated advertising or marketing.
        </p>
      </>
    ),
  },
  {
    title: "4. Payments",
    content: (
      <>
        <p>
          Payments may be processed through third-party payment service
          providers. Certain payment information may therefore be
          collected and processed directly by the applicable payment
          provider.
        </p>

        <p>
          NextPeer may receive transaction information necessary to
          confirm payments and maintain business records. We do not
          intend to store complete card details, banking credentials or
          payment passwords when those details are handled directly by
          a payment provider.
        </p>
      </>
    ),
  },
  {
    title: "5. Service Providers",
    content: (
      <p>
        NextPeer may use third-party providers for services such as
        website hosting, databases, authentication, email delivery,
        payment processing and other technical operations. These
        providers may process personal information where necessary to
        provide their services to NextPeer.
      </p>
    ),
  },
  {
    title: "6. Sharing of Personal Information",
    content: (
      <>
        <p>
          <strong>NextPeer does not sell your personal information.</strong>
        </p>

        <p>Information may be shared where reasonably necessary with:</p>

        <ul>
          <li>Technology and infrastructure providers</li>
          <li>Payment service providers</li>
          <li>Authorized NextPeer personnel</li>
          <li>Authorized HR personnel</li>
          <li>Professional advisers where required</li>
          <li>
            Government or regulatory authorities where required by law
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "7. Data Security",
    content: (
      <>
        <p>
          NextPeer uses reasonable administrative, organizational and
          technical measures designed to protect personal information
          against unauthorized access, misuse, alteration, disclosure
          or loss.
        </p>

        <p>
          Access to employee and HR information is intended to be
          restricted according to account authorization. However, no
          internet-based system can guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    title: "8. Data Retention",
    content: (
      <p>
        We retain personal information for as long as reasonably
        necessary for the purposes for which it was collected,
        including service delivery, employment administration,
        record-keeping and applicable legal requirements. Information
        that is no longer required may be deleted, anonymized or
        otherwise disposed of.
      </p>
    ),
  },
  {
    title: "9. Your Privacy Rights",
    content: (
      <>
        <p>
          Subject to applicable law and the circumstances of the
          processing, you may contact NextPeer regarding:
        </p>

        <ul>
          <li>Access to information concerning your personal data</li>
          <li>Correction of inaccurate personal information</li>
          <li>Deletion or erasure requests</li>
          <li>
            Withdrawal of consent where processing is based on consent
          </li>
          <li>Questions about how your information is processed</li>
          <li>Privacy complaints or grievances</li>
        </ul>

        <p>
          We may need to verify your identity before completing certain
          requests.
        </p>
      </>
    ),
  },
  {
    title: "10. Employee Accounts",
    content: (
      <p>
        Employee accounts are intended for the individual employee to
        whom they are issued. Employees should keep their login
        credentials confidential. Authorized HR personnel may access
        employee information where reasonably necessary for attendance,
        leave and workforce administration.
      </p>
    ),
  },
  {
    title: "11. Cookies & Technical Information",
    content: (
      <p>
        NextPeer may use cookies, authentication storage or similar
        technologies necessary for login sessions, security, website
        functionality and user experience. Technical information such
        as browser information, device information, IP address and
        timestamps may also be processed by our systems or service
        providers.
      </p>
    ),
  },
  {
    title: "12. Children's Privacy",
    content: (
      <p>
        Some NextPeer programs may be relevant to students under 18.
        Where personal information relating to a child is processed,
        NextPeer intends to handle that information in accordance with
        applicable requirements, including parental or guardian
        involvement where required.
      </p>
    ),
  },
  {
    title: "13. Third-Party Links",
    content: (
      <p>
        Our website may contain links to third-party websites or
        services. NextPeer is not responsible for the privacy practices
        of independent third parties. We recommend reviewing their
        privacy policies before providing personal information.
      </p>
    ),
  },
  {
    title: "14. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy when our services, technology
        or legal obligations change. When changes are made, the
        &quot;Last updated&quot; date on this page will be updated.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-blue-50/70 to-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                Privacy & Security
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                Your privacy matters to us.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
                Learn how NextPeer collects, uses and protects
                information across our learning platform, website and
                employee services.
              </p>

              <p className="mt-5 text-sm font-medium text-gray-500">
                Last updated: 6 October 2026
              </p>
            </div>
          </div>
        </section>

        {/* Policy */}
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
            {/* Side navigation */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="font-semibold text-gray-950">
                  Privacy Policy
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
                  NextPeer Private Limited (&quot;NextPeer&quot;,
                  &quot;we&quot;, &quot;us&quot; or &quot;our&quot;)
                  respects your privacy. This Privacy Policy explains
                  how we collect, use, store and protect personal
                  information when you use our website, educational
                  services, counselling services, training programs,
                  employee portal and related services.
                </p>
              </div>

              <div className="space-y-12">
                {sections.map((section) => (
                  <section
                    key={section.title}
                    className="
                      [&_h3]:mt-6
                      [&_h3]:font-semibold
                      [&_h3]:text-gray-900
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
                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-950">
                      {section.title}
                    </h2>

                    {section.content}
                  </section>
                ))}

                {/* Contact */}
                <section className="rounded-3xl bg-gray-950 p-7 text-white sm:p-9">
                  <p className="text-sm font-semibold text-blue-300">
                    Privacy Support
                  </p>

                  <h2 className="mt-3 text-2xl font-bold">
                    Questions about your data?
                  </h2>

                  <p className="mt-3 max-w-xl leading-7 text-gray-300">
                    Contact NextPeer for privacy questions, correction
                    requests, deletion requests or grievances concerning
                    your personal information.
                  </p>

                  <a
                    href="mailto:support@nextpeer.in"
                    className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-gray-950 transition hover:bg-gray-100"
                  >
                    support@nextpeer.in
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
