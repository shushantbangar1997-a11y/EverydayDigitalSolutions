import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { caseStudies } from "@/content/case-studies";
import { PhoneMockup } from "./PhoneMockup";

export function CaseStudy() {
  const prefersReducedMotion = useReducedMotion();
  const cs = caseStudies.quasar;
  
  const variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="work" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={variants}
      >
        <h2 className="text-4xl md:text-5xl font-serif mb-16 text-center">
          Selected work — <em className="text-primary italic">built &amp; shipped</em>.
        </h2>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
        }}
        className="relative bg-card border border-border/40 rounded-xl overflow-hidden p-6 lg:p-16"
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
              How we built Tricity's first celebrity-grade salon app — for <em className="text-primary italic">{cs.meta.budget}</em>, in 30 days.
            </h3>
            
            <div className="grid grid-cols-3 gap-6 w-full mb-12 border-y border-border/40 py-6">
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">{cs.meta.timeline}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Timeline</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">{cs.meta.budget}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Cost</span>
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
              <p className="font-serif text-2xl italic text-foreground mb-4">"{cs.quote.text}"</p>
              <footer className="text-sm text-muted-foreground">— {cs.quote.author}</footer>
            </blockquote>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="bg-primary text-black px-6 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Want this for your business
              </Link>
              <a href="#services" className="border border-border bg-transparent text-foreground px-6 py-3 rounded-sm font-medium hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                See pricing
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}