import {
  pgTable,
  bigserial,
  bigint,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sessionsTable } from "./sessions";
import { pageviewsTable } from "./pageviews";

export const eventsTable = pgTable(
  "events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessionsTable.id, { onDelete: "cascade" }),
    pageviewId: bigint("pageview_id", { mode: "number" }).references(
      () => pageviewsTable.id,
      { onDelete: "set null" },
    ),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    type: text("type").notNull(),
    element: text("element"),
    page: text("page"),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (t) => ({
    sessionOccurredIdx: index("events_session_occurred_idx").on(
      t.sessionId,
      t.occurredAt,
    ),
    typeIdx: index("events_type_idx").on(t.type),
  }),
);

export type EventRow = typeof eventsTable.$inferSelect;
export type InsertEventRow = typeof eventsTable.$inferInsert;
