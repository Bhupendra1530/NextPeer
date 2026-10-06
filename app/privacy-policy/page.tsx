import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NextPeer",
  description:
    "Learn how NextPeer collects, uses, protects and manages personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Header */}
        <div className="border-b pb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            NextPeer
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            Privacy Policy
          </h1>

          <p className="mt-3 text-gray-600">
            Last updated: 6 October 2026
          </p>

          <p className="mt-6 leading-7 text-gray-700">
            NextPeer Private Limited (&quot;NextPeer&quot;,
            &quot;we&quot;, &quot;us&quot; or &quot;our&quot;)
            respects your privacy. This Privacy Policy explains how we
            collect, use, store and protect personal information when
            you use our website, educational services, counselling
            services, training programs, employee portal and related
            services.
          </p>
        </div>

        <div className="space-y-10 py-10 text-gray-700">
          <Section title="1. Information We Collect">
            <p>
              The information we collect depends on how you interact
              with NextPeer.
            </p>

            <h3 className="mt-5 font-semibold text-gray-900">
              Students, learners and website users
            </h3>

            <List
              items={[
                "Full name",
                "Email address",
                "Phone number",
                "College or institution name",
                "Current year of study",
                "Program or course interests",
                "Counselling preferences",
                "Information submitted through forms",
                "Training, project and certification information",
                "Payment and transaction-related information",
                "Communications with NextPeer",
                "Account and authentication information",
                "Technical information associated with use of our website",
              ]}
            />

            <h3 className="mt-6 font-semibold text-gray-900">
              Employees and HR portal users
            </h3>

            <List
              items={[
                "Full name",
                "Employee code",
                "Email address",
                "Department",
                "Assigned work schedule",
                "Employment and account status",
                "Attendance dates and times",
                "Check-in and check-out records",
                "Attendance selfies",
                "GPS/location information submitted during attendance",
                "Location accuracy information",
                "Late-arrival information",
                "Leave applications, leave type, dates and approval status",
                "Authentication and account information",
              ]}
            />
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We may use personal information to:</p>

            <List
              items={[
                "Provide NextPeer educational and training services",
                "Respond to counselling and program enquiries",
                "Register learners for programs",
                "Manage learner accounts and participation",
                "Process or verify payments and transactions",
                "Issue applicable training, project or other certificates",
                "Send service-related communications",
                "Operate, maintain and secure our website and systems",
                "Manage employee accounts",
                "Maintain employee attendance records",
                "Verify employee check-in and check-out",
                "Administer employee work schedules",
                "Process leave applications and approvals",
                "Generate HR and attendance reports",
                "Prevent misuse, unauthorized access or fraudulent activity",
                "Maintain appropriate business and administrative records",
                "Comply with applicable legal obligations",
              ]}
            />
          </Section>

          <Section title="3. Attendance Selfies and Location Data">
            <p>
              NextPeer&apos;s employee attendance system may require
              employees to provide a selfie and device location when
              marking attendance.
            </p>

            <p className="mt-4">
              This information is used for attendance verification,
              workplace administration and prevention of fraudulent
              attendance.
            </p>

            <p className="mt-4">
              Location information is collected when an employee
              performs an attendance action requiring location
              verification. NextPeer does not intend the attendance
              system to continuously track an employee&apos;s location
              in the background.
            </p>

            <p className="mt-4">
              Attendance selfies and location information are not
              intended to be used for unrelated advertising or
              marketing purposes.
            </p>
          </Section>

          <Section title="4. Payments">
            <p>
              Payments may be processed through third-party payment
              service providers. Certain payment information may
              therefore be collected and processed directly by the
              applicable payment provider.
            </p>

            <p className="mt-4">
              NextPeer may receive transaction information necessary
              to confirm payments and maintain business records. We do
              not intend to store complete card details, banking
              credentials or payment passwords when those details are
              handled directly by a payment provider.
            </p>
          </Section>

          <Section title="5. Authentication and Service Providers">
            <p>
              NextPeer may use third-party technology and
              infrastructure providers for services such as website
              hosting, databases, authentication, email delivery,
              payment processing and other technical operations.
            </p>

            <p className="mt-4">
              These providers may process personal information where
              necessary to provide their services to NextPeer. We
              expect service providers handling personal information
              on our behalf to apply appropriate security and
              confidentiality measures.
            </p>
          </Section>

          <Section title="6. Sharing of Personal Information">
            <p className="font-semibold text-gray-900">
              NextPeer does not sell your personal information.
            </p>

            <p className="mt-4">
              We may disclose or make personal information available
              where reasonably necessary to:
            </p>

            <List
              items={[
                "Technology and infrastructure providers supporting NextPeer",
                "Payment service providers",
                "Authorized NextPeer personnel",
                "Authorized HR personnel for employment administration",
                "Professional advisers where required",
                "Government authorities or regulators where required by applicable law",
                "Protect NextPeer, our users or others against fraud, security threats or unlawful activity",
              ]}
            />
          </Section>

          <Section title="7. Data Security">
            <p>
              NextPeer uses reasonable administrative, organizational
              and technical measures designed to protect personal
              information against unauthorized access, misuse,
              alteration, disclosure or loss.
            </p>

            <p className="mt-4">
              Access to employee and HR information is intended to be
              restricted according to account authorization.
            </p>

            <p className="mt-4">
              However, no internet-based system or method of
              electronic storage can guarantee absolute security.
            </p>
          </Section>

          <Section title="8. Data Retention">
            <p>
              We retain personal information for as long as reasonably
              necessary for the purposes for which it was collected,
              including service delivery, employment administration,
              record keeping, dispute resolution and applicable legal
              or regulatory requirements.
            </p>

            <p className="mt-4">
              Retention periods may vary depending on the category of
              information and its purpose. When information is no
              longer required, we may delete, anonymize or otherwise
              dispose of it in accordance with applicable
              requirements.
            </p>
          </Section>

          <Section title="9. Your Privacy Choices and Rights">
            <p>
              Subject to applicable law and the circumstances of the
              processing, you may contact NextPeer regarding:
            </p>

            <List
              items={[
                "Access to information concerning your personal data",
                "Correction or updating of inaccurate personal data",
                "Deletion or erasure requests",
                "Withdrawal of consent where processing is based on consent",
                "Questions about how your personal information is processed",
                "Privacy complaints or grievances",
              ]}
            />

            <p className="mt-4">
              We may need to verify your identity before completing
              certain privacy requests.
            </p>

            <p className="mt-4">
              Privacy requests can be sent to{" "}
              <a
                href="mailto:support@nextpeer.in"
                className="font-semibold text-blue-600 hover:underline"
              >
                support@nextpeer.in
              </a>
              .
            </p>
          </Section>

          <Section title="10. Employee Accounts">
            <p>
              Employee accounts are intended for the individual
              employee to whom they are issued. Employees should keep
              their login credentials confidential and should not
              allow another person to use their account.
            </p>

            <p className="mt-4">
              Authorized HR personnel may access employee information
              where reasonably necessary for attendance, leave,
              workforce administration and legitimate HR functions.
            </p>
          </Section>

          <Section title="11. Cookies and Technical Information">
            <p>
              NextPeer may use cookies, authentication storage or
              similar technologies necessary for login sessions,
              security, website functionality and user experience.
            </p>

            <p className="mt-4">
              Technical information such as browser information,
              device information, IP address, timestamps and website
              usage information may also be processed where generated
              by our systems or service providers.
            </p>
          </Section>

          <Section title="12. Children's Privacy">
            <p>
              Some NextPeer programs may be relevant to students who
              are under 18 years of age. Where personal information
              relating to a child is processed, NextPeer intends to
              handle such information in accordance with applicable
              legal requirements, including parental or guardian
              involvement where required.
            </p>
          </Section>

          <Section title="13. Third-Party Links">
            <p>
              Our website may contain links to third-party websites or
              services. NextPeer is not responsible for the privacy
              practices of independent third parties. We recommend
              reviewing their privacy policies before providing
              personal information.
            </p>
          </Section>

          <Section title="14. Changes to This Privacy Policy">
            <p>
              NextPeer may update this Privacy Policy when our
              services, technology or legal obligations change. When
              changes are made, we will update the &quot;Last
              updated&quot; date displayed at the top of this page.
            </p>
          </Section>

          <Section title="15. Contact Us">
            <p>
              For privacy questions, correction requests, deletion
              requests or grievances concerning your personal
              information, contact:
            </p>

            <div className="mt-5 rounded-xl border bg-gray-50 p-5">
              <p className="font-bold text-gray-900">
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

              <p className="mt-1">
                Website:{" "}
                <a
                  href="https://www.nextpeer.in"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  www.nextpeer.in
                </a>
              </p>
            </div>
          </Section>
        </div>

        <div className="border-t pt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} NextPeer Private Limited. All
          rights reserved.
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        {title}
      </h2>

      <div className="leading-7">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
