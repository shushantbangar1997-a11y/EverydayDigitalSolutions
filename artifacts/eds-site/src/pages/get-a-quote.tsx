import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, ArrowLeft, ArrowRight, Download, MessageCircle, FileText } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectType = "mobile_app_cross" | "mobile_app_single" | "web_app" | "website" | "ai_automation" | "ai_voice_agent";
type Scale = "small" | "medium" | "large";
type Timeline = "asap" | "within_1_month" | "1_to_3_months" | "3_to_6_months" | "exploring";
type Industry = "salon_spa" | "real_estate" | "clinic_healthcare" | "restaurant_cafe" | "other_service" | "other";

interface QuoteLineItem { label: string; amount: number; note: string | null }
interface QuoteResult {
  quoteRef: string;
  businessName: string | null;
  contactName: string;
  generatedAt: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  total: number;
  delivery: { minDays: number; maxDays: number };
  executiveSummary: string;
  scopeItems: string[];
  validDays: number;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "salon_spa",          label: "Salon / Spa / Beauty" },
  { value: "real_estate",        label: "Real Estate" },
  { value: "clinic_healthcare",  label: "Clinic / Healthcare" },
  { value: "restaurant_cafe",    label: "Restaurant / Cafe" },
  { value: "other_service",      label: "Other service business" },
  { value: "other",              label: "Something else / not sure" },
];

const PROJECT_TYPES: { value: ProjectType; label: string; description: string }[] = [
  { value: "mobile_app_cross",  label: "Mobile App — iOS + Android", description: "Full cross-platform app, one codebase, both stores" },
  { value: "mobile_app_single", label: "Mobile App — Single platform", description: "iOS only or Android only" },
  { value: "web_app",           label: "Web Application",             description: "Browser-based tool, dashboard, or SaaS product" },
  { value: "website",           label: "Marketing Website",           description: "Brand site, landing page, lead-capture site" },
  { value: "ai_automation",     label: "AI Automation System",        description: "Automate workflows, lead follow-up, or internal ops" },
  { value: "ai_voice_agent",    label: "AI Voice Agent",              description: "Inbound / outbound voice AI for calls and inquiries" },
];

const ALL_FEATURES: { key: string; label: string; description: string }[] = [
  { key: "user_auth",           label: "User Login & Profiles",            description: "OTP / email auth, account management" },
  { key: "booking_scheduling",  label: "Booking & Appointments",           description: "Real-time slot picker, staff calendars" },
  { key: "payments",            label: "Payments (UPI, Card)",             description: "UPI, cards, net banking, wallets" },
  { key: "admin_dashboard",     label: "Admin / Owner Dashboard",          description: "Web portal to manage everything" },
  { key: "push_notifications",  label: "Push Notifications",               description: "Automated reminders, booking alerts" },
  { key: "loyalty_rewards",     label: "Loyalty & Rewards",                description: "Points system, member tiers" },
  { key: "whatsapp_automation", label: "WhatsApp Automation",              description: "Auto-messages for leads, reminders, follow-ups" },
  { key: "analytics_reporting", label: "Analytics & Reports",              description: "Revenue, bookings, conversion dashboards" },
  { key: "crm_integration",     label: "CRM / Third-party Integration",    description: "Sync with Zoho, HubSpot, Shopify, etc." },
  { key: "ai_chatbot",          label: "AI Chatbot / Assistant",           description: "Conversational bot on website or app" },
  { key: "real_time_tracking",  label: "Real-time Tracking",               description: "Live data sync, order/delivery tracking" },
  { key: "maps_location",       label: "Maps & Location",                  description: "Store locator, geofencing, directions" },
  { key: "multi_language",      label: "Multi-language Support",           description: "English + Hindi + Punjabi or others" },
  { key: "file_uploads",        label: "File & Photo Uploads",             description: "Document storage, image handling" },
];

const FEATURES_BY_TYPE: Record<ProjectType, string[]> = {
  mobile_app_cross:  ["user_auth","booking_scheduling","payments","push_notifications","admin_dashboard","loyalty_rewards","real_time_tracking","analytics_reporting","maps_location","multi_language","file_uploads"],
  mobile_app_single: ["user_auth","booking_scheduling","payments","push_notifications","admin_dashboard","loyalty_rewards","real_time_tracking","analytics_reporting","maps_location","file_uploads"],
  web_app:           ["user_auth","admin_dashboard","payments","analytics_reporting","crm_integration","whatsapp_automation","booking_scheduling","file_uploads","multi_language","maps_location"],
  website:           ["admin_dashboard","whatsapp_automation","analytics_reporting","booking_scheduling","maps_location","file_uploads"],
  ai_automation:     ["whatsapp_automation","crm_integration","ai_chatbot","analytics_reporting","user_auth","admin_dashboard"],
  ai_voice_agent:    ["whatsapp_automation","crm_integration","ai_chatbot","analytics_reporting","admin_dashboard","user_auth"],
};

const SCALES: { value: Scale; label: string; description: string }[] = [
  { value: "small",  label: "Small",  description: "Under 500 users / clients per month" },
  { value: "medium", label: "Medium", description: "500 – 5,000 users / clients per month" },
  { value: "large",  label: "Large",  description: "5,000+ users — multi-location or citywide" },
];

const TIMELINES: { value: Timeline; label: string }[] = [
  { value: "asap",           label: "ASAP — start within days" },
  { value: "within_1_month", label: "Within 1 month" },
  { value: "1_to_3_months",  label: "1–3 months from now" },
  { value: "3_to_6_months",  label: "3–6 months from now" },
  { value: "exploring",      label: "Just exploring options" },
];

const PROCESSING_STEPS = [
  "Reading your project brief...",
  "Analysing feature complexity...",
  "Calculating build timeline...",
  "Pricing each deliverable...",
  "Applying EDS delivery standards...",
  "Finalising your proposal...",
];

const STEP_LABELS = ["Industry", "Project type", "Features", "Scale", "Contact", "Your quote"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} lakh`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function fmtFull(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function escHtml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ─── Step dots ────────────────────────────────────────────────────────────────

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <ol className="flex items-center gap-2 mb-8 overflow-x-auto">
      {Array.from({ length: total }, (_, i) => {
        const done   = i < step;
        const active = i === step;
        return (
          <li key={i} className="flex items-center gap-2 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-colors ${
              done   ? "bg-primary text-black border-primary"
            : active ? "border-primary text-primary"
            :          "border-border text-muted-foreground"}`}>
              {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs hidden md:inline ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {STEP_LABELS[i]}
            </span>
            {i < total - 1 && <span className="hidden md:inline w-6 h-px bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

// ─── PDF download ─────────────────────────────────────────────────────────────

function downloadProposalPdf(q: QuoteResult, industry: Industry, projectType: ProjectType): void {
  const today = new Date(q.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const clientName = q.businessName ?? q.contactName;
  const ptLabel = PROJECT_TYPES.find((p) => p.value === projectType)?.label ?? projectType;

  const rows = q.lineItems.map((item) => `
    <tr>
      <td>${escHtml(item.label)}</td>
      <td class="amt">${fmtFull(item.amount)}</td>
      ${item.note ? `<td class="note">${escHtml(item.note)}</td>` : `<td class="note">—</td>`}
    </tr>`).join("");

  const scopeList = q.scopeItems.map((s) => `<li>${escHtml(s)}</li>`).join("");

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<title>Proposal — ${escHtml(clientName)} — Everyday Digital Solutions</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Georgia,serif;color:#111;line-height:1.6;background:#fff}
  
  /* Cover */
  .cover{background:#0f0d0b;color:#fff;min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:60px 64px;page-break-after:always}
  .cover-logo{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#c9a227;font-family:system-ui,sans-serif;font-weight:700;margin-bottom:80px}
  .cover-rule{width:60px;height:3px;background:#c9a227;margin:32px 0}
  .cover-tag{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#c9a227;font-family:system-ui,sans-serif;margin-bottom:16px}
  .cover-title{font-size:36px;line-height:1.2;color:#fff;margin-bottom:8px}
  .cover-sub{font-size:16px;color:rgba(255,255,255,.6);font-style:italic}
  .cover-footer{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;border-top:1px solid rgba(255,255,255,.1);padding-top:32px;font-size:11px;font-family:system-ui,sans-serif;color:rgba(255,255,255,.5)}
  .cover-footer strong{color:#fff;display:block;margin-bottom:4px;font-size:10px;text-transform:uppercase;letter-spacing:.12em}
  .cover-badge{display:inline-block;background:#c9a227;color:#0f0d0b;padding:10px 24px;font-size:12px;font-family:system-ui,sans-serif;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:32px}

  /* Content pages */
  .page{padding:56px 64px;max-width:860px;margin:0 auto}
  @media print{.page{padding:40px 48px}}
  
  h1.section-num{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#c9a227;font-family:system-ui,sans-serif;margin-bottom:8px}
  h2.section-title{font-size:26px;margin-bottom:24px;color:#0f0d0b}
  .divider{height:1px;background:#e5e0d8;margin:40px 0}
  
  p.body{font-size:15px;color:#333;margin-bottom:16px;line-height:1.7}
  
  /* Scope list */
  .scope-list{list-style:none;display:flex;flex-direction:column;gap:12px;margin:24px 0}
  .scope-list li{display:flex;gap:14px;font-size:14px;color:#333;align-items:flex-start;line-height:1.55}
  .scope-list li::before{content:"";width:6px;height:6px;border-radius:50%;background:#c9a227;flex-shrink:0;margin-top:7px}
  
  /* Investment table */
  table{width:100%;border-collapse:collapse;font-size:13px;margin-top:16px}
  thead tr{background:#0f0d0b;color:#fff}
  thead th{padding:10px 14px;text-align:left;font-family:system-ui,sans-serif;font-size:10px;letter-spacing:.1em;text-transform:uppercase}
  tbody tr:nth-child(odd){background:#faf8f4}
  tbody tr:nth-child(even){background:#fff}
  td{padding:10px 14px;vertical-align:top;color:#333}
  td.amt{text-align:right;font-family:system-ui,sans-serif;font-weight:600;white-space:nowrap;color:#0f0d0b}
  td.note{font-size:11px;color:#777;font-style:italic}
  .total-row{background:#c9a227!important}
  .total-row td{font-weight:700;font-size:15px;color:#0f0d0b!important;font-family:system-ui,sans-serif}
  .total-row td.amt{font-size:18px}
  
  /* Timeline block */
  .timeline-box{background:#faf8f4;border:1px solid #e5e0d8;padding:24px 28px;margin-top:16px}
  .timeline-box .t-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #e5e0d8;font-size:14px}
  .timeline-box .t-row:last-child{border-bottom:none}
  .timeline-box .t-row strong{font-family:system-ui,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#888}
  .timeline-box .t-row span{font-size:16px;font-weight:700;color:#0f0d0b;font-family:system-ui,sans-serif}
  
  /* Footer strip */
  .doc-footer{background:#0f0d0b;color:rgba(255,255,255,.4);font-size:10px;font-family:system-ui,sans-serif;padding:16px 64px;display:flex;justify-content:space-between;letter-spacing:.06em}
  
  @media print{
    body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .cover{page-break-after:always}
    .page-break{page-break-before:always}
  }
</style></head><body>

<!-- COVER PAGE -->
<div class="cover">
  <div>
    <div class="cover-logo">Everyday Digital Solutions &nbsp; · &nbsp; Technology that moves your business forward</div>
    <div class="cover-rule"></div>
    <div class="cover-tag">${escHtml(ptLabel)}</div>
    <h1 class="cover-title">Custom Software Proposal<br/>for ${escHtml(clientName)}</h1>
    <p class="cover-sub">A complete digital solution — scoped, costed, and ready to build.</p>
    <div class="cover-badge">Total Investment: ${fmtFull(q.total)} &nbsp;|&nbsp; Delivery: ${q.delivery.minDays}–${q.delivery.maxDays} days</div>
  </div>
  <div class="cover-footer">
    <div><strong>Prepared for</strong>${escHtml(clientName)}</div>
    <div><strong>Prepared by</strong>Everyday Digital Solutions</div>
    <div><strong>Date</strong>${escHtml(today)}</div>
  </div>
</div>

<!-- EXECUTIVE SUMMARY -->
<div class="page">
  <h1 class="section-num">01 — Executive Summary</h1>
  <h2 class="section-title">The Problem. The Solution. The Opportunity.</h2>
  <p class="body">${escHtml(q.executiveSummary)}</p>
  <p class="body">Everyday Digital Solutions will design, build, and ship a fully custom digital product for ${escHtml(clientName)}. The quote below reflects the exact scope described — fixed price, fixed timeline, no surprises.</p>
  <div class="divider"></div>

  <h1 class="section-num">02 — Scope of Work</h1>
  <h2 class="section-title">What We Will Build</h2>
  <ul class="scope-list">${scopeList}</ul>
  <div class="divider"></div>
</div>

<!-- INVESTMENT + TIMELINE -->
<div class="page page-break">
  <h1 class="section-num">03 — Investment Breakdown</h1>
  <h2 class="section-title">Transparent Cost Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th style="width:55%">Item</th>
        <th style="width:20%;text-align:right">Amount</th>
        <th style="width:25%">Notes</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="total-row">
        <td><strong>Total Investment</strong></td>
        <td class="amt">${fmtFull(q.total)}</td>
        <td class="note">${q.total > q.subtotal && q.subtotal < 300000 ? "Floor price applied — minimum EDS project size" : "All taxes additional"}</td>
      </tr>
    </tbody>
  </table>
  <p style="margin-top:12px;font-size:11px;color:#888;font-family:system-ui,sans-serif">* GST / applicable taxes billed separately. Quote valid for ${q.validDays} days from ${escHtml(today)}.</p>

  <div class="divider"></div>

  <h1 class="section-num">04 — Delivery Timeline</h1>
  <h2 class="section-title">When You Go Live</h2>
  <div class="timeline-box">
    <div class="t-row"><strong>Build window</strong><span>${q.delivery.minDays}–${q.delivery.maxDays} working days</span></div>
    <div class="t-row"><strong>Quote valid until</strong><span>${new Date(new Date(q.generatedAt).getTime() + q.validDays * 86400000).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span></div>
    <div class="t-row"><strong>Quote reference</strong><span>${escHtml(q.quoteRef)}</span></div>
  </div>
  <div class="divider"></div>

  <h1 class="section-num">05 — Next Steps</h1>
  <h2 class="section-title">How to Get Started</h2>
  <p class="body">Reply to this proposal or WhatsApp us directly to confirm scope. We will schedule a 30-minute discovery call, lock the final feature list, and issue a signed agreement. No payment is taken until scope is agreed and the contract is signed.</p>
  <p class="body" style="font-weight:600;color:#0f0d0b">WhatsApp: +91 90560 66006 &nbsp;·&nbsp; hello@everydaydigitalsolutions.com</p>
</div>

<div class="doc-footer">
  <span>Confidential &amp; Proprietary — Everyday Digital Solutions</span>
  <span>${escHtml(today)} &nbsp;·&nbsp; Ref: ${escHtml(q.quoteRef)}</span>
</div>

<script>window.addEventListener("load",function(){setTimeout(function(){window.print()},400)});</script>
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

// ─── Main component ───────────────────────────────────────────────────────────

interface FormState {
  industry: Industry | "";
  projectType: ProjectType | "";
  features: string[];
  scale: Scale | "";
  timeline: Timeline | "";
  projectDescription: string;
  businessName: string;
  contactName: string;
  whatsappNumber: string;
  email: string;
}

const INIT: FormState = {
  industry: "", projectType: "", features: [], scale: "", timeline: "",
  projectDescription: "", businessName: "", contactName: "", whatsappNumber: "", email: "",
};

export default function GetAQuote() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INIT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pdfGateEmail, setPdfGateEmail] = useState("");
  const [pdfGateSubmitting, setPdfGateSubmitting] = useState(false);
  const [pdfGateError, setPdfGateError] = useState<string | null>(null);
  const [pdfUnlocked, setPdfUnlocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Seed gate email from whatever the user typed in the form
  useEffect(() => {
    if (step === 5 && form.email) setPdfGateEmail(form.email);
  }, [step, form.email]);

  // Advance processing animation
  useEffect(() => {
    if (!processing) return;
    timerRef.current = setInterval(() => {
      setProcessingStep((p) => {
        if (p >= PROCESSING_STEPS.length - 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return p;
        }
        return p + 1;
      });
    }, 2400);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [processing]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const { [key as string]: _, ...rest } = e; return rest; });
  }

  function toggleFeature(key: string) {
    setForm((f) => ({
      ...f,
      features: f.features.includes(key) ? f.features.filter((k) => k !== key) : [...f.features, key],
    }));
  }

  function validate(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 0 && !form.industry) e["industry"] = "Pick your industry";
    if (s === 1 && !form.projectType) e["projectType"] = "Choose what you want to build";
    if (s === 3 && !form.scale) e["scale"] = "Pick a scale";
    if (s === 4) {
      if (form.projectDescription.trim().length < 10) e["projectDescription"] = "Describe your project (at least 10 characters)";
      if (form.contactName.trim().length < 2) e["contactName"] = "Your name";
      if (form.whatsappNumber.replace(/\D/g, "").length < 6) e["whatsappNumber"] = "A WhatsApp number we can reach you on";
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e["email"] = "That email doesn't look right";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    setStep((s) => Math.min(s + 1, 5));
  }

  async function handlePdfDownload() {
    if (!quote) return;
    const email = pdfGateEmail.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setPdfGateError("Enter a valid email address to unlock the PDF.");
      return;
    }
    setPdfGateSubmitting(true);
    setPdfGateError(null);
    try {
      await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: form.contactName.trim() || undefined }),
      });
    } catch {
      // fail-soft — unlock PDF even if capture fails
    }
    setPdfUnlocked(true);
    setPdfGateSubmitting(false);
    downloadProposalPdf(quote, form.industry as Industry, form.projectType as ProjectType);
  }

  async function generateQuote() {
    if (!validate(4)) return;
    setProcessing(true);
    setProcessingStep(0);
    setApiError(null);

    try {
      const body = {
        businessName: form.businessName.trim() || null,
        contactName: form.contactName.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        email: form.email.trim() || null,
        industry: form.industry as Industry,
        projectType: form.projectType as ProjectType,
        features: form.features,
        scale: form.scale as Scale,
        timeline: form.timeline as Timeline || "1_to_3_months",
        projectDescription: form.projectDescription.trim(),
      };

      const res = await fetch("/api/quote/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Server error" })) as { error: string };
        throw new Error(err.error ?? "Failed to generate quote");
      }

      const data = await res.json() as QuoteResult;

      // Ensure processing animation has shown at least a few steps
      await new Promise((r) => setTimeout(r, 1000));
      setQuote(data);
      setStep(5);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }

  // ── Processing overlay ────────────────────────────────────────────────────

  if (processing) {
    return (
      <>
        <SEO title="Generating your quote..." description="Building your personalised project proposal." canonical="/get-a-quote" />
        <Navbar />
        <main className="min-h-[100dvh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-8" />
            <h2 className="font-serif text-2xl mb-4">Building your proposal</h2>
            <p className="text-sm text-muted-foreground mb-8">Our system is pricing each component and writing your executive summary. This takes about 15 seconds.</p>
            <div className="space-y-2 text-left">
              {PROCESSING_STEPS.map((label, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm transition-opacity duration-500 ${i <= processingStep ? "opacity-100" : "opacity-20"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border text-xs ${
                    i < processingStep ? "bg-primary border-primary text-black" :
                    i === processingStep ? "border-primary text-primary animate-pulse" :
                    "border-border text-muted-foreground"}`}>
                    {i < processingStep ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className={i <= processingStep ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Quote results ────────────────────────────────────────────────────────

  if (step === 5 && quote) {
    const waText = `Hi! I just received a project quote from your website.\n\nQuote Ref: ${quote.quoteRef}\nBusiness: ${quote.businessName ?? quote.contactName}\nProject: ${PROJECT_TYPES.find((p) => p.value === form.projectType)?.label ?? form.projectType}\nTotal: ${fmtFull(quote.total)}\n\nI'd like to discuss next steps.`;
    const waLink = `https://wa.me/919056066006?text=${encodeURIComponent(waText)}`;

    return (
      <>
        <SEO title={`Your quote — ${fmtFull(quote.total)}`} description="Your personalised project proposal from Everyday Digital Solutions." canonical="/get-a-quote" />
        <Navbar />
        <main className="pt-8 pb-20 lg:pt-16 lg:pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[100dvh]">

          {/* Header */}
          <div className="mb-10 lg:mb-14">
            <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-4">
              Ref: {quote.quoteRef}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl mb-3 leading-tight">
              Your proposal is ready.
            </h1>
            <p className="text-muted-foreground">
              Generated on {new Date(quote.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · Valid for {quote.validDays} days
            </p>
          </div>

          {/* Total + delivery hero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-primary rounded-md p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-black/60 mb-2">Total Investment</p>
              <p className="font-serif text-5xl text-black">{fmtFull(quote.total)}</p>
              <p className="text-xs text-black/60 mt-2">+ GST / applicable taxes</p>
            </div>
            <div className="bg-card border border-border/40 rounded-md p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Delivery Window</p>
              <p className="font-serif text-5xl">{quote.delivery.minDays}–{quote.delivery.maxDays}</p>
              <p className="text-xs text-muted-foreground mt-2">working days from signed agreement</p>
            </div>
          </div>

          {/* Executive summary */}
          <div className="bg-card border border-border/40 rounded-md p-6 sm:p-8 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Executive Summary</h2>
            <p className="text-base leading-relaxed">{quote.executiveSummary}</p>
          </div>

          {/* Scope items */}
          <div className="bg-card border border-border/40 rounded-md p-6 sm:p-8 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Scope of Work</h2>
            <ul className="space-y-3">
              {quote.scopeItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cost breakdown */}
          <div className="bg-card border border-border/40 rounded-md overflow-hidden mb-6">
            <div className="px-6 sm:px-8 pt-6 pb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Investment Breakdown</h2>
            </div>
            <div className="divide-y divide-border/40">
              {quote.lineItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-6 sm:px-8 py-3.5 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    {item.note && <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>}
                  </div>
                  <span className={`font-mono text-sm font-semibold flex-shrink-0 ${item.amount < 0 ? "text-emerald-500" : "text-foreground"}`}>
                    {item.amount < 0 ? `-${fmtFull(Math.abs(item.amount))}` : fmtFull(item.amount)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between px-6 sm:px-8 py-4 bg-primary/5">
                <span className="font-bold text-base">Total</span>
                <span className="font-serif text-2xl text-primary font-bold">{fmtFull(quote.total)}</span>
              </div>
            </div>
          </div>

          {/* PDF email gate */}
          <div className="bg-card border border-border/40 rounded-md p-6 sm:p-8 mb-4">
            {!pdfUnlocked ? (
              <>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Download your proposal</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your email to unlock the PDF. We will follow up within one working day.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    value={pdfGateEmail}
                    onChange={(e) => { setPdfGateEmail(e.target.value); setPdfGateError(null); }}
                    placeholder="your@email.com"
                    className="flex-1"
                    disabled={pdfGateSubmitting}
                    onKeyDown={(e) => { if (e.key === "Enter") handlePdfDownload(); }}
                  />
                  <button
                    onClick={handlePdfDownload}
                    disabled={pdfGateSubmitting}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap"
                  >
                    {pdfGateSubmitting
                      ? "Preparing..."
                      : <><Download className="w-4 h-4" /> Get my PDF</>}
                  </button>
                </div>
                {pdfGateError && <p className="text-xs text-destructive mt-2">{pdfGateError}</p>}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Proposal unlocked</span>
                </div>
                <button
                  onClick={() => downloadProposalPdf(quote, form.industry as Industry, form.projectType as ProjectType)}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download PDF again
                </button>
              </>
            )}
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-border bg-transparent text-foreground px-6 py-3.5 rounded-sm font-medium hover:bg-muted transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Discuss on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-border bg-transparent text-foreground px-6 py-3.5 rounded-sm font-medium hover:bg-muted transition-colors"
            >
              <FileText className="w-4 h-4" /> Start a Project
            </Link>
          </div>

          <p className="text-xs text-muted-foreground border-t border-border/40 pt-6">
            This quote is an informed estimate based on the details you provided. Final pricing is confirmed after a 30-minute discovery call where we lock the scope together. No payment is taken until a signed agreement is in place.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  const availableFeatures = form.projectType
    ? ALL_FEATURES.filter((f) => (FEATURES_BY_TYPE[form.projectType as ProjectType] ?? []).includes(f.key))
    : ALL_FEATURES;

  return (
    <>
      <SEO
        title="Get an Instant Quote"
        description="Fill in 5 quick questions and get an AI-generated project quote with cost breakdown and delivery estimate — in under 60 seconds."
        canonical="/get-a-quote"
      />
      <Navbar />
      <main className="pt-8 pb-16 sm:pt-12 lg:pt-28 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[100dvh]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">

          {/* Left column */}
          <div>
            <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6">
              Free · No commitment · 60 seconds
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif mb-4 leading-tight">
              Get an instant <em className="text-primary italic">project quote</em>.
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg mb-8 leading-relaxed">
              Describe what you want to build. Our system runs the real math — base rates, feature complexity, scale, and our delivery margin — then generates a complete proposal PDF you can keep.
            </p>

            <div className="space-y-5 mb-8">
              {[
                { title: "Real pricing, not guesses", desc: "Every feature is individually costed. You see the breakdown, not just a final number." },
                { title: "AI-written scope", desc: "The executive summary and scope list are generated for your specific project — not a generic template." },
                { title: "Download as PDF", desc: "A fully branded proposal you can share with your team, board, or bank." },
                { title: "Minimum project size ₹3 lakh", desc: "We quote only on projects we can do justice to. Anything under that, we'll tell you honestly on a call." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — form */}
          <div className="bg-card border border-border/40 rounded-md p-6 sm:p-8 lg:p-10">
            <StepDots step={step} total={5} />

            {/* Step 0: Industry */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl mb-1">What industry are you in?</h2>
                  <p className="text-sm text-muted-foreground">Helps us tailor the scope and pricing.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind.value}
                      type="button"
                      onClick={() => update("industry", ind.value)}
                      className={`px-4 py-3 text-left text-sm rounded-sm border transition-colors ${
                        form.industry === ind.value
                          ? "bg-primary text-black border-primary font-medium"
                          : "border-border hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      {ind.label}
                    </button>
                  ))}
                </div>
                {errors["industry"] && <p className="text-xs text-destructive">{errors["industry"]}</p>}
                <div className="space-y-2">
                  <Label htmlFor="biz-name">Business name <span className="text-muted-foreground">(optional)</span></Label>
                  <Input id="biz-name" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="e.g. Quasar Salon" />
                </div>
              </div>
            )}

            {/* Step 1: Project type */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl mb-1">What are you building?</h2>
                  <p className="text-sm text-muted-foreground">Pick the closest match.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {PROJECT_TYPES.map((pt) => (
                    <button
                      key={pt.value}
                      type="button"
                      onClick={() => { update("projectType", pt.value); update("features", []); }}
                      className={`px-4 py-3.5 text-left rounded-sm border transition-colors ${
                        form.projectType === pt.value
                          ? "bg-primary text-black border-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      <p className="font-medium text-sm">{pt.label}</p>
                      <p className={`text-xs mt-0.5 ${form.projectType === pt.value ? "text-black/70" : "text-muted-foreground"}`}>{pt.description}</p>
                    </button>
                  ))}
                </div>
                {errors["projectType"] && <p className="text-xs text-destructive">{errors["projectType"]}</p>}
              </div>
            )}

            {/* Step 2: Features */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl mb-1">Which features do you need?</h2>
                  <p className="text-sm text-muted-foreground">Select all that apply. Each is priced individually.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {availableFeatures.map((f) => {
                    const selected = form.features.includes(f.key);
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => toggleFeature(f.key)}
                        className={`flex items-start gap-3 px-4 py-3 text-left rounded-sm border transition-colors ${
                          selected ? "bg-primary/10 border-primary/60" : "border-border hover:border-primary/30 hover:bg-muted/50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-sm border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                          selected ? "bg-primary border-primary text-black" : "border-border"
                        }`}>
                          {selected && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{f.label}</p>
                          <p className="text-xs text-muted-foreground">{f.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">{form.features.length} feature{form.features.length !== 1 ? "s" : ""} selected · you can change this later</p>
              </div>
            )}

            {/* Step 3: Scale */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl mb-1">What scale are you building for?</h2>
                  <p className="text-sm text-muted-foreground">Scale affects infrastructure and complexity costs.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {SCALES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => update("scale", s.value)}
                      className={`px-4 py-4 text-left rounded-sm border transition-colors ${
                        form.scale === s.value
                          ? "bg-primary text-black border-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      <p className="font-medium text-sm">{s.label}</p>
                      <p className={`text-xs mt-0.5 ${form.scale === s.value ? "text-black/70" : "text-muted-foreground"}`}>{s.description}</p>
                    </button>
                  ))}
                </div>
                {errors["scale"] && <p className="text-xs text-destructive">{errors["scale"]}</p>}
                <div className="space-y-2">
                  <Label>Ideal timeline</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIMELINES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => update("timeline", t.value)}
                        className={`px-3 py-2.5 text-sm text-left rounded-sm border transition-colors ${
                          form.timeline === t.value
                            ? "bg-primary text-black border-primary font-medium"
                            : "border-border hover:border-primary/50 hover:bg-muted"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact + description */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl mb-1">About you & the project</h2>
                  <p className="text-sm text-muted-foreground">We use this to personalise the proposal and contact you.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Describe your project <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="desc"
                    rows={4}
                    value={form.projectDescription}
                    onChange={(e) => update("projectDescription", e.target.value)}
                    placeholder="What does your business do? What problem are you solving? What should the app do for your customers?"
                  />
                  {errors["projectDescription"] && <p className="text-xs text-destructive">{errors["projectDescription"]}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cname">Your name <span className="text-destructive">*</span></Label>
                    <Input id="cname" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} placeholder="e.g. Harpreet Singh" />
                    {errors["contactName"] && <p className="text-xs text-destructive">{errors["contactName"]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wa">WhatsApp number <span className="text-destructive">*</span></Label>
                    <Input id="wa" value={form.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} placeholder="+91 98765 43210" />
                    {errors["whatsappNumber"] && <p className="text-xs text-destructive">{errors["whatsappNumber"]}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-muted-foreground">(optional — for proposal delivery)</span></Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
                  {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
                </div>
                {apiError && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-sm px-4 py-3">
                    {apiError}
                  </div>
                )}
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step < 4 ? (
                <Button onClick={next} className="inline-flex items-center gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={generateQuote} disabled={processing} className="inline-flex items-center gap-2 px-8">
                  {processing ? "Generating..." : "Generate my quote"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
