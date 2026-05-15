import { useEffect, useState } from "react";
import type { LiveSession } from "@/lib/admin-fetch";

const API_BASE: string = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function deviceEmoji(t: string | null): string {
  if (t === "mobile") return "📱";
  if (t === "tablet") return "📲";
  return "💻";
}

export function LiveView() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [connected, setConnected] = useState(false);
  const [, force] = useState(0);

  useEffect(() => {
    const es = new EventSource(`${API_BASE}/api/admin/live`, {
      withCredentials: true,
    });
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data) as { sessions: LiveSession[] };
        setSessions(payload.sessions);
      } catch {
        /* ignore parse errors */
      }
    };
    return () => es.close();
  }, []);

  useEffect(() => {
    const i = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Live view</h2>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              connected ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
            }`}
          />
          <span className="text-muted-foreground">
            {connected ? "Streaming" : "Connecting…"} · {sessions.length} active
          </span>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No one on the site right now.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {sessions.map((s) => (
            <div
              key={s.session_id}
              className="px-4 py-3 flex flex-wrap items-center gap-3"
            >
              <span className="text-lg" aria-hidden>
                {deviceEmoji(s.device_type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {s.ip_city || "Unknown"}
                  {s.ip_region && (
                    <span className="text-muted-foreground font-normal">
                      , {s.ip_region}
                    </span>
                  )}
                  {s.is_tri_city && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                      Tri-City
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.current_path ?? "—"} ·{" "}
                  {s.referrer_host ?? "direct"} · {s.browser ?? "?"} on{" "}
                  {s.os ?? "?"}
                </p>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {timeAgo(s.started_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
