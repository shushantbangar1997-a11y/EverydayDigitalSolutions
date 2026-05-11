import { Printer, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { site } from "@/lib/constants";
import { SEO } from "@/components/SEO";

export default function AppCostGuide2026() {
  function handlePrint() {
    if (typeof window !== "undefined") window.print();
  }

  return (
    <>
      <SEO
        title="App Cost Guide for Indian Businesses 2026"
        description="Honest price ranges for custom software in India in 2026, from 12+ shipped projects across Punjab. By Everyday Digital Solutions."
        canonical="/resources/app-cost-guide-2026"
      />
      <div className="min-h-screen bg-background text-foreground">
        <div className="print:hidden border-b border-border bg-card">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-sm text-sm font-medium hover:bg-primary/90"
            >
              <Printer className="w-4 h-4" /> Save as PDF / Print
            </button>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-6 py-10 lg:py-16 prose prose-neutral dark:prose-invert prose-headings:font-serif prose-h1:text-4xl print:py-6">
          <header className="not-prose mb-10 pb-6 border-b border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {site.name} · 2026 Edition
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-3">
              App Cost Guide for <em className="italic text-primary">Indian businesses</em>, 2026.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Honest price ranges from 12+ shipped projects across salons, clinics, real estate and restaurants in Punjab. Read it once and never get an inflated quote again.
            </p>
          </header>

          <h2>Why most app quotes are wrong</h2>
          <p>
            In our 7+ years of building for Indian SMBs, we've seen quotes vary by <strong>10x</strong> for the same scope. The reason isn't quality — it's <em>incentives</em>. Big agencies pad for overhead. Freelancers under-quote and run out of runway. This guide is what we wish every business owner had on day one.
          </p>

          <h2>The five honest price ranges</h2>

          <h3>1. Booking / appointments app — ₹1.5L to ₹6L</h3>
          <p>
            Customer-facing booking flow, staff calendar, automated WhatsApp/SMS reminders, payment link integration. Add ~₹1L for native iOS + Android. Most salons and clinics land at <strong>₹2.5L–₹4L</strong>.
          </p>

          <h3>2. CRM + lead pipeline — ₹2L to ₹8L</h3>
          <p>
            Lead capture (web, calls, walk-ins), assignment, follow-up automation, reporting. Real estate and high-velocity service businesses. Sweet spot: <strong>₹3L–₹5L</strong> for a workflow tailored to your team's actual sales motion.
          </p>

          <h3>3. Marketplace / multi-vendor — ₹6L to ₹25L+</h3>
          <p>
            Two-sided platforms (vendors + customers), payments, escrow, ratings, dispute handling. Cost moves with category complexity. KYC, payouts and admin tools are usually 40% of the budget — never an afterthought.
          </p>

          <h3>4. Internal tools / ops dashboards — ₹1L to ₹5L</h3>
          <p>
            Replaces 3–5 spreadsheets and a WhatsApp group. Often the highest ROI build per rupee. Most clients see 20+ hours/week saved within the first month.
          </p>

          <h3>5. AI voice agent — ₹1L to ₹4L (setup) + ₹0.50–₹2.50/min usage</h3>
          <p>
            Inbound or outbound calling agent that handles bookings, qualification, follow-ups in Hindi/Punjabi/English. Setup includes script design, voice tuning, CRM integration. Most agents pay for themselves within 60–90 days.
          </p>

          <h2>What makes the bill move up or down</h2>
          <ul>
            <li><strong>Native mobile apps</strong> add 30–60% over a web app or PWA. Only do this if you genuinely need offline mode, push notifications, or device APIs (camera, biometrics).</li>
            <li><strong>Custom design</strong> vs. component-library design: custom adds ~₹40k–₹1L. Worth it for consumer-facing apps; rarely worth it for internal tools.</li>
            <li><strong>Multi-language</strong> (Hindi, Punjabi): ~₹20k–₹40k extra per language for proper translation + RTL/font handling where needed.</li>
            <li><strong>Payments + billing</strong>: Razorpay/Stripe is ₹15k–₹40k. Subscription billing with proration is ₹40k–₹1L.</li>
            <li><strong>Compliance</strong>: GST invoices, basic data protection ~₹20k. Healthcare (DPDP, audit trails) ~₹50k–₹1.5L.</li>
          </ul>

          <h2>The hidden costs nobody mentions</h2>
          <ol>
            <li><strong>Hosting + infrastructure</strong>: ₹1k–₹15k/month depending on traffic. Most under-quote this.</li>
            <li><strong>Third-party SaaS</strong>: WhatsApp Business API (~₹5–₹15 per session), SMS gateway, payment processor fees (~2%).</li>
            <li><strong>Maintenance + bug fixes</strong>: budget 15–20% of build cost per year.</li>
            <li><strong>App store fees</strong>: Apple ₹8k/yr, Google ₹2k one-time. Cuts (15–30%) on in-app payments.</li>
            <li><strong>Iteration after launch</strong>: every successful app has at least 3 rounds of changes in the first 90 days. Set aside 25% of build budget for this — it's not a "phase 2", it's part of phase 1.</li>
          </ol>

          <h2>How to cut 30–50% by sequencing right</h2>
          <p>
            The single biggest lever isn't price-shopping vendors — it's <strong>cutting scope intelligently</strong>. We use a "weeks-to-revenue" framework on every project:
          </p>
          <ol>
            <li><strong>Week 0–2</strong>: ship the one feature that unblocks revenue. Often a booking link + admin dashboard. Nothing else.</li>
            <li><strong>Week 2–6</strong>: add the features customers actually ask for, based on real usage data — not your roadmap doc.</li>
            <li><strong>Week 6+</strong>: only then add nice-to-haves (white-label, advanced reporting, etc.) — and only if usage justifies them.</li>
          </ol>
          <p>
            Following this sequence, our average client ships in <strong>30 days</strong> at ~60% of their original scope's cost — and gets to revenue 3–4 months faster.
          </p>

          <h2>Five questions to ask any agency before signing</h2>
          <ol>
            <li>"Show me 3 apps you've shipped in my industry. Can I talk to one of those clients?"</li>
            <li>"Who specifically writes the code? Can I meet them?" (Junior offshore teams are fine — but you should know.)</li>
            <li>"What happens at month 4 if I want to change direction?"</li>
            <li>"What's your fixed cost for the first 3 months of post-launch maintenance?"</li>
            <li>"Will I own the code and the AWS/database account, or will you?"</li>
          </ol>

          <h2>Want a sanity-check on your project?</h2>
          <p className="not-prose bg-card border border-border rounded-md p-6 my-8">
            We do free 15-minute scoping calls. No pitch — just a number, a timeline, and what to watch out for. WhatsApp{" "}
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {site.phone}
            </a>{" "}
            or{" "}
            <Link href="/contact" className="text-primary underline">
              fill the 6-question brief
            </Link>{" "}
            and we'll respond within 4 working hours.
          </p>

          <hr />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {site.name} · Mohali · Jalandhar · Punjab, India · {site.domain}
          </p>
        </article>
      </div>
    </>
  );
}
