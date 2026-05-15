import { Router, type IRouter, type Request } from "express";
import { z } from "zod";
import { and, asc, count, desc, eq, gte, ilike, inArray, lte, or, type SQL } from "drizzle-orm";
import { db, leadsTable, leadActivityTable, subscribersTable } from "@workspace/db";
import {
  AdminLoginBody,
  UpdateLeadBody,
  LeadStatus,
  Industry,
  Timeline,
  BudgetBand,
} from "@workspace/api-zod";
import {
  verifyAdminPassword,
  setAdminCookie,
  clearAdminCookie,
  isAdminAuthed,
  getAdminSessionExpiresAt,
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
  const authenticated = isAdminAuthed(req);
  const expiresAtMs = authenticated ? getAdminSessionExpiresAt(req) : null;
  res.json({
    authenticated,
    expiresAt: expiresAtMs ? new Date(expiresAtMs).toISOString() : null,
  });
});

router.post("/admin/refresh", requireAdmin, async (_req, res): Promise<void> => {
  setAdminCookie(res);
  res.status(204).send();
});

const LeadsQuery = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  status: z.union([z.nativeEnum(LeadStatus), z.literal("all")]).optional(),
  industry: z.nativeEnum(Industry).optional(),
  city: z.string().trim().min(1).max(100).optional(),
  budget: z.nativeEnum(BudgetBand).optional(),
  timeline: z.nativeEnum(Timeline).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.enum(["createdAt:desc", "createdAt:asc"]).default("createdAt:desc"),
});

function buildLeadPredicates(input: z.infer<typeof LeadsQuery>): SQL | undefined {
  const conds: SQL[] = [];
  if (input.q) {
    const pattern = `%${input.q}%`;
    const search = or(
      ilike(leadsTable.name, pattern),
      ilike(leadsTable.businessName, pattern),
      ilike(leadsTable.email, pattern),
      ilike(leadsTable.whatsappNumber, pattern),
      ilike(leadsTable.city, pattern),
    );
    if (search) conds.push(search);
  }
  if (input.status && input.status !== "all") {
    conds.push(eq(leadsTable.status, input.status));
  }
  if (input.industry) conds.push(eq(leadsTable.industry, input.industry));
  if (input.city) conds.push(ilike(leadsTable.city, input.city));
  if (input.budget) conds.push(eq(leadsTable.budget, input.budget));
  if (input.timeline) conds.push(eq(leadsTable.timeline, input.timeline));
  if (input.from) conds.push(gte(leadsTable.createdAt, input.from));
  if (input.to) conds.push(lte(leadsTable.createdAt, input.to));
  return conds.length ? and(...conds) : undefined;
}

function parseLeadsQuery(
  req: Request,
): { ok: true; value: z.infer<typeof LeadsQuery> } | { ok: false; error: string } {
  const parsed = LeadsQuery.safeParse(req.query);
  if (!parsed.success) return { ok: false, error: "Invalid query" };
  if (parsed.data.from && parsed.data.to && parsed.data.from > parsed.data.to) {
    return { ok: false, error: "`from` must be before `to`" };
  }
  return { ok: true, value: parsed.data };
}

router.get("/admin/leads", requireAdmin, async (req, res): Promise<void> => {
  const parsed = parseLeadsQuery(req);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const q = parsed.value;
  const where = buildLeadPredicates(q);
  const orderBy = q.sort === "createdAt:asc" ? asc(leadsTable.createdAt) : desc(leadsTable.createdAt);

  const baseQuery = db.select().from(leadsTable);
  const baseCount = db.select({ n: count() }).from(leadsTable);

  const [items, totalRows] = await Promise.all([
    (where ? baseQuery.where(where) : baseQuery)
      .orderBy(orderBy)
      .limit(q.pageSize)
      .offset((q.page - 1) * q.pageSize),
    where ? baseCount.where(where) : baseCount,
  ]);

  res.json({
    items,
    total: totalRows[0]?.n ?? 0,
    page: q.page,
    pageSize: q.pageSize,
  });
});

router.get("/admin/leads.csv", requireAdmin, async (req, res): Promise<void> => {
  const parsed = parseLeadsQuery(req);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const q = parsed.value;
  const where = buildLeadPredicates(q);
  const orderBy = q.sort === "createdAt:asc" ? asc(leadsTable.createdAt) : desc(leadsTable.createdAt);

  const baseQuery = db.select().from(leadsTable);
  const rows = await (where ? baseQuery.where(where) : baseQuery).orderBy(orderBy);

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

function getPathId(req: Request): string | null {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

router.patch(
  "/admin/leads/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawId = getPathId(req);
    if (!rawId) {
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

    const row = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(leadsTable)
        .where(eq(leadsTable.id, rawId))
        .limit(1);
      if (!existing) return null;

      const [updated] = await tx
        .update(leadsTable)
        .set(updates)
        .where(eq(leadsTable.id, rawId))
        .returning();
      if (!updated) return null;

      const activities: { type: string; fromValue: string | null; toValue: string | null }[] = [];
      if (parsed.data.status !== undefined && existing.status !== updated.status) {
        activities.push({
          type: "status_changed",
          fromValue: existing.status,
          toValue: updated.status,
        });
      }
      if (parsed.data.notes !== undefined && (existing.notes ?? "") !== (updated.notes ?? "")) {
        activities.push({
          type: "notes_changed",
          fromValue: existing.notes ?? null,
          toValue: updated.notes ?? null,
        });
      }
      if (activities.length > 0) {
        await tx
          .insert(leadActivityTable)
          .values(activities.map((a) => ({ leadId: rawId, ...a })));
      }
      return updated;
    });

    if (!row) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    res.json(row);
  },
);

router.delete(
  "/admin/leads/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawId = getPathId(req);
    if (!rawId) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const ok = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(leadsTable)
        .where(eq(leadsTable.id, rawId))
        .limit(1);
      if (!existing) return false;

      await tx.insert(leadActivityTable).values({
        leadId: rawId,
        type: "deleted",
        leadSnapshot: existing,
      });
      await tx.delete(leadsTable).where(eq(leadsTable.id, rawId));
      return true;
    });

    if (!ok) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.status(204).send();
  },
);

const BulkLeadsBody = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("set_status"),
    ids: z.array(z.string().uuid()).min(1).max(200),
    value: z.nativeEnum(LeadStatus),
  }),
  z.object({
    action: z.literal("delete"),
    ids: z.array(z.string().uuid()).min(1).max(200),
  }),
]);

router.post("/admin/leads/bulk", requireAdmin, async (req, res): Promise<void> => {
  const parsed = BulkLeadsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { ids } = parsed.data;

  const affected = await db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(leadsTable)
      .where(inArray(leadsTable.id, ids));
    if (existing.length === 0) return 0;

    if (parsed.data.action === "set_status") {
      const newStatus = parsed.data.value;
      const changed = existing.filter((row) => row.status !== newStatus);
      if (changed.length === 0) return existing.length;
      await tx
        .update(leadsTable)
        .set({ status: newStatus })
        .where(inArray(leadsTable.id, changed.map((r) => r.id)));
      await tx.insert(leadActivityTable).values(
        changed.map((r) => ({
          leadId: r.id,
          type: "status_changed",
          fromValue: r.status,
          toValue: newStatus,
        })),
      );
      return existing.length;
    }

    // delete
    await tx.insert(leadActivityTable).values(
      existing.map((r) => ({
        leadId: r.id,
        type: "deleted",
        leadSnapshot: r,
      })),
    );
    await tx
      .delete(leadsTable)
      .where(inArray(leadsTable.id, existing.map((r) => r.id)));
    return existing.length;
  });

  res.json({ affected });
});

router.get(
  "/admin/leads/:id/activity",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawId = getPathId(req);
    if (!rawId) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const rows = await db
      .select({
        id: leadActivityTable.id,
        type: leadActivityTable.type,
        fromValue: leadActivityTable.fromValue,
        toValue: leadActivityTable.toValue,
        createdAt: leadActivityTable.createdAt,
      })
      .from(leadActivityTable)
      .where(eq(leadActivityTable.leadId, rawId))
      .orderBy(desc(leadActivityTable.createdAt))
      .limit(100);
    res.json({ items: rows });
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
