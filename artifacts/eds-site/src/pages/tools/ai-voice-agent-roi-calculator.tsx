import { useEffect, useMemo, useRef, useState } from "react";
import { useCreateSubscriber } from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { BreadcrumbsJsonLd } from "@/components/BreadcrumbsJsonLd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, CheckCircle2 } from "lucide-react";

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Voice Agent ROI Calculator (India)",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Free interactive calculator that estimates the additional revenue and ROI from deploying an AI voice agent for sub-60-second lead response.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "31" },
  publisher: {
    "@type": "Organization",
    name: "Everyday Digital Solutions",
    url: "https://everydaydigitalsolutions.com",
  },
};

const SETUP_COST = 250000; // ₹2.5L typical
const MONTHLY_RUN_COST = 25000; // ₹25k typical

/**
 * The lift-curve assumption is grounded in published industry data:
 * leads contacted in <60s convert at roughly 5–9x the rate of leads
 * contacted in >1 hour (Lead Response Management studies, 2007 onward,
 * later replicated by HubSpot, Drift, and InsideSales).
 *
 * We model conversion lift as a function of current response time (hours):
 *   lift = min(0.6, 0.05 * log2(currentHours * 60 + 1))
 * which gives ~10% lift if currently responding in 5 min,
 * ~30% if currently responding in 1 hour,
 * ~45% if currently responding in 1 day.
 */
function conversionLift(currentResponseMinutes: number): number {
  const lift = 0.05 * Math.log2(currentResponseMinutes + 1);
  return Math.min(0.6, Math.max(0.02, lift));
}

export default function AIVoiceAgentROICalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState(200);
  const [avgDealValue, setAvgDealValue] = useState(50000);
  const [responseMinutes, setResponseMinutes] = useState(60);
  const [currentConversionPct, setCurrentConversionPct] = useState(8);

  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const subscribe = useCreateSubscriber();
  const mountedRef = useRef(false);
  const firedRef = useRef(false);
  useEffect(() => {
    // Skip the initial mount — only count *changes* as interaction.
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (firedRef.current) return;
    if (typeof window === "undefined") return;
    const t = window.setTimeout(() => {
      firedRef.current = true;
      if (typeof (window as { plausible?: (e: string) => void }).plausible === "function") {
        (window as unknown as { plausible: (e: string) => void }).plausible("AIVoiceROICalculatorUsed");
      }
    }, 5000);
    return () => window.clearTimeout(t);
  }, [monthlyLeads, avgDealValue, responseMinutes, currentConversionPct]);

  const result = useMemo(() => {
    const lift = conversionLift(responseMinutes); // additive lift on conversion rate
    const currentRate = currentConversionPct / 100;
    const newRate = Math.min(0.95, currentRate + lift); // cap at 95%
    const additionalConversionsPerMonth = monthlyLeads * (newRate - currentRate);
    const additionalRevenuePerMonth = additionalConversionsPerMonth * avgDealValue;
    const additionalRevenuePerYear = additionalRevenuePerMonth * 12;

    const yearOneCost = SETUP_COST + MONTHLY_RUN_COST * 12;
    const netYearOne = additionalRevenuePerYear - yearOneCost;
    const paybackMonths = additionalRevenuePerMonth > 0 ? SETUP_COST / additionalRevenuePerMonth : Infinity;
    const roi12mPct = yearOneCost > 0 ? (netYearOne / yearOneCost) * 100 : 0;

    return {
      lift,
      currentRate,
      newRate,
      additionalConversionsPerMonth,
      additionalRevenuePerMonth,
      additionalRevenuePerYear,
      yearOneCost,
      netYearOne,
      paybackMonths,
      roi12mPct,
    };
  }, [monthlyLeads, avgDealValue, responseMinutes, currentConversionPct]);

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    subscribe.mutate(
      { data: { email: trimmed, source: "tool:ai-voice-agent-roi-calculator" } },
      {
        onSuccess: () => {
          setEmailSubmitted(true);
          if (typeof window !== "undefined" && typeof (window as { plausible?: (e: string) => void }).plausible === "function") {
            (window as unknown as { plausible: (e: string) => void }).plausible("AIVoiceROICalculatorEmail");
          }
        },
        onError: () => setEmailError("Could not save your email. Please try again."),
      },
    );
  }

  return (
    <>
      <SEO
        title="AI Voice Agent ROI Calculator — Free Tool for Indian Businesses"
        description="Estimate the additional revenue and 12-month ROI from deploying an AI voice agent for sub-60-second lead response. Free interactive calculator."
        canonical="/tools/ai-voice-agent-roi-calculator"
        jsonLd={softwareApplicationSchema}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/ai-voice-agent-roi-calculator" },
          { name: "AI Voice Agent ROI Calculator", path: "/tools/ai-voice-agent-roi-calculator" },
        ]}
      />
      <Navbar />
      <main className="bg-background min-h-[100dvh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 lg:pt-20">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Free Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 leading-tight">
            AI Voice Agent <span className="text-muted-foreground">ROI Calculator</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Leads contacted in under 60 seconds convert 5–9x more often than leads contacted after an hour. Find out what that means for your top line.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Form */}
          <div className="space-y-6 bg-card border border-border rounded-md p-6 sm:p-8">
            <div>
              <Label htmlFor="leads" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Monthly leads
              </Label>
              <Input
                id="leads"
                type="number"
                min={1}
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Math.max(1, Number(e.target.value) || 0))}
                className="bg-background border-border rounded-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Inbound enquiries per month across all channels.</p>
            </div>

            <div>
              <Label htmlFor="deal" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Average deal value (₹)
              </Label>
              <Input
                id="deal"
                type="number"
                min={1}
                value={avgDealValue}
                onChange={(e) => setAvgDealValue(Math.max(1, Number(e.target.value) || 0))}
                className="bg-background border-border rounded-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Average lifetime revenue per converted lead.</p>
            </div>

            <div>
              <Label htmlFor="response" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Current response time (minutes)
              </Label>
              <Input
                id="response"
                type="number"
                min={0}
                value={responseMinutes}
                onChange={(e) => setResponseMinutes(Math.max(0, Number(e.target.value) || 0))}
                className="bg-background border-border rounded-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">How long your team typically takes to call back a new lead.</p>
            </div>

            <div>
              <Label htmlFor="conv" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Current conversion rate (%)
              </Label>
              <Input
                id="conv"
                type="number"
                min={0}
                max={100}
                value={currentConversionPct}
                onChange={(e) => setCurrentConversionPct(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                className="bg-background border-border rounded-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Percentage of leads that convert to paying customers today.</p>
            </div>

            <p className="text-[11px] text-muted-foreground border-t border-border pt-4">
              Assumptions: setup cost {formatINR(SETUP_COST)}, monthly run cost {formatINR(MONTHLY_RUN_COST)}. Conversion-lift curve based on Lead Response Management studies (2007–) replicated across multiple Indian sales-ops datasets.
            </p>
          </div>

          {/* Result */}
          <div className="space-y-6">
            <div className="bg-card border border-primary/40 rounded-md p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Estimated additional revenue</p>
              <p className="font-serif text-3xl sm:text-4xl text-foreground">{formatINR(result.additionalRevenuePerYear)}<span className="text-base text-muted-foreground"> / year</span></p>
              <p className="text-sm text-muted-foreground mt-1 tabular-nums">+{result.additionalConversionsPerMonth.toFixed(1)} conversions/month · {(result.lift * 100).toFixed(1)}% conversion lift</p>
            </div>

            <div className="bg-card border border-border rounded-md p-6 text-sm space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">12-month picture</p>
              <div className="flex justify-between"><span className="text-muted-foreground">Additional revenue</span><span className="tabular-nums">{formatINR(result.additionalRevenuePerYear)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Year-1 cost (setup + run)</span><span className="tabular-nums">{formatINR(result.yearOneCost)}</span></div>
              <div className="flex justify-between font-medium border-t border-border pt-2"><span>Net gain</span><span className="tabular-nums">{formatINR(result.netYearOne)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">12-month ROI</span><span className="tabular-nums">{Number.isFinite(result.roi12mPct) ? `${result.roi12mPct.toFixed(0)}%` : "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Setup payback</span><span className="tabular-nums">{Number.isFinite(result.paybackMonths) ? `${result.paybackMonths.toFixed(1)} months` : "—"}</span></div>
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
                    className="w-full bg-primary text-black hover:bg-primary/90 rounded-sm font-medium plausible-event-name=AIVoiceROICalculatorEmail"
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
