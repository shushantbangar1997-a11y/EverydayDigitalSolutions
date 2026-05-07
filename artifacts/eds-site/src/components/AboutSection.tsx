import { motion, useReducedMotion } from "framer-motion";

const techStack = [
  "React Native", "Expo", "Firebase", "Next.js", "n8n", 
  "Twilio", "Synthflow", "Anthropic Claude", "OpenAI", "Railway"
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
          <div className="relative aspect-[4/5] bg-gradient-to-b from-muted to-background border border-border rounded-sm overflow-hidden flex items-center justify-center">
            <span className="font-serif text-[8rem] text-muted/20 select-none">S</span>
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