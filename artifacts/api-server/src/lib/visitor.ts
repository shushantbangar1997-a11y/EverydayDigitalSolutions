import type { Request } from "express";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

const TRI_CITY_KEYWORDS = [
  "chandigarh",
  "mohali",
  "panchkula",
  "zirakpur",
  "ajitgarh",
  "kharar",
  "s.a.s. nagar",
  "sahibzada ajit singh nagar",
];

export function classifyTriCity(city?: string | null, region?: string | null): boolean {
  const text = `${city ?? ""} ${region ?? ""}`.toLowerCase();
  return TRI_CITY_KEYWORDS.some((k) => text.includes(k));
}

export function extractClientIp(req: Request): string | null {
  const fwd = req.headers["x-forwarded-for"];
  const first = Array.isArray(fwd) ? fwd[0] : fwd?.split(",")[0]?.trim();
  const ip = first || req.ip || req.socket.remoteAddress || null;
  if (!ip) return null;
  return ip.replace(/^::ffff:/, "");
}

export interface VisitorContext {
  ip: string | null;
  geo: {
    country: string | null;
    region: string | null;
    city: string | null;
  };
  isTriCity: boolean;
  ua: {
    os: string | null;
    osVersion: string | null;
    browser: string | null;
    browserVersion: string | null;
    deviceType: "mobile" | "tablet" | "desktop";
  };
  userAgent: string | null;
}

export function parseVisitor(req: Request): VisitorContext {
  const ip = extractClientIp(req);
  const geoData = ip ? geoip.lookup(ip) : null;
  const uaString = String(req.headers["user-agent"] ?? "");
  const ua = new UAParser(uaString).getResult();
  const deviceTypeRaw = ua.device.type;
  const deviceType: VisitorContext["ua"]["deviceType"] =
    deviceTypeRaw === "mobile"
      ? "mobile"
      : deviceTypeRaw === "tablet"
        ? "tablet"
        : "desktop";

  const country = geoData?.country ?? null;
  const region = geoData?.region ?? null;
  const city = geoData?.city ?? null;

  return {
    ip,
    geo: { country, region, city },
    isTriCity: classifyTriCity(city, region),
    ua: {
      os: ua.os.name ?? null,
      osVersion: ua.os.version ?? null,
      browser: ua.browser.name ?? null,
      browserVersion: ua.browser.version ?? null,
      deviceType,
    },
    userAgent: uaString || null,
  };
}

export function safeReferrerHost(referrer?: string | null): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
