import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { site } from "@/lib/constants";

const DISMISS_KEY = "eds_sticky_cta_dismissed";
const SHOW_AFTER_PX = 700; // appear only after the user has scrolled past the hero

export function StickyCTA() {
  const [location] = useLocation();
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch {
      // ignore
    }

    function onScroll() {
      if (window.scrollY > SHOW_AFTER_PX) setScrolledPast(true);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset scroll-past state on route change so the CTA waits again on each new page.
  useEffect(() => {
    setScrolledPast(window.scrollY > SHOW_AFTER_PX);
  }, [location]);

  if (!mounted || dismissed || !scrolledPast) return null;
  if (location.startsWith("/contact") || location.startsWith("/admin")) return null;

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:bottom-4 md:right-4 md:left-auto md:inset-x-auto md:max-w-md pointer-events-none">
      <div className="pointer-events-auto glass-elevated md:rounded-md px-4 py-3 md:px-5 md:py-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">
            Free 15-min scoping call.
          </p>
          <p className="text-xs text-muted-foreground leading-snug mt-0.5 hidden sm:block">
            Get a clear, fixed proposal — no obligations.
          </p>
        </div>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
          aria-label="Message us on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1 bg-primary text-black px-3 py-2 rounded-sm text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          Start a Project <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
