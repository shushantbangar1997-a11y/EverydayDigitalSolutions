import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  adminFetch,
  type SessionsListItem,
  type SessionDetail,
  type Range,
} from "@/lib/admin-fetch";
import { RangeTabs } from "./AdminCharts";

export function SessionsView() {
  const [range, setRange] = useState<Range>("7d");
  const [openId, setOpenId] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin", "sessions", range],
    queryFn: () =>
      adminFetch<{ sessions: SessionsListItem[] }>(
        `/api/admin/sessions?range=${range}&limit=100`,
      ),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Sessions</h2>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      {q.isLoading && (
        <p className="text-sm text-muted-foreground">Loading sessions…</p>
      )}
      {q.data?.sessions.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">No sessions yet.</p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {q.data?.sessions.map((s) => (
          <div key={s.id}>
            <button
              type="button"
              onClick={() => setOpenId(openId === s.id ? null : s.id)}
              className="w-full text-left px-4 py-3 flex flex-wrap items-center gap-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  {s.ipCity || "Unknown"}
                  {s.ipRegion && (
                    <span className="text-muted-foreground">, {s.ipRegion}</span>
                  )}
                  {s.isTriCity && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                      Tri-City
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.deviceType ?? "?"} · {s.browser ?? "?"} · {s.os ?? "?"} ·{" "}
                  {s.referrerHost ?? "direct"} · {s.landingPage ?? "—"}
                </p>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {s.pageviewCount} pv · {s.clickCount} clicks
              </div>
              <div className="text-xs text-muted-foreground tabular-nums w-28 text-right">
                {new Date(s.startedAt).toLocaleString("en-IN", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </button>
            {openId === s.id && <SessionTimeline id={s.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionTimeline({ id }: { id: string }) {
  const q = useQuery({
    queryKey: ["admin", "session", id],
    queryFn: () => adminFetch<SessionDetail>(`/api/admin/sessions/${id}`),
  });

  if (q.isLoading) {
    return <div className="px-4 py-3 text-xs text-muted-foreground">Loading timeline…</div>;
  }
  if (!q.data) {
    return <div className="px-4 py-3 text-xs text-destructive">Could not load.</div>;
  }
  const d = q.data;
  const items: { at: string; kind: string; label: string; meta?: string }[] = [];
  for (const pv of d.pageviews) {
    items.push({
      at: pv.enteredAt,
      kind: "pageview",
      label: `📄 ${pv.path}`,
      meta:
        pv.timeOnPageSeconds != null
          ? `${pv.timeOnPageSeconds}s · scrolled ${pv.maxScrollPercent}%`
          : undefined,
    });
  }
  for (const e of d.events) {
    items.push({
      at: e.occurredAt,
      kind: e.type,
      label: `${e.type === "click" ? "👆" : "•"} ${e.element ?? e.type}`,
      meta: e.page ?? undefined,
    });
  }
  for (const r of d.toolRuns) {
    const out = r.output as Record<string, unknown>;
    const qa = typeof out.quoteAmount === "number" ? out.quoteAmount : null;
    items.push({
      at: r.occurredAt,
      kind: "tool",
      label: `🛠 ${r.tool}${qa ? ` · ₹${qa.toLocaleString()}` : ""}`,
      meta: r.completed ? "completed" : "abandoned",
    });
  }
  items.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <div className="px-4 py-3 bg-muted/20">
      <div className="grid sm:grid-cols-2 gap-4 mb-3 text-xs">
        <div>
          <p className="text-muted-foreground">Visitor</p>
          <p className="font-medium">
            {d.visitor?.isReturning ? "Returning" : "New"} · {d.visitor?.totalSessions ?? 1} sessions ·{" "}
            {d.visitor?.totalPageviews ?? 0} total pv
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">UTM</p>
          <p className="font-medium">
            {d.session.utmSource ?? "—"} / {d.session.utmMedium ?? "—"} /{" "}
            {d.session.utmCampaign ?? "—"}
          </p>
        </div>
      </div>
      {d.leads.length > 0 && (
        <div className="mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs">
          🎯 Lead submitted: {d.leads.map((l) => l.name).join(", ")}
        </div>
      )}
      <ol className="space-y-1">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs text-foreground"
          >
            <span className="text-muted-foreground tabular-nums w-14 shrink-0">
              {new Date(it.at).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <span className="flex-1 truncate" title={it.label}>
              {it.label}
            </span>
            {it.meta && (
              <span className="text-muted-foreground shrink-0">{it.meta}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
