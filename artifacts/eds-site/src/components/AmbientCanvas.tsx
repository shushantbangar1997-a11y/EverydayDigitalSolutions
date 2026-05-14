import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/canUseWebGL";

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

const ORB_CONFIGS = [
  { r: 460, color: "rgba(250,240,190,0.07)" },
  { r: 360, color: "rgba(184,144,0,0.05)" },
  { r: 400, color: "rgba(245,212,36,0.04)" },
  { r: 310, color: "rgba(250,250,248,0.06)" },
  { r: 480, color: "rgba(242,239,233,0.08)" },
];

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const orbs: Orb[] = ORB_CONFIGS.map((cfg) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: cfg.r,
      color: cfg.color,
    }));

    const reduced = prefersReducedMotion();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        const grad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.r
        );
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!reduced) {
          orb.x += orb.vx;
          orb.y += orb.vy;
          if (orb.x < -orb.r)                  orb.x = canvas.width  + orb.r;
          if (orb.x > canvas.width  + orb.r)   orb.x = -orb.r;
          if (orb.y < -orb.r)                  orb.y = canvas.height + orb.r;
          if (orb.y > canvas.height + orb.r)   orb.y = -orb.r;
        }
      }

      if (!reduced) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
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
