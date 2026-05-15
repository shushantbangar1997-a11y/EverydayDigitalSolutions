const API_BASE: string = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

export class AdminApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function adminFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new AdminApiError(res.status, `${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export type Range = "today" | "7d" | "30d" | "all";

export interface AdminLead {
  id: string;
  sessionId: string | null;
  name: string;
  businessName: string | null;
  whatsappNumber: string;
  email: string | null;
  city: string;
  industry: string;
  industryDetails: Record<string, unknown>;
  problem: string;
  currentSolution: string | null;
  goalIn3Months: string;
  budget: string;
  timeline: string;
  status: string;
  notes: string | null;
  whatsappNotificationSent: boolean;
  createdAt: string;
}

export interface LeadListResponse {
  items: AdminLead[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LeadsQueryParams {
  q?: string;
  status?: string;
  industry?: string;
  city?: string;
  budget?: string;
  timeline?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  sort?: "createdAt:desc" | "createdAt:asc";
}

export function buildLeadsQueryString(p: LeadsQueryParams): string {
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.status && p.status !== "all") sp.set("status", p.status);
  if (p.industry) sp.set("industry", p.industry);
  if (p.city) sp.set("city", p.city);
  if (p.budget) sp.set("budget", p.budget);
  if (p.timeline) sp.set("timeline", p.timeline);
  if (p.from) sp.set("from", p.from);
  if (p.to) sp.set("to", p.to);
  if (p.page) sp.set("page", String(p.page));
  if (p.pageSize) sp.set("pageSize", String(p.pageSize));
  if (p.sort) sp.set("sort", p.sort);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export interface DashboardData {
  range: Range;
  kpi: {
    activeNow: number;
    visitorsToday: number;
    sessionsToday: number;
    leadsToday: number;
    toolRunsToday: number;
    visitorsRange: number;
    sessionsRange: number;
  };
  daily: { day: string; visitors: number; sessions: number }[];
  topCities: { city: string; n: number }[];
  topSources: { source: string; n: number }[];
  topPages: { page: string; n: number }[];
}

export interface LiveSession {
  session_id: string;
  visitor_id: string;
  ip_city: string | null;
  ip_region: string | null;
  ip_country: string | null;
  is_tri_city: boolean;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  referrer_host: string | null;
  started_at: string;
  current_path: string | null;
}

export interface SessionsListItem {
  id: string;
  startedAt: string;
  ipCity: string | null;
  ipRegion: string | null;
  isTriCity: boolean;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  referrerHost: string | null;
  landingPage: string | null;
  exitPage: string | null;
  pageviewCount: number;
  clickCount: number;
  bounced: boolean;
}

export interface SessionDetail {
  session: {
    id: string;
    visitorId: string;
    startedAt: string;
    endedAt: string | null;
    durationSeconds: number | null;
    ipCity: string | null;
    ipRegion: string | null;
    ipCountry: string | null;
    isTriCity: boolean;
    deviceType: string | null;
    browser: string | null;
    os: string | null;
    referrer: string | null;
    referrerHost: string | null;
    landingPage: string | null;
    exitPage: string | null;
    pageviewCount: number;
    clickCount: number;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
  };
  visitor: {
    id: string;
    firstSeenAt: string;
    lastSeenAt: string;
    totalSessions: number;
    totalPageviews: number;
    isReturning: boolean;
  } | null;
  pageviews: {
    id: number;
    path: string;
    title: string | null;
    enteredAt: string;
    leftAt: string | null;
    timeOnPageSeconds: number | null;
    maxScrollPercent: number;
  }[];
  events: {
    id: number;
    pageviewId: number | null;
    occurredAt: string;
    type: string;
    element: string | null;
    page: string | null;
    metadata: Record<string, unknown>;
  }[];
  toolRuns: {
    id: number;
    tool: string;
    occurredAt: string;
    inputs: Record<string, unknown>;
    output: Record<string, unknown>;
    completed: boolean;
  }[];
  leads: {
    id: string;
    name: string;
    whatsappNumber: string;
    email: string | null;
    status: string;
    createdAt: string;
  }[];
}

export interface GeographyData {
  range: Range;
  cities: {
    city: string;
    region: string | null;
    country: string | null;
    visitors: number;
    sessions: number;
    is_tri_city: boolean;
  }[];
  triCitySummary: { bucket: string; visitors: number; sessions: number }[];
}

export interface DevicesData {
  range: Range;
  deviceTypes: { device_type: string; n: number }[];
  browsers: { browser: string; n: number }[];
  oses: { os: string; n: number }[];
  screens: { bucket: string; n: number }[];
}

export interface SourcesData {
  range: Range;
  referrers: { host: string; visitors: number; sessions: number }[];
  utmCampaigns: { campaign: string; sessions: number; leads: number }[];
  utmSources: { source: string; sessions: number }[];
}

export interface ToolsData {
  range: Range;
  perTool: { tool: string; runs: number; completed: number }[];
  perDay: { day: string; tool: string; runs: number }[];
  quoteStats: {
    tool: string;
    min_quote: number | null;
    max_quote: number | null;
    avg_quote: number | null;
    median_quote: number | null;
    total_runs: number;
  }[];
  completionRate: { tool: string; runs: number; with_lead: number }[];
}
