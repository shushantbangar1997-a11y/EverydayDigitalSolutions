import { useRef, useCallback, useEffect } from "react";
import { prefersReducedMotion } from "@/lib/canUseWebGL";

const MAX_TILT = 6;
const EASE = 0.10;

export function useTilt<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const rafRef = useRef<number>(0);
  const target = useRef({ rx: 0, ry: 0 });
  const current = useRef({ rx: 0, ry: 0 });
  const isAnimating = useRef(false);

  const step = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    current.current.rx += (target.current.rx - current.current.rx) * EASE;
    current.current.ry += (target.current.ry - current.current.ry) * EASE;

    el.style.transform = `perspective(800px) rotateX(${current.current.rx.toFixed(3)}deg) rotateY(${current.current.ry.toFixed(3)}deg)`;

    const still =
      Math.abs(target.current.rx - current.current.rx) < 0.01 &&
      Math.abs(target.current.ry - current.current.ry) < 0.01;

    if (still) {
      isAnimating.current = false;
    } else {
      rafRef.current = requestAnimationFrame(step);
    }
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      target.current.rx = -ny * MAX_TILT * 2;
      target.current.ry = nx * MAX_TILT * 2;
      if (!isAnimating.current) {
        isAnimating.current = true;
        rafRef.current = requestAnimationFrame(step);
      }
    },
    [step]
  );

  const onMouseLeave = useCallback(() => {
    target.current.rx = 0;
    target.current.ry = 0;
    if (!isAnimating.current) {
      isAnimating.current = true;
      rafRef.current = requestAnimationFrame(step);
    }
  }, [step]);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    el.style.willChange = "transform";

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.style.willChange = "";
      el.style.transform = "";
    };
  }, [onMouseMove, onMouseLeave]);

  return ref;
}
