import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { caseStudies } from "@/content/case-studies";
import { ArrowUpRight } from "lucide-react";

const BASE = "https://everydaydigitalsolutions.com";

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/work/open-humana#webpage`,
  "url": `${BASE}/work/open-humana`,
  "name": "Open Humana — AI Voice Agent SaaS Case Study — Everyday Digital Solutions",
  "description": "How EDS built Open Humana, an AI dialler SaaS that replaces manual outbound calling. Alex AI handles every dial and transfers only live answers to human reps — resulting in 5x to 10x dial volume and 100% live-prospect conversations.",
  "inLanguage": "en-IN",
  "isPartOf": {
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    "url": BASE,
    "name": "Everyday Digital Solutions"
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "We built the AI voice agent platform that lets sales teams stop dialling — and start closing.",
  "description": "Open Humana is an AI dialler SaaS built by Everyday Digital Solutions. Alex AI handles every outbound dial, leaves voicemails, and instantly transfers live calls to human reps.",
  "image": `${BASE}/opengraph.jpg`,
  "datePublished": "2024-06-01",
  "dateModified": "2025-05-12",
  "author": {
    "@type": "Person",
    "name": "Shushant Bangar"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Everyday Digital Solutions",
    "logo": { "@type": "ImageObject", "url": `${BASE}/logo.png` }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${BASE}/work/open-humana`
  }
};

const statusColors: Record<string, string> = {
  TRANSFERRED: "text-emerald-400 bg-emerald-400/10",
  CONNECTED: "text-amber-400 bg-amber-400/10",
  VOICEMAIL: "text-muted-foreground bg-muted/40"
};

export default function OpenHumanaCaseStudy() {
  const cs = caseStudies.openHumana;

  return (
    <>
      <SEO
        title="Open Humana — AI Voice Agent SaaS Case Study"
        description="How Everyday Digital Solutions built Open Humana — an AI dialler SaaS where Alex AI handles every outbound dial and transfers only live calls. 5x to 10x dial volume. 100% live-prospect conversations."
        canonical="/work/open-humana"
        ogType="article"
        jsonLd={[webPageSchema, articleSchema]}
      />
      <Navbar />
      <main className="pt-8 pb-16 sm:pt-12 lg:pt-28 lg:pb-32 bg-background min-h-[100dvh]">

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 lg:mb-24">
          <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6 lg:mb-8">
            {cs.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-8 lg:mb-12 leading-tight">
            We built the AI voice agent that lets sales teams{" "}
            <em className="text-primary italic">stop dialling — and start closing</em>.
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-6 text-sm text-muted-foreground border-y border-border/40 py-6 sm:py-8">
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1 text-xs sm:text-sm">Product</span>
              <span className="text-foreground">Open Humana</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1 text-xs sm:text-sm">Type</span>
              <span className="text-foreground">In-House SaaS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1 text-xs sm:text-sm">Launched</span>
              <span className="text-foreground">{cs.meta.launched}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1 text-xs sm:text-sm">Category</span>
              <span className="text-foreground">{cs.meta.category}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-32">
          <div className="rounded-xl border border-border/60 overflow-hidden shadow-2xl">
            {/* Browser chrome */}
            <div className="bg-[#1a1a1a] border-b border-border/40 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
                <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
                <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
              </div>
              <div className="flex-1 bg-[#2a2a2a] rounded px-3 py-1 text-xs text-muted-foreground font-mono mx-4">
                app.openhumana.com/dashboard
              </div>
            </div>

            {/* Dashboard body */}
            <div className="bg-[#0f0f0f] p-5 sm:p-8">
              {/* Stat tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {cs.dashboard.stats.map((stat) => (
                  <div key={stat.label} className="bg-[#1a1a1a] border border-white/8 rounded-lg p-4">
                    <p className="text-2xl sm:text-3xl font-serif text-foreground mb-1">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Call history table */}
              <div className="bg-[#1a1a1a] border border-white/8 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-white/8">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Call Activity</p>
                </div>
                <div className="divide-y divide-white/6">
                  {cs.dashboard.sampleCalls.map((call) => (
                    <div key={call.name} className="flex items-center justify-between px-4 py-3 gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-muted/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-muted-foreground">
                          {call.name.charAt(0)}
                        </div>
                        <span className="text-sm text-foreground truncate">{call.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${statusColors[call.status] ?? "text-muted-foreground"}`}>
                        {call.status}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono hidden sm:block flex-shrink-0">{call.duration}</span>
                      <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">{call.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-32 space-y-12 lg:space-y-16">
          <section>
            <h2 className="text-xl sm:text-2xl font-serif mb-5 lg:mb-6 text-foreground">The Problem</h2>
            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">{cs.story.problem}</p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-serif mb-5 lg:mb-6 text-foreground">What We Built</h2>
            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">{cs.story.solution}</p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-serif mb-5 lg:mb-6 text-foreground">The Result</h2>
            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">{cs.story.result}</p>
          </section>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-32 bg-card border border-border/40 rounded-xl p-6 sm:p-8 lg:p-12">
          <h3 className="text-xl sm:text-2xl font-serif mb-8 lg:mb-10 text-center">Everything we shipped</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {cs.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <div>
                  <h4 className="font-medium text-foreground mb-1 text-sm sm:text-base">{feature}</h4>
                  <p className="text-xs text-muted-foreground">Built and deployed in production.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industries */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-32">
          <h3 className="text-xl sm:text-2xl font-serif mb-6 text-center">Who uses it</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {cs.industries.map((industry) => (
              <span key={industry} className="px-4 py-2 border border-border/60 rounded-full text-sm text-foreground font-medium">
                {industry}
              </span>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-32">
          <h3 className="text-xl sm:text-2xl font-serif mb-6 text-center">Built with</h3>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              "Node.js", "TypeScript", "React", "PostgreSQL",
              "Twilio", "WebSockets", "REST API", "Redis"
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-mono border border-border/60 rounded-full text-muted-foreground bg-card"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Live product link */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-card border border-border/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-1">Live Product</p>
              <p className="text-sm font-medium text-foreground">Open Humana is live and serving teams today.</p>
            </div>
            <a
              href={cs.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
            >
              Visit openhumana.com <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-card border border-border/40 p-8 sm:p-12 rounded-xl">
          <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6">Want something like this for your team?</h2>
          <p className="text-muted-foreground text-sm mb-8">We build bespoke AI voice agents, dialler platforms, and outbound automation for sales teams across any industry.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-glass-primary px-8 py-4 rounded-full font-medium transition-colors w-full sm:w-auto text-center">
              Start your project
            </Link>
            <Link href="/services/ai-voice-agents" className="btn-glass-neutral text-foreground px-8 py-4 rounded-full font-medium transition-colors w-full sm:w-auto text-center">
              Our AI voice service
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
