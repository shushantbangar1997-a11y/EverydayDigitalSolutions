import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch, type DashboardData, type Range } from "@/lib/admin-fetch";
import { BarRow, SparkLine, KpiCard, RangeTabs } from "./AdminCharts";

export function DashboardView() {
  const [range, setRange] = useState<Range>("7d");
  const q = useQuery({
    queryKey: ["admin", "dashboard", range],
    queryFn: () => adminFetch<DashboardData>(`/api/admin/dashboard?range=${range}`),
    refetchInterval: 15000,
  });

  if (q.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;
  }
  if (q.isError || !q.data) {
    return <p className="text-sm text-destructive">Failed to load dashboard.</p>;
  }
  const d = q.data;

  const topCityMax = Math.max(1, ...d.topCities.map((c) => c.n));
  const topSourceMax = Math.max(1, ...d.topSources.map((s) => s.n));
  const topPageMax = Math.max(1, ...d.topPages.map((p) => p.n));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Dashboard</h2>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active now" value={d.kpi.activeNow} accent />
        <KpiCard label="Visitors today" value={d.kpi.visitorsToday} />
        <KpiCard label="Leads today" value={d.kpi.leadsToday} />
        <KpiCard label="Tool runs today" value={d.kpi.toolRunsToday} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Last 7 days
        </h3>
        <SparkLine
          data={d.daily.map((row) => ({
            day: new Date(row.day).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            }),
            visitors: row.visitors,
            sessions: row.sessions,
          }))}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Top cities
          </h3>
          {d.topCities.length === 0 && (
            <p className="text-xs text-muted-foreground">No data.</p>
          )}
          {d.topCities.map((c) => (
            <BarRow
              key={c.city}
              label={c.city}
              value={c.n}
              max={topCityMax}
              accent={["Chandigarh", "Mohali", "Panchkula"].some((tc) =>
                c.city.toLowerCase().includes(tc.toLowerCase()),
              )}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Top sources
          </h3>
          {d.topSources.length === 0 && (
            <p className="text-xs text-muted-foreground">No data.</p>
          )}
          {d.topSources.map((s) => (
            <BarRow
              key={s.source}
              label={s.source}
              value={s.n}
              max={topSourceMax}
              accent={
                s.source.includes("instagram") || s.source.includes("ig")
              }
            />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Top landing pages
          </h3>
          {d.topPages.length === 0 && (
            <p className="text-xs text-muted-foreground">No data.</p>
          )}
          {d.topPages.map((p) => (
            <BarRow
              key={p.page}
              label={p.page}
              value={p.n}
              max={topPageMax}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
