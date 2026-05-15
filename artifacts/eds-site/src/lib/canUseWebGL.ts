export function canUseWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof document === "undefined") return false;
  if (window.matchMedia("(max-width: 767px)").matches) return false;

  // Skip on low-core devices (typically older laptops / tablets) — the
  // decorative canvas is not worth the battery.
  const cores = (navigator as Navigator & { hardwareConcurrency?: number })
    .hardwareConcurrency;
  if (typeof cores === "number" && cores < 4) return false;

  // Respect Data Saver / slow connection hints — the canvas is purely
  // decorative and the user is signalling they want a lighter page.
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && ["slow-2g", "2g"].includes(conn.effectiveType)) {
    return false;
  }

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
