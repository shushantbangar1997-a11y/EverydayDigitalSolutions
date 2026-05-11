import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, leadsTable, subscribersTable } from "@workspace/db";
import { AdminLoginBody, UpdateLeadBody } from "@workspace/api-zod";
import {
  verifyAdminPassword,
  setAdminCookie,
  clearAdminCookie,
  isAdminAuthed,
  requireAdmin,
} from "../lib/admin-auth";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  if (!verifyAdminPassword(parsed.data.password)) {
    req.log.warn("Admin login failed");
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  setAdminCookie(res);
  res.status(204).send();
});

router.post("/admin/logout", async (_req, res): Promise<void> => {
  clearAdminCookie(res);
  res.status(204).send();
});

router.get("/admin/me", async (req, res): Promise<void> => {
  res.json({ authenticated: isAdminAuthed(req) });
});

router.get("/admin/leads", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));
  res.json(rows);
});

router.patch(
  "/admin/leads/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (typeof rawId !== "string" || rawId.length === 0) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const parsed = UpdateLeadBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const updates: Record<string, unknown> = {};
    if (parsed.data.status !== undefined) updates["status"] = parsed.data.status;
    if (parsed.data.notes !== undefined) updates["notes"] = parsed.data.notes;
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const [row] = await db
      .update(leadsTable)
      .set(updates)
      .where(eq(leadsTable.id, rawId))
      .returning();

    if (!row) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    res.json(row);
  },
);

router.get("/admin/subscribers", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(subscribersTable)
    .orderBy(desc(subscribersTable.createdAt));
  res.json(rows);
});

export default router;
