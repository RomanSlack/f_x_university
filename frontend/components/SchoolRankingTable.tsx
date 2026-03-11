"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import { fetchSchools, fetchSchoolCategories, fetchSchoolStates, type SchoolData } from "@/lib/api";
import { ScoreBadge } from "./ScoreBadge";
import { useSingularity } from "@/lib/singularity";
import { TableSkeleton } from "./Skeleton";

type SortField =
  | "school_score"
  | "name"
  | "avg_debt"
  | "median_salary_10yr"
  | "graduation_rate"
  | "pct_stem"
  | "in_state_tuition";

export default function SchoolRankingTable() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeState, setActiveState] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("school_score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const { multiplier } = useSingularity();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSchools({ singularity: multiplier }),
      fetchSchoolCategories(),
      fetchSchoolStates(),
    ]).then(([s, c, st]) => {
      setSchools(s);
      setCategories(c);
      setStates(st);
      setLoading(false);
    });
  }, [multiplier]);

  // Global rank map: slug -> rank (always by school_score desc, regardless of filters)
  const globalRankMap = useMemo(() => {
    const sorted = [...schools].sort((a, b) => b.school_score - a.school_score);
    const map = new Map<string, number>();
    sorted.forEach((s, i) => map.set(s.slug, i + 1));
    return map;
  }, [schools]);

  const filtered = useMemo(() => {
    let result = [...schools];
    if (activeCategory) {
      result = result.filter((s) => s.category === activeCategory);
    }
    if (activeState) {
      result = result.filter((s) => s.state === activeState);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.state.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc"
        ? ((aVal as number) ?? 0) - ((bVal as number) ?? 0)
        : ((bVal as number) ?? 0) - ((aVal as number) ?? 0);
    });
    return result;
  }, [schools, activeCategory, activeState, search, sortField, sortOrder]);

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

  function DetailRow({ school }: { school: SchoolData }) {
    const b = school.score_breakdown;
    return (
      <div className="text-[11px] text-[var(--muted)] py-4 px-4 bg-[var(--card)] border-b border-[var(--border)] space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">Debt/Salary</div>
            <div className="font-mono text-sm text-[var(--foreground)]">{b.debt_salary}<span className="text-[var(--muted)]">/100</span></div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">AI Readiness</div>
            <div className="font-mono text-sm text-[var(--foreground)]">{b.ai_readiness}<span className="text-[var(--muted)]">/100</span></div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">Network</div>
            <div className="font-mono text-sm text-[var(--foreground)]">{b.network}<span className="text-[var(--muted)]">/100</span></div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">Employability</div>
            <div className="font-mono text-sm text-[var(--foreground)]">{b.employability}<span className="text-[var(--muted)]">/100</span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-[var(--border)]">
          {school.admission_rate !== null && (
            <div><span className="font-medium">Acceptance:</span> {(school.admission_rate * 100).toFixed(1)}%</div>
          )}
          <div><span className="font-medium">Enrollment:</span> {school.enrollment.toLocaleString()}</div>
          <div><span className="font-medium">Control:</span> {school.control}</div>
          <div>
            <span className="font-medium">AI Program:</span>{" "}
            {school.has_ai_program ? "Yes" : "No"}
            {school.research_tier > 0 && ` - R${school.research_tier === 3 ? "1" : school.research_tier === 2 ? "2" : ""} Research`}
          </div>
        </div>
        {school.source_notes && (
          <div className="pt-2 border-t border-[var(--border)]">
            <span className="font-medium">Source:</span> {school.source_notes}
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
          placeholder="Search any school, city, or state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-b border-[var(--border)] bg-transparent px-0 py-3 text-lg focus:outline-none focus:border-[var(--foreground)] transition-colors placeholder:text-[var(--muted)]"
        />
        <div className="flex flex-wrap gap-2 items-center">
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
          <span className="w-px h-4 bg-[var(--border)] mx-1" />
          <select
            value={activeState || ""}
            onChange={(e) => setActiveState(e.target.value || null)}
            className="text-xs uppercase tracking-widest text-[var(--muted)] bg-transparent border-b border-[var(--border)] py-1 focus:outline-none focus:border-[var(--foreground)]"
          >
            <option value="">All States</option>
            {states.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block max-h-[70vh] overflow-y-auto border border-[var(--border)] rounded-lg">
        <table className="w-full">
          <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_var(--border)]">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-[var(--muted)] w-12">#</th>
              <SortHeader field="name" label="School" />
              <SortHeader field="school_score" label="Score" />
              <SortHeader field="avg_debt" label="Avg Debt" />
              <SortHeader field="median_salary_10yr" label="Salary (10yr)" />
              <SortHeader field="graduation_rate" label="Grad Rate" />
              <SortHeader field="pct_stem" label="% STEM" />
              <SortHeader field="in_state_tuition" label="Tuition" />
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <Fragment key={s.slug}>
                <tr
                  className={`border-b border-[var(--border)] hover:bg-[var(--card)] transition-colors cursor-pointer ${i === 0 ? "sticky top-[45px] bg-white z-[5] shadow-[0_1px_0_var(--border)]" : ""}`}
                  onClick={() => setExpandedSlug(expandedSlug === s.slug ? null : s.slug)}
                >
                  <td className="px-4 py-3 text-[var(--muted)] text-sm tabular-nums">{globalRankMap.get(s.slug) ?? i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest">{s.city}, {s.state} - {s.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={s.school_score} color={s.school_color} size="sm" />
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--muted)]">${s.avg_debt.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--muted)]">{s.median_salary_10yr > 0 ? `$${s.median_salary_10yr.toLocaleString()}` : "N/A"}</td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--muted)]">{(s.graduation_rate * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--muted)]">{(s.pct_stem * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--muted)]">${s.in_state_tuition.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[var(--muted)] text-xs">
                    {expandedSlug === s.slug ? "−" : "+"}
                  </td>
                </tr>
                {expandedSlug === s.slug && (
                  <tr key={`${s.slug}-detail`}>
                    <td colSpan={9}>
                      <DetailRow school={s} />
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
        {filtered.map((s, i) => (
          <div
            key={s.slug}
            className="py-4 cursor-pointer active:bg-[var(--card)] transition-colors"
            onClick={() => setExpandedSlug(expandedSlug === s.slug ? null : s.slug)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[var(--muted)] text-xs tabular-nums mr-2">{globalRankMap.get(s.slug) ?? i + 1}</span>
                <span className="text-sm font-medium">{s.name}</span>
                <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mt-0.5">{s.city}, {s.state}</div>
              </div>
              <div className="flex items-center gap-2">
                <ScoreBadge score={s.school_score} color={s.school_color} size="sm" />
                <span className="text-[var(--muted)] text-xs">{expandedSlug === s.slug ? "−" : "+"}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-[11px] mt-3">
              <div>
                <div className="text-[var(--muted)]">Debt</div>
                <div className="font-mono">${(s.avg_debt / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div className="text-[var(--muted)]">Salary</div>
                <div className="font-mono">{s.median_salary_10yr > 0 ? `$${(s.median_salary_10yr / 1000).toFixed(0)}k` : "N/A"}</div>
              </div>
              <div>
                <div className="text-[var(--muted)]">Grad</div>
                <div className="font-mono">{(s.graduation_rate * 100).toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-[var(--muted)]">STEM</div>
                <div className="font-mono">{(s.pct_stem * 100).toFixed(0)}%</div>
              </div>
            </div>
            {expandedSlug === s.slug && <DetailRow school={s} />}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-[11px] text-[var(--muted)] uppercase tracking-widest">
        {filtered.length} of {schools.length} schools - click any row for score breakdown
      </div>
    </div>
  );
}
