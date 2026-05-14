export function canUseWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof document === "undefined") return false;
  if (window.matchMedia("(max-width: 767px)").matches) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      (canvas.getContext as (c: string) => RenderingContext | null)("webgl") ||
      (canvas.getContext as (c: string) => RenderingContext | null)("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
