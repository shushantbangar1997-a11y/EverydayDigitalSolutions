import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch, type GeographyData, type Range } from "@/lib/admin-fetch";
import { BarRow, RangeTabs } from "./AdminCharts";

export function GeographyView() {
  const [range, setRange] = useState<Range>("30d");
  const q = useQuery({
    queryKey: ["admin", "geography", range],
    queryFn: () => adminFetch<GeographyData>(`/api/admin/geography?range=${range}`),
  });

  if (q.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading geography…</p>;
  }
  if (!q.data) {
    return <p className="text-sm text-destructive">Failed to load.</p>;
  }
  const d = q.data;
  const triMax = Math.max(1, ...d.triCitySummary.map((b) => b.visitors));
  const cityMax = Math.max(1, ...d.cities.slice(0, 20).map((c) => c.visitors));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Geography</h2>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Tri-City breakdown
        </h3>
        {d.triCitySummary.length === 0 ? (
          <p className="text-xs text-muted-foreground">No data.</p>
        ) : (
          d.triCitySummary.map((b) => (
            <BarRow
              key={b.bucket}
              label={b.bucket}
              value={b.visitors}
              max={triMax}
              accent={b.bucket !== "Other"}
              rightLabel={`${b.visitors} visitors · ${b.sessions} sessions`}
            />
          ))
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">
          All cities
        </h3>
        {d.cities.length === 0 ? (
          <p className="text-xs text-muted-foreground">No data.</p>
        ) : (
          d.cities.slice(0, 30).map((c) => (
            <BarRow
              key={c.city + (c.region ?? "")}
              label={`${c.city}${c.region ? `, ${c.region}` : ""}${c.country ? ` (${c.country})` : ""}`}
              value={c.visitors}
              max={cityMax}
              accent={c.is_tri_city}
              rightLabel={`${c.visitors} / ${c.sessions}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
