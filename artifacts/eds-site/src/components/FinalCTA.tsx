import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/constants";

export function FinalCTA() {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-32 lg:py-48 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-soft)_0%,transparent_50%)] pointer-events-none"></div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={variants}
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Let's talk</span>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-8 leading-tight">
          Stop quoting agencies. <br />
          <em className="text-primary italic">Start shipping.</em>
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-xl">
          Get a free quote in 24 hours. We'll scope your project on a 15-minute call and send you a fixed price — no surprises.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="bg-primary text-black px-8 py-4 rounded-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background text-lg"
          >
            Get Free Quote
          </Link>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border bg-transparent text-foreground px-8 py-4 rounded-sm font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background text-lg"
          >
            Or WhatsApp us
          </a>
        </div>
      </motion.div>
    </section>
  );
}
