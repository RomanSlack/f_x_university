"use client";

import { SingularityProvider } from "@/lib/singularity";
import { currentYear } from "@/lib/year";
import Navbar from "@/components/Navbar";
import SchoolHeroStats from "@/components/SchoolHeroStats";
import SchoolRankingTable from "@/components/SchoolRankingTable";
import StateMap from "@/components/StateMap";
import ShareButtons from "@/components/ShareButtons";
import Link from "next/link";

export default function SchoolsPage() {
  const year = currentYear();

  return (
    <SingularityProvider>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section id="hero" className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Majors
            </Link>
            <span className="text-[var(--muted)]">/</span>
            <span className="text-xs uppercase tracking-widest text-[var(--foreground)] border-b-2 border-[var(--foreground)] pb-0.5">
              Schools
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            Is your school<br />worth it in {year}?
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)] max-w-xl">
            Top US universities scored 0-100 on debt-to-salary ratio, AI
            readiness, network premium, and post-AI employability of their
            graduates. Higher is better. AGI mode on by default.
          </p>
          <div className="mt-6">
            <ShareButtons text={`Is your school worth it in ${year}? Every major and US university scored 0-100 on AI risk, debt, and employability.`} />
          </div>
          <SchoolHeroStats />
        </section>

        {/* State Map */}
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[var(--border)]">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
            Score by State
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            Average school worth-it score per state. Hover for details.
          </p>
          <StateMap />
        </section>

        {/* Rankings */}
        <section id="rankings" className="max-w-5xl mx-auto px-6 py-16 border-t border-[var(--border)]">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-8">
            All Schools Ranked
          </h2>
          <SchoolRankingTable />
        </section>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-6 text-[11px] text-[var(--muted)] uppercase tracking-widest mb-6">
            <Link href="/methodology" className="hover:text-[var(--foreground)] transition-colors">
              Methodology & Sources
            </Link>
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
              Major Rankings
            </Link>
            <a
              href="https://github.com/RomanSlack/f_x_university"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              GitHub
            </a>
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed max-w-xl">
            School data: US Department of Education College Scorecard, Carnegie
            Classifications, PitchBook University Rankings. AI program data
            manually verified. Network premium estimated from alumni salary
            uplift and startup density. This is not financial advice.
          </p>
        </footer>
      </main>
    </SingularityProvider>
  );
}
