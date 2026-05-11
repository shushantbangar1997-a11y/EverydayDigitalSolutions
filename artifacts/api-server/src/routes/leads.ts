import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";
import { CreateLeadBody } from "@workspace/api-zod";
import { sendWhatsApp, formatLeadMessage } from "../lib/whatsapp";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ issues: parsed.error.issues }, "Invalid lead body");
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const input = parsed.data;

  const [row] = await db
    .insert(leadsTable)
    .values({
      name: input.name,
      businessName: input.businessName ?? null,
      whatsappNumber: input.whatsappNumber,
      email: input.email ?? null,
      city: input.city,
      industry: input.industry,
      industryDetails: (input.industryDetails ?? {}) as Record<string, unknown>,
      problem: input.problem,
      currentSolution: input.currentSolution ?? null,
      goalIn3Months: input.goalIn3Months,
      budget: input.budget,
      timeline: input.timeline,
    })
    .returning();

  if (!row) {
    res.status(500).json({ error: "Failed to save lead" });
    return;
  }

  req.log.info({ leadId: row.id }, "Lead captured");
  res.status(201).json(row);

  // Fire WhatsApp notification AFTER responding so a slow/failing CallMeBot
  // never stalls the user. Persisted lead is the source of truth; this is
  // best-effort enrichment of `whatsappNotificationSent`.
  void (async () => {
    try {
      const sent = await sendWhatsApp(formatLeadMessage(row));
      if (sent) {
        await db
          .update(leadsTable)
          .set({ whatsappNotificationSent: true })
          .where(eq(leadsTable.id, row.id));
      }
      logger.info({ leadId: row.id, whatsappSent: sent }, "WhatsApp dispatch finished");
    } catch (err) {
      logger.error({ err, leadId: row.id }, "Async WhatsApp dispatch failed");
    }
  })();
});

export default router;
