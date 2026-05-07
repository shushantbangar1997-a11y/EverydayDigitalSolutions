import { motion, useReducedMotion } from "framer-motion";

const techStack = [
  "React Native", "Expo", "Firebase", "Next.js", "n8n",
  "Twilio", "Synthflow", "Anthropic Claude", "OpenAI", "Railway"
];

const stats = [
  { value: "7+", label: "Years in business" },
  { value: "2018", label: "Founded" },
  { value: "30 days", label: "Avg. delivery" },
  { value: "Mohali", label: "Home base" },
];

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={variants}
        className="bg-card border border-border/40 rounded-md p-8 lg:p-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Founder card — styled brand block in place of photo */}
          <div className="relative aspect-[4/5] bg-gradient-to-b from-[#111008] to-background border border-border/60 rounded-sm overflow-hidden flex flex-col items-center justify-center gap-6 p-8">
            {/* Large EDS monogram */}
            <div className="flex flex-col items-center gap-2">
              <img
                src="/logo.png"
                alt="Everyday Digital Solutions"
                className="h-20 w-auto invert brightness-105 opacity-90"
              />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mt-2">
                Everyday Digital Solutions
              </span>
            </div>

            {/* Divider */}
            <div className="w-12 h-[1px] bg-primary/40"></div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6 w-full">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center">
                  <span className="text-2xl font-serif text-primary">{s.value}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Subtle yellow glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--accent-soft)_0%,transparent_60%)] opacity-30 pointer-events-none"></div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">About the studio</span>
            <h2 className="text-3xl lg:text-4xl font-serif mb-8 leading-tight">
              Hi, I'm Shushant. I founded Everyday Digital Solutions in <em className="text-primary italic">2018</em>.
            </h2>

            <div className="flex flex-col gap-6 text-muted-foreground leading-relaxed mb-10">
              <p>
                For seven years, I helped service businesses grow through digital marketing, lead generation, and custom systems. I ran offices, managed teams, and learned every part of the customer acquisition stack from the inside.
              </p>
              <p>
                In 2024, I rebuilt the company from the ground up around AI. Today, I run a focused studio — backed by a stack of AI agents and modern automation tools — that ships custom software, voice agents, and AI systems in 30 days, at prices traditional agencies can't match.
              </p>
              <p>
                Based in Mohali and Jalandhar. Working with ambitious service businesses across Tricity, India, and beyond.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full px-3 py-1 bg-secondary text-secondary-foreground border border-border text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
