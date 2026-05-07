import { motion } from "framer-motion";

const clients = [
  { name: "Quasar Salon", category: "Beauty & Wellness" },
  { name: "Tricity Realty Group", category: "Real Estate" },
  { name: "MediPulse Clinics", category: "Healthcare" },
  { name: "GrowStack Commerce", category: "E-Commerce" },
];

export function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="border-y border-border/50 bg-card/30 py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase whitespace-nowrap shrink-0">
            Trusted by Tricity's leading service brands
          </p>
          <div className="flex items-center gap-8 md:gap-12 opacity-60 overflow-x-auto w-full md:w-auto">
            {clients.map((client) => (
              <div key={client.name} className="flex flex-col items-center shrink-0">
                <span className="font-serif text-lg md:text-xl text-foreground whitespace-nowrap">{client.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{client.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
