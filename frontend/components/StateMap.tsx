"use client";

import { useState, useEffect, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { fetchSchools, type SchoolData } from "@/lib/api";
import { useSingularity } from "@/lib/singularity";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// FIPS code -> state abbreviation
const FIPS_TO_STATE: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
  "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
  "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
  "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
  "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
  "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
  "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
  "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
  "56": "WY",
};

interface StateStats {
  avg: number;
  count: number;
  best: SchoolData;
  worst: SchoolData;
}

function scoreToColor(score: number): string {
  // Map 0-100 score to our color scale (higher = better for schools)
  if (score >= 60) return "var(--safe)";
  if (score >= 52) return "var(--low)";
  if (score >= 45) return "var(--moderate)";
  if (score >= 38) return "var(--high)";
  return "var(--critical)";
}

function scoreToFill(score: number): string {
  // More granular opacity-based fill for the map
  if (score >= 60) return "#22c55e";
  if (score >= 55) return "#6ee7a0";
  if (score >= 50) return "#a3e635";
  if (score >= 47) return "#facc15";
  if (score >= 44) return "#fb923c";
  if (score >= 40) return "#f87171";
  return "#ef4444";
}

export default function StateMap() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [tooltip, setTooltip] = useState<{ state: string; stats: StateStats; x: number; y: number } | null>(null);
  const { multiplier } = useSingularity();

  useEffect(() => {
    fetchSchools({ singularity: multiplier }).then(setSchools);
  }, [multiplier]);

  const stateData = useMemo(() => {
    const map = new Map<string, SchoolData[]>();
    for (const s of schools) {
      if (!map.has(s.state)) map.set(s.state, []);
      map.get(s.state)!.push(s);
    }
    const stats = new Map<string, StateStats>();
    for (const [state, list] of map) {
      const sorted = [...list].sort((a, b) => b.school_score - a.school_score);
      stats.set(state, {
        avg: Math.round(sorted.reduce((sum, s) => sum + s.school_score, 0) / sorted.length * 10) / 10,
        count: sorted.length,
        best: sorted[0],
        worst: sorted[sorted.length - 1],
      });
    }
    return stats;
  }, [schools]);

  if (schools.length === 0) {
    return (
      <div className="h-[300px] md:h-[420px] bg-gray-50 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="relative">
      <div className="w-full">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1000 }}
          width={800}
          height={500}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const fips = geo.id;
                const stateAbbr = FIPS_TO_STATE[fips] || "";
                const stats = stateData.get(stateAbbr);
                const fill = stats ? scoreToFill(stats.avg) : "#e5e7eb";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#111", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={(e) => {
                      if (stats) {
                        const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                        setTooltip({
                          state: stateAbbr,
                          stats,
                          x: e.clientX - (rect?.left ?? 0),
                          y: e.clientY - (rect?.top ?? 0),
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none bg-white border border-[var(--border)] shadow-lg rounded-lg px-4 py-3 text-xs max-w-[220px]"
          style={{
            left: Math.min(tooltip.x + 12, (typeof window !== "undefined" ? window.innerWidth * 0.7 : 500)),
            top: tooltip.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="font-semibold text-sm mb-1.5">{tooltip.state}</div>
          <div className="space-y-1 text-[var(--muted)]">
            <div className="flex justify-between gap-4">
              <span>Avg Score</span>
              <span className="font-mono" style={{ color: scoreToColor(tooltip.stats.avg) }}>
                {tooltip.stats.avg}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Schools</span>
              <span className="font-mono">{tooltip.stats.count}</span>
            </div>
            <div className="pt-1 border-t border-[var(--border)]">
              <div className="text-[10px] uppercase tracking-widest mb-0.5">Best</div>
              <div className="text-[var(--foreground)] truncate">{tooltip.stats.best.name}</div>
              <div className="font-mono" style={{ color: scoreToColor(tooltip.stats.best.school_score) }}>
                {tooltip.stats.best.school_score}
              </div>
            </div>
            <div className="pt-1 border-t border-[var(--border)]">
              <div className="text-[10px] uppercase tracking-widest mb-0.5">Worst</div>
              <div className="text-[var(--foreground)] truncate">{tooltip.stats.worst.name}</div>
              <div className="font-mono" style={{ color: scoreToColor(tooltip.stats.worst.school_score) }}>
                {tooltip.stats.worst.school_score}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 mt-4">
        <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] mr-2">Overpriced</span>
        {["#ef4444", "#f87171", "#fb923c", "#facc15", "#a3e635", "#6ee7a0", "#22c55e"].map((c) => (
          <div key={c} className="w-6 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] ml-2">Worth It</span>
      </div>
    </div>
  );
}
