"use client";

import { useState, useEffect } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { fetchTrends, type TrendsData, type TrendPoint } from "@/lib/api";
import { useSingularity } from "@/lib/singularity";
import { ChartSkeleton } from "./Skeleton";

export default function TrendChart() {
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const { multiplier } = useSingularity();

  useEffect(() => {
    fetchTrends(multiplier).then(setTrends);
  }, [multiplier]);

  if (!trends) return <ChartSkeleton />;

  const toX = (p: TrendPoint) => `${p.month} ${p.year}`;

  // Get the last historical point — both projection lines start here
  const lastHistorical = trends.historical[trends.historical.length - 1];
  const branchX = toX(lastHistorical);
  const branchY = lastHistorical.unemployment;

  // Build a unified data array with all three series
  // Historical points
  const dataMap = new Map<string, { x: string; historical?: number; projected?: number; agi?: number; label?: string }>();

  for (const p of trends.historical) {
    const x = toX(p);
    dataMap.set(x, { x, historical: p.unemployment, label: p.label });
  }

  // Projected baseline — include branch point so the line connects
  const projWithBranch = [
    { year: lastHistorical.year, month: lastHistorical.month, unemployment: branchY, label: "" },
    ...trends.projected_baseline,
  ];
  for (const p of projWithBranch) {
    const x = toX(p);
    const existing = dataMap.get(x) || { x };
    existing.projected = p.unemployment;
    if (p.label) existing.label = p.label;
    dataMap.set(x, existing);
  }

  // AGI — include branch point
  const agiWithBranch = [
    { year: lastHistorical.year, month: lastHistorical.month, unemployment: branchY, label: "" },
    ...trends.projected_agi,
  ];
  for (const p of agiWithBranch) {
    const x = toX(p);
    const existing = dataMap.get(x) || { x };
    existing.agi = p.unemployment;
    if (p.label) existing.label = p.label;
    dataMap.set(x, existing);
  }

  // Build sort order from all points
  const allPoints = [
    ...trends.historical,
    ...trends.projected_baseline,
    ...trends.projected_agi,
  ];
  const monthOrder: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };
  const toSortKey = (p: { year: string; month: string }) =>
    parseInt(p.year) * 100 + (monthOrder[p.month] || 0);

  const uniqueKeys = [...new Set(allPoints.map(toX))];
  const sortedKeys = uniqueKeys.sort((a, b) => {
    const pa = allPoints.find((p) => toX(p) === a)!;
    const pb = allPoints.find((p) => toX(p) === b)!;
    return toSortKey(pa) - toSortKey(pb);
  });

  const merged = sortedKeys.map((key) => dataMap.get(key)!);

  return (
    <div>
      <div className="h-[350px] md:h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={merged} margin={{ top: 30, right: 10, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="x"
              tick={{ fontSize: 9, fill: "#737373" }}
              interval="preserveStartEnd"
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#737373" }}
              tickLine={false}
              axisLine={false}
              domain={[0, "auto"]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e5e5e5",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              formatter={(value: unknown, name: unknown) => [
                `${value}%`,
                name === "historical"
                  ? "Actual"
                  : name === "projected"
                    ? "Projected (trend)"
                    : "AGI Scenario",
              ]}
            />
            <ReferenceLine
              x="Nov 2022"
              stroke="#111"
              strokeDasharray="3 3"
              label={{
                value: "ChatGPT Launches",
                position: "insideTopRight",
                fontSize: 10,
                fill: "#111",
                offset: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#111111"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#111111"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="agi"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 text-[10px] text-[var(--muted)] uppercase tracking-widest">
        <span className="flex items-center gap-1.5">
          <span className="w-6 h-0.5 bg-[#111] inline-block" /> Actual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-6 inline-block border-t-[1.5px] border-dashed border-[#111]" /> Projected (trend)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-6 inline-block border-t-2 border-dashed border-[#dc2626]" /> AGI Scenario
        </span>
      </div>
      <p className="mt-3 text-[10px] text-[var(--muted)] leading-relaxed">
        {trends.note}
      </p>
    </div>
  );
}
