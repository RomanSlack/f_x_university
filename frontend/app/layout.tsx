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
  metadataBase: new URL("https://fxuniversity.world"),
  title: `Is Your Degree Worth It in ${year}?  - Degree Collapse Dashboard`,
  description: `Every college major and US university scored 0-100 on AI automation risk, debt, and employability. The tool universities don't want you to have. Updated for ${year}.`,
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
    description: `Every major and 1,000 US universities scored 0-100 on AI risk, debt, and employability. Check yours.`,
    type: "website",
    siteName: "Degree Collapse",
  },
  twitter: {
    card: "summary_large_image",
    title: `Is Your Degree Worth It in ${year}?`,
    description: `Every major and 1,000 US universities scored 0-100 on AI risk, debt, and employability.`,
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
