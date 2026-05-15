import { Router, type IRouter } from "express";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import {
  db,
  sessionsTable,
  pageviewsTable,
  eventsTable,
  toolRunsTable,
  leadsTable,
  visitorsTable,
} from "@workspace/db";
import { requireAdmin } from "../lib/admin-auth";
import { parseRange, rangeStart } from "../lib/range";

const router: IRouter = Router();

const ACTIVE_WINDOW_SECONDS = 30;

// ─── Dashboard ─────────────────────────────────────────────────────────────
router.get("/admin/dashboard", requireAdmin, async (req, res): Promise<void> => {
  const range = parseRange(req);
  const start = rangeStart(range);
  const todayStart = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const sinceClause = start
    ? sql`started_at >= ${start.toISOString()}`
    : sql`true`;

  const [
    activeNow,
    visitorsRange,
    sessionsRange,
    visitorsToday,
    sessionsToday,
    leadsToday,
    toolRunsToday,
    daily,
    topCities,
    topSources,
    topPages,
  ] = await Promise.all([
    db.execute(sql<{ n: number }>`
      SELECT COUNT(*)::int AS n FROM sessions
      WHERE last_heartbeat_at >= NOW() - (${ACTIVE_WINDOW_SECONDS} * INTERVAL '1 second')
    `),
    db.execute(sql<{ n: number }>`
      SELECT COUNT(DISTINCT visitor_id)::int AS n FROM sessions WHERE ${sinceClause}
    `),
    db.execute(sql<{ n: number }>`
      SELECT COUNT(*)::int AS n FROM sessions WHERE ${sinceClause}
    `),
    db.execute(sql<{ n: number }>`
      SELECT COUNT(DISTINCT visitor_id)::int AS n FROM sessions WHERE started_at >= ${todayStart.toISOString()}
    `),
    db.execute(sql<{ n: number }>`
      SELECT COUNT(*)::int AS n FROM sessions WHERE started_at >= ${todayStart.toISOString()}
    `),
    db.execute(sql<{ n: number }>`
      SELECT COUNT(*)::int AS n FROM leads WHERE created_at >= ${todayStart.toISOString()}
    `),
    db.execute(sql<{ n: number }>`
      SELECT COUNT(*)::int AS n FROM tool_runs WHERE occurred_at >= ${todayStart.toISOString()}
    `),
    db.execute(sql<{ day: string; visitors: number; sessions: number }>`
      SELECT date_trunc('day', started_at)::date AS day,
             COUNT(DISTINCT visitor_id)::int AS visitors,
             COUNT(*)::int AS sessions
      FROM sessions
      WHERE started_at >= NOW() - INTERVAL '7 days'
      GROUP BY day
      ORDER BY day
    `),
    db.execute(sql<{ city: string; n: number }>`
      SELECT COALESCE(NULLIF(ip_city, ''), 'Unknown') AS city, COUNT(*)::int AS n
      FROM sessions WHERE ${sinceClause}
      GROUP BY city ORDER BY n DESC LIMIT 5
    `),
    db.execute(sql<{ source: string; n: number }>`
      SELECT COALESCE(NULLIF(referrer_host, ''), 'direct') AS source, COUNT(*)::int AS n
      FROM sessions WHERE ${sinceClause}
      GROUP BY source ORDER BY n DESC LIMIT 5
    `),
    db.execute(sql<{ page: string; n: number }>`
      SELECT COALESCE(NULLIF(landing_page, ''), '/') AS page, COUNT(*)::int AS n
      FROM sessions WHERE ${sinceClause}
      GROUP BY page ORDER BY n DESC LIMIT 5
    `),
  ]);

  res.json({
    range,
    kpi: {
      activeNow: activeNow.rows[0]?.n ?? 0,
      visitorsToday: visitorsToday.rows[0]?.n ?? 0,
      sessionsToday: sessionsToday.rows[0]?.n ?? 0,
      leadsToday: leadsToday.rows[0]?.n ?? 0,
      toolRunsToday: toolRunsToday.rows[0]?.n ?? 0,
      visitorsRange: visitorsRange.rows[0]?.n ?? 0,
      sessionsRange: sessionsRange.rows[0]?.n ?? 0,
    },
    daily: daily.rows,
    topCities: topCities.rows,
    topSources: topSources.rows,
    topPages: topPages.rows,
  });
});

// ─── Live View (SSE) ───────────────────────────────────────────────────────
router.get("/admin/live", requireAdmin, async (req, res): Promise<void> => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  let closed = false;
  req.on("close", () => {
    closed = true;
  });

  async function push(): Promise<void> {
    const result = await db.execute(sql<{
      session_id: string;
      visitor_id: string;
      ip_city: string | null;
      ip_region: string | null;
      ip_country: string | null;
      is_tri_city: boolean;
      device_type: string | null;
      browser: string | null;
      os: string | null;
      referrer_host: string | null;
      started_at: Date;
      current_path: string | null;
    }>`
      SELECT
        s.id AS session_id,
        s.visitor_id,
        s.ip_city, s.ip_region, s.ip_country, s.is_tri_city,
        s.device_type, s.browser, s.os,
        s.referrer_host,
        s.started_at,
        (SELECT path FROM pageviews WHERE session_id = s.id ORDER BY entered_at DESC LIMIT 1) AS current_path
      FROM sessions s
      WHERE s.last_heartbeat_at >= NOW() - (${ACTIVE_WINDOW_SECONDS} * INTERVAL '1 second')
      ORDER BY s.started_at DESC
      LIMIT 50
    `);
    if (closed) return;
    res.write(`data: ${JSON.stringify({ sessions: result.rows })}\n\n`);
  }

  await push();
  const interval = setInterval(() => {
    if (closed) {
      clearInterval(interval);
      return;
    }
    push().catch(() => {});
  }, 3000);

  req.on("close", () => clearInterval(interval));
});

// ─── Sessions list ─────────────────────────────────────────────────────────
router.get("/admin/sessions", requireAdmin, async (req, res): Promise<void> => {
  const range = parseRange(req);
  const start = rangeStart(range);
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
  const offset = Math.max(0, Number(req.query.offset) || 0);
  const city = typeof req.query.city === "string" ? req.query.city : null;
  const device = typeof req.query.device === "string" ? req.query.device : null;
  const source = typeof req.query.source === "string" ? req.query.source : null;
  const hasLead = req.query.hasLead === "true";

  const conditions = [];
  if (start) conditions.push(gte(sessionsTable.startedAt, start));
  if (city) conditions.push(eq(sessionsTable.ipCity, city));
  if (device) conditions.push(eq(sessionsTable.deviceType, device));
  if (source) conditions.push(eq(sessionsTable.referrerHost, source));

  const whereClause = conditions.length ? and(...conditions) : undefined;

  if (hasLead) {
    const rows = await db.execute(sql<{
      id: string;
      started_at: Date;
      ip_city: string | null;
      device_type: string | null;
      browser: string | null;
      referrer_host: string | null;
      landing_page: string | null;
      pageview_count: number;
      click_count: number;
      lead_id: string | null;
    }>`
      SELECT s.id, s.started_at, s.ip_city, s.device_type, s.browser,
             s.referrer_host, s.landing_page, s.pageview_count, s.click_count,
             l.id AS lead_id
      FROM sessions s
      INNER JOIN leads l ON l.session_id = s.id
      ${start ? sql`WHERE s.started_at >= ${start.toISOString()}` : sql``}
      ORDER BY s.started_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    res.json({ sessions: rows.rows });
    return;
  }

  const rows = await db
    .select({
      id: sessionsTable.id,
      startedAt: sessionsTable.startedAt,
      ipCity: sessionsTable.ipCity,
      ipRegion: sessionsTable.ipRegion,
      isTriCity: sessionsTable.isTriCity,
      deviceType: sessionsTable.deviceType,
      browser: sessionsTable.browser,
      os: sessionsTable.os,
      referrerHost: sessionsTable.referrerHost,
      landingPage: sessionsTable.landingPage,
      exitPage: sessionsTable.exitPage,
      pageviewCount: sessionsTable.pageviewCount,
      clickCount: sessionsTable.clickCount,
      bounced: sessionsTable.bounced,
    })
    .from(sessionsTable)
    .where(whereClause)
    .orderBy(desc(sessionsTable.startedAt))
    .limit(limit)
    .offset(offset);

  res.json({ sessions: rows });
});

// ─── Session detail ───────────────────────────────────────────────────────
router.get("/admin/sessions/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = req.params.id;
  if (typeof id !== "string" || id.length === 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, id))
    .limit(1);

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const [visitor] = await db
    .select()
    .from(visitorsTable)
    .where(eq(visitorsTable.id, session.visitorId))
    .limit(1);

  const pageviews = await db
    .select()
    .from(pageviewsTable)
    .where(eq(pageviewsTable.sessionId, id))
    .orderBy(pageviewsTable.enteredAt);

  const events = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.sessionId, id))
    .orderBy(eventsTable.occurredAt);

  const toolRuns = await db
    .select()
    .from(toolRunsTable)
    .where(eq(toolRunsTable.sessionId, id))
    .orderBy(toolRunsTable.occurredAt);

  const leads = await db
    .select()
    .from(leadsTable)
    .where(eq(leadsTable.sessionId, id))
    .orderBy(leadsTable.createdAt);

  res.json({ session, visitor, pageviews, events, toolRuns, leads });
});

// ─── Geography ────────────────────────────────────────────────────────────
router.get("/admin/geography", requireAdmin, async (req, res): Promise<void> => {
  const range = parseRange(req);
  const start = rangeStart(range);
  const sinceClause = start
    ? sql`started_at >= ${start.toISOString()}`
    : sql`true`;

  const cities = await db.execute(sql<{
    city: string;
    region: string | null;
    country: string | null;
    visitors: number;
    sessions: number;
    is_tri_city: boolean;
  }>`
    SELECT
      COALESCE(NULLIF(ip_city, ''), 'Unknown') AS city,
      MAX(ip_region) AS region,
      MAX(ip_country) AS country,
      COUNT(DISTINCT visitor_id)::int AS visitors,
      COUNT(*)::int AS sessions,
      BOOL_OR(is_tri_city) AS is_tri_city
    FROM sessions WHERE ${sinceClause}
    GROUP BY city
    ORDER BY visitors DESC
  `);

  const triCitySummary = await db.execute(sql<{
    bucket: string;
    visitors: number;
    sessions: number;
  }>`
    SELECT
      CASE
        WHEN LOWER(COALESCE(ip_city, '')) LIKE '%chandigarh%' THEN 'Chandigarh'
        WHEN LOWER(COALESCE(ip_city, '')) LIKE '%mohali%' OR LOWER(COALESCE(ip_city, '')) LIKE '%ajitgarh%' THEN 'Mohali'
        WHEN LOWER(COALESCE(ip_city, '')) LIKE '%panchkula%' THEN 'Panchkula'
        WHEN LOWER(COALESCE(ip_city, '')) LIKE '%jalandhar%' THEN 'Jalandhar'
        WHEN LOWER(COALESCE(ip_city, '')) LIKE '%zirakpur%' THEN 'Zirakpur'
        ELSE 'Other'
      END AS bucket,
      COUNT(DISTINCT visitor_id)::int AS visitors,
      COUNT(*)::int AS sessions
    FROM sessions WHERE ${sinceClause}
    GROUP BY bucket
    ORDER BY visitors DESC
  `);

  res.json({
    range,
    cities: cities.rows,
    triCitySummary: triCitySummary.rows,
  });
});

// ─── Devices ──────────────────────────────────────────────────────────────
router.get("/admin/devices", requireAdmin, async (req, res): Promise<void> => {
  const range = parseRange(req);
  const start = rangeStart(range);
  const sinceClause = start
    ? sql`started_at >= ${start.toISOString()}`
    : sql`true`;

  const [deviceTypes, browsers, oses, screens] = await Promise.all([
    db.execute(sql<{ device_type: string; n: number }>`
      SELECT COALESCE(NULLIF(device_type, ''), 'unknown') AS device_type, COUNT(*)::int AS n
      FROM sessions WHERE ${sinceClause}
      GROUP BY device_type ORDER BY n DESC
    `),
    db.execute(sql<{ browser: string; n: number }>`
      SELECT COALESCE(NULLIF(browser, ''), 'unknown') AS browser, COUNT(*)::int AS n
      FROM sessions WHERE ${sinceClause}
      GROUP BY browser ORDER BY n DESC LIMIT 10
    `),
    db.execute(sql<{ os: string; n: number }>`
      SELECT COALESCE(NULLIF(os, ''), 'unknown') AS os, COUNT(*)::int AS n
      FROM sessions WHERE ${sinceClause}
      GROUP BY os ORDER BY n DESC LIMIT 10
    `),
    db.execute(sql<{ bucket: string; n: number }>`
      SELECT
        CASE
          WHEN screen_width IS NULL THEN 'unknown'
          WHEN screen_width < 480 THEN '<480'
          WHEN screen_width < 768 THEN '480-767'
          WHEN screen_width < 1024 THEN '768-1023'
          WHEN screen_width < 1440 THEN '1024-1439'
          WHEN screen_width < 1920 THEN '1440-1919'
          ELSE '1920+'
        END AS bucket,
        COUNT(*)::int AS n
      FROM sessions WHERE ${sinceClause}
      GROUP BY bucket ORDER BY n DESC
    `),
  ]);

  res.json({
    range,
    deviceTypes: deviceTypes.rows,
    browsers: browsers.rows,
    oses: oses.rows,
    screens: screens.rows,
  });
});

// ─── Sources ──────────────────────────────────────────────────────────────
router.get("/admin/sources", requireAdmin, async (req, res): Promise<void> => {
  const range = parseRange(req);
  const start = rangeStart(range);
  const sinceClause = start
    ? sql`started_at >= ${start.toISOString()}`
    : sql`true`;

  const [referrers, utmCampaigns, utmSources] = await Promise.all([
    db.execute(sql<{ host: string; visitors: number; sessions: number }>`
      SELECT COALESCE(NULLIF(referrer_host, ''), 'direct') AS host,
             COUNT(DISTINCT visitor_id)::int AS visitors,
             COUNT(*)::int AS sessions
      FROM sessions WHERE ${sinceClause}
      GROUP BY host ORDER BY sessions DESC LIMIT 20
    `),
    db.execute(sql<{ campaign: string; sessions: number; leads: number }>`
      SELECT COALESCE(NULLIF(utm_campaign, ''), 'none') AS campaign,
             COUNT(DISTINCT s.id)::int AS sessions,
             COUNT(DISTINCT l.id)::int AS leads
      FROM sessions s LEFT JOIN leads l ON l.session_id = s.id
      WHERE s.${sinceClause}
      GROUP BY campaign ORDER BY sessions DESC LIMIT 10
    `).catch(() => ({ rows: [] })),
    db.execute(sql<{ source: string; sessions: number }>`
      SELECT COALESCE(NULLIF(utm_source, ''), 'none') AS source,
             COUNT(*)::int AS sessions
      FROM sessions WHERE ${sinceClause}
      GROUP BY source ORDER BY sessions DESC LIMIT 10
    `),
  ]);

  res.json({
    range,
    referrers: referrers.rows,
    utmCampaigns: utmCampaigns.rows,
    utmSources: utmSources.rows,
  });
});

// ─── Tools (estimator, voice ROI) ──────────────────────────────────────────
router.get("/admin/tools", requireAdmin, async (req, res): Promise<void> => {
  const range = parseRange(req);
  const start = rangeStart(range);
  const sinceClause = start
    ? sql`occurred_at >= ${start.toISOString()}`
    : sql`true`;

  const [perTool, perDay, quoteStats, completionRate] = await Promise.all([
    db.execute(sql<{ tool: string; runs: number; completed: number }>`
      SELECT tool,
             COUNT(*)::int AS runs,
             COUNT(*) FILTER (WHERE completed)::int AS completed
      FROM tool_runs WHERE ${sinceClause}
      GROUP BY tool ORDER BY runs DESC
    `),
    db.execute(sql<{ day: string; tool: string; runs: number }>`
      SELECT date_trunc('day', occurred_at)::date AS day, tool, COUNT(*)::int AS runs
      FROM tool_runs WHERE ${sinceClause}
      GROUP BY day, tool ORDER BY day
    `),
    db.execute(sql<{
      tool: string;
      min_quote: number | null;
      max_quote: number | null;
      avg_quote: number | null;
      median_quote: number | null;
      total_runs: number;
    }>`
      SELECT tool,
             MIN((output->>'quoteAmount')::numeric)::int AS min_quote,
             MAX((output->>'quoteAmount')::numeric)::int AS max_quote,
             ROUND(AVG((output->>'quoteAmount')::numeric))::int AS avg_quote,
             PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (output->>'quoteAmount')::numeric)::int AS median_quote,
             COUNT(*) FILTER (WHERE output ? 'quoteAmount')::int AS total_runs
      FROM tool_runs
      WHERE ${sinceClause} AND output ? 'quoteAmount'
      GROUP BY tool
    `).catch(() => ({ rows: [] })),
    db.execute(sql<{ tool: string; runs: number; with_lead: number }>`
      SELECT tr.tool,
             COUNT(*)::int AS runs,
             COUNT(DISTINCT l.id)::int AS with_lead
      FROM tool_runs tr
      LEFT JOIN leads l ON l.session_id = tr.session_id
      WHERE tr.${sinceClause}
      GROUP BY tr.tool
    `),
  ]);

  res.json({
    range,
    perTool: perTool.rows,
    perDay: perDay.rows,
    quoteStats: quoteStats.rows,
    completionRate: completionRate.rows,
  });
});

export default router;
