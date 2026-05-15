import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch, type SourcesData, type Range } from "@/lib/admin-fetch";
import { BarRow, RangeTabs } from "./AdminCharts";

export function SourcesView() {
  const [range, setRange] = useState<Range>("30d");
  const q = useQuery({
    queryKey: ["admin", "sources", range],
    queryFn: () => adminFetch<SourcesData>(`/api/admin/sources?range=${range}`),
  });

  if (q.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading sources…</p>;
  }
  if (!q.data) {
    return <p className="text-sm text-destructive">Failed to load.</p>;
  }
  const d = q.data;
  const refMax = Math.max(1, ...d.referrers.map((r) => r.sessions));
  const campMax = Math.max(1, ...d.utmCampaigns.map((r) => r.sessions));
  const utmSrcMax = Math.max(1, ...d.utmSources.map((r) => r.sessions));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Sources</h2>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Referrers</h3>
        {d.referrers.map((r) => (
          <BarRow
            key={r.host}
            label={r.host}
            value={r.sessions}
            max={refMax}
            accent={r.host.includes("instagram") || r.host === "ig"}
            rightLabel={`${r.visitors} v · ${r.sessions} s`}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">
            UTM campaigns
          </h3>
          {d.utmCampaigns.length === 0 ? (
            <p className="text-xs text-muted-foreground">No campaigns yet.</p>
          ) : (
            d.utmCampaigns.map((c) => (
              <BarRow
                key={c.campaign}
                label={c.campaign}
                value={c.sessions}
                max={campMax}
                rightLabel={`${c.sessions} · ${c.leads} leads`}
              />
            ))
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">
            UTM sources
          </h3>
          {d.utmSources.length === 0 ? (
            <p className="text-xs text-muted-foreground">No data.</p>
          ) : (
            d.utmSources.map((s) => (
              <BarRow
                key={s.source}
                label={s.source}
                value={s.sessions}
                max={utmSrcMax}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
