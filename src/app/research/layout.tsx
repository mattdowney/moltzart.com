import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research — Moltzart",
  robots: { index: false, follow: false },
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
