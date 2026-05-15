import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const visitorsTable = pgTable(
  "visitors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cookieId: text("cookie_id").notNull(),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    totalSessions: integer("total_sessions").notNull().default(0),
    totalPageviews: integer("total_pageviews").notNull().default(0),
    isReturning: boolean("is_returning").notNull().default(false),
  },
  (t) => ({
    cookieIdUnique: uniqueIndex("visitors_cookie_id_unique").on(t.cookieId),
  }),
);

export type VisitorRow = typeof visitorsTable.$inferSelect;
export type InsertVisitorRow = typeof visitorsTable.$inferInsert;
