"use client";

import { useState, useEffect } from "react";
import { fetchStats, type StatsData } from "@/lib/api";
import { ScoreBadge } from "./ScoreBadge";
import { useSingularity } from "@/lib/singularity";
import { StatsSkeleton } from "./Skeleton";

export default function HeroStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const { multiplier } = useSingularity();

  useEffect(() => {
    fetchStats(multiplier).then(setStats);
  }, [multiplier]);

  if (!stats) return <StatsSkeleton />;

  return (
    <div className="mt-16 space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)]">
        {[
          { value: stats.total_majors, label: "Majors Tracked" },
          { value: stats.average_score, label: "Avg Risk Score", color: "text-[var(--moderate)]" },
          { value: stats.critical_count, label: "High-Risk Majors", color: "text-[var(--critical)]" },
          { value: stats.best_5[0]?.risk_score ?? "-", label: "Safest Score", color: "text-[var(--safe)]" },
        ].map((item) => (
          <div key={item.label} className="bg-white p-6 text-center">
            <div className={`text-3xl font-mono font-semibold ${item.color || ""}`}>
              {item.value}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 uppercase tracking-widest">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
            Highest Risk
          </h3>
          <div className="space-y-3">
            {stats.worst_5.map((m, i) => (
              <div key={m.slug} className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                <span className="text-sm">
                  <span className="text-[var(--muted)] tabular-nums mr-3">{i + 1}</span>
                  {m.name}
                </span>
                <ScoreBadge score={m.risk_score} color={m.risk_color} size="sm" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
            Lowest Risk
          </h3>
          <div className="space-y-3">
            {stats.best_5.map((m, i) => (
              <div key={m.slug} className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                <span className="text-sm">
                  <span className="text-[var(--muted)] tabular-nums mr-3">{i + 1}</span>
                  {m.name}
                </span>
                <ScoreBadge score={m.risk_score} color={m.risk_color} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
