import Image from "next/image";

const universities = [
  { name: "IIT Bombay", logo: "/logos/iit-bombay.png" },
  { name: "IIT Delhi", logo: "/logos/iit-delhi.png" },
  { name: "IIT Madras", logo: "/logos/iit-madras.png" },
  { name: "IIT Kanpur", logo: "/logos/iit-kanpur.png" },
  { name: "NIT Trichy", logo: "/logos/nit-trichy.png" },
  { name: "NIT Warangal", logo: "/logos/nit-warangal.png" },
  { name: "VIT", logo: "/logos/vit.png" },
  { name: "SRM University", logo: "/logos/srm.png" },
  { name: "Manipal University", logo: "/logos/manipal.png" },
  { name: "Amity University", logo: "/logos/amity.png" },
  {
    name: "Chandigarh University",
    logo: "/logos/chandigarh-university.png",
  },
  { name: "Lovely Professional University", logo: "/logos/lpu.png" },
];

function UniversityMarquee() {
  const repeatedUniversities = [...universities, ...universities];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {repeatedUniversities.map((university, index) => (
          <div
            className="marquee-card marquee-logo-card"
            key={`${university.name}-${index}`}
          >
            <Image
              src={university.logo}
              alt={`${university.name} logo`}
              width={170}
              height={60}
              className="marquee-logo"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CampusCareerMarquee() {
  return (
    <section className="campus-career-section">
      <div className="campus-career-heading">
        <span className="campus-eyebrow">
          BUILT FOR AMBITIOUS STUDENTS
        </span>

        <h2>
          Learning built for students across
          <span> leading colleges & universities</span>
        </h2>

        <p>
          Practical, career-focused learning designed to help college
          students build industry-relevant technology skills.
        </p>
      </div>

      <div className="marquee-group">
        <div className="marquee-label">
          <span>🎓</span>
          <h3>Students from colleges & universities across India</h3>
        </div>

        <UniversityMarquee />
      </div>
    </section>
  );
}
