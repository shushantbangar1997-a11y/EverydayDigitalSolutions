import { and, eq, isNotNull, lte, sql } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";
import { sendWhatsApp, formatLeadMessage } from "./whatsapp";
import { logger } from "./logger";

const SCAN_INTERVAL_MS = 60_000;
const MAX_ATTEMPTS = 5;

// Exponential backoff in seconds, indexed by current attempts count BEFORE
// the next try (i.e. attempts=0 → wait 60s, attempts=1 → 5min, etc.).
const BACKOFF_SEC = [60, 300, 1800, 7200, 28800];

export function nextRetryAt(currentAttempts: number): Date {
  const idx = Math.min(currentAttempts, BACKOFF_SEC.length - 1);
  return new Date(Date.now() + BACKOFF_SEC[idx]! * 1000);
}

/**
 * Mark a lead as needing a future retry. Bumps attempts, sets retryAfter
 * with exponential backoff. Caller passes the attempts count BEFORE this
 * failure (i.e. 0 on the first failure).
 */
export async function scheduleRetry(leadId: string, currentAttempts: number): Promise<void> {
  if (currentAttempts + 1 >= MAX_ATTEMPTS) {
    await db
      .update(leadsTable)
      .set({
        whatsappAttempts: currentAttempts + 1,
        whatsappRetryAfter: null,
      })
      .where(eq(leadsTable.id, leadId));
    logger.error({ leadId, attempts: currentAttempts + 1 }, "WhatsApp retries exhausted");
    return;
  }
  await db
    .update(leadsTable)
    .set({
      whatsappAttempts: currentAttempts + 1,
      whatsappRetryAfter: nextRetryAt(currentAttempts),
    })
    .where(eq(leadsTable.id, leadId));
}

async function runScan(): Promise<void> {
  const now = new Date();
  const due = await db
    .select()
    .from(leadsTable)
    .where(
      and(
        eq(leadsTable.whatsappNotificationSent, false),
        isNotNull(leadsTable.whatsappRetryAfter),
        lte(leadsTable.whatsappRetryAfter, now),
        sql`${leadsTable.whatsappAttempts} < ${MAX_ATTEMPTS}`,
      ),
    )
    .limit(20);

  if (due.length === 0) return;

  logger.info({ count: due.length }, "Retrying queued WhatsApp notifications");

  for (const lead of due) {
    try {
      const sent = await sendWhatsApp(formatLeadMessage(lead));
      if (sent) {
        await db
          .update(leadsTable)
          .set({ whatsappNotificationSent: true, whatsappRetryAfter: null })
          .where(eq(leadsTable.id, lead.id));
        logger.info({ leadId: lead.id }, "Queued WhatsApp delivered on retry");
      } else {
        await scheduleRetry(lead.id, lead.whatsappAttempts);
      }
    } catch (err) {
      logger.error({ err, leadId: lead.id }, "Retry attempt threw");
      await scheduleRetry(lead.id, lead.whatsappAttempts);
    }
  }
}

let timer: NodeJS.Timeout | null = null;

export function startWhatsAppRetryWorker(): void {
  if (timer) return;
  timer = setInterval(() => {
    runScan().catch((err) => logger.error({ err }, "WhatsApp retry scan failed"));
  }, SCAN_INTERVAL_MS);
  // Don't keep the event loop alive on shutdown.
  if (typeof timer.unref === "function") timer.unref();
  logger.info({ intervalMs: SCAN_INTERVAL_MS }, "WhatsApp retry worker started");
}
