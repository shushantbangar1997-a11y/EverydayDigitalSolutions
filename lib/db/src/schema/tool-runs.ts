import {
  pgTable,
  bigserial,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { sessionsTable } from "./sessions";

export const toolRunsTable = pgTable(
  "tool_runs",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    sessionId: uuid("session_id").references(() => sessionsTable.id, {
      onDelete: "set null",
    }),
    tool: text("tool").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    inputs: jsonb("inputs").notNull().default({}),
    output: jsonb("output").notNull().default({}),
    completed: boolean("completed").notNull().default(false),
  },
  (t) => ({
    toolOccurredIdx: index("tool_runs_tool_occurred_idx").on(
      t.tool,
      t.occurredAt,
    ),
    sessionIdx: index("tool_runs_session_idx").on(t.sessionId),
  }),
);

export type ToolRunRow = typeof toolRunsTable.$inferSelect;
export type InsertToolRunRow = typeof toolRunsTable.$inferInsert;
