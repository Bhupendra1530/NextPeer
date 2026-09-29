import Link from "next/link";
import {
  BrainCircuit,
  BarChart3,
  Code2,
  Cloud,
  Terminal,
  Palette,
  Megaphone,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const careerPaths = [
  {
    title: "Artificial Intelligence",
    description:
      "Explore AI fundamentals, neural networks and intelligent applications.",
    icon: BrainCircuit,
    skills: ["AI", "Neural Networks", "Projects"],
    href: "/programs/artificial-intelligence-essentials",
    featured: true,
  },
  {
    title: "Machine Learning",
    description:
      "Learn how to build practical machine learning solutions using Python.",
    icon: Sparkles,
    skills: ["Python", "ML", "Models"],
    href: "/programs/machine-learning-with-python",
  },
  {
    title: "Data Analytics",
    description:
      "Turn raw data into useful insights with Excel and Power BI.",
    icon: BarChart3,
    skills: ["Excel", "Power BI", "Analytics"],
    href: "/programs/data-analytics-excel-power-bi",
  },
  {
    title: "Full Stack Development",
    description:
      "Learn modern web development and build complete web applications.",
    icon: Code2,
    skills: ["React", "Node.js", "MERN"],
    href: "/programs/full-stack-web-development",
  },
  {
    title: "Cloud Computing",
    description:
      "Understand cloud infrastructure, architecture and deployment.",
    icon: Cloud,
    skills: ["AWS", "Azure", "Cloud"],
    href: "/programs/cloud-computing-fundamentals",
  },
  {
    title: "Python",
    description:
      "Build a strong programming foundation from beginner to advanced.",
    icon: Terminal,
    skills: ["Python", "Logic", "Projects"],
    href: "/programs/python-for-beginners-to-advanced",
  },
  {
    title: "UI/UX Design",
    description:
      "Learn user-focused product design, interfaces and design thinking.",
    icon: Palette,
    skills: ["UI", "UX", "Design"],
    href: "/programs/ui-ux-design-fundamentals",
  },
  {
    title: "Digital Marketing",
    description:
      "Learn the fundamentals of digital growth and online marketing.",
    icon: Megaphone,
    skills: ["SEO", "Marketing", "Growth"],
    href: "/programs/digital-marketing-essentials",
  },
];

export default function CareerPaths() {
  return (
    <section className="career-paths-section">
      <div className="career-paths-container">

        <div className="career-paths-heading">
          <span className="career-paths-eyebrow">
            FIND YOUR DIRECTION
          </span>

          <h2>
            Choose your{" "}
            <span>career path.</span>
          </h2>

          <p>
            Pick a field you&apos;re curious about and start building
            practical, industry-relevant skills.
          </p>
        </div>

        <div className="career-paths-grid">
          {careerPaths.map((path) => {
            const Icon = path.icon;

            return (
              <Link
                href={path.href}
                key={path.title}
                className={`career-path-card ${
                  path.featured ? "career-path-featured" : ""
                }`}
              >
                {path.featured && (
                  <span className="career-path-popular">
                    Popular
                  </span>
                )}

                <div className="career-path-top">
                  <div className="career-path-icon">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <ArrowUpRight
                    className="career-path-arrow"
                    size={21}
                  />
                </div>

                <div className="career-path-content">
                  <h3>{path.title}</h3>

                  <p>{path.description}</p>
                </div>

                <div className="career-path-skills">
                  {path.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="career-path-explore">
                  Explore program
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="career-paths-bottom">
          <p>Not sure which path is right for you?</p>

          <Link
            href="/book-session"
            className="career-guidance-button"
          >
            Book a free career session
            <ArrowUpRight size={17} />
          </Link>
        </div>

      </div>
    </section>
  );
}
