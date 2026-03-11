"use client";

import { SingularityProvider } from "@/lib/singularity";
import { currentYear } from "@/lib/year";
import Navbar from "@/components/Navbar";
import HeroStats from "@/components/HeroStats";
import TrendChart from "@/components/TrendChart";
import RankingTable from "@/components/RankingTable";
import Calculator from "@/components/Calculator";
import DebtClock from "@/components/DebtClock";
import Link from "next/link";

export default function Home() {
  const year = currentYear();

  return (
    <SingularityProvider>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section id="hero" className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            Is your degree<br />worth it in {year}?
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)] max-w-xl">
            Every major scored 0–100 on unemployment, AI automation risk, debt
            load, salary, and the rate of AI-driven job displacement since
            ChatGPT launched. Defaults to AGI-adjusted projections  - toggle
            in the nav to see baseline.
          </p>
          <HeroStats />
        </section>

        {/* Trend Chart */}
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[var(--border)]">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
            CS/Tech Unemployment Over Time
          </h2>
          <p className="text-sm text-[var(--muted)] mb-8">
            The acceleration since November 2022, projected to 2030.
          </p>
          <TrendChart />
        </section>

        {/* Rankings */}
        <section id="rankings" className="max-w-5xl mx-auto px-6 py-16 border-t border-[var(--border)]">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-8">
            All Majors Ranked
          </h2>
          <RankingTable />
        </section>

        {/* Calculator */}
        <section id="calculator" className="max-w-5xl mx-auto px-6 py-16 border-t border-[var(--border)]">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
            Personal Calculator
          </h2>
          <p className="text-sm text-[var(--muted)] mb-8">
            Plug in your own numbers. Includes AI acceleration factor.
          </p>
          <Calculator />
        </section>

        {/* Debt Clock */}
        <section id="debt" className="max-w-5xl mx-auto px-6 py-16 border-t border-[var(--border)]">
          <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-8">
            The Debt Clock
          </h2>
          <DebtClock />
        </section>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-6 text-[11px] text-[var(--muted)] uppercase tracking-widest mb-6">
            <Link href="/methodology" className="hover:text-[var(--foreground)] transition-colors">
              Methodology & Sources
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
            Data sources: BLS Occupational Outlook, NY Fed Labor Market
            Outcomes, Oxford/Frey-Osborne, College Scorecard, NACE, McKinsey,
            Goldman Sachs. Automation risk scores are 2-year forward estimates.
            This is not financial advice.
          </p>
        </footer>
      </main>
    </SingularityProvider>
  );
}
