import type { Metadata } from "next";

const year = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Is Your School Worth It in ${year}? - Degree Collapse Dashboard`,
  description: `Top 1,000 US universities scored 0-100 on debt-to-salary ratio, AI readiness, network premium, and post-AI employability. Find out if your school is worth the investment.`,
  openGraph: {
    title: `Is Your School Worth It in ${year}?`,
    description: `We scored 1,000 US universities 0-100 on debt, AI readiness, network, and employability. Check yours.`,
    type: "website",
    siteName: "Degree Collapse",
  },
  twitter: {
    card: "summary_large_image",
    title: `Is Your School Worth It in ${year}?`,
    description: `We scored 1,000 US universities 0-100 on debt, AI readiness, network, and employability.`,
  },
};

export default function SchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
