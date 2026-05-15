import {
  pgTable,
  bigserial,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { sessionsTable } from "./sessions";

export const pageviewsTable = pgTable(
  "pageviews",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessionsTable.id, { onDelete: "cascade" }),
    path: text("path").notNull(),
    title: text("title"),
    enteredAt: timestamp("entered_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    leftAt: timestamp("left_at", { withTimezone: true }),
    timeOnPageSeconds: integer("time_on_page_seconds"),
    maxScrollPercent: integer("max_scroll_percent").notNull().default(0),
  },
  (t) => ({
    sessionIdx: index("pageviews_session_idx").on(t.sessionId),
    enteredAtIdx: index("pageviews_entered_at_idx").on(t.enteredAt),
    pathIdx: index("pageviews_path_idx").on(t.path),
  }),
);

export type PageviewRow = typeof pageviewsTable.$inferSelect;
export type InsertPageviewRow = typeof pageviewsTable.$inferInsert;
