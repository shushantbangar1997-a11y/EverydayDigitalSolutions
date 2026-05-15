import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch, type DevicesData, type Range } from "@/lib/admin-fetch";
import { BarRow, RangeTabs } from "./AdminCharts";

export function DevicesView() {
  const [range, setRange] = useState<Range>("30d");
  const q = useQuery({
    queryKey: ["admin", "devices", range],
    queryFn: () => adminFetch<DevicesData>(`/api/admin/devices?range=${range}`),
  });

  if (q.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading devices…</p>;
  }
  if (!q.data) {
    return <p className="text-sm text-destructive">Failed to load.</p>;
  }
  const d = q.data;
  const total = d.deviceTypes.reduce((sum, r) => sum + r.n, 0);
  const browserMax = Math.max(1, ...d.browsers.map((r) => r.n));
  const osMax = Math.max(1, ...d.oses.map((r) => r.n));
  const screenMax = Math.max(1, ...d.screens.map((r) => r.n));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Devices</h2>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {d.deviceTypes.map((t) => {
          const pct = total > 0 ? Math.round((t.n / total) * 100) : 0;
          return (
            <div
              key={t.device_type}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {t.device_type}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {pct}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.n.toLocaleString()} sessions
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Browsers</h3>
          {d.browsers.map((b) => (
            <BarRow
              key={b.browser}
              label={b.browser}
              value={b.n}
              max={browserMax}
            />
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Operating systems
          </h3>
          {d.oses.map((o) => (
            <BarRow key={o.os} label={o.os} value={o.n} max={osMax} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Screen widths
        </h3>
        {d.screens.map((s) => (
          <BarRow
            key={s.bucket}
            label={`${s.bucket}px`}
            value={s.n}
            max={screenMax}
          />
        ))}
      </div>
    </div>
  );
}
