import Link from "next/link";

export const metadata = {
  title: "Methodology & Sources  - Degree Collapse",
  description: "How we calculate degree risk scores. Every data source cited.",
};

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-[var(--border)] hover:decoration-[var(--foreground)] transition-colors"
    >
      {children}
    </a>
  );
}

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

      {/* Major Data Sources */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          Major Data Sources
        </h2>
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-medium mb-1">Unemployment Rates</h3>
            <ul className="text-[var(--muted)] space-y-1.5 list-disc list-inside">
              <li>
                <SourceLink href="https://www.newyorkfed.org/research/college-labor-market/index">
                  Federal Reserve Bank of New York - Labor Market Outcomes of College Graduates
                </SourceLink>
                {" "}(updated annually, most recent 2024-2025)
              </li>
              <li>
                <SourceLink href="https://www.bls.gov/ooh/">
                  Bureau of Labor Statistics - Occupational Outlook Handbook
                </SourceLink>
                {" "}(2024 edition)
              </li>
              <li>
                <SourceLink href="https://www.hiringlab.org/">
                  Indeed Hiring Lab
                </SourceLink>
                {" "}- tech hiring and layoff tracking (2023-2025)
              </li>
              <li>
                <SourceLink href="https://www.comptia.org/content/research/it-industry-trends-analysis">
                  CompTIA - IT Workforce and Technology Report
                </SourceLink>
                {" "}2025
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Automation Risk</h3>
            <ul className="text-[var(--muted)] space-y-1.5 list-disc list-inside">
              <li>
                <SourceLink href="https://www.oxfordmartin.ox.ac.uk/downloads/academic/The_Future_of_Employment.pdf">
                  Frey & Osborne (2017) - &quot;The Future of Employment&quot;
                </SourceLink>
                {" "}- baseline automation probabilities for 702 occupations
              </li>
              <li>
                <SourceLink href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier">
                  McKinsey Global Institute - &quot;The Economic Potential of Generative AI&quot;
                </SourceLink>
                {" "}(2023, updated 2024-2025)
              </li>
              <li>
                <SourceLink href="https://www.goldmansachs.com/insights/pages/generative-ai-could-raise-global-gdp-by-7-percent">
                  Goldman Sachs - &quot;Generative AI Could Raise Global GDP by 7 Percent&quot;
                </SourceLink>
              </li>
              <li>
                <SourceLink href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/">
                  World Economic Forum - Future of Jobs Report 2025
                </SourceLink>
              </li>
              <li>
                <SourceLink href="https://arxiv.org/abs/2303.10130">
                  OpenAI - &quot;GPTs are GPTs&quot; (Eloundou et al., 2023)
                </SourceLink>
                {" "}- task exposure analysis across occupations
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Student Debt</h3>
            <ul className="text-[var(--muted)] space-y-1.5 list-disc list-inside">
              <li>
                <SourceLink href="https://collegescorecard.ed.gov/">
                  U.S. Department of Education - College Scorecard
                </SourceLink>
                {" "}(2024 data, by CIP code)
              </li>
              <li>
                <SourceLink href="https://studentaid.gov/data-center/student/portfolio">
                  Federal Student Aid - Portfolio Summary
                </SourceLink>
                {" "}- aggregate loan data
              </li>
              <li>Figures inflated ~3% to estimated 2026 values</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Starting Salaries</h3>
            <ul className="text-[var(--muted)] space-y-1.5 list-disc list-inside">
              <li>
                <SourceLink href="https://www.naceweb.org/job-market/compensation/salary-trends-through-salary-survey/">
                  NACE - First Destination Survey
                </SourceLink>
                {" "}(National Association of Colleges and Employers, 2025)
              </li>
              <li>
                <SourceLink href="https://www.glassdoor.com/research/">
                  Glassdoor Economic Research
                </SourceLink>
                {" "}- entry-level salary aggregates
              </li>
              <li>
                <SourceLink href="https://www.bls.gov/oes/">
                  BLS - Occupational Employment and Wage Statistics
                </SourceLink>
                {" "}(2024)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Trend / Historical Data</h3>
            <ul className="text-[var(--muted)] space-y-1.5 list-disc list-inside">
              <li>
                <SourceLink href="https://www.bls.gov/cps/">
                  BLS - Current Population Survey
                </SourceLink>
                {" "}- monthly unemployment by occupation (2019-2025)
              </li>
              <li>
                <SourceLink href="https://www.newyorkfed.org/research/college-labor-market/index">
                  NY Fed - College Labor Market
                </SourceLink>
                {" "}- annual graduate outcomes (2019-2025)
              </li>
              <li>
                <SourceLink href="https://www.hiringlab.org/">
                  Indeed Hiring Lab
                </SourceLink>
                {" "}- tech job posting volume (2022-2025)
              </li>
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
            Start with{" "}
            <SourceLink href="https://www.oxfordmartin.ox.ac.uk/downloads/academic/The_Future_of_Employment.pdf">
              Frey & Osborne&apos;s automation probability scores
            </SourceLink>
            {" "}for 702 occupations.
          </p>
          <p>
            <span className="font-medium text-[var(--foreground)]">Step 2:</span>{" "}
            Map each degree to its top 3-5 career outcomes using{" "}
            <SourceLink href="https://www.bls.gov/ooh/">
              BLS occupation-by-degree data
            </SourceLink>.
          </p>
          <p>
            <span className="font-medium text-[var(--foreground)]">Step 3:</span>{" "}
            Apply a 2-year acceleration multiplier based on: current AI coding/writing/analysis benchmarks,
            enterprise AI adoption rates (
            <SourceLink href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai">
              McKinsey 2025: 72% of companies deploying
            </SourceLink>),
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

      {/* School Scoring */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          School Worth-It Score
        </h2>
        <p className="text-sm leading-relaxed mb-4">
          Every university receives a score from 0 (worst value) to 100 (best value).
          Note: this is <span className="font-medium text-[var(--foreground)]">inverted</span> from
          the major risk score - higher means the school is a better bet. The score
          is computed from four weighted factors:
        </p>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 font-mono text-sm leading-loose mb-4">
          <div>school_score = (</div>
          <div className="ml-4">0.35 x debt_salary_value +</div>
          <div className="ml-4">0.20 x ai_readiness +</div>
          <div className="ml-4">0.20 x network_premium +</div>
          <div className="ml-4">0.25 x post_ai_employability</div>
          <div>) x 100</div>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <span className="font-medium">Debt-to-Salary Value (35%)</span>
            <span className="text-[var(--muted)]">
              {" "}- Average debt at graduation divided by median earnings 10 years post-entry.
              Lower ratio = higher score. Capped at 1.5x ratio. Source:{" "}
              <SourceLink href="https://collegescorecard.ed.gov/">College Scorecard</SourceLink>.
            </span>
          </div>
          <div>
            <span className="font-medium">AI Readiness (20%)</span>
            <span className="text-[var(--muted)]">
              {" "}- Composite of: percentage of degrees in STEM fields (30% weight),
              whether the school has a dedicated AI/ML program (40% weight), and{" "}
              <SourceLink href="https://carnegieclassifications.acenet.edu/">
                Carnegie research classification
              </SourceLink>
              {" "}R1/R2 (30% weight). Schools with strong
              AI programs and research output score highest.
            </span>
          </div>
          <div>
            <span className="font-medium">Network Premium (20%)</span>
            <span className="text-[var(--muted)]">
              {" "}- Alumni salary uplift above national median (60% weight) combined with
              startup density per 1,000 alumni (40% weight). Startup data from{" "}
              <SourceLink href="https://pitchbook.com/news/rankings/top-100-universities-for-founders">
                PitchBook University Rankings
              </SourceLink>
              . Measures whether the school&apos;s
              brand and alumni network provide tangible career advantages beyond education.
            </span>
          </div>
          <div>
            <span className="font-medium">Post-AI Employability (25%)</span>
            <span className="text-[var(--muted)]">
              {" "}- Inverse of the weighted average automation risk across the school&apos;s
              most popular majors. Schools whose graduates cluster in AI-resilient fields
              score higher. In AGI mode, this factor gets amplified.
            </span>
          </div>
        </div>
      </section>

      {/* School Data Sources */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
          School Data Sources
        </h2>
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-medium mb-1">Core Financial Data</h3>
            <ul className="text-[var(--muted)] space-y-1.5 list-disc list-inside">
              <li>
                <SourceLink href="https://collegescorecard.ed.gov/">
                  U.S. Department of Education - College Scorecard
                </SourceLink>
                {" "}- median debt, median earnings (4yr and 10yr), graduation rate, tuition, enrollment, admission rate
              </li>
              <li>
                <SourceLink href="https://collegescorecard.ed.gov/data/documentation/">
                  College Scorecard API Documentation
                </SourceLink>
                {" "}- program percentages by CIP code
              </li>
              <li>Top 1,000 bachelor&apos;s-granting institutions by enrollment</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">AI Programs & Research</h3>
            <ul className="text-[var(--muted)] space-y-1.5 list-disc list-inside">
              <li>
                <SourceLink href="https://carnegieclassifications.acenet.edu/">
                  Carnegie Classification of Institutions of Higher Education
                </SourceLink>
                {" "}- R1/R2 research designation
              </li>
              <li>AI/ML program existence manually verified for top ~100 schools via university websites and{" "}
                <SourceLink href="https://csrankings.org/">CSRankings.org</SourceLink>
              </li>
              <li>
                STEM percentage computed from{" "}
                <SourceLink href="https://nces.ed.gov/ipeds/cipcode/default.aspx?y=56">
                  NCES CIP codes
                </SourceLink>
                {" "}11, 14, 15, 26, 27, 40
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Network & Startup Data</h3>
            <ul className="text-[var(--muted)] space-y-1.5 list-disc list-inside">
              <li>Alumni salary premium derived from{" "}
                <SourceLink href="https://collegescorecard.ed.gov/">College Scorecard</SourceLink>
                {" "}earnings vs national median ($38k baseline)
              </li>
              <li>
                Startup density estimated from{" "}
                <SourceLink href="https://pitchbook.com/news/rankings/top-100-universities-for-founders">
                  PitchBook University Rankings
                </SourceLink>
                {" "}and{" "}
                <SourceLink href="https://www.crunchbase.com/">Crunchbase</SourceLink>
                {" "}data for top ~100 schools
              </li>
              <li>Remaining schools default to 0.5 startups per 1,000 alumni</li>
            </ul>
          </div>
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
            All data and methodology are{" "}
            <SourceLink href="https://github.com/RomanSlack/f_x_university">
              open source on GitHub
            </SourceLink>
            . If you find an error or have better data, submit a pull request.
          </p>
        </div>
      </section>

      {/* Links */}
      <section className="border-t border-[var(--border)] pt-8">
        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest">
          <Link href="/" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            ← Major Rankings
          </Link>
          <Link href="/schools" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            School Rankings
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
