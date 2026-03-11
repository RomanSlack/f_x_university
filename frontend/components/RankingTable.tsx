"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import { fetchMajors, fetchCategories, type MajorData } from "@/lib/api";
import { ScoreBadge } from "./ScoreBadge";
import { useSingularity } from "@/lib/singularity";
import { TableSkeleton } from "./Skeleton";

type SortField =
  | "risk_score"
  | "name"
  | "unemployment_rate"
  | "automation_risk"
  | "avg_debt"
  | "median_starting_salary";

export default function RankingTable() {
  const [majors, setMajors] = useState<MajorData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("risk_score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const { multiplier } = useSingularity();

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMajors({ singularity: multiplier }), fetchCategories()]).then(([m, c]) => {
      setMajors(m);
      setCategories(c);
      setLoading(false);
    });
  }, [multiplier]);

  // Global rank map: slug -> rank (always by risk_score desc, regardless of filters)
  const globalRankMap = useMemo(() => {
    const sorted = [...majors].sort((a, b) => b.risk_score - a.risk_score);
    const map = new Map<string, number>();
    sorted.forEach((m, i) => map.set(m.slug, i + 1));
    return map;
  }, [majors]);

  const filtered = useMemo(() => {
    let result = [...majors];
    if (activeCategory) {
      result = result.filter((m) => m.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return result;
  }, [majors, activeCategory, search, sortField, sortOrder]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  }

  function SortHeader({ field, label }: { field: SortField; label: string }) {
    const active = sortField === field;
    return (
      <th
        className={`px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest cursor-pointer select-none transition-colors ${active ? "text-[var(--foreground)]" : "text-[var(--muted)]"} hover:text-[var(--foreground)]`}
        onClick={() => toggleSort(field)}
      >
        {label}
        {active && <span className="ml-1">{sortOrder === "desc" ? "↓" : "↑"}</span>}
      </th>
    );
  }

  function SourceRow({ major }: { major: MajorData }) {
    return (
      <div className="text-[10px] text-[var(--muted)] space-y-1 py-3 px-4 bg-[var(--card)] border-b border-[var(--border)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {major.source_unemployment && (
            <div><span className="font-medium">Unemployment:</span> {major.source_unemployment}</div>
          )}
          {major.source_automation && (
            <div><span className="font-medium">AI Risk:</span> {major.source_automation}</div>
          )}
          {major.source_debt && (
            <div><span className="font-medium">Debt:</span> {major.source_debt}</div>
          )}
          {major.source_salary && (
            <div><span className="font-medium">Salary:</span> {major.source_salary}</div>
          )}
        </div>
        {major.unemployment_rate_pre_ai > 0 && (
          <div className="mt-1 pt-1 border-t border-[var(--border)]">
            Pre-AI unemployment: <span className="font-mono">{major.unemployment_rate_pre_ai}%</span>
            {" → "}Current: <span className="font-mono">{major.unemployment_rate}%</span>
            {" "}({((major.unemployment_rate / major.unemployment_rate_pre_ai - 1) * 100).toFixed(0)}% increase since ChatGPT)
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search any major..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-b border-[var(--border)] bg-transparent px-0 py-3 text-lg focus:outline-none focus:border-[var(--foreground)] transition-colors placeholder:text-[var(--muted)]"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1 text-xs uppercase tracking-widest transition-colors ${!activeCategory ? "text-[var(--foreground)] border-b-2 border-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1 text-xs uppercase tracking-widest transition-colors ${activeCategory === cat ? "text-[var(--foreground)] border-b-2 border-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block max-h-[70vh] overflow-y-auto border border-[var(--border)] rounded-lg">
        <table className="w-full">
          <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_var(--border)]">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-[var(--muted)] w-12">#</th>
              <SortHeader field="name" label="Major" />
              <SortHeader field="risk_score" label="Risk Score" />
              <SortHeader field="unemployment_rate" label="Unemployment" />
              <SortHeader field="automation_risk" label="AI Risk 2yr" />
              <SortHeader field="avg_debt" label="Avg Debt" />
              <SortHeader field="median_starting_salary" label="Salary" />
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <Fragment key={m.slug}>
                <tr
                  className={`border-b border-[var(--border)] hover:bg-[var(--card)] transition-colors cursor-pointer ${i === 0 ? "sticky top-[45px] bg-white z-[5] shadow-[0_1px_0_var(--border)]" : ""}`}
                  onClick={() => setExpandedSlug(expandedSlug === m.slug ? null : m.slug)}
                >
                  <td className="px-4 py-3 text-[var(--muted)] text-sm tabular-nums">{globalRankMap.get(m.slug) ?? i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest">{m.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={m.risk_score} color={m.risk_color} size="sm" />
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--muted)]">{m.unemployment_rate}%</td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--muted)]">{m.automation_risk}%</td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--muted)]">${m.avg_debt.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--muted)]">${m.median_starting_salary.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[var(--muted)] text-xs">
                    {expandedSlug === m.slug ? "−" : "+"}
                  </td>
                </tr>
                {expandedSlug === m.slug && (
                  <tr key={`${m.slug}-sources`}>
                    <td colSpan={8}>
                      <SourceRow major={m} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[var(--border)]">
        {filtered.map((m, i) => (
          <div
            key={m.slug}
            className="py-4 cursor-pointer active:bg-[var(--card)] transition-colors"
            onClick={() => setExpandedSlug(expandedSlug === m.slug ? null : m.slug)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[var(--muted)] text-xs tabular-nums mr-2">{globalRankMap.get(m.slug) ?? i + 1}</span>
                <span className="text-sm font-medium">{m.name}</span>
                <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mt-0.5">{m.category}</div>
              </div>
              <div className="flex items-center gap-2">
                <ScoreBadge score={m.risk_score} color={m.risk_color} size="sm" />
                <span className="text-[var(--muted)] text-xs">{expandedSlug === m.slug ? "−" : "+"}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-[11px] mt-3">
              <div>
                <div className="text-[var(--muted)]">Unemp.</div>
                <div className="font-mono">{m.unemployment_rate}%</div>
              </div>
              <div>
                <div className="text-[var(--muted)]">AI Risk</div>
                <div className="font-mono">{m.automation_risk}%</div>
              </div>
              <div>
                <div className="text-[var(--muted)]">Debt</div>
                <div className="font-mono">${(m.avg_debt / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div className="text-[var(--muted)]">Salary</div>
                <div className="font-mono">${(m.median_starting_salary / 1000).toFixed(0)}k</div>
              </div>
            </div>
            {expandedSlug === m.slug && <SourceRow major={m} />}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-[11px] text-[var(--muted)] uppercase tracking-widest">
        {filtered.length} of {majors.length} majors  - click any row for sources
      </div>
    </div>
  );
}
