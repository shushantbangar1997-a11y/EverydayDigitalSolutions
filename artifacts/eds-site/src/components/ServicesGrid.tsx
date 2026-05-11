import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Smartphone, Mic, Zap } from "lucide-react";
import { services } from "@/content/services";

const SERVICE_META: Record<string, { icon: React.ElementType; startingAt: string; href: string }> = {
  "01": { icon: Smartphone, startingAt: "Starting at ₹3L", href: "/services/mobile-app-development" },
  "02": { icon: Mic,        startingAt: "Starting at ₹1.5L", href: "/services/ai-voice-agents" },
  "03": { icon: Zap,        startingAt: "Starting at ₹80K", href: "/services/automation-systems" },
};

export function ServicesGrid() {
  const prefersReducedMotion = useReducedMotion();
  const variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="services" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-3xl mb-16"
      >
        <motion.h2 variants={variants} className="text-4xl md:text-5xl font-serif mb-6">
          Three ways we build <em className="text-primary italic">competitive advantage</em> into your business.
        </motion.h2>
        <motion.p variants={variants} className="text-lg text-muted-foreground">
          From customer-facing products to the AI systems running behind the scenes. Each one engineered to perform — not just to ship.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, i) => {
          const meta = SERVICE_META[service.id];
          const Icon = meta.icon;
          return (
            <motion.div
              key={service.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }
              }}
              className="group relative bg-card border border-border/40 p-8 flex flex-col hover:border-primary transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-muted-foreground">{service.id}</span>
                <div className="p-2 rounded-md bg-[var(--accent-soft)] text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-2xl font-serif mb-2">{service.title}</h3>
              <p className="text-primary italic mb-6">{service.tagline}</p>

              <ul className="flex flex-col gap-3 mb-8 flex-grow">
                {service.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1 shrink-0">▸</span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="w-full h-[1px] bg-border/40 mb-6"></div>

              <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-muted-foreground">Best for: {service.bestFor}</p>
                <span className="text-xs font-medium text-primary whitespace-nowrap ml-4">{meta.startingAt}</span>
              </div>

              <Link
                href={meta.href}
                className="inline-flex items-center gap-2 bg-primary text-black px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background group-hover:gap-3"
              >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
