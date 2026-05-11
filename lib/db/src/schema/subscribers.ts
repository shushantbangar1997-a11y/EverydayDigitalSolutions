import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const subscribersTable = pgTable(
  "subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    source: text("source").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailSourceUnique: uniqueIndex("subscribers_email_source_unique").on(t.email, t.source),
  }),
);

export type SubscriberRow = typeof subscribersTable.$inferSelect;
export type InsertSubscriberRow = typeof subscribersTable.$inferInsert;
