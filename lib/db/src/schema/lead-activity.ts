import { pgTable, uuid, text, jsonb, timestamp, index } from "drizzle-orm/pg-core";

// No FK to leadsTable: 'deleted' activity rows must outlive the lead they describe.
// `leadSnapshot` is populated only for 'deleted' events.
export const leadActivityTable = pgTable(
  "lead_activity",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id").notNull(),
    type: text("type").notNull(),
    fromValue: text("from_value"),
    toValue: text("to_value"),
    leadSnapshot: jsonb("lead_snapshot"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byLead: index("lead_activity_lead_id_idx").on(t.leadId, t.createdAt),
  }),
);

export type LeadActivityRow = typeof leadActivityTable.$inferSelect;
export type InsertLeadActivityRow = typeof leadActivityTable.$inferInsert;
