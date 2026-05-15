import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { visitorsTable } from "./visitors";

export const consentsTable = pgTable(
  "consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    visitorId: uuid("visitor_id")
      .notNull()
      .references(() => visitorsTable.id, { onDelete: "cascade" }),
    consentedAt: timestamp("consented_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    version: text("version").notNull(),
    ipAddress: text("ip_address"),
  },
  (t) => ({
    visitorIdx: index("consents_visitor_idx").on(t.visitorId),
  }),
);

export type ConsentRow = typeof consentsTable.$inferSelect;
export type InsertConsentRow = typeof consentsTable.$inferInsert;
