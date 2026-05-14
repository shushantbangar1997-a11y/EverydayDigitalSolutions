import { lazy, Suspense, useState } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { canUseWebGL } from "@/lib/canUseWebGL";

const GlassLens = lazy(() =>
  import("@/components/GlassLens").then((m) => ({ default: m.GlassLens }))
);

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [showGlassLens] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return canUseWebGL();
  });

  const variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
  };
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <section className="pt-8 pb-16 sm:pt-12 md:pt-16 lg:pt-28 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-10 lg:gap-16 items-start"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          <motion.div variants={variants} className="inline-flex items-center gap-2 glass px-3 py-1 rounded-full text-xs font-medium tracking-wide text-muted-foreground mb-6 lg:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span>1 flagship project shipping · taking new clients for 2026</span>
          </motion.div>
          <motion.h1 variants={variants} className="font-serif leading-[1.1] text-foreground mb-6 lg:mb-8" style={{ fontSize: 'clamp(2.2rem, 6vw + 0.5rem, 5.25rem)' }}>
            The technology partner for <em className="text-primary font-serif italic">Tricity's</em> most ambitious businesses.
          </motion.h1>
          <motion.p variants={variants} className="text-base lg:text-lg text-muted-foreground mb-8 lg:mb-10 max-w-2xl leading-relaxed">
            We design and ship custom software, AI voice agents, and automation systems — crafted with senior-level precision for service businesses across Chandigarh, Mohali, and Panchkula.
          </motion.p>
          <motion.div variants={variants} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/contact"
              data-float=""
              className="w-full sm:w-auto text-center bg-primary text-black px-6 py-3.5 sm:py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start a Project
            </Link>
            <a
              href="#work"
              data-float=""
              className="w-full sm:w-auto text-center glass text-foreground px-6 py-3.5 sm:py-3 rounded-sm font-medium hover:brightness-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              See our work
            </a>
          </motion.div>
        </div>

        <motion.div variants={variants} className="flex flex-col gap-6 lg:pl-10 lg:border-l border-border/40 pt-6 lg:pt-0 border-t lg:border-t-0 border-border/40 min-w-0">
          {/* Mini app preview — desktop only */}
          <div className="hidden lg:block">
            <div className="glass-elevated rounded-xl relative overflow-hidden">
              {showGlassLens && (
                <Suspense fallback={null}>
                  <GlassLens />
                </Suspense>
              )}
              <div className="relative p-5" style={{ zIndex: 2 }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Quasar Salon · App</span>
                  <span className="flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2.5 p-2.5 bg-background rounded-md border border-border/40">
                    <div className="w-6 h-6 rounded-full bg-primary/20 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground">Appointment confirmed</div>
                      <div className="text-[10px] text-muted-foreground">Today, 3:00 PM · Harpreet S.</div>
                    </div>
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-background rounded-md border border-border/40 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-foreground">New booking request</div>
                      <div className="text-[10px] text-muted-foreground">Tomorrow, 11:00 AM</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-background rounded-md border border-border/40 opacity-40">
                    <div className="w-6 h-6 rounded-full bg-border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-foreground">Loyalty reward earned</div>
                      <div className="text-[10px] text-muted-foreground">240 pts · Manpreet K.</div>
                    </div>
                  </div>
                </div>
                <div className="w-full py-2 bg-primary rounded-sm text-center text-[11px] font-bold text-black tracking-wide">
                  Book Now
                </div>
                <p className="text-center text-[10px] text-muted-foreground mt-2">Shipped in 30 days · Launching May 2026</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-5 lg:gap-6">
            <div className="flex flex-col gap-1 lg:gap-2">
              <span className="text-2xl lg:text-3xl font-serif text-primary">30 days</span>
              <span className="text-xs lg:text-sm text-muted-foreground">Average delivery</span>
            </div>
            <div className="flex flex-col gap-1 lg:gap-2">
              <span className="text-2xl lg:text-3xl font-serif text-primary">2</span>
              <span className="text-xs lg:text-sm text-muted-foreground">In-house products built</span>
            </div>
            <div className="flex flex-col gap-1 lg:gap-2">
              <span className="text-2xl lg:text-3xl font-serif text-primary">Mohali</span>
              <span className="text-xs lg:text-sm text-muted-foreground">Studio &amp; home base</span>
            </div>
            <div className="flex flex-col gap-1 lg:gap-2">
              <span className="text-2xl lg:text-3xl font-serif text-primary">2018</span>
              <span className="text-xs lg:text-sm text-muted-foreground">Founded · 7 years building</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
