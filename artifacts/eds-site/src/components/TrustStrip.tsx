import { motion, useReducedMotion } from "framer-motion";

export function TrustStrip() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="border-y border-border/50 bg-card/30 py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase whitespace-nowrap">
            Trusted by Tricity's leading service brands
          </p>
          <div className="flex items-center gap-8 md:gap-16 opacity-70 grayscale">
            <span className="font-serif text-2xl">Quasar Salon</span>
            <span className="font-serif text-xl text-muted-foreground italic">Your brand here</span>
            <span className="font-serif text-xl text-muted-foreground italic hidden sm:inline-block">Your brand here</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}