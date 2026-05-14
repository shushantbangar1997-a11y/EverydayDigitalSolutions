import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface InlinePageFAQProps {
  heading?: string;
  items: FAQItem[];
}

export function InlinePageFAQ({ heading = "Frequently Asked Questions", items }: InlinePageFAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <h2 className="text-2xl sm:text-3xl font-serif mb-10">{heading}</h2>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[var(--glass-fill)] transition-colors"
              aria-expanded={open === i}
            >
              <span className="font-medium text-foreground text-sm sm:text-base">{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-5">
                <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
