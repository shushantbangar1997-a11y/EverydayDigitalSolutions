import { z } from "zod";

export const TrackSessionBody = z.object({
  cookieId: z.string().min(1).max(64),
  screenWidth: z.number().int().min(0).max(20000).optional(),
  screenHeight: z.number().int().min(0).max(20000).optional(),
  viewportWidth: z.number().int().min(0).max(20000).optional(),
  viewportHeight: z.number().int().min(0).max(20000).optional(),
  referrer: z.string().max(2048).optional(),
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  utmContent: z.string().max(255).optional(),
  utmTerm: z.string().max(255).optional(),
  landingPage: z.string().max(2048).optional(),
  dntEnabled: z.boolean().optional(),
});

export const TrackSessionResponse = z.object({
  sessionId: z.string().uuid(),
  visitorId: z.string().uuid(),
});

export const TrackPageviewBody = z.object({
  sessionId: z.string().uuid(),
  path: z.string().min(1).max(2048),
  title: z.string().max(512).optional(),
});

export const TrackPageviewResponse = z.object({
  pageviewId: z.number().int().nonnegative(),
});

export const TrackPageviewEndBody = z.object({
  pageviewId: z.number().int().nonnegative(),
  timeOnPageSeconds: z.number().int().nonnegative().max(86400).optional(),
  maxScrollPercent: z.number().int().min(0).max(100).optional(),
});

const EventInput = z.object({
  type: z.string().min(1).max(64),
  pageviewId: z.number().int().nonnegative().optional(),
  element: z.string().max(512).optional(),
  page: z.string().max(2048).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  occurredAt: z.string().datetime().optional(),
});

export const TrackEventBatchBody = z.object({
  sessionId: z.string().uuid(),
  events: z.array(EventInput).min(1).max(100),
});

export const TrackHeartbeatBody = z.object({
  sessionId: z.string().uuid(),
});

export const TrackConsentBody = z.object({
  cookieId: z.string().min(1).max(64),
  version: z.string().min(1).max(32),
});

export const TrackToolRunBody = z.object({
  sessionId: z.string().uuid().optional(),
  tool: z.string().min(1).max(64),
  inputs: z.record(z.string(), z.unknown()).optional(),
  output: z.record(z.string(), z.unknown()).optional(),
  completed: z.boolean().optional(),
});
