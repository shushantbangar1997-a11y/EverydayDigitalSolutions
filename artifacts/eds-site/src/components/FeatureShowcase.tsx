import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Smartphone, Mic, Zap } from "lucide-react";

function unsplash(id: string, w: number): string {
  return `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=75`;
}

function srcSet(id: string): string {
  return [480, 768, 1024, 1440]
    .map((w) => `${unsplash(id, w)} ${w}w`)
    .join(", ");
}

const FEATURES = [
  {
    id: 1,
    icon: Smartphone,
    title: "Custom mobile apps your customers actually use",
    description:
      "Bookings, loyalty points, push notifications, and in-app payments — all under your brand. Built for iOS and Android. Deployed to both stores end-to-end.",
    photoId: "photo-1512941937669-90a1b58e7e9c",
    imageAlt: "Person using a mobile booking app on their phone",
  },
  {
    id: 2,
    icon: Mic,
    title: "An AI that answers every call in under 60 seconds",
    description:
      "Hindi, English, and Punjabi voice agents handle inbound leads, outbound follow-ups, and appointment reminders — 24 hours a day, without adding headcount.",
    photoId: "photo-1677442136019-21780ecad995",
    imageAlt: "AI voice agent interface on screen",
  },
  {
    id: 3,
    icon: Zap,
    title: "Automation that runs the ops your staff hate",
    description:
      "WhatsApp, CRM, email, and calendar — unified into one workflow. Custom AI agents trained on your processes. Fully managed so your team focuses on customers, not admin.",
    photoId: "photo-1551288049-bebda4e38f71",
    imageAlt: "Business automation dashboard with analytics",
  },
];

const CYCLE_MS = 5000;

export function FeatureShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function startCycle() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (prefersReducedMotion) return;
    setProgress(0);
    const tick = 100;
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setCurrent((c) => (c + 1) % FEATURES.length);
          return 0;
        }
        return p + tick / (CYCLE_MS / tick);
      });
    }, tick);
  }

  useEffect(() => {
    startCycle();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [prefersReducedMotion]);

  useEffect(() => {
    startCycle();
  }, [current]);

  function select(index: number) {
    setCurrent(index);
    setProgress(0);
  }

  const feature = FEATURES[current];

  return (
    <section className="py-24 lg:py-32 bg-card/40 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            What you get from day one
          </p>
          <h2 className="text-3xl md:text-4xl font-serif">
            Three ways we build <em className="italic text-primary">competitive advantage</em> into your business.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-3 order-2 lg:order-1">
            {FEATURES.map((f, index) => {
              const Icon = f.icon;
              const isActive = current === index;
              return (
                <button
                  key={f.id}
                  ref={(el) => { tabRefs.current[index] = el; }}
                  onClick={() => select(index)}
                  className={`text-left flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg transition-all duration-300 border ${
                    isActive
                      ? "bg-background border-primary/30 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-background/60"
                  }`}
                >
                  <div
                    className={`mt-0.5 p-2 rounded-md shrink-0 transition-colors duration-300 ${
                      isActive ? "bg-primary text-black" : "bg-[var(--accent-soft)] text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-serif text-lg leading-snug mb-1 transition-colors duration-300 ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {f.title}
                    </h3>
                    {isActive && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {f.description}
                      </p>
                    )}
                    <div className="h-0.5 bg-border/40 rounded-full overflow-hidden">
                      {isActive && !prefersReducedMotion && (
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                      )}
                      {isActive && prefersReducedMotion && (
                        <div className="h-full bg-primary w-full" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              key={current}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative rounded-2xl overflow-hidden border border-border/40 shadow-xl"
            >
              <img
                src={unsplash(feature.photoId, 768)}
                srcSet={srcSet(feature.photoId)}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={feature.imageAlt}
                width={768}
                height={515}
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
