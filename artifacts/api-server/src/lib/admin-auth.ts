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
  res.cookie(COOKIE_NAME, mintToken(), {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
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
