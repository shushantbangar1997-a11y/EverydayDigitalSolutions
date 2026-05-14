// Global hover delegate for the Glass Float effect.
// Lifts [data-float] / .glass / .glass-elevated elements on cursor enter,
// applies the SVG lens refraction, and tracks cursor position for the
// specular highlight. Disabled on mobile and prefers-reduced-motion.
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

function floatTarget(node: Element | null): HTMLElement | null {
  let el = node;
  while (el && el !== document.documentElement) {
    if (el instanceof HTMLElement) {
      const hasFloat = el.dataset.float !== undefined;
      const hasGlass = el.classList.contains("glass") || el.classList.contains("glass-elevated") || el.classList.contains("btn-glass-primary") || el.classList.contains("btn-glass-neutral");
      if (hasFloat || hasGlass) {
        const pos = getComputedStyle(el).position;
        if (pos === "fixed" || pos === "sticky") return null;
        const r = el.getBoundingClientRect();
        if (r.width  > window.innerWidth  * 0.85) return null;
        if (r.height > window.innerHeight * 0.78) return null;
        return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}

function updateCursorVars(el: HTMLElement, clientX: number, clientY: number): void {
  const r = el.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return;
  el.style.setProperty("--glass-x", ((clientX - r.left) / r.width  * 100).toFixed(1) + "%");
  el.style.setProperty("--glass-y", ((clientY - r.top)  / r.height * 100).toFixed(1) + "%");
}

function clearCursorVars(el: HTMLElement): void {
  el.style.removeProperty("--glass-x");
  el.style.removeProperty("--glass-y");
}

export function useGlassFloat(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (prefersReducedMotion()) return;

    let active: HTMLElement | null = null;

    function enter(el: HTMLElement, clientX: number, clientY: number) {
      active = el;
      el.classList.add("glass-float-active");
      updateCursorVars(el, clientX, clientY);
      attachLiquidGlass(el);
      gsap.to(el, { y: LIFT_Y, scale: SCALE_UP, duration: DUR_IN, ease: EASE_IN, overwrite: "auto" });
    }

    function leave(el: HTMLElement) {
      detachLiquidGlass(el);
      clearCursorVars(el);
      el.classList.remove("glass-float-active");
      gsap.to(el, { y: 0, scale: 1, duration: DUR_OUT, ease: EASE_OUT, overwrite: "auto" });
      if (active === el) active = null;
    }

    function onMove(e: MouseEvent) {
      const target = floatTarget(e.target as Element);
      if (target !== active) {
        if (active) leave(active);
        if (target) enter(target, e.clientX, e.clientY);
      }
      if (active) {
        attachLiquidGlass(active); // re-snap after scroll
        updateCursorVars(active, e.clientX, e.clientY);
      }
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
        clearCursorVars(el);
        el.classList.remove("glass-float-active");
        gsap.killTweensOf(el);
        gsap.set(el, { y: 0, scale: 1 });
        active = null;
      }
    };
  }, []);
}
