import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const year = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Is Your Degree Worth It in ${year}?  - Degree Collapse Dashboard`,
  description: `Every college major scored 0-100 on unemployment, AI automation risk, debt load, and salary. The tool universities don't want you to have. Updated for ${year}.`,
  keywords: [
    "degree ROI",
    "college major risk",
    "AI automation jobs",
    "student debt",
    "degree collapse",
    "is college worth it",
    `best majors ${year}`,
    `worst majors ${year}`,
    "AGI job displacement",
  ],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: `Is Your Degree Worth It in ${year}?`,
    description: `We scored every major 0-100 on AI risk, unemployment, debt, and salary. Check yours.`,
    type: "website",
    siteName: "Degree Collapse",
  },
  twitter: {
    card: "summary_large_image",
    title: `Is Your Degree Worth It in ${year}?`,
    description: `We scored every major 0-100 on AI risk, unemployment, debt, and salary.`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
