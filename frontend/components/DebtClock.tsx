"use client";

import { useState, useEffect, useRef } from "react";
import { fetchMajors, type MajorData } from "@/lib/api";
import { useSingularity } from "@/lib/singularity";
import { DebtClockSkeleton } from "./Skeleton";

export default function DebtClock() {
  const [majors, setMajors] = useState<MajorData[]>([]);
  const [selected, setSelected] = useState<MajorData | null>(null);
  const [counter, setCounter] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { multiplier } = useSingularity();

  useEffect(() => {
    fetchMajors({ sort: "risk_score", order: "desc", singularity: multiplier }).then((data) => {
      setMajors(data);
      if (data.length > 0) setSelected(data[0]);
    });
  }, [multiplier]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!selected) return;

    const annualInterest = selected.avg_debt * 0.05;
    const perSecond = annualInterest / (365.25 * 24 * 3600);
    setCounter(0);

    intervalRef.current = setInterval(() => {
      setCounter((prev) => prev + perSecond * 0.1);
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selected]);

  const [totalDebt, setTotalDebt] = useState(1_770_000_000_000);
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalDebt((prev) => prev + 272.6);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (majors.length === 0) return <DebtClockSkeleton />;

  return (
    <div className="grid md:grid-cols-2 gap-px bg-[var(--border)]">
      <div className="bg-white p-8 text-center">
        <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-6">
          Interest Accumulating Now
        </div>
        {selected && (
          <>
            <select
              value={selected.slug}
              onChange={(e) => {
                const m = majors.find((x) => x.slug === e.target.value);
                if (m) setSelected(m);
              }}
              className="border-b border-[var(--border)] bg-transparent px-1 py-2 text-sm mb-6 focus:outline-none focus:border-[var(--foreground)]"
            >
              {majors.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}  - ${m.avg_debt.toLocaleString()}
                </option>
              ))}
            </select>
            <div className="text-4xl md:text-5xl font-mono font-semibold text-[var(--critical)] tabular-nums">
              ${counter.toFixed(4)}
            </div>
            <div className="text-[11px] text-[var(--muted)] mt-3">
              at 5% on ${selected.avg_debt.toLocaleString()} since page load
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-8 text-center">
        <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-6">
          Total US Student Debt
        </div>
        <div className="text-4xl md:text-5xl font-mono font-semibold tabular-nums mt-12">
          ${(totalDebt / 1_000_000_000_000).toFixed(6)}T
        </div>
        <div className="text-[11px] text-[var(--muted)] mt-3">
          +$2,726 every second
        </div>
      </div>
    </div>
  );
}
