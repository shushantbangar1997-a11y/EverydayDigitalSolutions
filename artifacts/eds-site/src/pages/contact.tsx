import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { site } from "@/lib/constants";
import { Phone, Mail, MessageCircle, MapPin, Check, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCreateLead } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const INDUSTRY_OPTIONS = [
  { value: "salon_spa", label: "Salon / Spa / Beauty" },
  { value: "real_estate", label: "Real Estate" },
  { value: "clinic_healthcare", label: "Clinic / Healthcare" },
  { value: "restaurant_cafe", label: "Restaurant / Cafe" },
  { value: "other_service", label: "Other service business" },
  { value: "other", label: "Something else" },
] as const;

const BUDGET_OPTIONS = [
  { value: "under_1l", label: "Under ₹1 Lakh" },
  { value: "1l_to_3l", label: "₹1L – ₹3L" },
  { value: "3l_to_8l", label: "₹3L – ₹8L" },
  { value: "8l_to_20l", label: "₹8L – ₹20L" },
  { value: "20l_plus", label: "₹20L+" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "within_1_month", label: "Within 1 month" },
  { value: "1_to_3_months", label: "1–3 months" },
  { value: "3_to_6_months", label: "3–6 months" },
  { value: "exploring", label: "Just exploring" },
] as const;

type Industry = typeof INDUSTRY_OPTIONS[number]["value"];
type Budget = typeof BUDGET_OPTIONS[number]["value"];
type Timeline = typeof TIMELINE_OPTIONS[number]["value"];

interface FormState {
  industry: Industry | "";
  industryDetails: Record<string, string>;
  businessName: string;
  city: string;
  problem: string;
  currentSolution: string;
  goalIn3Months: string;
  budget: Budget | "";
  timeline: Timeline | "";
  name: string;
  whatsappNumber: string;
  email: string;
}

const INITIAL: FormState = {
  industry: "",
  industryDetails: {},
  businessName: "",
  city: "",
  problem: "",
  currentSolution: "",
  goalIn3Months: "",
  budget: "",
  timeline: "",
  name: "",
  whatsappNumber: "",
  email: "",
};

const INDUSTRY_QUESTIONS: Record<Industry, { key: string; label: string; placeholder: string }[]> = {
  salon_spa: [
    { key: "monthlyBookings", label: "Roughly how many bookings per month?", placeholder: "e.g. 400" },
    { key: "noShowRate", label: "Approximate no-show rate (%)", placeholder: "e.g. 15" },
  ],
  real_estate: [
    { key: "monthlyLeads", label: "Roughly how many leads per month?", placeholder: "e.g. 200" },
    { key: "currentCRM", label: "Current CRM (if any)", placeholder: "e.g. None / Excel / Zoho" },
  ],
  clinic_healthcare: [
    { key: "monthlyPatients", label: "Approximate patients per month", placeholder: "e.g. 600" },
    { key: "currentBookingSystem", label: "Current booking system", placeholder: "e.g. Phone calls / Google Form" },
  ],
  restaurant_cafe: [
    { key: "ordersPerDay", label: "Average orders per day", placeholder: "e.g. 80" },
    { key: "deliveryChannels", label: "Current delivery / order channels", placeholder: "e.g. Zomato, Swiggy, walk-in" },
  ],
  other_service: [
    { key: "businessType", label: "What does your business do?", placeholder: "e.g. Digital marketing agency" },
    { key: "monthlyCustomers", label: "Approximate customers per month", placeholder: "e.g. 50" },
  ],
  other: [
    { key: "context", label: "Tell us a bit about your business", placeholder: "Industry, scale, anything we should know" },
  ],
};

const STEP_LABELS = ["About you", "Specifics", "The problem", "Scope", "Contact", "Review"];

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Start a Project — Everyday Digital Solutions",
  "url": "https://everydaydigitalsolutions.com/contact",
  "description": "Tell us about your project. 6-step guided intake — we'll respond on WhatsApp within 4 working hours."
};

function StepDots({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 mb-8 overflow-x-auto" aria-label="Progress">
      {STEP_LABELS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex items-center gap-2 shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border ${
                done
                  ? "bg-primary text-black border-primary"
                  : active
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs hidden md:inline ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && <span className="hidden md:inline w-6 h-px bg-border" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function labelFor<T extends string>(opts: readonly { value: T; label: string }[], v: T | ""): string {
  return opts.find((o) => o.value === v)?.label ?? "—";
}

export default function Contact() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const mutation = useCreateLead();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const { [key as string]: _omit, ...rest } = e;
      return rest;
    });
  }

  function updateIndustryDetail(key: string, value: string) {
    setForm((f) => ({ ...f, industryDetails: { ...f.industryDetails, [key]: value } }));
  }

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.industry) e["industry"] = "Pick an industry";
      if (form.city.trim().length < 2) e["city"] = "Where is your business based?";
    } else if (s === 1) {
      // industry-specific is optional but at least one if industry has questions — soft requirement
    } else if (s === 2) {
      if (form.problem.trim().length < 10) e["problem"] = "Tell us a bit more (at least 10 characters)";
      if (form.goalIn3Months.trim().length < 5) e["goalIn3Months"] = "What does success look like in 3 months?";
    } else if (s === 3) {
      if (!form.budget) e["budget"] = "Pick a budget band";
      if (!form.timeline) e["timeline"] = "Pick a timeline";
    } else if (s === 4) {
      if (form.name.trim().length < 2) e["name"] = "Your name";
      if (form.whatsappNumber.replace(/\D/g, "").length < 6) e["whatsappNumber"] = "A WhatsApp number we can reach you on";
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e["email"] = "That email doesn't look right";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    if (!validateStep(4)) {
      setStep(4);
      return;
    }
    mutation.mutate(
      {
        data: {
          name: form.name.trim(),
          businessName: form.businessName.trim() || null,
          whatsappNumber: form.whatsappNumber.trim(),
          email: form.email.trim() || null,
          city: form.city.trim(),
          industry: form.industry as Industry,
          industryDetails: form.industryDetails,
          problem: form.problem.trim(),
          currentSolution: form.currentSolution.trim() || null,
          goalIn3Months: form.goalIn3Months.trim(),
          budget: form.budget as Budget,
          timeline: form.timeline as Timeline,
        },
      },
      {
        onSuccess: () => setSubmitted(true),
      },
    );
  }

  if (submitted) {
    return (
      <>
        <SEO title="Thank you" description="Your brief has been received." canonical="/contact" />
        <Navbar />
        <main className="pt-12 pb-20 lg:pt-28 lg:pb-32 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[100dvh]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 text-primary mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 leading-tight">
              Got it. We'll WhatsApp you within <em className="italic text-primary">4 working hours</em>.
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground mb-10 leading-relaxed">
              Shushant or someone from the team will reach out on the WhatsApp number you shared, with a couple of questions and a proposed time for a 15-minute call.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp us now
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-sm font-medium hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const industryQs = form.industry ? INDUSTRY_QUESTIONS[form.industry as Industry] : [];

  return (
    <>
      <SEO
        title="Start a Project"
        description="Tell us what you're building. We'll scope it on a 15-minute call and respond on WhatsApp within 4 working hours."
        canonical="/contact"
        jsonLd={contactPageSchema}
      />
      <Navbar />
      <main className="pt-8 pb-16 sm:pt-12 lg:pt-28 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[100dvh]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-6 lg:mb-8 leading-tight">
              Start a <em className="text-primary italic">project</em>.
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground mb-8 leading-relaxed">
              6 quick questions. Takes about 3 minutes. We respond on WhatsApp within 4 working hours.
            </p>

            <div className="flex flex-col gap-5 mb-8">
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Call us</h3>
                  <a href={`tel:${site.phone}`} className="text-foreground hover:text-primary transition-colors">{site.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">WhatsApp</h3>
                  <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">Message us directly</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Email us</h3>
                  <a href={`mailto:${site.email}`} className="text-foreground hover:text-primary transition-colors break-all">{site.email}</a>
                </div>
              </div>
              {site.offices.map((office, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">{office.city} Office</h3>
                    <address className="not-italic text-sm text-foreground leading-relaxed">
                      {office.address.map((line, i) => (<span key={i} className="block">{line}</span>))}
                    </address>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-md p-6 sm:p-8 lg:p-10">
            <StepDots step={step} />

            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">About your business</h2>
                  <p className="text-sm text-muted-foreground">Helps us tailor the conversation.</p>
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update("industry", opt.value)}
                        className={`text-left px-4 py-3 rounded-sm border text-sm transition-colors ${
                          form.industry === opt.value
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border hover:border-foreground/30 text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors["industry"] && <p className="text-xs text-destructive">{errors["industry"]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business name (optional)</Label>
                  <Input
                    id="businessName"
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    placeholder="e.g. Quasar Salon"
                    className="bg-background border-border rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="e.g. Mohali"
                    className="bg-background border-border rounded-sm"
                  />
                  {errors["city"] && <p className="text-xs text-destructive">{errors["city"]}</p>}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">A few specifics</h2>
                  <p className="text-sm text-muted-foreground">Optional — but it helps us scope quickly.</p>
                </div>
                {industryQs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No specific questions for this industry. Continue.</p>
                ) : (
                  industryQs.map((q) => (
                    <div key={q.key} className="space-y-2">
                      <Label htmlFor={q.key}>{q.label}</Label>
                      <Input
                        id={q.key}
                        value={form.industryDetails[q.key] ?? ""}
                        onChange={(e) => updateIndustryDetail(q.key, e.target.value)}
                        placeholder={q.placeholder}
                        className="bg-background border-border rounded-sm"
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">The problem</h2>
                  <p className="text-sm text-muted-foreground">In your own words. Be specific.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="problem">What's the main problem you want to solve?</Label>
                  <Textarea
                    id="problem"
                    value={form.problem}
                    onChange={(e) => update("problem", e.target.value)}
                    placeholder="e.g. Too many no-shows. Front desk wastes 2 hours a day chasing confirmations."
                    className="min-h-[120px] bg-background border-border rounded-sm resize-y"
                  />
                  {errors["problem"] && <p className="text-xs text-destructive">{errors["problem"]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSolution">How are you handling it today? (optional)</Label>
                  <Textarea
                    id="currentSolution"
                    value={form.currentSolution}
                    onChange={(e) => update("currentSolution", e.target.value)}
                    placeholder="e.g. WhatsApp + Excel sheet. Manual reminders."
                    className="min-h-[80px] bg-background border-border rounded-sm resize-y"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalIn3Months">What does success look like in 3 months?</Label>
                  <Textarea
                    id="goalIn3Months"
                    value={form.goalIn3Months}
                    onChange={(e) => update("goalIn3Months", e.target.value)}
                    placeholder="e.g. 40% fewer no-shows. Front desk does zero confirmations."
                    className="min-h-[80px] bg-background border-border rounded-sm resize-y"
                  />
                  {errors["goalIn3Months"] && <p className="text-xs text-destructive">{errors["goalIn3Months"]}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">Scope</h2>
                  <p className="text-sm text-muted-foreground">Rough is fine — we'll refine on the call.</p>
                </div>
                <div className="space-y-2">
                  <Label>Budget band</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update("budget", opt.value)}
                        className={`text-left px-4 py-3 rounded-sm border text-sm transition-colors ${
                          form.budget === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors["budget"] && <p className="text-xs text-destructive">{errors["budget"]}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIMELINE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update("timeline", opt.value)}
                        className={`text-left px-4 py-3 rounded-sm border text-sm transition-colors ${
                          form.timeline === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors["timeline"] && <p className="text-xs text-destructive">{errors["timeline"]}</p>}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">Your details</h2>
                  <p className="text-sm text-muted-foreground">We respond on WhatsApp first.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Aman Singh" className="bg-background border-border rounded-sm" />
                  {errors["name"] && <p className="text-xs text-destructive">{errors["name"]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp number</Label>
                  <Input id="whatsappNumber" type="tel" value={form.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} placeholder="+91 98765 43210" className="bg-background border-border rounded-sm" />
                  {errors["whatsappNumber"] && <p className="text-xs text-destructive">{errors["whatsappNumber"]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@business.com" className="bg-background border-border rounded-sm" />
                  {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">Quick review</h2>
                  <p className="text-sm text-muted-foreground">Make sure this looks right before we WhatsApp you.</p>
                </div>
                <dl className="divide-y divide-border/60 border border-border/60 rounded-sm">
                  {([
                    ["Industry", labelFor(INDUSTRY_OPTIONS, form.industry)],
                    ["Business", form.businessName || "—"],
                    ["City", form.city],
                    ["Problem", form.problem],
                    ["Current solution", form.currentSolution || "—"],
                    ["3-month goal", form.goalIn3Months],
                    ["Budget", labelFor(BUDGET_OPTIONS, form.budget)],
                    ["Timeline", labelFor(TIMELINE_OPTIONS, form.timeline)],
                    ["Name", form.name],
                    ["WhatsApp", form.whatsappNumber],
                    ["Email", form.email || "—"],
                  ] as const).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-3 text-sm">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-foreground whitespace-pre-wrap break-words">{v}</dd>
                    </div>
                  ))}
                </dl>
                {mutation.isError && (
                  <p className="text-sm text-destructive">
                    Something went wrong. Please try again or message us on{" "}
                    <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a>.
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-8 mt-8 border-t border-border/60">
              <Button
                type="button"
                variant="ghost"
                onClick={prev}
                disabled={step === 0 || mutation.isPending}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              {step < STEP_LABELS.length - 1 ? (
                <Button
                  type="button"
                  onClick={next}
                  className="bg-primary text-black hover:bg-primary/90 rounded-sm font-medium px-6"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={submit}
                  disabled={mutation.isPending}
                  className="bg-primary text-black hover:bg-primary/90 rounded-sm font-medium px-6"
                >
                  {mutation.isPending ? "Sending..." : "Send my brief"}
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
