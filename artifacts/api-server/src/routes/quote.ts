import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { GenerateQuoteBody } from "@workspace/api-zod";
import { randomBytes } from "crypto";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"] ?? "placeholder",
});

// ─── Pricing model ────────────────────────────────────────────────────────────
//
// Everything is effort-based: person-days × blended daily team rate.
//
// DAILY_RATE  = all-in blended rate for the team that builds this type of
//               project (devs + designer + PM overhead + EDS margin).
//               Based on Mohali/Tricity 2026 market rates.
//
// BASE_EFFORT = person-days to build the core platform with no optional
//               features (login, basic CRUD, deployment pipeline, etc.)
//
// FEATURE_DAYS = additional person-days each optional feature adds on top.
//               Derived from real sprint estimates — auth is ~3 days,
//               a payment gateway integration is ~6 days of dev + testing, etc.
//
// PHASES split the base effort into:
//   • Discovery & UX  — 20 % of base (wireframes, flows, architecture)
//   • Development     — 80 % of base + 100 % of each feature's days
//   • QA & testing    — 15 % of total dev days (manual + automated cycle)
//   • Deployment      — fixed per project type (CI/CD, store submission, DNS)
//
// Scale and urgency are applied as explicit line-item adjustments on the
// pre-adjustment subtotal so the client can see exactly what they add.
// ─────────────────────────────────────────────────────────────────────────────

/** Blended daily team rate in ₹ (devs + design + PM + EDS margin, all-in) */
const DAILY_RATE: Record<string, number> = {
  mobile_app_cross:  16500,   // senior dev × 2 + designer — both platforms
  mobile_app_single: 13000,   // senior dev + mid dev + designer
  web_app:           11500,   // 2 devs + designer, part-time PM
  website:            9500,   // mid dev + designer
  ai_automation:     15500,   // AI engineer + backend dev
  ai_voice_agent:    19000,   // AI specialist + infra engineer
};

/** Base effort in person-days to build the core platform */
const BASE_EFFORT: Record<string, number> = {
  mobile_app_cross:  26,
  mobile_app_single: 19,
  web_app:           15,
  website:            9,
  ai_automation:     22,
  ai_voice_agent:    26,
};

/** Human-readable project type labels */
const BASE_LABEL: Record<string, string> = {
  mobile_app_cross:  "Cross-platform Mobile App (iOS + Android)",
  mobile_app_single: "Single-platform Mobile App",
  web_app:           "Web Application",
  website:           "Marketing Website",
  ai_automation:     "AI Automation System",
  ai_voice_agent:    "AI Voice Agent Platform",
};

/** Additional person-days each optional feature adds */
const FEATURE_DAYS: Record<string, number> = {
  user_auth:            3,   // OTP/email auth, session management
  payments:             6,   // gateway API, webhook handling, reconciliation
  admin_dashboard:      7,   // full CRUD portal, roles, export
  push_notifications:   3,   // FCM/APNS setup, template engine
  booking_scheduling:   9,   // calendar engine, conflict resolution, staff availability
  loyalty_rewards:      5,   // points ledger, expiry logic, redemption UI
  real_time_tracking:   6,   // websocket/SSE, live sync, conflict handling
  analytics_reporting:  5,   // dashboards, charting, data aggregation
  multi_language:       4,   // i18n setup, 3-language content extraction
  crm_integration:      6,   // API mapping, field sync, error handling
  whatsapp_automation:  4,   // CallMeBot / WABA API, message templates
  ai_chatbot:           9,   // model wiring, context management, fallback/escalation
  maps_location:        3,   // Maps SDK, geocoding, search
  file_uploads:         2,   // storage, resizing, CDN delivery
};

/** Human-readable feature labels */
const FEATURE_LABEL: Record<string, string> = {
  user_auth:           "User Authentication & Profiles",
  payments:            "Payment Gateway (UPI, Card, Net Banking)",
  admin_dashboard:     "Admin Dashboard & Management Portal",
  push_notifications:  "Push Notifications & Automated Reminders",
  booking_scheduling:  "Booking & Appointment Scheduling Engine",
  loyalty_rewards:     "Loyalty Points & Rewards Programme",
  real_time_tracking:  "Real-time Data Sync & Live Updates",
  analytics_reporting: "Analytics Dashboard & Business Reports",
  multi_language:      "Multi-language Support",
  crm_integration:     "CRM / Third-party Integration",
  whatsapp_automation: "WhatsApp Automation & Notifications",
  ai_chatbot:          "AI Chatbot / Conversational Interface",
  maps_location:       "Maps, Location & Geofencing",
  file_uploads:        "Photo & Document Upload Handling",
};

/** Fixed deployment cost per project type */
const DEPLOYMENT_COST: Record<string, number> = {
  mobile_app_cross:  35000,  // both stores + CI/CD + OTA updates setup
  mobile_app_single: 22000,  // one store + CI/CD
  web_app:           14000,  // hosting, env setup, monitoring
  website:            9000,  // hosting, DNS, CDN, SSL
  ai_automation:     17000,  // infra provisioning, API gateway, monitoring
  ai_voice_agent:    22000,  // telephony stack, SIP config, monitoring
};

/** Scale multiplier applied to pre-adjustment subtotal */
const SCALE_MULTIPLIER: Record<string, number> = {
  small:  1.00,   // < 500 users — standard infra
  medium: 1.20,   // 500–5K — load testing, autoscale, staging env
  large:  1.45,   // 5K+ — distributed systems, CDN, performance audit
};

const SCALE_NOTE: Record<string, string> = {
  medium: "Covers load testing, autoscaling infrastructure, and a full staging environment",
  large:  "Covers distributed architecture, CDN, database sharding, and performance audit",
};

/** Urgency markup/discount applied after scale */
const TIMELINE_MARKUP: Record<string, number> = {
  asap:             0.35,   // dedicated team, overtime, expedited reviews
  within_1_month:   0.18,   // accelerated sprint cadence
  "1_to_3_months":  0.00,
  "3_to_6_months": -0.08,   // allows better planning, less rework
  exploring:        0.00,
};

/** Phases as fractions of base effort */
const DISCOVERY_FRACTION = 0.20;  // discovery + UX out of base effort
const QA_FRACTION        = 0.15;  // QA days as fraction of total dev days

const FLOOR      = 300000;
const VALID_DAYS = 30;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function r1k(n: number): number {
  return Math.round(n / 1000) * 1000;
}

function fmtRate(rate: number): string {
  return `₹${(rate / 1000).toFixed(1)}K`;
}

// ─── Quote route ──────────────────────────────────────────────────────────────

router.post("/quote/generate", async (req, res): Promise<void> => {
  const parsed = GenerateQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ issues: parsed.error.issues }, "Invalid quote body");
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const input = parsed.data;

  // ── 1. Effort calculation ─────────────────────────────────────────────────

  const dailyRate   = DAILY_RATE[input.projectType] ?? 11500;
  const baseDays    = BASE_EFFORT[input.projectType] ?? 15;

  const discoveryDays = Math.round(baseDays * DISCOVERY_FRACTION);
  const baseDev       = baseDays - discoveryDays;                      // 80 % of base

  const featureDaysMap: { key: string; days: number }[] = input.features
    .filter((f) => FEATURE_DAYS[f] !== undefined)
    .map((f) => ({ key: f, days: FEATURE_DAYS[f]! }));

  const totalFeatureDays = featureDaysMap.reduce((s, f) => s + f.days, 0);
  const totalDevDays     = baseDays + totalFeatureDays;
  const qaDays           = Math.round(totalDevDays * QA_FRACTION);
  const deploymentCost   = DEPLOYMENT_COST[input.projectType] ?? 15000;

  // ── 2. Build line items ───────────────────────────────────────────────────

  const lineItems: { label: string; amount: number; note: string | null }[] = [];

  // Discovery & UX
  const discoveryAmt = r1k(discoveryDays * dailyRate);
  lineItems.push({
    label:  "Discovery, UX design & technical architecture",
    amount: discoveryAmt,
    note:   `${discoveryDays} days — wireframes, user flows, data model, API design`,
  });

  // Base platform development
  const baseDevAmt = r1k(baseDev * dailyRate);
  lineItems.push({
    label:  `${BASE_LABEL[input.projectType] ?? "Platform"} — core development`,
    amount: baseDevAmt,
    note:   `${baseDev} days × ${fmtRate(dailyRate)}/day`,
  });

  // Per-feature items
  for (const { key, days } of featureDaysMap) {
    const amt = r1k(days * dailyRate);
    lineItems.push({
      label:  FEATURE_LABEL[key] ?? key,
      amount: amt,
      note:   `${days} days × ${fmtRate(dailyRate)}/day`,
    });
  }

  // QA & testing
  const qaAmt = r1k(qaDays * dailyRate);
  lineItems.push({
    label:  "QA, testing & bug resolution",
    amount: qaAmt,
    note:   `${qaDays} days — manual + automated testing across all features`,
  });

  // Deployment
  lineItems.push({
    label:  input.projectType.startsWith("mobile")
              ? "App Store & Play Store submission + production deployment"
              : "Production deployment, infrastructure setup & monitoring",
    amount: deploymentCost,
    note:   input.projectType.startsWith("mobile")
              ? "CI/CD pipeline, over-the-air update config, both stores"
              : "Hosting, SSL, domain, CDN, env config",
  });

  // Pre-adjustment subtotal (all dev + deployment, before scale/urgency)
  const preAdjustment = lineItems.reduce((s, l) => s + l.amount, 0);

  // Scale adjustment
  const scaleMult = SCALE_MULTIPLIER[input.scale] ?? 1.0;
  const scaleAdd  = r1k(preAdjustment * (scaleMult - 1));
  if (scaleAdd > 0) {
    const pct = Math.round((scaleMult - 1) * 100);
    lineItems.push({
      label:  `Scale adjustment — ${input.scale} (+${pct}%)`,
      amount: scaleAdd,
      note:   SCALE_NOTE[input.scale] ?? null,
    });
  }

  // Urgency
  const urgencyRate = TIMELINE_MARKUP[input.timeline] ?? 0;
  const preUrgency  = preAdjustment + scaleAdd;
  const urgencyAdd  = r1k(preUrgency * urgencyRate);
  if (urgencyAdd > 0) {
    const pct = Math.round(urgencyRate * 100);
    lineItems.push({
      label:  input.timeline === "asap"
                ? `Express delivery premium (+${pct}%)`
                : `Accelerated timeline premium (+${pct}%)`,
      amount: urgencyAdd,
      note:   input.timeline === "asap"
                ? "Dedicated team, parallel sprints, expedited reviews"
                : "Condensed sprint cadence, priority scheduling",
    });
  } else if (urgencyAdd < 0) {
    const pct = Math.abs(Math.round(urgencyRate * 100));
    lineItems.push({
      label:  `Flexible timeline discount (−${pct}%)`,
      amount: urgencyAdd,
      note:   "Allows better sprint planning and reduced rework",
    });
  }

  const rawTotal = preUrgency + urgencyAdd;
  const subtotal = r1k(rawTotal);
  const total    = Math.max(subtotal, FLOOR);

  // ── 3. Delivery estimate ──────────────────────────────────────────────────
  //
  // Delivery = totalDevDays + qaDays (in calendar days, accounting for
  // parallel work across team members).
  // A 2-person team working in parallel means we apply a parallelism
  // factor of 0.65 — not every day of effort maps to a calendar day.
  // Urgency (ASAP) compresses this by running two tracks simultaneously.

  const parallelismFactor = input.projectType.startsWith("mobile_app")
    ? 0.62   // larger teams, more parallelism
    : 0.70;

  const urgencyTimeFactor = input.timeline === "asap"
    ? 0.75
    : input.timeline === "within_1_month"
    ? 0.88
    : 1.00;

  const scaleDayFactor = scaleMult > 1.3 ? 1.18 : scaleMult > 1.0 ? 1.08 : 1.00;

  const rawCalendarDays = (totalDevDays + qaDays) * parallelismFactor * scaleDayFactor * urgencyTimeFactor;
  const minDays = Math.round(rawCalendarDays * 0.92);
  const maxDays = Math.round(rawCalendarDays * 1.12);

  // ── 4. AI scope copy ─────────────────────────────────────────────────────

  const selectedFeatureLabels = featureDaysMap.map(({ key }) => FEATURE_LABEL[key] ?? key);

  const promptMessages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a senior solutions architect at Everyday Digital Solutions (EDS), a software studio in Mohali, Punjab, India. You write precise, confident, client-facing proposal copy. No fluff. No emojis. Plain British English.`,
    },
    {
      role: "user",
      content: `Write a project proposal summary for this brief.

Client: ${input.businessName ?? input.contactName}
Industry: ${input.industry}
Project type: ${BASE_LABEL[input.projectType] ?? input.projectType}
Features: ${selectedFeatureLabels.length > 0 ? selectedFeatureLabels.join(", ") : "core platform only"}
Scale: ${input.scale}
Timeline: ${input.timeline}
Client's description: "${input.projectDescription}"
Total investment: ₹${total.toLocaleString("en-IN")}
Delivery window: ${minDays}–${maxDays} working days

Return ONLY valid JSON:
{
  "executiveSummary": "<2–3 sentences: client's problem, what EDS will build, specific project type + top 2–3 features by name, business outcome. Confident tone.>",
  "scopeItems": [
    "<deliverable 1 — specific, not a feature name repeat>",
    "<deliverable 2>",
    "<deliverable 3>",
    "<deliverable 4>",
    "<deliverable 5>",
    "<deliverable 6>"
  ]
}

scopeItems must be exactly 6 items. Each is one sentence describing what will actually be built and delivered.`.trim(),
    },
  ];

  let executiveSummary = `EDS will design and ship a custom ${BASE_LABEL[input.projectType] ?? "digital product"} for ${input.businessName ?? input.contactName}. The build covers ${selectedFeatureLabels.slice(0, 3).join(", ")} and is scoped to deliver within ${minDays}–${maxDays} working days at a total investment of ₹${total.toLocaleString("en-IN")}.`;
  let scopeItems: string[] = [
    ...selectedFeatureLabels.slice(0, 5).map((f) => `${f} — fully designed, built, and integrated`),
    "Production deployment, App Store submission, and 30-day post-launch support",
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      max_completion_tokens: 1024,
      messages: promptMessages,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const p = JSON.parse(jsonMatch[0]) as { executiveSummary?: string; scopeItems?: string[] };
      if (typeof p.executiveSummary === "string" && p.executiveSummary.length > 20) {
        executiveSummary = p.executiveSummary;
      }
      if (Array.isArray(p.scopeItems) && p.scopeItems.length >= 4) {
        scopeItems = p.scopeItems;
      }
    }
  } catch (err) {
    req.log.warn({ err }, "AI generation failed — using fallback copy");
  }

  // ── 5. Response ───────────────────────────────────────────────────────────

  const quoteRef = `EDS-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  res.status(200).json({
    quoteRef,
    businessName: input.businessName ?? null,
    contactName:  input.contactName,
    generatedAt:  new Date().toISOString(),
    lineItems,
    subtotal,
    total,
    delivery: { minDays, maxDays },
    executiveSummary,
    scopeItems,
    validDays: VALID_DAYS,
  });
});

export default router;
