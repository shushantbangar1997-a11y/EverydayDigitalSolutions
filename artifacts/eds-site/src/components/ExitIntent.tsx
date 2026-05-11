import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { X } from "lucide-react";
import { LeadMagnet } from "./LeadMagnet";

const SHOWN_KEY = "eds_exit_intent_shown";

export function ExitIntent() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return; // desktop only
    if (location.startsWith("/contact") || location.startsWith("/admin")) return;
    try {
      if (sessionStorage.getItem(SHOWN_KEY) === "1") return;
    } catch {
      return;
    }

    function handler(e: MouseEvent) {
      if (e.clientY > 0) return;
      try {
        sessionStorage.setItem(SHOWN_KEY, "1");
      } catch {
        // ignore
      }
      setOpen(true);
      document.removeEventListener("mouseleave", handler);
    }

    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [location]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-card border border-border rounded-md max-w-md w-full p-6 sm:p-8 shadow-2xl">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-2">
          Before you go
        </p>
        <h3 className="font-serif text-2xl sm:text-3xl text-foreground leading-tight mb-3">
          Get the <em className="italic text-primary">App Cost Guide</em>.
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          Real numbers from 12+ shipped projects across Punjab. 18 pages. Free.
        </p>
        <LeadMagnet source="exit_intent" variant="compact" />
      </div>
    </div>
  );
}
