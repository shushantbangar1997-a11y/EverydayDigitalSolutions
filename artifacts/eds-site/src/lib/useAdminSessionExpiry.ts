import { useEffect, useState } from "react";

const WARN_AT_MS = 5 * 60 * 1000;

export interface SessionExpiryState {
  msRemaining: number | null;
  isExpiringSoon: boolean;
  isExpired: boolean;
}

/**
 * Tracks how long until the admin cookie expires (as reported by /admin/me)
 * and ticks once a minute so warning banners react without a refetch.
 */
export function useAdminSessionExpiry(expiresAtIso: string | null | undefined): SessionExpiryState {
  const expiresAt = expiresAtIso ? new Date(expiresAtIso).getTime() : null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [expiresAt]);

  if (!expiresAt) {
    return { msRemaining: null, isExpiringSoon: false, isExpired: false };
  }
  const msRemaining = expiresAt - now;
  return {
    msRemaining,
    isExpiringSoon: msRemaining > 0 && msRemaining <= WARN_AT_MS,
    isExpired: msRemaining <= 0,
  };
}

export function formatRemaining(ms: number): string {
  if (ms <= 0) return "0 seconds";
  const totalSec = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes > 0) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }
  return `${seconds}s`;
}
