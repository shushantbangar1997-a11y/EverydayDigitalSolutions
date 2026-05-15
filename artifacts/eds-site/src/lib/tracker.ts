const CONSENT_VERSION = "1.0";
const COOKIE_NAME = "eds_cid";
const COOKIE_MAX_AGE_DAYS = 730; // 2 years
const CONSENT_KEY = "eds_consent";
const FLUSH_INTERVAL_MS = 5_000;
const FLUSH_MAX_EVENTS = 10;
const HEARTBEAT_INTERVAL_MS = 15_000;
const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

const API_BASE: string = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

function url(path: string): string {
  return `${API_BASE}${path}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^| )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]+)"),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getCookieId(): string {
  let id = getCookie(COOKIE_NAME);
  if (!id) {
    id = uuid();
    setCookie(COOKIE_NAME, id, COOKIE_MAX_AGE_DAYS);
  }
  return id;
}

function isDntEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  const dnt =
    navigator.doNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes";
}

export type ConsentState = "unknown" | "granted" | "denied";

export function getConsentState(): ConsentState {
  if (typeof localStorage === "undefined") return "unknown";
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === "granted") return "granted";
  if (v === "denied") return "denied";
  return "unknown";
}

function setConsentState(state: ConsentState): void {
  if (typeof localStorage === "undefined") return;
  if (state === "unknown") localStorage.removeItem(CONSENT_KEY);
  else localStorage.setItem(CONSENT_KEY, state);
}

function getUtmParams(): Record<string, string | undefined> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource: p.get("utm_source") ?? undefined,
    utmMedium: p.get("utm_medium") ?? undefined,
    utmCampaign: p.get("utm_campaign") ?? undefined,
    utmContent: p.get("utm_content") ?? undefined,
    utmTerm: p.get("utm_term") ?? undefined,
  };
}

interface QueuedEvent {
  type: string;
  pageviewId?: number;
  element?: string;
  page?: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
}

interface CurrentPageview {
  id: number;
  path: string;
  enteredAt: number;
  maxScroll: number;
  milestonesSent: Set<number>;
}

class Tracker {
  private sessionId: string | null = null;
  private sessionPromise: Promise<string | null> | null = null;
  private currentPageview: CurrentPageview | null = null;
  private eventBuffer: QueuedEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private listenersAttached = false;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private unloadHandler: (() => void) | null = null;

  isReady(): boolean {
    return this.sessionId !== null;
  }

  /**
   * Start tracking.
   *
   * Privacy posture: first-party only, no third-party sharing — we treat the
   * unknown state as implicit consent (Plausible/Fathom model). Browser-level
   * Do-Not-Track is still respected, and explicit "denied" stops everything.
   */
  async start(): Promise<void> {
    if (typeof window === "undefined") return;
    if (this.sessionPromise) return void (await this.sessionPromise);
    if (getConsentState() === "denied") return;
    if (isDntEnabled()) return;

    this.sessionPromise = this.startSession();
    await this.sessionPromise;
  }

  private async startSession(): Promise<string | null> {
    const cookieId = getCookieId();
    const utm = getUtmParams();
    const body = {
      cookieId,
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      referrer: document.referrer || undefined,
      landingPage: window.location.pathname + window.location.search,
      dntEnabled: isDntEnabled(),
      ...utm,
    };
    try {
      const res = await fetch(url("/api/track/session"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        credentials: "omit",
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { sessionId: string };
      this.sessionId = data.sessionId;
      this.attachListeners();
      this.startTimers();
      return this.sessionId;
    } catch {
      return null;
    }
  }

  /** Record consent acceptance and start the session. */
  async acceptConsent(): Promise<void> {
    setConsentState("granted");
    const cookieId = getCookieId();
    try {
      await fetch(url("/api/track/consent"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cookieId, version: CONSENT_VERSION }),
        credentials: "omit",
      });
    } catch {
      /* best-effort */
    }
    await this.start();
  }

  /** Decline tracking. Tracker stays no-op. */
  declineConsent(): void {
    setConsentState("denied");
  }

  /** Called on every route change (and initial mount). */
  async recordPageview(path: string, title?: string): Promise<void> {
    await this.ensureReady();
    if (!this.sessionId) return;

    if (this.currentPageview) {
      this.endCurrentPageview();
    }

    try {
      const res = await fetch(url("/api/track/pageview"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: this.sessionId, path, title }),
        credentials: "omit",
      });
      if (!res.ok) return;
      const data = (await res.json()) as { pageviewId: number };
      this.currentPageview = {
        id: data.pageviewId,
        path,
        enteredAt: Date.now(),
        maxScroll: 0,
        milestonesSent: new Set(),
      };
    } catch {
      /* swallow */
    }
  }

  private endCurrentPageview(): void {
    const pv = this.currentPageview;
    if (!pv) return;
    const timeOnPageSeconds = Math.round((Date.now() - pv.enteredAt) / 1000);
    const payload = {
      pageviewId: pv.id,
      timeOnPageSeconds,
      maxScrollPercent: pv.maxScroll,
    };
    this.beaconOrFetch("/api/track/pageview-end", payload);
    this.currentPageview = null;
  }

  /** Record a custom event. Buffered, sent in batches. */
  recordEvent(
    type: string,
    opts: {
      element?: string;
      page?: string;
      metadata?: Record<string, unknown>;
    } = {},
  ): void {
    if (!this.sessionId) return;
    this.eventBuffer.push({
      type,
      pageviewId: this.currentPageview?.id,
      element: opts.element,
      page: opts.page ?? window.location.pathname,
      metadata: opts.metadata,
      occurredAt: new Date().toISOString(),
    });
    if (this.eventBuffer.length >= FLUSH_MAX_EVENTS) {
      void this.flush();
    }
  }

  /** Record a tool run (cost calculator, voice ROI calculator, etc.). */
  async recordToolRun(
    tool: string,
    inputs: Record<string, unknown>,
    output: Record<string, unknown>,
    completed = true,
  ): Promise<void> {
    await this.ensureReady();
    const body = {
      sessionId: this.sessionId ?? undefined,
      tool,
      inputs,
      output,
      completed,
    };
    try {
      await fetch(url("/api/track/tool-run"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        credentials: "omit",
      });
    } catch {
      /* swallow */
    }
  }

  /** Returns the current sessionId once ready, or null if tracking is disabled. */
  getSessionId(): string | null {
    return this.sessionId;
  }

  private async ensureReady(): Promise<void> {
    if (this.sessionId) return;
    if (getConsentState() !== "denied" && !isDntEnabled()) {
      await this.start();
    }
  }

  private async flush(): Promise<void> {
    if (!this.sessionId || this.eventBuffer.length === 0) return;
    const events = this.eventBuffer.splice(0, this.eventBuffer.length);
    try {
      await fetch(url("/api/track/event"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: this.sessionId, events }),
        credentials: "omit",
      });
    } catch {
      /* swallow */
    }
  }

  private beaconOrFetch(path: string, body: unknown): void {
    const json = JSON.stringify(body);
    const fullUrl = url(path);
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      const blob = new Blob([json], { type: "application/json" });
      const ok = navigator.sendBeacon(fullUrl, blob);
      if (ok) return;
    }
    void fetch(fullUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: json,
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  }

  private startTimers(): void {
    if (!this.flushTimer) {
      this.flushTimer = setInterval(() => void this.flush(), FLUSH_INTERVAL_MS);
    }
    if (!this.heartbeatTimer) {
      this.heartbeatTimer = setInterval(() => {
        if (!this.sessionId) return;
        this.beaconOrFetch("/api/track/heartbeat", { sessionId: this.sessionId });
      }, HEARTBEAT_INTERVAL_MS);
    }
  }

  private attachListeners(): void {
    if (this.listenersAttached || typeof document === "undefined") return;
    this.listenersAttached = true;

    this.clickHandler = (e: MouseEvent) => this.handleClick(e);
    document.addEventListener("click", this.clickHandler, { capture: true });

    this.scrollHandler = () => this.handleScroll();
    window.addEventListener("scroll", this.scrollHandler, { passive: true });

    this.unloadHandler = () => {
      if (this.eventBuffer.length > 0) {
        const events = this.eventBuffer.splice(0, this.eventBuffer.length);
        this.beaconOrFetch("/api/track/event", {
          sessionId: this.sessionId,
          events,
        });
      }
      if (this.currentPageview) {
        this.endCurrentPageview();
      }
    };
    window.addEventListener("pagehide", this.unloadHandler);
    window.addEventListener("beforeunload", this.unloadHandler);
  }

  private handleClick(e: MouseEvent): void {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const tracked = target.closest<HTMLElement>(
      "[data-track], a, button, [role='button']",
    );
    if (!tracked) return;
    const label = describeElement(tracked);
    this.recordEvent("click", { element: label });
  }

  private handleScroll(): void {
    const pv = this.currentPageview;
    if (!pv) return;
    const doc = document.documentElement;
    const total = doc.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)));
    if (pct > pv.maxScroll) pv.maxScroll = pct;
    for (const m of SCROLL_MILESTONES) {
      if (pct >= m && !pv.milestonesSent.has(m)) {
        pv.milestonesSent.add(m);
        this.recordEvent("scroll", { metadata: { depth: m } });
      }
    }
  }
}

function describeElement(el: HTMLElement): string {
  const dataTrack = el.getAttribute("data-track");
  if (dataTrack) return dataTrack;
  const aria = el.getAttribute("aria-label");
  if (aria) return aria.slice(0, 120);
  const text = el.textContent?.trim().replace(/\s+/g, " ");
  if (text && text.length > 0) return text.slice(0, 120);
  if (el instanceof HTMLAnchorElement && el.href) return `link:${el.href}`;
  return el.tagName.toLowerCase();
}

export const tracker = new Tracker();
