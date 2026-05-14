import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/content/case-studies";
import { PhoneMockup } from "./PhoneMockup";

const statusColors: Record<string, string> = {
  TRANSFERRED: "text-emerald-400 bg-emerald-400/10",
  CONNECTED: "text-amber-400 bg-amber-400/10",
  VOICEMAIL: "text-muted-foreground bg-muted/40"
};

const postStatusColors: Record<string, string> = {
  SCHEDULED: "text-emerald-400 bg-emerald-400/10",
  DRAFT: "text-muted-foreground bg-muted/40"
};

export function CaseStudy() {
  const prefersReducedMotion = useReducedMotion();
  const cs = caseStudies.quasar;
  const oh = caseStudies.openHumana;
  const oca = caseStudies.oneClickAssist;

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const cardFade = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section id="work" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Section header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="mb-5 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-serif mb-4">
          Selected work — <em className="text-primary italic">built &amp; shipped</em>.
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          One client build and two in-house products. No fabricated case studies.
        </p>
      </motion.div>

      {/* Sub-heading: Client work */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="mt-16 mb-8"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Client work</p>
      </motion.div>

      {/* Featured — Quasar */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={cardFade}
        className="relative bg-card border border-border/40 rounded-xl overflow-hidden p-6 md:p-10 lg:p-16 mb-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-soft)_0%,transparent_70%)] opacity-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 flex justify-center">
            <PhoneMockup screens={cs.screens} />
          </div>

          <div className="order-1 lg:order-2 flex flex-col items-start">
            <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6">
              {cs.tag}
            </span>

            <h3 className="text-3xl lg:text-4xl font-serif mb-10 leading-tight">
              How we built Tricity's first celebrity-grade salon app —{" "}
              <em className="text-primary italic">in 30 days</em>.
            </h3>

            <div className="grid grid-cols-2 gap-6 w-full mb-12 border-y border-border/40 py-6">
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">{cs.meta.timeline}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Timeline</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">{cs.meta.features}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Shipped</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 mb-12">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Problem</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{cs.story.problem}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">What We Built</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{cs.story.solution}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Result</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{cs.story.result}</p>
              </div>
            </div>

            <blockquote className="border-l-2 border-primary pl-6 mb-12">
              <p className="font-serif text-xl italic text-foreground mb-4">"{cs.quote.text}"</p>
              <footer className="text-sm text-muted-foreground">— {cs.quote.author}</footer>
            </blockquote>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/work/quasar-salon"
                data-float=""
                className="btn-glass-primary px-6 py-3 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Read full case study
              </Link>
              <Link
                href="/contact"
                data-float=""
                className="btn-glass-neutral text-foreground px-6 py-3 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Want this for your business
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sub-heading: In-house products */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="mb-8"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Our own products</p>
        <p className="text-sm text-muted-foreground mt-1">Built on our own time and conviction — no client, no client budget.</p>
      </motion.div>

      {/* Featured — Open Humana */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={cardFade}
        className="relative bg-card border border-border/40 rounded-xl overflow-hidden p-6 md:p-10 lg:p-16 mb-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-soft)_0%,transparent_70%)] opacity-10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Dashboard mockup */}
          <div className="order-2 lg:order-1">
            <div className="rounded-xl border border-border/60 overflow-hidden shadow-xl">
              <div className="bg-[#1a1a1a] border-b border-border/40 px-3 py-2.5 flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 bg-[#2a2a2a] rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono mx-2 truncate">
                  app.openhumana.com/dashboard
                </div>
              </div>
              <div className="bg-[#0f0f0f] p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {oh.dashboard.stats.map((stat) => (
                    <div key={stat.label} className="bg-[#1a1a1a] border border-white/8 rounded-lg p-3">
                      <p className="text-lg font-serif text-foreground mb-0.5">{stat.value}</p>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#1a1a1a] border border-white/8 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 border-b border-white/8">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Live Call Activity</p>
                  </div>
                  <div className="divide-y divide-white/6">
                    {oh.dashboard.sampleCalls.map((call) => (
                      <div key={call.name} className="flex items-center justify-between px-3 py-2 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-muted/20 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-muted-foreground">
                            {call.name.charAt(0)}
                          </span>
                          <span className="text-xs text-foreground truncate">{call.name}</span>
                        </div>
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusColors[call.status] ?? "text-muted-foreground"}`}>
                          {call.status}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-mono flex-shrink-0">{call.duration}</span>
                        <span className="text-[9px] text-muted-foreground/60 flex-shrink-0 hidden sm:block">{call.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 flex flex-col items-start">
            <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6">
              {oh.tag}
            </span>

            <h3 className="text-3xl lg:text-4xl font-serif mb-10 leading-tight">
              We built the AI platform where reps{" "}
              <em className="text-primary italic">stop dialling — and start closing</em>.
            </h3>

            <div className="grid grid-cols-3 gap-4 w-full mb-12 border-y border-border/40 py-6">
              {oh.featuredMetrics.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <span className="text-2xl font-serif text-primary">{m.value}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{m.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6 mb-12">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Problem</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{oh.story.problem}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">What We Built</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{oh.story.solution}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Status</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{oh.story.result}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={oh.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-glass-primary px-6 py-3 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Visit openhumana.com <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/work/open-humana"
                className="btn-glass-neutral text-foreground px-6 py-3 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Read the build story
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Featured — OneClickAssist */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={cardFade}
        className="relative bg-card border border-border/40 rounded-xl overflow-hidden p-6 md:p-10 lg:p-16 mb-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-soft)_0%,transparent_70%)] opacity-10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-1 lg:order-2 flex flex-col items-start">
            <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6">
              {oca.tag}
            </span>

            <h3 className="text-3xl lg:text-4xl font-serif mb-10 leading-tight">
              We built the social and pipeline tool that{" "}
              <em className="text-primary italic">runs while you run your business</em>.
            </h3>

            <div className="grid grid-cols-3 gap-4 w-full mb-12 border-y border-border/40 py-6">
              {oca.featuredMetrics.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <span className="text-2xl font-serif text-primary">{m.value}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{m.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6 mb-12">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Problem</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{oca.story.problem}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">What We Built</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{oca.story.solution}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Status</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{oca.story.result}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={oca.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-glass-primary px-6 py-3 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Visit oneclickassist.com <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                className="btn-glass-neutral text-foreground px-6 py-3 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Build something similar
              </Link>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="order-2 lg:order-1">
            <div className="rounded-xl border border-border/60 overflow-hidden shadow-xl">
              <div className="bg-[#1a1a1a] border-b border-border/40 px-3 py-2.5 flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 bg-[#2a2a2a] rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono mx-2 truncate">
                  app.oneclickassist.com/dashboard
                </div>
              </div>
              <div className="bg-[#0f0f0f] p-4 space-y-4">
                <div className="bg-[#1a1a1a] border border-white/8 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 border-b border-white/8">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Scheduled Posts</p>
                  </div>
                  <div className="divide-y divide-white/6">
                    {oca.dashboard.scheduledPosts.map((post) => (
                      <div key={post.preview} className="flex items-center gap-2 px-3 py-2.5">
                        <span className="text-[9px] font-bold text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded flex-shrink-0 w-6 text-center">
                          {post.platform}
                        </span>
                        <span className="text-[10px] text-foreground/80 truncate flex-1">{post.preview}</span>
                        <span className="text-[9px] text-muted-foreground/60 flex-shrink-0 hidden sm:block">{post.time}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full flex-shrink-0 ${postStatusColors[post.status] ?? "text-muted-foreground"}`}>
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#1a1a1a] border border-white/8 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 border-b border-white/8">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Recent Leads</p>
                  </div>
                  <div className="divide-y divide-white/6">
                    {oca.dashboard.capturedLeads.map((lead) => (
                      <div key={lead.name} className="flex items-center justify-between px-3 py-2 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-muted/20 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-muted-foreground">
                            {lead.name.charAt(0)}
                          </span>
                          <span className="text-xs text-foreground truncate">{lead.name}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground flex-shrink-0">{lead.source}</span>
                        <span className="text-[9px] text-muted-foreground/60 flex-shrink-0">{lead.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Closing CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="border border-border/40 rounded-xl p-8 sm:p-12 text-center bg-card"
      >
        <h3 className="font-serif text-2xl sm:text-3xl mb-4">
          Ready to build something <em className="text-primary italic">real</em>?
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-8">
          We take on a small number of client projects each year. If your business has a real problem and a real deadline, let's talk.
        </p>
        <Link
          href="/contact"
          data-float=""
          className="inline-flex items-center gap-2 btn-glass-primary px-8 py-3.5 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Start a Project
        </Link>
      </motion.div>
    </section>
  );
}
