import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PhoneMockupProps {
  screens: string[];
}

export function PhoneMockup({ screens }: PhoneMockupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!screens || screens.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screens.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [screens]);

  if (!screens || screens.length === 0) return null;

  return (
    <div className="relative mx-auto w-full max-w-[280px] aspect-[9/19.5] rounded-[2.5rem] border-[10px] border-[#1a1714] bg-background shadow-2xl overflow-hidden flex-shrink-0">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 w-32 bg-[#1a1714] mx-auto rounded-b-[1rem] z-20"></div>
      
      {/* Inner Screen */}
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={screens[currentIndex]}
            alt={`Screen ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}