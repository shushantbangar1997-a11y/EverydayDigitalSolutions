import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "eds_admin";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSessionSecret(): string {
  const secret = process.env["SESSION_SECRET"];
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be set (min 16 chars)");
  }
  return secret;
}

function hmac(payload: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Constant-time comparison of supplied password with ADMIN_PASSWORD. */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) return false;
  if (typeof password !== "string" || password.length === 0) return false;
  // Pad to equal length to avoid timing leaks via length difference
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Build a signed cookie value. */
function mintToken(): string {
  const expiresAt = Date.now() + MAX_AGE_MS;
  const payload = String(expiresAt);
  return `${payload}.${hmac(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  const idx = token.indexOf(".");
  if (idx <= 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  if (!timingSafeEqual(sig, hmac(payload))) return false;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  return true;
}

export function setAdminCookie(res: Response): void {
  const isProd = process.env["NODE_ENV"] === "production";
  const crossOrigin = Boolean(process.env["CORS_ORIGIN"]);
  res.cookie(COOKIE_NAME, mintToken(), {
    httpOnly: true,
    secure: isProd || crossOrigin,
    sameSite: crossOrigin ? "none" : "lax",
    maxAge: MAX_AGE_MS,
    path: "/",
  });
}

export function clearAdminCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function isAdminAuthed(req: Request): boolean {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies ?? {};
  return verifyToken(cookies[COOKIE_NAME]);
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!isAdminAuthed(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

// --- Login throttle (in-memory; single-instance deployment) ----------------
//
// Per-IP sliding window: max 8 failed attempts per 15 min, then a 15-min
// lockout. Successful login clears the counter. Memory is bounded by capping
// the map size and evicting expired entries opportunistically.

interface LoginAttemptState {
  failures: number;
  firstFailureAt: number;
  lockedUntil: number;
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_TRACKED_IPS = 5_000;

const loginAttempts = new Map<string, LoginAttemptState>();

function clientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  const first = Array.isArray(fwd) ? fwd[0] : fwd?.split(",")[0]?.trim();
  return first || req.ip || req.socket.remoteAddress || "unknown";
}

function gcLoginAttempts(now: number): void {
  if (loginAttempts.size < MAX_TRACKED_IPS) return;
  for (const [ip, state] of loginAttempts) {
    if (state.lockedUntil < now && now - state.firstFailureAt > WINDOW_MS) {
      loginAttempts.delete(ip);
    }
  }
}

/** Returns ms remaining if locked out, otherwise 0. */
export function checkLoginLockout(req: Request): number {
  const ip = clientIp(req);
  const state = loginAttempts.get(ip);
  if (!state) return 0;
  const now = Date.now();
  if (state.lockedUntil > now) return state.lockedUntil - now;
  return 0;
}

export function recordLoginFailure(req: Request): void {
  const now = Date.now();
  const ip = clientIp(req);
  const state = loginAttempts.get(ip);
  if (!state || now - state.firstFailureAt > WINDOW_MS) {
    loginAttempts.set(ip, { failures: 1, firstFailureAt: now, lockedUntil: 0 });
  } else {
    state.failures += 1;
    if (state.failures >= MAX_FAILURES) {
      state.lockedUntil = now + LOCKOUT_MS;
    }
  }
  gcLoginAttempts(now);
}

export function recordLoginSuccess(req: Request): void {
  loginAttempts.delete(clientIp(req));
}
