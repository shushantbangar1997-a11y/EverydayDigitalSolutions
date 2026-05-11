import { motion } from "framer-motion";

const clients = [
  { name: "Quasar Salon", initials: "QS", category: "Beauty & Wellness" },
  { name: "Tricity Realty Group", initials: "TRG", category: "Real Estate" },
  { name: "MediPulse Clinics", initials: "MP", category: "Healthcare" },
  { name: "GrowStack Commerce", initials: "GS", category: "E-Commerce" },
];

export function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="border-y border-border/50 bg-card/30 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase whitespace-nowrap shrink-0">
            Trusted by Tricity's most ambitious brands
          </p>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-8 md:gap-10 w-full md:w-auto">
            {clients.map((client) => (
              <div key={client.name} className="flex items-center gap-3 opacity-60 hover:opacity-90 transition-opacity">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-sm bg-foreground/8 border border-border/50 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-[10px] font-bold tracking-wider text-foreground/70">{client.initials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-base text-foreground whitespace-nowrap leading-tight">{client.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{client.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
