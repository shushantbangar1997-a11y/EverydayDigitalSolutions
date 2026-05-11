import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const prevLocation = useRef(location);

  useEffect(() => {
    if (prevLocation.current !== location) {
      window.scrollTo(0, 0);
      prevLocation.current = location;
    }
  }, [location]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
