import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/canUseWebGL";

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const ORB_RADII = [460, 360, 400, 310, 480];

const ORB_COLORS_LIGHT = [
  "rgba(250,240,190,0.07)",
  "rgba(184,144,0,0.05)",
  "rgba(245,212,36,0.04)",
  "rgba(250,250,248,0.06)",
  "rgba(242,239,233,0.08)",
];

const ORB_COLORS_DARK = [
  "rgba(184,144,0,0.09)",
  "rgba(120,80,10,0.07)",
  "rgba(184,120,0,0.06)",
  "rgba(245,180,0,0.04)",
  "rgba(80,50,10,0.10)",
];

function readBgBase(): string {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-base")
      .trim() || "#FAFAF8"
  );
}

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Theme-reactive state stored in refs so the RAF loop is always current ──
    const fillRef   = { current: readBgBase() };
    const colorsRef = { current: ORB_COLORS_LIGHT as readonly string[] };

    const syncTheme = () => {
      fillRef.current   = readBgBase();
      colorsRef.current = document.documentElement.classList.contains("dark")
        ? ORB_COLORS_DARK
        : ORB_COLORS_LIGHT;
    };
    syncTheme(); // initialise before first paint

    // Watch for .dark class toggling on <html>
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Remove body background so the fixed canvas (z:-1) is visible
    const prevBodyBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "transparent";

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const orbs: Orb[] = ORB_RADII.map((r) => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r,
    }));

    const reduced = prefersReducedMotion();

    const draw = () => {
      // Page background fill — always uses the current theme colour
      ctx.fillStyle = fillRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        const grad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.r
        );
        grad.addColorStop(0, colorsRef.current[i]);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!reduced) {
          orb.x += orb.vx;
          orb.y += orb.vy;
          if (orb.x < -orb.r)                 orb.x = canvas.width  + orb.r;
          if (orb.x > canvas.width  + orb.r)  orb.x = -orb.r;
          if (orb.y < -orb.r)                 orb.y = canvas.height + orb.r;
          if (orb.y > canvas.height + orb.r)  orb.y = -orb.r;
        }
      }

      if (!reduced) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
