"use client";

import { useState, useEffect } from "react";
import { fetchSchoolStats, type SchoolStatsData } from "@/lib/api";
import { ScoreBadge } from "./ScoreBadge";
import { useSingularity } from "@/lib/singularity";
import { StatsSkeleton } from "./Skeleton";

export default function SchoolHeroStats() {
  const [stats, setStats] = useState<SchoolStatsData | null>(null);
  const { multiplier } = useSingularity();

  useEffect(() => {
    fetchSchoolStats(multiplier).then(setStats);
  }, [multiplier]);

  if (!stats) return <StatsSkeleton />;

  return (
    <div className="mt-16 space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)]">
        {[
          { value: stats.total_schools, label: "Schools Ranked" },
          { value: stats.average_score, label: "Avg Worth-It Score", color: "text-[var(--moderate)]" },
          { value: stats.top_rated_count, label: "Top-Rated Schools", color: "text-[var(--safe)]" },
          { value: stats.best_5[0]?.school_score ?? "-", label: "Highest Score", color: "text-[var(--safe)]" },
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
            Best Value
          </h3>
          <div className="space-y-3">
            {stats.best_5.map((s, i) => (
              <div key={s.slug} className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                <span className="text-sm">
                  <span className="text-[var(--muted)] tabular-nums mr-3">{i + 1}</span>
                  {s.name}
                </span>
                <ScoreBadge score={s.school_score} color={s.school_color} size="sm" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
            Worst Value
          </h3>
          <div className="space-y-3">
            {stats.worst_5.map((s, i) => (
              <div key={s.slug} className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                <span className="text-sm">
                  <span className="text-[var(--muted)] tabular-nums mr-3">{i + 1}</span>
                  {s.name}
                </span>
                <ScoreBadge score={s.school_score} color={s.school_color} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
