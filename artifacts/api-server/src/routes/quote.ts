import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { GenerateQuoteBody } from "@workspace/api-zod";
import { randomBytes } from "crypto";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"] ?? "placeholder",
});

// ─── Pricing tables ───────────────────────────────────────────────────────────

const BASE_COST: Record<string, number> = {
  mobile_app_cross:  220000,
  mobile_app_single: 160000,
  web_app:           150000,
  website:            90000,
  ai_automation:     160000,
  ai_voice_agent:    180000,
};

const BASE_LABEL: Record<string, string> = {
  mobile_app_cross:  "Cross-platform Mobile App (iOS + Android) — Base Platform",
  mobile_app_single: "Single-platform Mobile App — Base Platform",
  web_app:           "Web Application — Base Platform",
  website:           "Marketing Website — Base Build",
  ai_automation:     "AI Automation System — Base Platform",
  ai_voice_agent:    "AI Voice Agent Platform — Base Build",
};

const FEATURE_COST: Record<string, number> = {
  user_auth:           25000,
  payments:            35000,
  admin_dashboard:     40000,
  push_notifications:  20000,
  booking_scheduling:  45000,
  loyalty_rewards:     30000,
  real_time_tracking:  35000,
  analytics_reporting: 30000,
  multi_language:      20000,
  crm_integration:     35000,
  whatsapp_automation: 25000,
  ai_chatbot:          45000,
  maps_location:       20000,
  file_uploads:        15000,
};

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

// Days added per feature (complex vs simple)
const FEATURE_DAYS: Record<string, number> = {
  user_auth:           3,
  payments:            6,
  admin_dashboard:     7,
  push_notifications:  3,
  booking_scheduling:  8,
  loyalty_rewards:     5,
  real_time_tracking:  6,
  analytics_reporting: 5,
  multi_language:      4,
  crm_integration:     6,
  whatsapp_automation: 4,
  ai_chatbot:          8,
  maps_location:       4,
  file_uploads:        3,
};

const BASE_DELIVERY: Record<string, { min: number; max: number }> = {
  mobile_app_cross:  { min: 35, max: 50 },
  mobile_app_single: { min: 25, max: 40 },
  web_app:           { min: 20, max: 35 },
  website:           { min: 10, max: 20 },
  ai_automation:     { min: 20, max: 35 },
  ai_voice_agent:    { min: 25, max: 40 },
};

const SCALE_MULTIPLIER: Record<string, number> = {
  small:  1.00,
  medium: 1.15,
  large:  1.30,
};

const SCALE_LABEL: Record<string, string> = {
  small:  "Scale adjustment (< 500 active users)",
  medium: "Scale adjustment (500–5,000 users) +15%",
  large:  "Scale adjustment (5,000+ users) +30%",
};

const TIMELINE_MARKUP: Record<string, number> = {
  asap:           0.30,
  within_1_month: 0.15,
  "1_to_3_months": 0.00,
  "3_to_6_months": -0.05,
  exploring:      0.00,
};

const MARGIN = 0.35;
const FLOOR  = 300000;
const VALID_DAYS = 30;

// ─── Helper: round to nearest 1000 ───────────────────────────────────────────

function r1k(n: number): number {
  return Math.round(n / 1000) * 1000;
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

  // ── 1. Deterministic pricing math ──────────────────────────────────────────

  const lineItems: { label: string; amount: number; note: string | null }[] = [];

  // Base cost
  const baseCost = BASE_COST[input.projectType] ?? 150000;
  lineItems.push({ label: BASE_LABEL[input.projectType] ?? "Base Platform", amount: baseCost, note: null });

  // Feature costs
  let featureCost = 0;
  for (const f of input.features) {
    const cost = FEATURE_COST[f];
    if (cost !== undefined) {
      featureCost += cost;
      lineItems.push({ label: FEATURE_LABEL[f] ?? f, amount: cost, note: null });
    }
  }

  // Scale multiplier
  const scaleMult = SCALE_MULTIPLIER[input.scale] ?? 1.0;
  const beforeScale = baseCost + featureCost;
  const scaleAdd = r1k(beforeScale * (scaleMult - 1));
  if (scaleMult > 1) {
    lineItems.push({ label: SCALE_LABEL[input.scale] ?? "Scale adjustment", amount: scaleAdd, note: null });
  }

  // Timeline urgency markup
  const timelineRate = TIMELINE_MARKUP[input.timeline] ?? 0;
  const preUrgency = beforeScale + scaleAdd;
  const urgencyAdd = r1k(preUrgency * timelineRate);
  if (urgencyAdd > 0) {
    const urgencyLabel = input.timeline === "asap"
      ? "Express delivery premium (+30%)"
      : "Accelerated timeline premium (+15%)";
    lineItems.push({ label: urgencyLabel, amount: urgencyAdd, note: null });
  } else if (urgencyAdd < 0) {
    lineItems.push({ label: "Flexible timeline discount (−5%)", amount: urgencyAdd, note: null });
  }

  const subtotalBeforeMargin = preUrgency + urgencyAdd;

  // EDS margin
  const marginAmount = r1k(subtotalBeforeMargin * MARGIN);
  lineItems.push({
    label: "EDS design, testing & delivery",
    amount: marginAmount,
    note: "Covers UX/UI design, QA, App Store submission, and post-launch support"
  });

  const rawTotal = subtotalBeforeMargin + marginAmount;
  const subtotal = r1k(rawTotal);
  const total = Math.max(r1k(rawTotal), FLOOR);

  // ── 2. Delivery estimate ────────────────────────────────────────────────────

  const base = BASE_DELIVERY[input.projectType] ?? { min: 25, max: 40 };
  let featureDays = 0;
  for (const f of input.features) {
    featureDays += FEATURE_DAYS[f] ?? 3;
  }
  const scaleDayMult = scaleMult > 1.2 ? 1.15 : 1.0;
  const urgencyDayMult = input.timeline === "asap" ? 0.75 : 1.0;
  const minDays = Math.round((base.min + featureDays * 0.5) * scaleDayMult * urgencyDayMult);
  const maxDays = Math.round((base.max + featureDays * 0.7) * scaleDayMult * urgencyDayMult);

  // ── 3. AI: executive summary + scope items ──────────────────────────────────

  const selectedFeatureLabels = input.features.map((f) => FEATURE_LABEL[f] ?? f);

  const promptMessages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a senior solutions architect at Everyday Digital Solutions (EDS), a software studio based in Mohali, Punjab, India. You write precise, confident, client-facing proposal copy. No fluff. No emojis. Write in plain British English.`,
    },
    {
      role: "user",
      content: `
Write a project proposal summary for the following brief.

Client: ${input.businessName ?? input.contactName}
Industry: ${input.industry}
Project type: ${BASE_LABEL[input.projectType] ?? input.projectType}
Features selected: ${selectedFeatureLabels.length > 0 ? selectedFeatureLabels.join(", ") : "none specified"}
Scale: ${input.scale}
Project description from client: "${input.projectDescription}"

Return ONLY valid JSON with this exact shape:
{
  "executiveSummary": "<2–3 sentences describing the client's problem and what EDS will build to solve it. Mention the specific project type and top 2–3 features by name. End with a confident statement about the business outcome.>",
  "scopeItems": [
    "<precise deliverable 1>",
    "<precise deliverable 2>",
    "<precise deliverable 3>",
    "<precise deliverable 4>",
    "<precise deliverable 5>",
    "<precise deliverable 6>"
  ]
}

scopeItems must be 6 items. Each is a one-sentence deliverable that will appear in the proposal. Be specific to this project. Do not repeat the feature names verbatim — describe what will actually be built.`.trim(),
    },
  ];

  let executiveSummary = `EDS will design and ship a custom ${BASE_LABEL[input.projectType] ?? "digital product"} for ${input.businessName ?? input.contactName}. The build includes ${selectedFeatureLabels.slice(0, 3).join(", ")} and is scoped to deliver within ${minDays}–${maxDays} days.`;
  let scopeItems: string[] = selectedFeatureLabels.slice(0, 6).map((f) => `${f} — fully designed and integrated`);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      max_completion_tokens: 1024,
      messages: promptMessages,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed2 = JSON.parse(jsonMatch[0]) as { executiveSummary?: string; scopeItems?: string[] };
      if (typeof parsed2.executiveSummary === "string") executiveSummary = parsed2.executiveSummary;
      if (Array.isArray(parsed2.scopeItems) && parsed2.scopeItems.length > 0) scopeItems = parsed2.scopeItems;
    }
  } catch (err) {
    req.log.warn({ err }, "AI generation failed — using fallback copy");
  }

  // ── 4. Build response ───────────────────────────────────────────────────────

  const quoteRef = `EDS-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  res.status(200).json({
    quoteRef,
    businessName: input.businessName ?? null,
    contactName: input.contactName,
    generatedAt: new Date().toISOString(),
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
