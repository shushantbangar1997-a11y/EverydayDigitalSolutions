import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { caseStudies, portfolioProjects } from "@/content/case-studies";
import { PhoneMockup } from "./PhoneMockup";

const statusColors: Record<string, string> = {
  TRANSFERRED: "text-emerald-400 bg-emerald-400/10",
  CONNECTED: "text-amber-400 bg-amber-400/10",
  VOICEMAIL: "text-muted-foreground bg-muted/40"
};

const categoryColors: Record<string, string> = {
  "Custom Mobile App": "bg-[var(--accent-soft)] text-primary",
  "AI Voice Agent": "bg-blue-500/10 text-blue-400",
  "Automation & AI": "bg-emerald-500/10 text-emerald-400",
};

export function CaseStudy() {
  const prefersReducedMotion = useReducedMotion();
  const cs = caseStudies.quasar;

  const variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="work" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={variants}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-center">
          Selected work — <em className="text-primary italic">built &amp; shipped</em>.
        </h2>
      </motion.div>

      {/* Featured case study — Quasar */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
        }}
        className="relative bg-card border border-border/40 rounded-xl overflow-hidden p-6 md:p-10 lg:p-16 mb-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-soft)_0%,transparent_70%)] opacity-20 pointer-events-none"></div>

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
                className="bg-primary text-black px-6 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Read full case study
              </Link>
              <Link
                href="/contact"
                className="border border-border bg-transparent text-foreground px-6 py-3 rounded-sm font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Want this for your business
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Featured case study — Open Humana */}
      {(() => {
        const oh = caseStudies.openHumana;
        return (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="relative bg-card border border-border/40 rounded-xl overflow-hidden p-6 md:p-10 lg:p-16 mb-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-soft)_0%,transparent_70%)] opacity-10 pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Dashboard mockup */}
              <div className="order-2 lg:order-1">
                <div className="rounded-xl border border-border/60 overflow-hidden shadow-xl">
                  {/* Browser chrome */}
                  <div className="bg-[#1a1a1a] border-b border-border/40 px-3 py-2.5 flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
                    </div>
                    <div className="flex-1 bg-[#2a2a2a] rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono mx-2 truncate">
                      app.openhumana.com/dashboard
                    </div>
                  </div>
                  {/* Dashboard body */}
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
                  <div className="flex flex-col">
                    <span className="text-2xl font-serif text-primary">1,285+</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Dials / day</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-serif text-primary">5–10x</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Dial volume</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-serif text-primary">100%</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Live calls</span>
                  </div>
                </div>

                <div className="flex flex-col gap-6 mb-12">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Problem</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">Reps waste 70% of their day on unanswered dials and voicemails. By the time a real human picks up, the energy is gone.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">What We Built</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">Alex, an AI voice agent that handles every outbound dial — navigating voicemail and transferring only live calls to a human rep, instantly.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Result</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">Teams report reps spend 100% of their on-phone time with live prospects. Open Humana is live and serving sales teams today.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/work/open-humana"
                    className="bg-primary text-black px-6 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Read full case study
                  </Link>
                  <a
                    href={oh.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-border bg-transparent text-foreground px-6 py-3 rounded-sm font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Visit openhumana.com <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* Portfolio grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioProjects.map((project, i) => {
          const colorClass = categoryColors[project.category] ?? "bg-[var(--accent-soft)] text-primary";
          return (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{
                hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }
              }}
              className="group bg-card border border-border/40 rounded-lg p-6 flex flex-col hover:border-primary transition-all duration-300 hover:-translate-y-1"
            >
              <span className={`self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${colorClass}`}>
                {project.category}
              </span>

              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-2">
                {project.client}
              </p>
              <h3 className="font-serif text-base leading-snug mb-4 flex-grow">
                {project.title}
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed mb-6 border-t border-border/40 pt-4">
                {project.outcome}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-border/60 text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              {project.hasFullCaseStudy ? (
                <Link
                  href={project.caseStudyUrl}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
                >
                  View case study <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:gap-2.5 transition-all"
                >
                  Enquire about this <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* View all CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={variants}
        className="text-center mt-12"
      >
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 border border-border bg-transparent text-foreground px-6 py-3 rounded-sm font-medium hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Start your project <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
