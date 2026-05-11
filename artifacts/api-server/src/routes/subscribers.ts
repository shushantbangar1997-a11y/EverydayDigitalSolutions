import { Router, type IRouter } from "express";
import { db, subscribersTable } from "@workspace/db";
import { CreateSubscriberBody } from "@workspace/api-zod";
import { and, eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/subscribers", async (req, res): Promise<void> => {
  const parsed = CreateSubscriberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();
  const source = parsed.data.source.trim();

  // Idempotent: if a row already exists for (email, source), return it.
  const existing = await db
    .select()
    .from(subscribersTable)
    .where(and(eq(subscribersTable.email, email), eq(subscribersTable.source, source)))
    .limit(1);

  if (existing[0]) {
    res.status(201).json(existing[0]);
    return;
  }

  const [row] = await db
    .insert(subscribersTable)
    .values({ email, source })
    .returning();

  if (!row) {
    res.status(500).json({ error: "Failed to save subscriber" });
    return;
  }

  req.log.info({ subscriberId: row.id, source }, "Subscriber captured");
  res.status(201).json(row);
});

export default router;
