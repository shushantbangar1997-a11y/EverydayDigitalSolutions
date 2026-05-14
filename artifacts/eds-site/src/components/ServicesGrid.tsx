import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { Check, MessageCircle, Smartphone, Mic, Zap } from "lucide-react";
import { services } from "@/content/services";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "01": Smartphone,
  "02": Mic,
  "03": Zap,
};

export function ServicesGrid() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <TooltipProvider delayDuration={120}>
      <section id="services" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Three ways we build <em className="text-primary italic">competitive advantage</em> into your business.
          </h2>
          <p className="text-lg text-muted-foreground">
            From customer-facing products to the AI systems running behind the scenes. Each one engineered to perform — not just to ship.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[service.id];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <Card className="glass rounded-3xl p-6 flex flex-col gap-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-serif leading-snug mb-1">{service.title}</h3>
                      <p className="text-sm text-primary italic">{service.tagline}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--accent-soft)] text-primary shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Feature list */}
                  <CardContent className="rounded-2xl border border-border/60 bg-background px-5 py-5 flex flex-col gap-4">
                    {service.features.map((f, j) => (
                      <Tooltip key={j}>
                        <TooltipTrigger asChild>
                          <div className="flex items-start gap-3 cursor-default select-none text-muted-foreground hover:text-foreground transition-colors group">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm leading-snug">{f.label}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-[240px] text-xs rounded-lg px-3 py-2"
                        >
                          {f.info}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </CardContent>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-4 px-1 pt-1">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Starting from</span>
                      <span className="text-2xl font-serif text-foreground leading-tight">{service.startingAt}</span>
                    </div>
                    <Link
                      href="/contact"
                      data-float=""
                      className="inline-flex items-center gap-2 bg-primary text-black px-5 py-3 rounded-2xl text-sm font-medium hover:bg-primary/90 transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Start a Project
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </TooltipProvider>
  );
}
