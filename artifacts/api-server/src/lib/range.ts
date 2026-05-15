import type { Request } from "express";

export type Range = "today" | "7d" | "30d" | "all";

export function parseRange(req: Request): Range {
  const r = req.query.range;
  if (r === "today" || r === "7d" || r === "30d" || r === "all") return r;
  return "7d";
}

export function rangeStart(range: Range): Date | null {
  const now = new Date();
  if (range === "all") return null;
  if (range === "today") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const days = range === "7d" ? 7 : 30;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}
