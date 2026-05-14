import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { OptimizedImage } from "@/components/OptimizedImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

const navLinks = [
  { label: "Services",  href: "/#services" },
  { label: "Work",      href: "/#work" },
  { label: "Process",   href: "/#process" },
  { label: "About",     href: "/#about" },
  { label: "FAQ",       href: "/#faq" },
  { label: "Contact",   href: "/contact" },
  { label: "Get a Quote", href: "/get-a-quote" },
];

export function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hover shape effects
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
        gsap.defaults({ ease: "main", duration: 0.7 });
      }
    } catch {
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer?.querySelector(`.bg-shape-${shapeIndex}`) ?? null;
        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          shapesContainer?.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          shape.classList.add("active");
          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        (item as HTMLElement & { _cleanup?: () => void })._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      containerRef.current?.querySelectorAll(".menu-list-item[data-shape]").forEach((item) => {
        (item as HTMLElement & { _cleanup?: () => void })._cleanup?.();
      });
    };
  }, []);

  // Open / close animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const navWrap   = containerRef.current!.querySelector(".nav-overlay-wrapper");
      const menu      = containerRef.current!.querySelector(".menu-content");
      const overlay   = containerRef.current!.querySelector(".kn-overlay");
      const bgPanels  = containerRef.current!.querySelectorAll(".backdrop-layer");
      const menuLinks = containerRef.current!.querySelectorAll(".nav-link");
      const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");
      const menuBtn   = containerRef.current!.querySelector(".nav-close-btn");
      const btnTexts  = menuBtn?.querySelectorAll("p");
      const btnIcon   = menuBtn?.querySelector(".menu-button-icon");

      const tl = gsap.timeline();

      if (isMenuOpen) {
        navWrap?.setAttribute("data-nav", "open");
        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(btnTexts ?? [], { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
          .fromTo(btnIcon ?? [], { rotate: 0 }, { rotate: 315 }, "<")
          .fromTo(overlay ?? [], { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
          .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35");
        if (fadeTargets.length) {
          tl.fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" }, "<+=0.2");
        }
      } else {
        navWrap?.setAttribute("data-nav", "closed");
        tl.to(overlay ?? [], { autoAlpha: 0 })
          .to(menu ?? [], { xPercent: 120 }, "<")
          .to(btnTexts ?? [], { yPercent: 0 }, "<")
          .to(btnIcon ?? [], { rotate: 0 }, "<")
          .set(navWrap ?? [], { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  // Body scroll lock — prevent page scrolling behind open menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMenuOpen]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleMenu = () => setIsMenuOpen((p) => !p);
  const closeMenu  = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef}>
      {/* ── Sticky Header ── */}
      <div className="site-header-wrapper">
        <header className={`kn-header${scrolled ? " kn-header--scrolled" : ""}`}>
          <div className="kn-container">
            <nav className="kn-nav-row">
              {/* Logo */}
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
                {/* Theme toggle */}
                <button
                  className="kn-theme-btn"
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun className="kn-theme-icon" /> : <Moon className="kn-theme-icon" />}
                </button>

                {/* Hamburger button — only item in header besides logo */}
                <button className="nav-close-btn" onClick={toggleMenu} aria-label="Toggle menu">
                  <div className="menu-button-text">
                    <p className="kn-btn-label">Menu</p>
                    <p className="kn-btn-label">Close</p>
                  </div>
                  <div className="icon-wrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="menu-button-icon"
                    >
                      <path d="M7.333 16V0h1.334v16H7.333Z" fill="currentColor" />
                      <path d="M16 8.667H0V7.333h16v1.334Z" fill="currentColor" />
                      <path d="M6 7.333h1.333V6A1.333 1.333 0 0 1 6 7.333Z" fill="currentColor" />
                      <path d="M10 7.333H8.667V6A1.333 1.333 0 0 0 10 7.333Z" fill="currentColor" />
                      <path d="M6 8.667h1.333V10A1.333 1.333 0 0 1 6 8.667Z" fill="currentColor" />
                      <path d="M10 8.667H8.667V10A1.333 1.333 0 0 0 10 8.667Z" fill="currentColor" />
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      {/* ── Full-screen Overlay Menu ── */}
      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="kn-overlay" onClick={closeMenu} />

          <nav className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer first" />
              <div className="backdrop-layer second" />
              <div className="backdrop-layer" />

              {/* Ambient shapes — EDS yellow/warm palette */}
              <div className="ambient-background-shapes">
                {/* Shape 1 – floating circles */}
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80"  cy="120" r="40" fill="rgba(245,212,36,0.12)" />
                  <circle className="shape-element" cx="300" cy="80"  r="60" fill="rgba(224,190,21,0.09)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(245,212,36,0.07)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(245,212,36,0.12)" />
                </svg>

                {/* Shape 2 – wave strokes */}
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M0 200 Q100 100,200 200 T400 200"
                        stroke="rgba(245,212,36,0.15)" strokeWidth="60" fill="none" />
                  <path className="shape-element" d="M0 280 Q100 180,200 280 T400 280"
                        stroke="rgba(224,190,21,0.10)" strokeWidth="40" fill="none" />
                </svg>

                {/* Shape 3 – dot grid */}
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  {[50,150,250,350].map((x) =>
                    [50,150,250,350].map((y) => (
                      <circle key={`${x}-${y}`} className="shape-element"
                              cx={x} cy={y} r="7" fill="rgba(245,212,36,0.22)" />
                    ))
                  )}
                </svg>

                {/* Shape 4 – organic blobs */}
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element"
                        d="M100 100 Q150 50,200 100 Q250 150,200 200 Q150 250,100 200 Q50 150,100 100"
                        fill="rgba(245,212,36,0.10)" />
                  <path className="shape-element"
                        d="M250 200 Q300 150,350 200 Q400 250,350 300 Q300 350,250 300 Q200 250,250 200"
                        fill="rgba(224,190,21,0.08)" />
                </svg>

                {/* Shape 5 – diagonal lines */}
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0"   y1="100" x2="300" y2="400"
                        stroke="rgba(245,212,36,0.12)" strokeWidth="28" />
                  <line className="shape-element" x1="100" y1="0"   x2="400" y2="300"
                        stroke="rgba(224,190,21,0.09)" strokeWidth="22" />
                  <line className="shape-element" x1="200" y1="0"   x2="400" y2="200"
                        stroke="rgba(245,212,36,0.07)" strokeWidth="18" />
                </svg>
              </div>
            </div>

            {/* Logo inside overlay */}
            <div className="kn-overlay-logo">
              <Link href="/" onClick={closeMenu} className="kn-logo-link">
                <OptimizedImage src="/logo.png" alt="Everyday Digital Solutions" className="kn-logo-img" width={140} height={32} loading="eager" decoding="async" />
                <div className="kn-logo-wordmark">
                  <span className="kn-logo-name">Everyday Digital Solutions</span>
                  <span className="kn-logo-sub">AI &amp; Custom Software Studio</span>
                </div>
              </Link>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {navLinks.map((link, i) => (
                  <li key={link.label} className="menu-list-item" data-shape={i + 1}>
                    <a
                      href={link.href}
                      className="nav-link w-inline-block"
                      onClick={closeMenu}
                    >
                      <p className="nav-link-text">{link.label}</p>
                      <div className="nav-link-hover-bg" />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Services + Solutions sub-sections */}
              <div className="kn-nav-sub-sections" data-menu-fade>
                <div className="kn-nav-sub-col">
                  <p className="kn-nav-sub-heading">Services</p>
                  <ul className="kn-nav-sub-list">
                    <li><Link href="/services/mobile-app-development" className="kn-nav-sub-link" onClick={closeMenu}>Mobile Apps</Link></li>
                    <li><Link href="/services/ai-voice-agents" className="kn-nav-sub-link" onClick={closeMenu}>AI Voice Agents</Link></li>
                    <li><Link href="/services/automation-systems" className="kn-nav-sub-link" onClick={closeMenu}>Automation Systems</Link></li>
                  </ul>
                </div>
                <div className="kn-nav-sub-col">
                  <p className="kn-nav-sub-heading">Solutions</p>
                  <ul className="kn-nav-sub-list">
                    <li><Link href="/solutions/salons-and-spas" className="kn-nav-sub-link" onClick={closeMenu}>Salons &amp; Spas</Link></li>
                  </ul>
                </div>
                <div className="kn-nav-sub-col">
                  <p className="kn-nav-sub-heading">Learn</p>
                  <ul className="kn-nav-sub-list">
                    <li><Link href="/blog" className="kn-nav-sub-link" onClick={closeMenu}>Blog</Link></li>
                    <li><Link href="/punjab" className="kn-nav-sub-link" onClick={closeMenu}>Serving Punjab</Link></li>
                  </ul>
                </div>
              </div>

              <div className="kn-overlay-footer" data-menu-fade>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link href="/get-a-quote" className="kn-cta-btn kn-cta-btn--large" onClick={closeMenu}>
                    Get a Quote
                  </Link>
                  <Link href="/contact" className="kn-cta-btn kn-cta-btn--large" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "inherit" }} onClick={closeMenu}>
                    Start a Project
                  </Link>
                </div>
                <p className="kn-overlay-tagline">AI &amp; Custom Software · Mohali · Jalandhar</p>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
