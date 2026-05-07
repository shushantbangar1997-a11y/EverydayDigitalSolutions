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
    <section className="pt-8 pb-16 sm:pt-12 lg:pt-28 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-10 lg:gap-16 items-start"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          <motion.div variants={variants} className="inline-block border border-border px-3 py-1 rounded-full text-xs font-medium tracking-wide text-muted-foreground mb-6 lg:mb-8">
            AI &amp; Custom Software Studio · Mohali · Jalandhar
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
              className="w-full sm:w-auto text-center bg-primary text-black px-6 py-3.5 sm:py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start a Project
            </Link>
            <a
              href="#work"
              className="w-full sm:w-auto text-center border border-border bg-transparent text-foreground px-6 py-3.5 sm:py-3 rounded-sm font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              See our work
            </a>
          </motion.div>
        </div>

        <motion.div variants={variants} className="grid grid-cols-2 lg:flex lg:flex-col gap-6 lg:pl-10 lg:border-l border-border/40 pt-6 lg:pt-0 border-t lg:border-t-0 border-border/40">
          <div className="flex flex-col gap-1 lg:gap-2">
            <span className="text-2xl lg:text-3xl font-serif text-primary">30 days</span>
            <span className="text-xs lg:text-sm text-muted-foreground">Average delivery</span>
          </div>
          <div className="flex flex-col gap-1 lg:gap-2">
            <span className="text-2xl lg:text-3xl font-serif text-primary">Senior</span>
            <span className="text-xs lg:text-sm text-muted-foreground">Talent on every project</span>
          </div>
          <div className="flex flex-col gap-1 lg:gap-2">
            <span className="text-2xl lg:text-3xl font-serif text-primary">Mohali</span>
            <span className="text-xs lg:text-sm text-muted-foreground">Studio &amp; home base</span>
          </div>
          <div className="flex flex-col gap-1 lg:gap-2">
            <span className="text-2xl lg:text-3xl font-serif text-primary">2018</span>
            <span className="text-xs lg:text-sm text-muted-foreground">Founded · 7 years building</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
