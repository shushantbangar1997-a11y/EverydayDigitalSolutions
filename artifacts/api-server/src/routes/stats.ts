import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

router.get("/stats", async (_req, res): Promise<void> => {
  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(leadsTable);

  res.json({
    activeProjects: intEnv("TRUST_ACTIVE_PROJECTS", 3),
    projectsShipped: intEnv("TRUST_SHIPPED_PROJECTS", 12),
    leadsAllTime: count ?? 0,
  });
});

export default router;
