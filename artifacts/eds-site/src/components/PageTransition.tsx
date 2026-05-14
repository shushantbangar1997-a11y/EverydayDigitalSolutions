import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SPRING_IN = {
  type: "spring" as const,
  stiffness: 340,
  damping: 30,
  mass: 0.85,
};

const FADE_OUT = {
  duration: 0.16,
  ease: [0.4, 0, 1, 1] as [number, number, number, number],
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const prevLocation = useRef(location);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout> | undefined;
    if (prevLocation.current !== location) {
      window.scrollTo(0, 0);
      setOverlay(true);
      id = setTimeout(() => setOverlay(false), 220);
      prevLocation.current = location;
    }
    return () => { if (id !== undefined) clearTimeout(id); };
  }, [location]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location}
          initial={{ opacity: 0, scale: 0.972 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: SPRING_IN,
          }}
          exit={{
            opacity: 0,
            scale: 1.016,
            transition: FADE_OUT,
          }}
          style={{ transformOrigin: "top center", willChange: "transform, opacity" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Glass shimmer — briefly flashes between pages like iOS navigation */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            key="nav-overlay"
            aria-hidden
            className="fixed inset-0 pointer-events-none z-[80]"
            style={{
              background:
                "radial-gradient(ellipse 120% 80% at 50% 0%, var(--glass-highlight) 0%, transparent 65%)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
