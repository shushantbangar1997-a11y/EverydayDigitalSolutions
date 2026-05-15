import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import {
  db,
  visitorsTable,
  sessionsTable,
  pageviewsTable,
  eventsTable,
  toolRunsTable,
  consentsTable,
} from "@workspace/db";
import {
  TrackSessionBody,
  TrackPageviewBody,
  TrackPageviewEndBody,
  TrackEventBatchBody,
  TrackHeartbeatBody,
  TrackConsentBody,
  TrackToolRunBody,
} from "@workspace/api-zod";
import { parseVisitor, safeReferrerHost } from "../lib/visitor";

const router: IRouter = Router();

router.post("/track/session", async (req, res): Promise<void> => {
  const parsed = TrackSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const input = parsed.data;
  const ctx = parseVisitor(req);

  const [visitor] = await db
    .insert(visitorsTable)
    .values({ cookieId: input.cookieId })
    .onConflictDoUpdate({
      target: visitorsTable.cookieId,
      set: {
        lastSeenAt: new Date(),
        totalSessions: sql`${visitorsTable.totalSessions} + 1`,
        isReturning: true,
      },
    })
    .returning();

  if (!visitor) {
    res.status(500).json({ error: "Failed to record visitor" });
    return;
  }

  const [session] = await db
    .insert(sessionsTable)
    .values({
      visitorId: visitor.id,
      ipAddress: ctx.ip,
      ipCountry: ctx.geo.country,
      ipRegion: ctx.geo.region,
      ipCity: ctx.geo.city,
      isTriCity: ctx.isTriCity,
      userAgent: ctx.userAgent,
      deviceType: ctx.ua.deviceType,
      os: ctx.ua.os,
      osVersion: ctx.ua.osVersion,
      browser: ctx.ua.browser,
      browserVersion: ctx.ua.browserVersion,
      screenWidth: input.screenWidth ?? null,
      screenHeight: input.screenHeight ?? null,
      viewportWidth: input.viewportWidth ?? null,
      viewportHeight: input.viewportHeight ?? null,
      referrer: input.referrer ?? null,
      referrerHost: safeReferrerHost(input.referrer),
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      utmContent: input.utmContent ?? null,
      utmTerm: input.utmTerm ?? null,
      landingPage: input.landingPage ?? null,
      dntEnabled: input.dntEnabled ?? false,
    })
    .returning();

  if (!session) {
    res.status(500).json({ error: "Failed to start session" });
    return;
  }

  res.status(201).json({ sessionId: session.id, visitorId: visitor.id });
});

router.post("/track/pageview", async (req, res): Promise<void> => {
  const parsed = TrackPageviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const input = parsed.data;

  const [pv] = await db
    .insert(pageviewsTable)
    .values({
      sessionId: input.sessionId,
      path: input.path,
      title: input.title ?? null,
    })
    .returning({ id: pageviewsTable.id });

  if (!pv) {
    res.status(500).json({ error: "Failed to record pageview" });
    return;
  }

  await db
    .update(sessionsTable)
    .set({
      pageviewCount: sql`${sessionsTable.pageviewCount} + 1`,
      lastHeartbeatAt: new Date(),
      exitPage: input.path,
    })
    .where(eq(sessionsTable.id, input.sessionId));

  await db
    .update(visitorsTable)
    .set({
      totalPageviews: sql`${visitorsTable.totalPageviews} + 1`,
      lastSeenAt: new Date(),
    })
    .where(
      eq(
        visitorsTable.id,
        sql`(SELECT visitor_id FROM sessions WHERE id = ${input.sessionId})`,
      ),
    );

  res.status(201).json({ pageviewId: pv.id });
});

router.post("/track/pageview-end", async (req, res): Promise<void> => {
  const parsed = TrackPageviewEndBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const input = parsed.data;

  await db
    .update(pageviewsTable)
    .set({
      leftAt: new Date(),
      timeOnPageSeconds: input.timeOnPageSeconds ?? null,
      maxScrollPercent: input.maxScrollPercent ?? 0,
    })
    .where(eq(pageviewsTable.id, input.pageviewId));

  res.status(204).send();
});

router.post("/track/event", async (req, res): Promise<void> => {
  const parsed = TrackEventBatchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { sessionId, events } = parsed.data;

  const rows = events.map((e) => ({
    sessionId,
    pageviewId: e.pageviewId ?? null,
    occurredAt: e.occurredAt ? new Date(e.occurredAt) : new Date(),
    type: e.type,
    element: e.element ?? null,
    page: e.page ?? null,
    metadata: (e.metadata ?? {}) as Record<string, unknown>,
  }));

  await db.insert(eventsTable).values(rows);

  const clicks = events.filter((e) => e.type === "click").length;
  if (clicks > 0) {
    await db
      .update(sessionsTable)
      .set({
        clickCount: sql`${sessionsTable.clickCount} + ${clicks}`,
        lastHeartbeatAt: new Date(),
      })
      .where(eq(sessionsTable.id, sessionId));
  } else {
    await db
      .update(sessionsTable)
      .set({ lastHeartbeatAt: new Date() })
      .where(eq(sessionsTable.id, sessionId));
  }

  res.status(204).send();
});

router.post("/track/heartbeat", async (req, res): Promise<void> => {
  const parsed = TrackHeartbeatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  await db
    .update(sessionsTable)
    .set({ lastHeartbeatAt: new Date() })
    .where(eq(sessionsTable.id, parsed.data.sessionId));

  res.status(204).send();
});

router.post("/track/consent", async (req, res): Promise<void> => {
  const parsed = TrackConsentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { cookieId, version } = parsed.data;
  const ctx = parseVisitor(req);

  const [visitor] = await db
    .insert(visitorsTable)
    .values({ cookieId })
    .onConflictDoUpdate({
      target: visitorsTable.cookieId,
      set: { lastSeenAt: new Date() },
    })
    .returning();

  if (!visitor) {
    res.status(500).json({ error: "Failed to record consent" });
    return;
  }

  await db.insert(consentsTable).values({
    visitorId: visitor.id,
    version,
    ipAddress: ctx.ip,
  });

  res.status(204).send();
});

router.post("/track/tool-run", async (req, res): Promise<void> => {
  const parsed = TrackToolRunBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { sessionId, tool, inputs, output, completed } = parsed.data;

  await db.insert(toolRunsTable).values({
    sessionId: sessionId ?? null,
    tool,
    inputs: (inputs ?? {}) as Record<string, unknown>,
    output: (output ?? {}) as Record<string, unknown>,
    completed: completed ?? false,
  });

  res.status(204).send();
});

export default router;
