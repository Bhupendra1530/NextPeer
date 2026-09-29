import {
  Compass,
  Video,
  FolderKanban,
  Users,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Path",
    description:
      "Select the domain that matches your interests and career goals.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Learn Live",
    description:
      "Build your fundamentals through structured, instructor-led learning.",
    icon: Video,
  },
  {
    number: "03",
    title: "Build Projects",
    description:
      "Apply what you learn by working on practical, portfolio-ready projects.",
    icon: FolderKanban,
  },
  {
    number: "04",
    title: "Get Mentorship",
    description:
      "Get guidance, feedback and support throughout your learning journey.",
    icon: Users,
  },
  {
    number: "05",
    title: "Become Career Ready",
    description:
      "Strengthen your portfolio and prepare for internships and career opportunities.",
    icon: BriefcaseBusiness,
  },
];

export default function HowNextPeerWorks() {
  return (
    <section className="how-nextpeer-section">
      <div className="how-nextpeer-container">

        <div className="how-nextpeer-heading">
          <span className="how-nextpeer-eyebrow">
            YOUR NEXTPeer JOURNEY
          </span>

          <h2>
            From learning to{" "}
            <span>career readiness.</span>
          </h2>

          <p>
            A practical learning journey designed to help you move
            from curiosity to real-world skills.
          </p>
        </div>

        <div className="journey-wrapper">

          <div className="journey-line">
            <div className="journey-line-progress" />
          </div>

          <div className="journey-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div className="journey-step" key={step.number}>

                  <div className="journey-number">
                    {step.number}
                  </div>

                  <div className="journey-icon">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                  {index < steps.length - 1 && (
                    <ArrowRight
                      className="journey-arrow"
                      size={18}
                    />
                  )}

                </div>
              );
            })}
          </div>

        </div>

        <div className="journey-message">
          <span>Learn.</span>
          <span>Build.</span>
          <span>Grow.</span>
        </div>

      </div>
    </section>
  );
}
