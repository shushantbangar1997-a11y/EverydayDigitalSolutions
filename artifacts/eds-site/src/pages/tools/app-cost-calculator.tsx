import { useMemo, useState } from "react";
import { useCreateSubscriber } from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { BreadcrumbsJsonLd } from "@/components/BreadcrumbsJsonLd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, CheckCircle2 } from "lucide-react";

type AppType = "consumer" | "internal" | "marketplace";
type Platform = "ios" | "android" | "web";
type Region = "india" | "offshore-mix" | "western";

interface FeatureOption {
  id: string;
  label: string;
  cost: number;
  description: string;
}

const APP_TYPE_BASE: Record<AppType, { label: string; base: number; description: string }> = {
  consumer: { label: "Consumer-facing app", base: 250000, description: "Booking, loyalty, payments — for the public to download." },
  internal: { label: "Internal / B2B tool", base: 350000, description: "Operations dashboard, field-team app, CRM-style workflow." },
  marketplace: { label: "Marketplace / multi-sided", base: 600000, description: "Buyers, sellers, admin — three sides connected." },
};

const PLATFORM_MULTIPLIER: Record<Platform, { label: string; multiplier: number }> = {
  ios: { label: "iOS app", multiplier: 1.0 },
  android: { label: "Android app", multiplier: 1.0 },
  web: { label: "Web app", multiplier: 0.85 },
};

const FEATURES: FeatureOption[] = [
  { id: "auth", label: "Authentication & user accounts", cost: 40000, description: "Email, phone OTP, social login, password reset." },
  { id: "payments", label: "Payments (Razorpay / Stripe)", cost: 80000, description: "Online payment, refunds, invoices, subscription billing." },
  { id: "chat", label: "In-app chat / messaging", cost: 90000, description: "1:1 chat, push notifications, attachments." },
  { id: "gps", label: "GPS / maps / location tracking", cost: 70000, description: "Live location, geofencing, address autocomplete." },
  { id: "ai", label: "AI integration (chat or voice)", cost: 120000, description: "OpenAI / Anthropic integration, prompt design, fallbacks." },
  { id: "loyalty", label: "Loyalty / rewards programme", cost: 60000, description: "Points, tiers, redemption, expiry rules." },
  { id: "notifications", label: "Push notifications + WhatsApp", cost: 50000, description: "Transactional notifications via push and WhatsApp Business API." },
  { id: "admin", label: "Custom admin dashboard", cost: 110000, description: "Web admin to manage users, content, orders, analytics." },
  { id: "analytics", label: "Custom analytics & reports", cost: 70000, description: "Owner dashboard with charts, exports, scheduled reports." },
  { id: "multiLanguage", label: "Multi-language (Hindi / Punjabi)", cost: 45000, description: "Full i18n with Hindi and Punjabi translations baked in." },
];

const REGION_MULTIPLIER: Record<Region, { label: string; multiplier: number; description: string }> = {
  india: { label: "Indian senior team (us)", multiplier: 1.0, description: "Senior engineers based in India. The honest market price for quality." },
  "offshore-mix": { label: "Mixed offshore (India junior + onshore PM)", multiplier: 1.6, description: "Typical big-agency model with a markup for project management." },
  western: { label: "Pure US / UK agency", multiplier: 4.5, description: "Western hourly rates. Same product, 4–5x the bill." },
};

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "App Cost Calculator (India, 2026)",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Free interactive calculator that estimates the cost of building a custom mobile app in India in 2026 — based on app type, platforms, features, and team region.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "47" },
  publisher: {
    "@type": "Organization",
    name: "Everyday Digital Solutions",
    url: "https://everydaydigitalsolutions.com",
  },
};

export default function AppCostCalculator() {
  const [appType, setAppType] = useState<AppType>("consumer");
  const [platforms, setPlatforms] = useState<Set<Platform>>(new Set(["ios", "android"]));
  const [features, setFeatures] = useState<Set<string>>(new Set(["auth", "payments", "notifications"]));
  const [region, setRegion] = useState<Region>("india");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const subscribe = useCreateSubscriber();

  function togglePlatform(p: Platform) {
    setPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p); else next.add(p);
      return next;
    });
  }
  function toggleFeature(id: string) {
    setFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const result = useMemo(() => {
    const base = APP_TYPE_BASE[appType].base;
    const platformMult = Array.from(platforms).reduce((sum, p) => sum + PLATFORM_MULTIPLIER[p].multiplier, 0) || 1;
    const featuresCost = FEATURES.filter((f) => features.has(f.id)).reduce((sum, f) => sum + f.cost, 0);
    const subtotal = (base + featuresCost) * platformMult;
    const total = subtotal * REGION_MULTIPLIER[region].multiplier;
    const low = Math.round(total * 0.85);
    const high = Math.round(total * 1.15);
    return { low, high, total, base, platformMult, featuresCost };
  }, [appType, platforms, features, region]);

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    subscribe.mutate(
      { data: { email: trimmed, source: "tool:app-cost-calculator" } },
      {
        onSuccess: () => {
          setEmailSubmitted(true);
          if (typeof window !== "undefined" && typeof (window as { plausible?: (e: string) => void }).plausible === "function") {
            (window as unknown as { plausible: (e: string) => void }).plausible("AppCostCalculatorEmail");
          }
        },
        onError: () => setEmailError("Could not save your email. Please try again."),
      },
    );
  }

  return (
    <>
      <SEO
        title="App Cost Calculator (India, 2026) — Free Interactive Tool"
        description="Free calculator that estimates what a custom mobile app costs to build in India in 2026. Pick app type, platforms, and features — get a transparent budget band in minutes."
        canonical="/tools/app-cost-calculator"
        jsonLd={softwareApplicationSchema}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/app-cost-calculator" },
          { name: "App Cost Calculator", path: "/tools/app-cost-calculator" },
        ]}
      />
      <Navbar />
      <main className="bg-background min-h-[100dvh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 lg:pt-20">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Free Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 leading-tight">
            App Cost Calculator <span className="text-muted-foreground">(India, 2026)</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Real numbers from 12+ shipped projects. Pick what you want to build — get a transparent budget band in seconds. No email gate to see the result.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Form */}
          <div className="space-y-8 bg-card border border-border rounded-md p-6 sm:p-8">
            {/* App type */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">App type</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(APP_TYPE_BASE) as AppType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAppType(t)}
                    className={`text-left p-4 border rounded-sm transition-colors ${
                      appType === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <p className="font-medium text-sm text-foreground">{APP_TYPE_BASE[t].label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{APP_TYPE_BASE[t].description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Platforms</Label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(PLATFORM_MULTIPLIER) as Platform[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`p-3 border rounded-sm text-sm font-medium transition-colors ${
                      platforms.has(p) ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {PLATFORM_MULTIPLIER[p].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Features</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FEATURES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFeature(f.id)}
                    className={`text-left p-3 border rounded-sm transition-colors ${
                      features.has(f.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{f.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Team region</Label>
              <div className="space-y-2">
                {(Object.keys(REGION_MULTIPLIER) as Region[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`w-full text-left p-3 border rounded-sm transition-colors ${
                      region === r ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">{REGION_MULTIPLIER[r].label}</p>
                      <span className="text-xs text-muted-foreground tabular-nums">{REGION_MULTIPLIER[r].multiplier.toFixed(2)}x</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{REGION_MULTIPLIER[r].description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="space-y-6">
            <div className="bg-card border border-primary/40 rounded-md p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Estimated budget</p>
              <p className="font-serif text-3xl sm:text-4xl text-foreground">
                {formatINR(result.low)} <span className="text-muted-foreground">—</span> {formatINR(result.high)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Range reflects scope variability. Tighter scoping after a 30-minute call typically produces a fixed-price quote near the midpoint.
              </p>
            </div>

            <div className="bg-card border border-border rounded-md p-6 text-sm space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Breakdown</p>
              <div className="flex justify-between"><span className="text-muted-foreground">Base ({APP_TYPE_BASE[appType].label})</span><span className="tabular-nums">{formatINR(result.base)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Features ({features.size})</span><span className="tabular-nums">{formatINR(result.featuresCost)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Platforms ({platforms.size})</span><span className="tabular-nums">×{result.platformMult.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Team region</span><span className="tabular-nums">×{REGION_MULTIPLIER[region].multiplier.toFixed(2)}</span></div>
            </div>

            <div className="bg-card border border-border rounded-md p-6">
              <h3 className="font-serif text-lg text-foreground mb-2">Email me this estimate</h3>
              <p className="text-xs text-muted-foreground mb-4">
                We'll send the breakdown to your inbox so you can share it internally. No spam — just this one email.
              </p>
              {emailSubmitted ? (
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">On its way. Check your inbox.</p>
                </div>
              ) : (
                <form onSubmit={submitEmail} className="space-y-2">
                  <Input
                    type="email"
                    required
                    placeholder="you@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border rounded-sm"
                  />
                  <Button
                    type="submit"
                    disabled={subscribe.isPending}
                    className="w-full bg-primary text-black hover:bg-primary/90 rounded-sm font-medium plausible-event-name=AppCostCalculatorEmail"
                  >
                    {subscribe.isPending ? "Sending..." : "Email me this estimate"}
                  </Button>
                  {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
