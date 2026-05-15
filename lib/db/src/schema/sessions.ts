import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { visitorsTable } from "./visitors";

export const sessionsTable = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    visitorId: uuid("visitor_id")
      .notNull()
      .references(() => visitorsTable.id, { onDelete: "cascade" }),

    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    lastHeartbeatAt: timestamp("last_heartbeat_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    durationSeconds: integer("duration_seconds"),

    ipAddress: text("ip_address"),
    ipCountry: text("ip_country"),
    ipRegion: text("ip_region"),
    ipCity: text("ip_city"),
    ipIsp: text("ip_isp"),
    isTriCity: boolean("is_tri_city").notNull().default(false),

    userAgent: text("user_agent"),
    deviceType: text("device_type"),
    os: text("os"),
    osVersion: text("os_version"),
    browser: text("browser"),
    browserVersion: text("browser_version"),
    screenWidth: integer("screen_width"),
    screenHeight: integer("screen_height"),
    viewportWidth: integer("viewport_width"),
    viewportHeight: integer("viewport_height"),

    referrer: text("referrer"),
    referrerHost: text("referrer_host"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),

    landingPage: text("landing_page"),
    exitPage: text("exit_page"),

    pageviewCount: integer("pageview_count").notNull().default(0),
    clickCount: integer("click_count").notNull().default(0),
    bounced: boolean("bounced").notNull().default(false),
    dntEnabled: boolean("dnt_enabled").notNull().default(false),
  },
  (t) => ({
    visitorIdx: index("sessions_visitor_idx").on(t.visitorId),
    startedAtIdx: index("sessions_started_at_idx").on(t.startedAt),
    heartbeatIdx: index("sessions_heartbeat_idx").on(t.lastHeartbeatAt),
    cityIdx: index("sessions_city_idx").on(t.ipCity),
    deviceIdx: index("sessions_device_idx").on(t.deviceType),
    referrerHostIdx: index("sessions_referrer_host_idx").on(t.referrerHost),
  }),
);

export type SessionRow = typeof sessionsTable.$inferSelect;
export type InsertSessionRow = typeof sessionsTable.$inferInsert;
