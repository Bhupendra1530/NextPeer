import type { SVGProps, ReactElement } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* Simplified, original geometric marks inspired by each tool's category —
   not reproductions of official trademarked logos. */

const Aws = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M4 15c3.5 2.5 12.5 2.5 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 13.5l2.5 1.2-1 2.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="8" r="1.4" fill="currentColor" />
    <circle cx="12" cy="6.5" r="1.4" fill="currentColor" />
    <circle cx="17" cy="8" r="1.4" fill="currentColor" />
  </svg>
);

const Azure = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M9.5 4h4l-5 11.5H4L9.5 4z" opacity="0.9" />
    <path d="M11.5 4L6 17l-2 3h16l-8-8 4-1-4-7z" />
  </svg>
);

const Gcp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="8" cy="8" r="2.6" fill="#EA4335" />
    <circle cx="16" cy="8" r="2.6" fill="#4285F4" />
    <circle cx="8" cy="16" r="2.6" fill="#FBBC05" />
    <circle cx="16" cy="16" r="2.6" fill="#34A853" />
  </svg>
);

const Docker = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="3" y="11" width="3.2" height="3.2" rx="0.5" />
    <rect x="7" y="11" width="3.2" height="3.2" rx="0.5" />
    <rect x="11" y="11" width="3.2" height="3.2" rx="0.5" />
    <rect x="7" y="7" width="3.2" height="3.2" rx="0.5" />
    <rect x="11" y="7" width="3.2" height="3.2" rx="0.5" />
    <path d="M2 14c0 3.5 3 5.5 8 5.5 6 0 9.5-3 10.8-7-1-.3-2.2 0-2.8.8-1-2-3-2-3-2s-.6 1.7.6 3c-1 .5-2.5.7-4.6.7-3.6 0-6.5-1-9-2.6V14z" />
  </svg>
);

const Kubernetes = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 2.5l8 3v8l-8 8-8-8v-8l8-3z" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 8.8v-3M14.8 13.6l2.6 1.5M9.2 13.6l-2.6 1.5" strokeLinecap="round" />
  </svg>
);

const Terraform = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M4 4l5 2.9v5.8L4 9.8V4z" />
    <path d="M10 7.2l5 2.9v5.8l-5-2.9V7.2z" opacity="0.75" />
    <path d="M16 4l5 2.9v5.8l-5-2.9V4z" opacity="0.5" />
    <path d="M10 13.4l5 2.9V22l-5-2.9v-5.7z" opacity="0.9" />
  </svg>
);

const Jenkins = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <circle cx="12" cy="9" r="4" />
    <path d="M6 21c0-4 2.5-6.5 6-6.5s6 2.5 6 6.5" strokeLinecap="round" />
    <path d="M9.5 8.5h.01M14.5 8.5h.01" strokeLinecap="round" strokeWidth="2.2" />
  </svg>
);

const GitBrand = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="17" cy="12" r="2" />
    <path d="M6 8v8M8 6h5a4 4 0 014 4" strokeLinecap="round" />
  </svg>
);

const GithubBrand = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 00-3.16 19.5c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
  </svg>
);

const Linux = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <ellipse cx="12" cy="14" rx="5" ry="6" />
    <circle cx="9.8" cy="12" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="14.2" cy="12" r="0.8" fill="currentColor" stroke="none" />
    <path d="M8 19c1.3 1.3 6.7 1.3 8 0" strokeLinecap="round" />
  </svg>
);

const Prometheus = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 3a7 7 0 00-4 12.7V19a1 1 0 001 1h6a1 1 0 001-1v-3.3A7 7 0 0012 3z" />
    <path d="M9.5 19h5M10 21h4" strokeLinecap="round" />
  </svg>
);

const Grafana = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" strokeLinejoin="round" />
    <path d="M9 12.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Ansible = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 6l3.2 9M12 6L8.8 15M9.6 12.5h4.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Nginx = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M4 8l8-5 8 5v8l-8 5-8-5V8z" strokeLinejoin="round" />
    <path d="M8.5 16V8l7 8V8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Gitlab = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 21l3.9-8.2H8.1L12 21z" />
    <path d="M4.5 12.8L3 8l1.5-4.8L7.5 9h9l3-5.8L21 8l-1.5 4.8L12 21 4.5 12.8z" opacity="0.85" />
  </svg>
);

const VsCode = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M16.5 3.5L6 12l10.5 8.5 3-1.5V5l-3-1.5z" strokeLinejoin="round" />
    <path d="M16.5 20.5L3.5 13.5V10.5L16.5 3.5" strokeLinejoin="round" />
  </svg>
);

const Python = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M11.9 2c-4.4 0-4.1 1.9-4.1 1.9V6h4.2v.6H6.1S3 6.2 3 10.6s2.7 4.3 2.7 4.3h1.6v-2.2s-.1-2.7 2.6-2.7h4.1s2.5.1 2.5-2.4V4.3S16.9 2 11.9 2z" />
    <path d="M12.1 22c4.4 0 4.1-1.9 4.1-1.9V18h-4.2v-.6h5.9S21 17.8 21 13.4s-2.7-4.3-2.7-4.3h-1.6v2.2s.1 2.7-2.6 2.7H10s-2.5-.1-2.5 2.4v4.3S7.1 22 12.1 22z" opacity="0.6" />
  </svg>
);

const TensorFlow = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M4 6l7-3.5v19L4 18V6z" opacity="0.85" />
    <path d="M11 2.5L20 6v12l-9 3.5V2.5z" opacity="0.55" />
  </svg>
);

const PyTorch = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 3v5.5" strokeLinecap="round" />
    <path d="M8.2 6.8a7 7 0 107.6 0" strokeLinecap="round" />
    <circle cx="14.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const ScikitLearn = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <circle cx="9" cy="9" r="4" />
    <circle cx="15" cy="15" r="4" />
    <path d="M12 9a3 3 0 003 3" strokeLinecap="round" />
  </svg>
);

const Pandas = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <rect x="3.5" y="4" width="17" height="16" rx="2" />
    <path d="M8 4v16M13 4v16M3.5 9h17M3.5 14h17" />
  </svg>
);

const NumPy = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M4 6l8 4.5 8-4.5M4 6v12l8 4.5M4 6l8-4.5 8 4.5M20 6v12l-8 4.5m8-16.5L12 10.5v10" strokeLinejoin="round" />
  </svg>
);

const OpenCv = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <circle cx="8" cy="8" r="3.2" />
    <circle cx="16" cy="8" r="3.2" />
    <circle cx="12" cy="16" r="3.2" />
  </svg>
);

const HuggingFace = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9 11c0 .6-.4 1-1 1s-1-.4-1-1 .4-1 1-1 1 .4 1 1zM17 11c0 .6-.4 1-1 1s-1-.4-1-1 .4-1 1-1 1 .4 1 1z" fill="currentColor" />
    <path d="M8.5 15c1.5 1.5 5.5 1.5 7 0" strokeLinecap="round" />
  </svg>
);

const OpenAi = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 3a4 4 0 00-3.9 5A4 4 0 007 15.5 4 4 0 0011 21a4 4 0 003.9-5A4 4 0 0017 8.5 4 4 0 0012 3z" strokeLinejoin="round" />
  </svg>
);

const LangChain = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <circle cx="8" cy="9" r="3" />
    <circle cx="16" cy="15" r="3" />
    <path d="M10.2 10.8l3.6 2.4" strokeLinecap="round" />
  </svg>
);

const Pinecone = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z" />
  </svg>
);

const Jupyter = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="5" cy="17" r="1.6" opacity="0.8" />
    <circle cx="19" cy="17" r="1.6" opacity="0.6" />
    <path d="M6 6c0 3 2.5 5 6 5s6-2 6-5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

export const TECH_ICON_MAP: Record<string, (p: IconProps) => ReactElement> = {
  aws: Aws,
  azure: Azure,
  gcp: Gcp,
  docker: Docker,
  kubernetes: Kubernetes,
  terraform: Terraform,
  jenkins: Jenkins,
  git: GitBrand,
  github: GithubBrand,
  linux: Linux,
  prometheus: Prometheus,
  grafana: Grafana,
  ansible: Ansible,
  nginx: Nginx,
  gitlab: Gitlab,
  vscode: VsCode,
  python: Python,
  tensorflow: TensorFlow,
  pytorch: PyTorch,
  scikitlearn: ScikitLearn,
  pandas: Pandas,
  numpy: NumPy,
  opencv: OpenCv,
  huggingface: HuggingFace,
  openai: OpenAi,
  langchain: LangChain,
  pinecone: Pinecone,
  jupyter: Jupyter,
};

const TILE_COLORS: Record<string, string> = {
  aws: "bg-orange-50 text-orange-500",
  azure: "bg-blue-50 text-blue-600",
  gcp: "bg-slate-50 text-slate-700",
  docker: "bg-sky-50 text-sky-600",
  kubernetes: "bg-blue-50 text-blue-600",
  terraform: "bg-violet-50 text-violet-600",
  jenkins: "bg-red-50 text-red-500",
  git: "bg-orange-50 text-orange-600",
  github: "bg-slate-100 text-slate-800",
  linux: "bg-amber-50 text-amber-600",
  prometheus: "bg-orange-50 text-orange-600",
  grafana: "bg-orange-50 text-orange-500",
  ansible: "bg-red-50 text-red-500",
  nginx: "bg-emerald-50 text-emerald-600",
  gitlab: "bg-orange-50 text-orange-600",
  vscode: "bg-blue-50 text-blue-500",
  python: "bg-blue-50 text-blue-500",
  tensorflow: "bg-orange-50 text-orange-500",
  pytorch: "bg-red-50 text-red-500",
  scikitlearn: "bg-orange-50 text-orange-500",
  pandas: "bg-indigo-50 text-indigo-600",
  numpy: "bg-blue-50 text-blue-600",
  opencv: "bg-teal-50 text-teal-600",
  huggingface: "bg-amber-50 text-amber-500",
  openai: "bg-emerald-50 text-emerald-700",
  langchain: "bg-lime-50 text-lime-600",
  pinecone: "bg-teal-50 text-teal-600",
  jupyter: "bg-orange-50 text-orange-500",
};

export function TechIcon({
  name,
  size = 18,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = TECH_ICON_MAP[name];
  if (!Icon) return null;
  return <Icon width={size} height={size} className={className} />;
}

export function TechTile({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const dims =
    size === "sm" ? "h-12 w-12" : size === "lg" ? "h-16 w-16" : size === "xl" ? "h-20 w-20" : "h-14 w-14";
  const iconSize = size === "sm" ? 22 : size === "lg" ? 30 : size === "xl" ? 38 : 26;
  const colorClass = TILE_COLORS[name] || "bg-slate-50 text-slate-600";

  return (
    <div
      title={name}
      className={`flex ${dims} shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5 transition-transform hover:scale-110 ${colorClass}`}
    >
      <TechIcon name={name} size={iconSize} />
    </div>
  );
}
