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
  checkLoginLockout,
  recordLoginFailure,
  recordLoginSuccess,
} from "../lib/admin-auth";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const lockedMs = checkLoginLockout(req);
  if (lockedMs > 0) {
    const retrySec = Math.ceil(lockedMs / 1000);
    req.log.warn({ retrySec }, "Admin login locked out");
    res.setHeader("Retry-After", String(retrySec));
    res.status(429).json({ error: "Too many attempts. Try again later." });
    return;
  }

  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  if (!verifyAdminPassword(parsed.data.password)) {
    recordLoginFailure(req);
    req.log.warn("Admin login failed");
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  recordLoginSuccess(req);
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

router.get("/admin/leads.csv", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));
  const headers = [
    "id",
    "createdAt",
    "name",
    "businessName",
    "whatsappNumber",
    "email",
    "city",
    "industry",
    "problem",
    "currentSolution",
    "goalIn3Months",
    "budget",
    "timeline",
    "status",
    "notes",
    "sessionId",
    "whatsappNotificationSent",
  ];
  const escape = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "string" ? v : JSON.stringify(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.createdAt.toISOString(),
        r.name,
        r.businessName,
        r.whatsappNumber,
        r.email,
        r.city,
        r.industry,
        r.problem,
        r.currentSolution,
        r.goalIn3Months,
        r.budget,
        r.timeline,
        r.status,
        r.notes,
        r.sessionId,
        r.whatsappNotificationSent,
      ]
        .map(escape)
        .join(","),
    );
  }
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
  );
  res.send(lines.join("\n"));
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
