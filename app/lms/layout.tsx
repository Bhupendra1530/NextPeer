import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Learning Portal",
  description: "NextPeer student and mentor learning workspace.",
  robots: { index: false, follow: false },
};
export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
