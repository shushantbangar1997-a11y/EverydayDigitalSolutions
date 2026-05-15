interface BarRowProps {
  label: string;
  value: number;
  max: number;
  rightLabel?: string;
  accent?: boolean;
}

export function BarRow({ label, value, max, rightLabel, accent }: BarRowProps) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span
        className={`flex-1 truncate text-sm ${accent ? "text-primary font-medium" : "text-foreground"}`}
        title={label}
      >
        {label}
      </span>
      <div className="flex-[2] h-2 rounded-full bg-muted/60 overflow-hidden">
        <div
          className={`h-full rounded-full ${accent ? "bg-primary" : "bg-zinc-400 dark:bg-zinc-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums w-16 text-right">
        {rightLabel ?? value.toLocaleString()}
      </span>
    </div>
  );
}

interface SparkLineProps {
  data: { day: string; visitors: number; sessions: number }[];
  height?: number;
}

export function SparkLine({ data, height = 120 }: SparkLineProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }
  const max = Math.max(1, ...data.map((d) => Math.max(d.visitors, d.sessions)));
  const w = 600;
  const h = height;
  const stepX = data.length > 1 ? w / (data.length - 1) : 0;
  const toY = (v: number) => h - 10 - ((v / max) * (h - 20));
  const visitorsPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${i * stepX},${toY(d.visitors)}`)
    .join(" ");
  const sessionsPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${i * stepX},${toY(d.sessions)}`)
    .join(" ");

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: `${h}px` }}
      >
        <path
          d={sessionsPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-zinc-400 dark:text-zinc-500"
        />
        <path
          d={visitorsPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="text-primary"
        />
      </svg>
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{data[0]?.day ?? ""}</span>
        <span>{data[data.length - 1]?.day ?? ""}</span>
      </div>
      <div className="flex gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-primary"></span>
          <span className="text-muted-foreground">Visitors</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-zinc-400 dark:bg-zinc-500"></span>
          <span className="text-muted-foreground">Sessions</span>
        </span>
      </div>
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: number | string;
  hint?: string;
  accent?: boolean;
}

export function KpiCard({ label, value, hint, accent }: KpiCardProps) {
  return (
    <div
      className={`rounded-2xl p-4 border ${
        accent
          ? "bg-primary/5 border-primary/20"
          : "bg-card border-border"
      }`}
    >
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          accent ? "text-primary" : "text-foreground"
        }`}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

interface RangeTabsProps {
  value: "today" | "7d" | "30d" | "all";
  onChange: (r: "today" | "7d" | "30d" | "all") => void;
}

export function RangeTabs({ value, onChange }: RangeTabsProps) {
  const options: { value: typeof value; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "7d", label: "7d" },
    { value: "30d", label: "30d" },
    { value: "all", label: "All" },
  ];
  return (
    <div className="inline-flex bg-muted/40 rounded-full p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            value === o.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
