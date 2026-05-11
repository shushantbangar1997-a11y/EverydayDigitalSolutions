# Everyday Digital Solutions

Marketing site + lead-capture engine for an AI & custom software studio based in Mohali / Jalandhar, Punjab. Visitors fill a guided 6-step intake form; leads land in Postgres and are pushed to WhatsApp in real time. Internal staff manage leads from a single-password admin dashboard at `/admin`.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env:
  - `DATABASE_URL` — Postgres connection string (provisioned)
  - `SESSION_SECRET` — HMAC key for the admin cookie (provisioned, ≥16 chars)
  - `ADMIN_PASSWORD` — single password for `/admin` (set this manually)
  - `CALLMEBOT_API_KEY` — CallMeBot API key issued for the recipient phone (set this manually)
  - `CALLMEBOT_PHONE` — recipient WhatsApp number, international format with NO `+` (e.g. `919056066006`)
- Optional env:
  - `TRUST_ACTIVE_PROJECTS` (default `3`), `TRUST_SHIPPED_PROJECTS` (default `12`) — numbers shown in the hero trust ticker
  - `GOOGLE_SITE_VERIFICATION` (server / prerender) and/or `VITE_GOOGLE_SITE_VERIFICATION` (client) — token from Google Search Console, injected as `<meta name="google-site-verification">` by `SEO.tsx`. Set BOTH to the same value to keep SSR-rendered HTML and client hydration consistent. Set once after registering the property in GSC.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- API contract (source of truth): `lib/api-spec/openapi.yaml`
- DB schema: `lib/db/src/schema/` (`leads.ts`, `subscribers.ts`)
- API routes: `artifacts/api-server/src/routes/{leads,subscribers,stats,admin,health}.ts`
- WhatsApp helper: `artifacts/api-server/src/lib/whatsapp.ts`
- Admin auth (HMAC cookie): `artifacts/api-server/src/lib/admin-auth.ts`
- Marketing site: `artifacts/eds-site/src/`
  - Multi-step intake: `pages/contact.tsx`
  - Admin dashboard: `pages/admin.tsx` (+ `pages/admin/request-review.tsx` — one-click WhatsApp review-request composer)
  - Lead-magnet guide: `pages/resources/app-cost-guide-2026.tsx`
  - Free interactive tools: `pages/tools/{app-cost-calculator,ai-voice-agent-roi-calculator}.tsx`
  - Locality pages (8): `pages/{chandigarh,mohali,jalandhar}/*.tsx` driven by `content/locality-pages.ts` + shared `components/LocalityPageView.tsx`
  - Conversion accessories: `components/{StickyCTA,ExitIntent,LeadMagnet,Hero}.tsx`
  - SEO helpers: `components/{SEO,BreadcrumbsJsonLd}.tsx`
- SEO playbook (founder-facing, off-page work): `SEO_PLAYBOOK.md` at repo root.
- Image alt-text audit: `pnpm --filter @workspace/scripts run check-alt-text`
- Generated React Query hooks + Zod schemas: `lib/api-client-react/`, `lib/api-zod/`

## Architecture decisions

- **Contract-first**: every API change starts in `openapi.yaml` → `pnpm --filter @workspace/api-spec run codegen` → server validates with the generated Zod schemas, frontend uses the generated React Query hooks. Never hand-write fetch logic.
- **Lead capture is fail-soft**: a lead is persisted to Postgres BEFORE the WhatsApp call, and `sendWhatsApp()` never throws. If CallMeBot is down or env is missing, the lead is still saved and visible in `/admin`.
- **Admin auth is intentionally minimal**: single password compared with `crypto.timingSafeEqual`, signed with `SESSION_SECRET`-keyed HMAC into an httpOnly cookie. There is no user table — this is a 1–2-person studio.
- **Static-first frontend**: prerendered HTML for all marketing routes via `build-scripts/prerender.mjs`. `/admin` and `/resources/*` are deliberately excluded from the prerender list (admin is auth-gated, the resource page is reached from the lead magnet).
- **No emojis, no purple/blue, no glassmorphism** anywhere in the UI — see User preferences.

## Product

- Marketing site for service businesses in Punjab/Tricity (salons, clinics, real estate, restaurants).
- Conversion engine:
  - 6-step guided intake form on `/contact` → Postgres + WhatsApp ping to the founder.
  - Lead-magnet email capture (`/resources/app-cost-guide-2026`) on the homepage and via desktop exit-intent popup.
  - Sticky CTA bar (mobile bottom / desktop bottom-right) on every page except `/contact` and `/admin`, dismissible per session.
  - Live trust ticker in the hero powered by `/api/stats`.
- Admin: `/admin` lists leads + subscribers, lets staff update lead status (`new` → `contacted` → `qualified` → `closed_won`/`closed_lost`) and add internal notes.

## User preferences

- **No emojis** in UI copy or commit messages.
- **No purple/blue accents.** Brand color is the gold/ochre primary already in the theme.
- **No glassmorphism** (no frosted blurs over busy backgrounds).
- **Smart guided form, NOT an AI chat.**
- **No external email service** (Mailchimp, Brevo, etc.) — capture only.
- **No Calendly or external scheduling** — the founder responds on WhatsApp.

## Gotchas

- The recipient WhatsApp number must be registered with `@CallMeBot` first to receive an API key. Without `CALLMEBOT_API_KEY` + `CALLMEBOT_PHONE` set, leads still save but no notification fires — check API logs for `"CallMeBot env not configured"`.
- `CALLMEBOT_PHONE` must be the international number with no `+` (e.g. `919056066006`, not `+919056066006`).
- `ADMIN_PASSWORD` is compared by `timingSafeEqual` so length matters — both sides must be the same byte length to match (handled by the function returning false on length mismatch).
- After editing `openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` before typechecking — generated hook names are derived from `operationId`.
- Hero's live stats fall back to defaults (3 active / 12 shipped) when `/api/stats` hasn't loaded — safe for SSR/prerender.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
