"use client";

import { useState, useEffect } from "react";
import { calculateScore, type CalculateResult } from "@/lib/api";
import { ScoreBadge } from "./ScoreBadge";
import { useSingularity } from "@/lib/singularity";

export default function Calculator() {
  const [unemployment, setUnemployment] = useState(5);
  const [automation, setAutomation] = useState(50);
  const [debt, setDebt] = useState(40000);
  const [salary, setSalary] = useState(55000);
  const [preAi, setPreAi] = useState(3);
  const [result, setResult] = useState<CalculateResult | null>(null);
  const { multiplier } = useSingularity();

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateScore({
        unemployment_rate: unemployment,
        automation_risk: automation,
        avg_debt: debt,
        median_starting_salary: salary,
        unemployment_rate_pre_ai: preAi,
        singularity: multiplier,
      }).then(setResult);
    }, 200);
    return () => clearTimeout(timer);
  }, [unemployment, automation, debt, salary, preAi, multiplier]);

  const sliders = [
    { label: "Unemployment Rate", value: `${unemployment}%`, state: unemployment, set: setUnemployment, min: 0, max: 15, step: 0.1 },
    { label: "Pre-AI Unemployment", value: `${preAi}%`, state: preAi, set: setPreAi, min: 0, max: 10, step: 0.1 },
    { label: "AI Automation Risk (2yr)", value: `${automation}%`, state: automation, set: setAutomation, min: 0, max: 100, step: 1 },
    { label: "Expected Total Debt", value: `$${debt.toLocaleString()}`, state: debt, set: setDebt, min: 0, max: 200000, step: 1000 },
    { label: "Expected Starting Salary", value: `$${salary.toLocaleString()}`, state: salary, set: setSalary, min: 20000, max: 150000, step: 1000 },
  ];

  return (
    <div className="space-y-10">
      {/* Score result — centered at top on mobile, centered overall */}
      <div className="text-center py-6 border border-[var(--border)] rounded-lg">
        {result ? (
          <div className="animate-in fade-in duration-300">
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">
              Your Risk Score
            </div>
            <ScoreBadge score={result.risk_score} color={result.risk_color} size="lg" />
            <div className="mt-3 text-xs text-[var(--muted)] leading-relaxed">
              {result.risk_label}
            </div>
            <div className="mt-3 flex justify-center gap-6 text-[11px] text-[var(--muted)]">
              <span>Debt-to-salary: <span className="font-mono">{(debt / salary).toFixed(2)}x</span></span>
              <span>AI acceleration: <span className="font-mono">{preAi > 0 ? ((unemployment / preAi - 1) * 100).toFixed(0) : 0}%</span></span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <div className="animate-pulse h-3 w-20 bg-gray-100 rounded mx-auto" />
            <div className="animate-pulse h-12 w-20 bg-gray-100 rounded mx-auto" />
            <div className="animate-pulse h-3 w-48 bg-gray-100 rounded mx-auto" />
          </div>
        )}
      </div>

      {/* Sliders */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-3xl mx-auto">
        {sliders.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[var(--muted)]">{item.label}</span>
              <span className="font-mono">{item.value}</span>
            </div>
            <input
              type="range"
              min={item.min}
              max={item.max}
              step={item.step}
              value={item.state}
              onChange={(e) => item.set(Number(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
