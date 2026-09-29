const universities = [
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "IIT Kanpur",
  "NIT Trichy",
  "NIT Warangal",
  "VIT",
  "SRM University",
  "Manipal University",
  "Amity University",
  "Chandigarh University",
  "Lovely Professional University",
];

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "OpenAI",
  "NVIDIA",
  "Adobe",
  "IBM",
  "Accenture",
  "Deloitte",
  "TCS",
  "Infosys",
  "Wipro",
];

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const repeatedItems = [...items, ...items];

  return (
    <div className="marquee-wrapper">
      <div
        className={`marquee-track ${
          reverse ? "marquee-reverse" : ""
        }`}
      >
        {repeatedItems.map((item, index) => (
          <div className="marquee-card" key={`${item}-${index}`}>
            <span>{item}</span>
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
        <span className="campus-eyebrow">BUILT FOR AMBITIOUS STUDENTS</span>

        <h2>
          Learn skills for opportunities across
          <span> leading universities & companies</span>
        </h2>

        <p>
          Career-focused learning designed for college students preparing
          for the modern technology industry.
        </p>
      </div>

      <div className="marquee-group">
        <div className="marquee-label">
          <span>🎓</span>
          <h3>Built for students across leading colleges & universities</h3>
        </div>

        <MarqueeRow items={universities} />
      </div>

      <div className="marquee-group company-group">
        <div className="marquee-label">
          <span>🚀</span>
          <h3>Build skills for careers at leading technology companies</h3>
        </div>

        <MarqueeRow items={companies} reverse />
      </div>

      <p className="marquee-disclaimer">
        Institution and company names are shown for educational and career
        context only and do not imply partnership, endorsement, enrollment,
        hiring, or placement by NextPeer.
      </p>
    </section>
  );
}
