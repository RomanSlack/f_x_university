import Link from "next/link";

export const metadata = {
  title: "Methodology & Sources  - Degree Collapse",
  description: "How we calculate degree risk scores. Every data source cited.",
};

export default function MethodologyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <Link
        href="/"
        className="text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight mt-8 mb-12">
        Methodology & Sources
      </h1>

      {/* Scoring Formula */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          The Risk Score Formula
        </h2>
        <p className="text-sm leading-relaxed mb-4">
          Every degree receives a score from 0 (safest) to 100 (most dangerous).
          The score is computed from five weighted factors:
        </p>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 font-mono text-sm leading-loose mb-4">
          <div>score = (</div>
          <div className="ml-4">0.20 × unemployment_normalized +</div>
          <div className="ml-4">0.25 × automation_risk_normalized +</div>
          <div className="ml-4">0.35 × debt_salary_ratio_normalized +</div>
          <div className="ml-4">0.20 × acceleration_normalized</div>
          <div>) × 100</div>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <span className="font-medium">Unemployment (20%)</span>
            <span className="text-[var(--muted)]">
              {" "} - Recent graduate unemployment rate, normalized against a 15% ceiling.
            </span>
          </div>
          <div>
            <span className="font-medium">Automation Risk (25%)</span>
            <span className="text-[var(--muted)]">
              {" "} - Probability of significant AI automation within 2 years, on a 0-100 scale.
            </span>
          </div>
          <div>
            <span className="font-medium">Debt-to-Salary Ratio (35%)</span>
            <span className="text-[var(--muted)]">
              {" "} - Average total debt divided by median starting salary, normalized
              so that a 2:1 ratio (debt = 2x salary) hits maximum. This is the
              highest-weighted factor because it directly measures the personal
              financial trap.
            </span>
          </div>
          <div>
            <span className="font-medium">AI Acceleration (20%)</span>
            <span className="text-[var(--muted)]">
              {" "} - The rate of unemployment increase since ChatGPT launched (November
              2022). A field that went from 2% to 6% unemployment is in freefall.
              A field sitting at 6% for a decade is stable. This factor captures
              the velocity of disruption, not just the snapshot.
            </span>
          </div>
        </div>
      </section>

      {/* AGI Mode */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          AGI / Singularity Mode
        </h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          The toggle in the bottom-right corner applies a multiplier (1.5x–5x)
          to all AI-related factors: automation risk scores and the AI-driven
          portion of unemployment increases. At 2x, you&apos;re seeing what happens
          if AI capabilities double their current displacement rate. At 5x,
          you&apos;re modeling a near-AGI scenario where most cognitive tasks become
          automatable within 2 years. The baseline data stays untouched  - only
          the AI amplification changes.
        </p>
      </section>

      {/* Data Sources */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          Data Sources
        </h2>
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-medium mb-1">Unemployment Rates</h3>
            <ul className="text-[var(--muted)] space-y-1 list-disc list-inside">
              <li>Federal Reserve Bank of New York  - Labor Market Outcomes of College Graduates (updated annually, most recent 2024-2025)</li>
              <li>Bureau of Labor Statistics  - Occupational Outlook Handbook (2024 edition)</li>
              <li>Indeed Hiring Lab  - tech hiring and layoff tracking (2023-2025)</li>
              <li>CompTIA  - IT Workforce and Technology Report 2025</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Automation Risk</h3>
            <ul className="text-[var(--muted)] space-y-1 list-disc list-inside">
              <li>Oxford/Frey & Osborne (2017)  - &quot;The Future of Employment&quot; baseline probabilities for 702 occupations</li>
              <li>McKinsey Global Institute  - &quot;The Economic Potential of Generative AI&quot; (2024-2025 updates)</li>
              <li>Goldman Sachs  - &quot;The Potentially Large Effects of AI on Economic Growth&quot; (2025)</li>
              <li>World Economic Forum  - Future of Jobs Report 2025</li>
              <li>OpenAI/Anthropic capability benchmarks  - coding, writing, analysis task performance trajectories</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Student Debt</h3>
            <ul className="text-[var(--muted)] space-y-1 list-disc list-inside">
              <li>U.S. Department of Education  - College Scorecard (2024 data, by CIP code)</li>
              <li>Federal Student Aid (studentaid.gov)  - aggregate loan data</li>
              <li>Figures inflated ~3% to estimated 2026 values</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Starting Salaries</h3>
            <ul className="text-[var(--muted)] space-y-1 list-disc list-inside">
              <li>NACE  - National Association of Colleges and Employers, First Destination Survey 2025</li>
              <li>Glassdoor  - entry-level salary aggregates</li>
              <li>BLS  - Occupational Employment and Wage Statistics 2024</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Trend / Historical Data</h3>
            <ul className="text-[var(--muted)] space-y-1 list-disc list-inside">
              <li>BLS  - monthly unemployment by occupation (2019-2025)</li>
              <li>NY Fed  - annual graduate outcomes (2019-2025)</li>
              <li>Indeed Hiring Lab  - tech job posting volume (2022-2025)</li>
              <li>Projections extrapolated from the 2022-2025 trend line using linear regression</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Methodology for Automation Risk */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          How We Calculate Automation Risk
        </h2>
        <div className="text-sm leading-relaxed text-[var(--muted)] space-y-3">
          <p>
            <span className="font-medium text-[var(--foreground)]">Step 1:</span>{" "}
            Start with Oxford/Frey-Osborne&apos;s automation probability scores for 702 occupations.
          </p>
          <p>
            <span className="font-medium text-[var(--foreground)]">Step 2:</span>{" "}
            Map each degree to its top 3-5 career outcomes using BLS occupation-by-degree data.
          </p>
          <p>
            <span className="font-medium text-[var(--foreground)]">Step 3:</span>{" "}
            Apply a 2-year acceleration multiplier based on: current AI coding/writing/analysis benchmarks,
            enterprise AI adoption rates (McKinsey 2025: 72% of companies deploying),
            and rate of improvement in AI capabilities (GPT-3.5 → GPT-4 → o3 trajectory).
          </p>
          <p>
            <span className="font-medium text-[var(--foreground)]">Step 4:</span>{" "}
            Weight by what percentage of graduates actually enter those roles (not just what the degree enables,
            but where people end up).
          </p>
          <p>
            <span className="font-medium text-[var(--foreground)]">Result:</span>{" "}
            A defensible, citable 2-year automation risk score per degree.
          </p>
        </div>
      </section>

      {/* Acceleration Factor */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          The Acceleration Factor
        </h2>
        <div className="text-sm leading-relaxed text-[var(--muted)] space-y-3">
          <p>
            Most tools look at unemployment as a snapshot. We measure the derivative  - how fast
            it&apos;s changing. Specifically, the ratio of current unemployment to pre-ChatGPT
            unemployment (before November 2022).
          </p>
          <p>
            Computer Science: 2.8% → 6.1% = 2.18x increase in ~3 years.{" "}
            Software Engineering: 2.5% → 7.5% = 3.0x increase.{" "}
            Nursing: 1.6% → 1.9% = 1.19x (barely moved).
          </p>
          <p>
            This is the signal that existing tools miss entirely. A field with stable
            5% unemployment is categorically different from a field where unemployment
            tripled in 3 years  - even if the current number is the same.
          </p>
        </div>
      </section>

      {/* Limitations */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          Limitations & Disclaimers
        </h2>
        <div className="text-sm leading-relaxed text-[var(--muted)] space-y-3">
          <p>
            These are estimates and extrapolations, not official statistics. Automation
            risk in particular is inherently speculative  - nobody knows exactly when
            AI will be able to do X. Our scores represent informed projections based on
            current capability trajectories, not certainties.
          </p>
          <p>
            Unemployment data varies by source and methodology. The NY Fed measures
            recent graduates differently than BLS measures all workers. We cite our
            specific source for each data point.
          </p>
          <p>
            This is not financial advice. Individual outcomes vary enormously by school,
            location, specialization, internship experience, and luck. These scores
            describe averages across all graduates of a given major.
          </p>
          <p>
            All data and methodology are open source. If you find an error or have
            better data, submit a pull request.
          </p>
        </div>
      </section>

      {/* Links */}
      <section className="border-t border-[var(--border)] pt-8">
        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest">
          <Link href="/" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            ← Dashboard
          </Link>
          <a
            href="https://github.com/RomanSlack/f_x_university"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            GitHub Repository
          </a>
        </div>
      </section>
    </main>
  );
}
