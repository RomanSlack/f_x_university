"use client";

import { useSingularity } from "@/lib/singularity";

export default function SingularityToggle() {
  const { multiplier, setMultiplier, isActive } = useSingularity();

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all ${isActive ? "scale-105" : ""}`}>
      <div
        className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-colors ${
          isActive
            ? "border-[var(--critical)] bg-white/95"
            : "border-[var(--border)] bg-white/90"
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setMultiplier(isActive ? 1.0 : 2.0)}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              isActive ? "bg-[var(--critical)]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                isActive ? "left-5" : "left-0.5"
              }`}
            />
          </button>
          <span className={`text-xs font-medium uppercase tracking-widest ${isActive ? "text-[var(--critical)]" : "text-[var(--muted)]"}`}>
            {isActive ? "AGI Mode" : "Baseline"}
          </span>
        </div>
        {isActive && (
          <div className="space-y-1">
            <input
              type="range"
              min={1.5}
              max={5.0}
              step={0.5}
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="w-32"
            />
            <div className="text-[10px] text-[var(--muted)] font-mono text-center">
              {multiplier}x acceleration
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
