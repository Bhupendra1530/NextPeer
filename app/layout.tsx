import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = "https://nextpeer.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "NextPeer | Industry-Ready Technology Courses for College Students",
    template: "%s | NextPeer",
  },

  description:
    "NextPeer helps college students become industry-ready through practical technology courses, real-world projects, mentorship, internships and placement support.",

  applicationName: "NextPeer",

  authors: [{ name: "NextPeer" }],
  creator: "NextPeer",
  publisher: "NextPeer",

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "NextPeer",
    title:
      "NextPeer | Industry-Ready Technology Courses for College Students",
    description:
      "Learn practical technology skills, build real-world projects and prepare for industry opportunities with NextPeer.",
    locale: "en_IN",
    images: [
      {
        url: "/nextpeer-logo.jpeg",
        alt: "NextPeer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "NextPeer | Industry-Ready Technology Courses for College Students",
    description:
      "Practical technology training, projects, mentorship, internships and placement support for college students.",
    images: ["/nextpeer-logo.jpeg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
