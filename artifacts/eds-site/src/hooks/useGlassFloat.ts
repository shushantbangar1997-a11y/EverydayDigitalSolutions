/**
 * useGlassFloat — global hover hook for the Glass Float effect.
 *
 * Watches the whole document via event delegation. When the cursor enters
 * any [data-float], .glass, or .glass-elevated element it:
 *   1. Applies the SVG liquid-glass backdropFilter via LiquidGlassFilter.attachLiquidGlass()
 *   2. GSAP-animates the element up and slightly scaled (the "float off the page" motion)
 *   3. Adds the .glass-float-active CSS class (elevated box-shadow, glass sheen)
 *
 * On cursor-leave the filter is removed and the element settles back.
 * Disabled on touch/mobile (≤767 px) and prefers-reduced-motion.
 */
import { useEffect } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/canUseWebGL";
import { attachLiquidGlass, detachLiquidGlass } from "@/components/LiquidGlassFilter";

const LIFT_Y   = -12;
const SCALE_UP = 1.032;
const DUR_IN   = 0.42;
const DUR_OUT  = 0.50;
const EASE_IN  = "power3.out";
const EASE_OUT = "power2.out";

/**
 * Walk up the DOM to find the nearest floatable element:
 * - has `data-float` attr OR has `.glass` / `.glass-elevated` class
 * - is NOT fixed/sticky (navbar, modals)
 * - does NOT fill most of the viewport (wide banners)
 */
function floatTarget(node: Element | null): HTMLElement | null {
  let el = node;
  while (el && el !== document.documentElement) {
    if (el instanceof HTMLElement) {
      const hasFloat = el.dataset.float !== undefined;
      const hasGlass = el.classList.contains("glass") || el.classList.contains("glass-elevated");

      if (hasFloat || hasGlass) {
        const pos = getComputedStyle(el).position;
        if (pos === "fixed" || pos === "sticky") return null;
        const r = el.getBoundingClientRect();
        if (r.width  > window.innerWidth  * 0.88) return null;
        if (r.height > window.innerHeight * 0.78) return null;
        return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}

export function useGlassFloat(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (prefersReducedMotion()) return;

    let active: HTMLElement | null = null;

    function enter(el: HTMLElement) {
      active = el;
      el.classList.add("glass-float-active");
      attachLiquidGlass(el);
      gsap.to(el, {
        y:         LIFT_Y,
        scale:     SCALE_UP,
        duration:  DUR_IN,
        ease:      EASE_IN,
        overwrite: "auto",
      });
    }

    function leave(el: HTMLElement) {
      detachLiquidGlass(el);
      el.classList.remove("glass-float-active");
      gsap.to(el, {
        y:         0,
        scale:     1,
        duration:  DUR_OUT,
        ease:      EASE_OUT,
        overwrite: "auto",
      });
      if (active === el) active = null;
    }

    function onMove(e: MouseEvent) {
      const target = floatTarget(e.target as Element);

      if (target !== active) {
        if (active) leave(active);
        if (target) enter(target);
      }

      // Keep filter snapped to the element on every frame (handles page scroll mid-hover)
      if (active) attachLiquidGlass(active);
    }

    function onLeaveDoc() {
      if (active) leave(active);
    }

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeaveDoc);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeaveDoc);
      if (active) {
        const el = active;
        detachLiquidGlass(el);
        el.classList.remove("glass-float-active");
        gsap.killTweensOf(el);
        gsap.set(el, { y: 0, scale: 1 });
        active = null;
      }
    };
  }, []);
}
