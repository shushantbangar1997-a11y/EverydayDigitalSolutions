import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
  };
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-12 lg:gap-16 items-start"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          <motion.div variants={variants} className="inline-block border border-border px-3 py-1 rounded-full text-xs font-medium tracking-wide text-muted-foreground mb-8">
            AI &amp; Custom Software Studio · Mohali · Jalandhar
          </motion.div>
          <motion.h1 variants={variants} className="font-serif leading-[1.1] text-foreground mb-8" style={{ fontSize: 'clamp(2.5rem, 5vw + 1rem, 5.25rem)' }}>
            The technology partner for <em className="text-primary font-serif italic">Tricity's</em> most ambitious businesses.
          </motion.h1>
          <motion.p variants={variants} className="text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            We design and ship custom software, AI voice agents, and automation systems for service businesses across Chandigarh, Mohali, and Panchkula — at one-tenth of agency cost, in 30 days.
          </motion.p>
          <motion.div variants={variants} className="flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="bg-primary text-black px-6 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Get a Free Quote
            </Link>
            <a
              href="#work"
              className="border border-border bg-transparent text-foreground px-6 py-3 rounded-sm font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              See our work
            </a>
          </motion.div>
        </div>
        <motion.div variants={variants} className="flex flex-col gap-6 lg:pl-10 lg:border-l border-border/40">
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-serif text-primary">30 days</span>
            <span className="text-sm text-muted-foreground">Average build time</span>
          </div>
          <div className="h-[1px] w-12 bg-border/40"></div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-serif text-primary">1/10×</span>
            <span className="text-sm text-muted-foreground">Of typical agency cost</span>
          </div>
          <div className="h-[1px] w-12 bg-border/40"></div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-serif text-primary">Mohali</span>
            <span className="text-sm text-muted-foreground">Studio &amp; home base</span>
          </div>
          <div className="h-[1px] w-12 bg-border/40"></div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-serif text-primary">2018</span>
            <span className="text-sm text-muted-foreground">Founded · 7 years building</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
