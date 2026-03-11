const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface MajorData {
  id: number;
  slug: string;
  name: string;
  category: string;
  unemployment_rate: number;
  unemployment_rate_pre_ai: number;
  automation_risk: number;
  avg_debt: number;
  median_starting_salary: number;
  risk_score: number;
  risk_label: string;
  risk_color: string;
  source_unemployment: string | null;
  source_automation: string | null;
  source_debt: string | null;
  source_salary: string | null;
  source_notes: string | null;
  updated_at: string | null;
}

export interface StatsData {
  total_majors: number;
  average_score: number;
  critical_count: number;
  worst_5: MajorData[];
  best_5: MajorData[];
}

export interface CalculateResult {
  risk_score: number;
  risk_label: string;
  risk_color: string;
}

export interface TrendPoint {
  year: string;
  month: string;
  unemployment: number;
  label: string;
}

export interface TrendsData {
  historical: TrendPoint[];
  projected_baseline: TrendPoint[];
  projected_agi: TrendPoint[];
  source: string;
  note: string;
}

export async function fetchMajors(params?: {
  sort?: string;
  order?: string;
  category?: string;
  q?: string;
  singularity?: number;
}): Promise<MajorData[]> {
  const searchParams = new URLSearchParams();
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.order) searchParams.set("order", params.order);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.q) searchParams.set("q", params.q);
  if (params?.singularity) searchParams.set("singularity", String(params.singularity));

  const res = await fetch(`${API_URL}/api/majors?${searchParams.toString()}`);
  return res.json();
}

export async function fetchStats(singularity?: number): Promise<StatsData> {
  const params = singularity ? `?singularity=${singularity}` : "";
  const res = await fetch(`${API_URL}/api/stats${params}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/categories`);
  return res.json();
}

export async function calculateScore(params: {
  unemployment_rate: number;
  automation_risk: number;
  avg_debt: number;
  median_starting_salary: number;
  unemployment_rate_pre_ai?: number;
  singularity?: number;
}): Promise<CalculateResult> {
  const res = await fetch(`${API_URL}/api/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function fetchTrends(singularity?: number): Promise<TrendsData> {
  const params = singularity ? `?singularity=${singularity}` : "";
  const res = await fetch(`${API_URL}/api/trends${params}`);
  return res.json();
}
