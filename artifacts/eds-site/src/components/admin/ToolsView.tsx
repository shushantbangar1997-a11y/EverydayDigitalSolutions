import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch, type ToolsData, type Range } from "@/lib/admin-fetch";
import { BarRow, RangeTabs } from "./AdminCharts";

const TOOL_LABELS: Record<string, string> = {
  app_cost: "App Cost Calculator",
  voice_roi: "Voice Agent ROI",
};

function inr(n: number | null): string {
  if (n == null) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

export function ToolsView() {
  const [range, setRange] = useState<Range>("30d");
  const q = useQuery({
    queryKey: ["admin", "tools", range],
    queryFn: () => adminFetch<ToolsData>(`/api/admin/tools?range=${range}`),
  });

  if (q.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading tool analytics…</p>;
  }
  if (!q.data) {
    return <p className="text-sm text-destructive">Failed to load.</p>;
  }
  const d = q.data;
  const runsMax = Math.max(1, ...d.perTool.map((r) => r.runs));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Tool analytics</h2>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Runs per tool
        </h3>
        {d.perTool.length === 0 ? (
          <p className="text-xs text-muted-foreground">No tool runs yet.</p>
        ) : (
          d.perTool.map((t) => {
            const completion =
              t.runs > 0 ? Math.round((t.completed / t.runs) * 100) : 0;
            return (
              <BarRow
                key={t.tool}
                label={TOOL_LABELS[t.tool] ?? t.tool}
                value={t.runs}
                max={runsMax}
                rightLabel={`${t.runs} runs · ${completion}% complete`}
              />
            );
          })
        )}
      </div>

      {d.quoteStats.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Quote value distribution
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left py-2 pr-3">Tool</th>
                  <th className="text-right py-2 px-3">Min</th>
                  <th className="text-right py-2 px-3">Median</th>
                  <th className="text-right py-2 px-3">Avg</th>
                  <th className="text-right py-2 px-3">Max</th>
                  <th className="text-right py-2 pl-3">Runs</th>
                </tr>
              </thead>
              <tbody>
                {d.quoteStats.map((q) => (
                  <tr key={q.tool} className="border-b border-border last:border-0">
                    <td className="py-2 pr-3 font-medium">
                      {TOOL_LABELS[q.tool] ?? q.tool}
                    </td>
                    <td className="text-right py-2 px-3 tabular-nums">{inr(q.min_quote)}</td>
                    <td className="text-right py-2 px-3 tabular-nums">{inr(q.median_quote)}</td>
                    <td className="text-right py-2 px-3 tabular-nums">{inr(q.avg_quote)}</td>
                    <td className="text-right py-2 px-3 tabular-nums">{inr(q.max_quote)}</td>
                    <td className="text-right py-2 pl-3 tabular-nums">{q.total_runs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {d.completionRate.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Tool → Lead conversion
          </h3>
          {d.completionRate.map((c) => {
            const conv = c.runs > 0 ? Math.round((c.with_lead / c.runs) * 100) : 0;
            return (
              <div
                key={c.tool}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="text-foreground">
                  {TOOL_LABELS[c.tool] ?? c.tool}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {c.with_lead}/{c.runs} runs → {conv}% became leads
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
