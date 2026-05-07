import { motion, useReducedMotion } from "framer-motion";

const steps = [
  {
    number: "01",
    days: "Days 1–3",
    title: "Discovery",
    description: "Deep dive into your business, your customers, and what success looks like. Tight scope on day three."
  },
  {
    number: "02",
    days: "Days 4–21",
    title: "Build",
    description: "I build your product end-to-end. Daily WhatsApp updates, weekly demos, no agency black-box."
  },
  {
    number: "03",
    days: "Days 22–28",
    title: "Test & Polish",
    description: "Real-device testing, edge cases, performance tuning. We don't ship anything I wouldn't put my name on."
  },
  {
    number: "04",
    days: "Days 29–30",
    title: "Launch & Handoff",
    description: "Store submissions, deployment, training, documentation. You own the code, the data, and the keys."
  }
];

export function ProcessTimeline() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="process" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={item}
        className="max-w-3xl mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-serif mb-6">
          A 30-day path from idea to <em className="text-primary italic">live product</em>.
        </h2>
        <p className="text-lg text-muted-foreground">
          No surprises, no scope creep, no missed deadlines.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
      >
        {steps.map((step) => (
          <motion.div key={step.number} variants={item} className="flex flex-col border-t-2 border-primary pt-6">
            <span className="font-mono text-sm text-muted-foreground mb-4">{step.number}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{step.days}</span>
            <h3 className="text-2xl font-serif mb-4">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}