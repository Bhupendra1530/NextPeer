import { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface FloatingCard {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export interface FeatureHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  placement: string;
  quote: string;
  rating: number;
  initials: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}


export interface ProgramCategory {
  slug: string;
  label: string;
  icon: LucideIcon;
}

export interface ProgramTrustPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Program {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  badge?: "Bestseller" | "Popular" | "New";
  gradient: string;
  icon: LucideIcon;
  rating: number;
  reviewCount: number;
  level: "Beginner" | "Beginner to Advanced" | "Intermediate";
  duration: string;
  price: number;
}

export interface DifferentiatorCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface CoreValue {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface AudienceItem {
  icon: LucideIcon;
  label: string;
}

export interface ProgramAreaItem {
  icon: LucideIcon;
  label: string;
}

export interface CTAPill {
  icon: LucideIcon;
  label: string;
}
export interface BlogCategory {
  slug: string;
  label: string;
  icon: LucideIcon;
}

export interface BlogTag {
  label: string;
}

export interface BlogPost {
  slug: string;
  number: number;
  title: string;
  excerpt: string;
  gradient: string;
  icon: LucideIcon;
  readTime: string;
}

export interface FeaturedPost {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: string;
}

export interface TrendingTopic {
  label: string;
}

export interface FreeResource {
  icon: LucideIcon;
  label: string;
}

export interface StatBox { icon: LucideIcon; value: string; label: string; }
export interface CurriculumModule { number: string; icon: LucideIcon; title: string; topics: string[]; }
export interface ProjectItem { icon: LucideIcon; title: string; key?: string; }
export interface ToolItem { icon: LucideIcon; label: string; key?: string; }
export interface CareerRole { label: string; }
export interface SalaryRow { experience: string; salary: string; }
export interface WhyChoosePoint { icon: LucideIcon; label: string; }
export interface JourneyStep { number: number; label: string; icon: LucideIcon; }
export interface FaqItem { question: string; answer: string; }
export interface ProgramDetail {
  slug: string;
  tagline: string;
  titleLine1: string;
  heroInitials: string;
  titleLine2: string;
  description: string;
  heroBadges: ToolItem[];
  quickHighlights: string[];
  whyLearnTitle: string;
  whyLearnDescription: string;
  whyLearnStats: StatBox[];
  curriculum: CurriculumModule[];
  projects: ProjectItem[];
  tools: ToolItem[];
  careerRoles: CareerRole[];
  salaryRows: SalaryRow[];
  whyChoosePoints: WhyChoosePoint[];
  certificateTitle: string;
  journeySteps: JourneyStep[];
  faqs: FaqItem[];
}
