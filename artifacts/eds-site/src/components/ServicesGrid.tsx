import { motion, useReducedMotion } from "framer-motion";
import { services } from "@/content/services";

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
          Three ways we help your business <em className="text-primary italic">run on autopilot</em>.
        </motion.h2>
        <motion.p variants={variants} className="text-lg text-muted-foreground">
          From customer-facing apps to behind-the-scenes AI agents that work 24/7. Pick one. Or stack them — most clients do.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, i) => (
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
            <span className="text-xs font-mono text-muted-foreground mb-6 block">{service.id}</span>
            <h3 className="text-2xl font-serif mb-2">{service.title}</h3>
            <p className="text-primary italic mb-6">{service.tagline}</p>
            
            <ul className="flex flex-col gap-3 mb-8 flex-grow">
              {service.bullets.map((bullet, j) => (
                <li key={j} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-primary mr-2 mt-1 text-[10px]">♦</span>
                  {bullet}
                </li>
              ))}
            </ul>
            
            <div className="w-full h-[1px] bg-border/40 mb-6"></div>
            
            <p className="font-mono text-sm mb-2">{service.price}</p>
            <p className="text-xs text-muted-foreground">Best for: {service.bestFor}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}