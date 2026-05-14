import { useEffect } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/canUseWebGL";

const MAX_TILT  = 10;
const SCALE_UP  = 1.022;
const DUR_IN    = 0.65;
const DUR_OUT   = 0.55;
const EASE_IN   = "power3.out";
const EASE_OUT  = "power2.out";

type Animators = {
  rotX:  ReturnType<typeof gsap.quickTo>;
  rotY:  ReturnType<typeof gsap.quickTo>;
};

/** Walk up the DOM to find the nearest tiltable .glass / .glass-elevated ancestor. */
function glassAncestor(node: Element | null): HTMLElement | null {
  let el = node;
  while (el && el !== document.documentElement) {
    if (el instanceof HTMLElement) {
      const cl = el.classList;
      if (cl.contains("glass") || cl.contains("glass-elevated")) {
        const pos = getComputedStyle(el).position;
        if (pos === "fixed" || pos === "sticky") return null;
        const r = el.getBoundingClientRect();
        if (r.width  > window.innerWidth  * 0.88) return null;
        if (r.height > window.innerHeight * 0.78) return null;
        if (el.dataset.noTilt !== undefined) return null;
        return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}

export function useGlobalGlassTilt() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (prefersReducedMotion()) return;

    const cache = new Map<HTMLElement, Animators>();
    let active: HTMLElement | null = null;

    function setup(el: HTMLElement): Animators {
      // transformPerspective gives the 3-D depth illusion
      gsap.set(el, { transformPerspective: 900 });
      el.style.willChange = "transform";
      const a: Animators = {
        rotX: gsap.quickTo(el, "rotationX", { duration: DUR_IN, ease: EASE_IN }),
        rotY: gsap.quickTo(el, "rotationY", { duration: DUR_IN, ease: EASE_IN }),
      };
      cache.set(el, a);
      return a;
    }

    function resetEl(el: HTMLElement) {
      const a = cache.get(el);
      if (a) {
        a.rotX(0);
        a.rotY(0);
      }
      // Animate scale back with a separate tween (quickTo has issues with scale clearProps)
      gsap.to(el, { scale: 1, duration: DUR_OUT, ease: EASE_OUT, overwrite: "auto" });
    }

    function onMove(e: MouseEvent) {
      const target = glassAncestor(e.target as Element);

      if (target !== active) {
        if (active) resetEl(active);
        active = target;
      }

      if (!target) return;

      const a    = cache.get(target) ?? setup(target);
      const rect = target.getBoundingClientRect();
      const nx   = ((e.clientX - rect.left) / rect.width  - 0.5) * 2; // −1 → 1
      const ny   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      a.rotX(-ny * MAX_TILT);
      a.rotY( nx * MAX_TILT);
      gsap.to(target, { scale: SCALE_UP, duration: DUR_IN, ease: EASE_IN, overwrite: "auto" });
    }

    function onLeave() {
      if (active) { resetEl(active); active = null; }
    }

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cache.forEach((_, el) => {
        gsap.killTweensOf(el);
        // Reset transforms cleanly — no clearProps on shorthand scale
        gsap.set(el, { rotationX: 0, rotationY: 0, scale: 1, transformPerspective: 0 });
        el.style.willChange = "";
      });
      cache.clear();
    };
  }, []);
}
