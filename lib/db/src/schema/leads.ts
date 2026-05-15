import {
  pgTable,
  uuid,
  text,
  jsonb,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { sessionsTable } from "./sessions";

export const leadsTable = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => sessionsTable.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  businessName: text("business_name"),
  whatsappNumber: text("whatsapp_number").notNull(),
  email: text("email"),
  city: text("city").notNull(),
  industry: text("industry").notNull(),
  industryDetails: jsonb("industry_details").notNull().default({}),
  problem: text("problem").notNull(),
  currentSolution: text("current_solution"),
  goalIn3Months: text("goal_in_3_months").notNull(),
  budget: text("budget").notNull(),
  timeline: text("timeline").notNull(),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  whatsappNotificationSent: boolean("whatsapp_notification_sent").notNull().default(false),
  whatsappAttempts: integer("whatsapp_attempts").notNull().default(0),
  whatsappRetryAfter: timestamp("whatsapp_retry_after", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type LeadRow = typeof leadsTable.$inferSelect;
export type InsertLeadRow = typeof leadsTable.$inferInsert;
