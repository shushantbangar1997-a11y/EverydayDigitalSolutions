import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "wouter";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { OptimizedImage } from "@/components/OptimizedImage";
import { canUseWebGL } from "@/lib/canUseWebGL";
import { NavSlideTabs } from "@/components/NavSlideTabs";

const GlassLens = lazy(() =>
  import("@/components/GlassLens").then((m) => ({ default: m.GlassLens }))
);

const NAV_TABS = [
  { label: "Mobile Apps",   href: "/services/mobile-app-development" },
  { label: "AI Voice",      href: "/services/ai-voice-agents" },
  { label: "Automation",    href: "/services/automation-systems" },
  { label: "Salons & Spas", href: "/solutions/salons-and-spas" },
  { label: "Real Estate",   href: "/solutions/real-estate" },
  { label: "Clinics",       href: "/solutions/clinics-and-healthcare" },
  { label: "Restaurants",   href: "/solutions/restaurants-and-cafes" },
  { label: "Blog",          href: "/blog" },
  { label: "Tools",         href: "/tools/app-cost-calculator" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();
  const [showGlassLens] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return canUseWebGL();
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`kn-header${scrolled ? " kn-header--scrolled" : ""}`}>
      {scrolled && showGlassLens && (
        <Suspense fallback={null}>
          <GlassLens />
        </Suspense>
      )}
      <div className="kn-container">
        {/* Row 1: logo + CTA */}
        <nav className="kn-nav-row">
          <Link href="/" className="kn-logo-link" aria-label="Home">
            <OptimizedImage
              src="/logo.png"
              alt="Everyday Digital Solutions"
              className="kn-logo-img"
              width={140}
              height={32}
              loading="eager"
              decoding="async"
            />
            <div className="kn-logo-wordmark">
              <span className="kn-logo-name">Everyday Digital Solutions</span>
              <span className="kn-logo-sub">AI &amp; Custom Software Studio</span>
            </div>
          </Link>

          <div className="kn-nav-row-right">
            <button
              className="kn-theme-btn"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="kn-theme-icon" /> : <Moon className="kn-theme-icon" />}
            </button>
            <Link href="/get-a-quote" data-float="" className="kn-cta-btn">
              Get a Quote
            </Link>
          </div>
        </nav>

        {/* Row 2: slide-tab nav strip */}
        <div className="kn-tabs-strip">
          <NavSlideTabs tabs={NAV_TABS} />
        </div>
      </div>
    </header>
  );
}
