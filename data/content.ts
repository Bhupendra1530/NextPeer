import {
  Briefcase,
  Code2,
  Award,
  Users,
  BadgeCheck,
  ClipboardList,
  Settings2,
  GraduationCap,
  Star,
  Building2,
  type LucideIcon,
} from "lucide-react";
import type {
  NavLink,
  FloatingCard,
  FeatureHighlight,
  Stat,
  Testimonial,
  FooterLinkGroup,
} from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  // { label: "Internships", href: "/internships" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  // { label: "Contact", href: "/contact" },
];

export const HERO_FLOATING_CARDS: FloatingCard[] = [
  {
    icon: Briefcase,
    title: "Placement Support",
    description: "Get placed in top companies with our dedicated support.",
    badge: "95% Success Rate",
  },
  {
    icon: Code2,
    title: "Real World Projects",
    description: "Build, deploy and add industry level projects to your portfolio.",
  },
  {
    icon: Award,
    title: "Certificate",
    description: "Earn professional certificates recognized by industry leaders.",
  },
];

export const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    icon: Users,
    title: "Industry Mentors",
    description: "Learn from experienced industry professionals",
  },
  {
    icon: BadgeCheck,
    title: "Live Interactive Classes",
    description: "Engaging live sessions with doubt solving",
  },
  {
    icon: ClipboardList,
    title: "Real World Projects",
    description: "Work on industry level projects and case studies",
  },
  {
    icon: Settings2,
    title: "Internship Opportunities",
    description: "Get internships & gain real world experience",
  },
  {
    icon: GraduationCap,
    title: "Placement Assistance",
    description: "Resume, mock interviews & placement support",
  },
  {
    icon: Award,
    title: "Professional Certificates",
    description: "Earn certificates trusted by top companies",
  },
];

export const STATS: Stat[] = [
  { icon: GraduationCap, value: "10,000+", label: "Students Trained" },
  { icon: Users, value: "250+", label: "Expert Mentors" },
  { icon: Building2, value: "500+", label: "Hiring Partners" },
  { icon: Briefcase, value: "3,000+", label: "Internships Secured" },
  { icon: Star, value: "4.8/5", label: "Average Rating" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ananya Singh",
    placement: "Placed at Microsoft",
    quote:
      "NextPeer helped me build real projects and improve my skills. I got placed at a top product based company. Highly recommended!",
    rating: 5,
    initials: "AS",
  },
  {
    name: "Karan Verma",
    placement: "Placed at Amazon",
    quote:
      "The mentors are amazing and the curriculum is industry focused. The internship program really boosted my confidence.",
    rating: 5,
    initials: "KV",
  },
  {
    name: "Neha Patel",
    placement: "Placed at Deloitte",
    quote:
      "From DSA to placement support, NextPeer is the best platform for college students serious about their careers.",
    rating: 5,
    initials: "NP",
  },
];

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Programs", href: "/programs" },
      // { label: "Internships", href: "/internships" },
      // { label: "Mentors", href: "/mentors" },
      // { label: "Success Stories", href: "/success-stories" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      // { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];
