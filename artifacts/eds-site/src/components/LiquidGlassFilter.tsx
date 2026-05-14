/**
 * LiquidGlassFilter — singleton SVG displacement-map filter for the Glass Float effect.
 *
 * Algorithm ported from 21st.dev LiquidGlass component (manfromexistence):
 *   roundedRectSDF + smoothStep → per-pixel displacement map → feDisplacementMap backdrop filter.
 *
 * The component renders once in App.tsx. The attach/detach functions are called
 * imperatively by useGlassFloat on hover enter/leave.
 */
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/canUseWebGL";

// ── SDF math (identical to 21st.dev source) ──────────────────────────────────

const smoothStep = (a: number, b: number, t: number): number => {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const len2 = (x: number, y: number): number => Math.sqrt(x * x + y * y);

const roundedRectSDF = (
  x: number, y: number,
  w: number, h: number, r: number,
): number => {
  const qx = Math.abs(x) - w + r;
  const qy = Math.abs(y) - h + r;
  return Math.min(Math.max(qx, qy), 0) + len2(Math.max(qx, 0), Math.max(qy, 0)) - r;
};

// ── Shader settings (tuned for mixed button/card shapes) ─────────────────────

const DISTORT_W   = 0.30;
const DISTORT_H   = 0.20;
const DISTORT_R   = 0.60;
const SMOOTH_EDGE = 0.80;
const DIST_OFFSET = 0.15;
const MAP_RES     = 192;       // canvas resolution for the displacement map
const FILTER_ID   = "eds-lgf"; // must be unique in the document

// ── Module-level singletons ───────────────────────────────────────────────────

let _filter:   SVGFilterElement | null          = null;
let _feImg:    SVGFEImageElement | null         = null;
let _feDisp:   SVGFEDisplacementMapElement | null = null;
let _mapURL:   string | null                    = null; // pre-computed once

// ── Map builder ──────────────────────────────────────────────────────────────

function buildDisplacementMap(): string {
  const canvas = document.createElement("canvas");
  canvas.width  = MAP_RES;
  canvas.height = MAP_RES;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const data = new Uint8ClampedArray(MAP_RES * MAP_RES * 4);
  let maxScale = 0;
  const raw: number[] = [];

  for (let i = 0; i < MAP_RES * MAP_RES; i++) {
    const px = i % MAP_RES;
    const py = Math.floor(i / MAP_RES);
    const ix = px / MAP_RES - 0.5;
    const iy = py / MAP_RES - 0.5;
    const d  = roundedRectSDF(ix, iy, DISTORT_W, DISTORT_H, DISTORT_R);
    const dp = smoothStep(SMOOTH_EDGE, 0, d - DIST_OFFSET);
    const s  = smoothStep(0, 1, dp);
    const dx = (ix * s + 0.5) * MAP_RES - px;
    const dy = (iy * s + 0.5) * MAP_RES - py;
    maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
    raw.push(dx, dy);
  }

  maxScale *= 0.5;

  let di = 0, ri = 0;
  for (let i = 0; i < MAP_RES * MAP_RES; i++) {
    data[di++] = (raw[ri++] / maxScale + 0.5) * 255;
    data[di++] = (raw[ri++] / maxScale + 0.5) * 255;
    data[di++] = 0;
    data[di++] = 255;
  }

  ctx.putImageData(new ImageData(data, MAP_RES, MAP_RES), 0, 0);
  return canvas.toDataURL();
}

// ── Public imperative API ─────────────────────────────────────────────────────

/**
 * Snap the SVG filter to `el`'s current viewport rect and enable
 * the liquid-glass backdropFilter on it.
 */
export function attachLiquidGlass(el: HTMLElement): void {
  if (!_filter || !_feImg || !_feDisp || !_mapURL) return;

  const r = el.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return;

  // Position the filter region over the element in viewport space
  _filter.setAttribute("x",      String(Math.floor(r.left)));
  _filter.setAttribute("y",      String(Math.floor(r.top)));
  _filter.setAttribute("width",  String(Math.ceil(r.width)));
  _filter.setAttribute("height", String(Math.ceil(r.height)));

  // Scale feImage to match
  _feImg.setAttribute("width",  String(Math.ceil(r.width)));
  _feImg.setAttribute("height", String(Math.ceil(r.height)));

  // Displacement strength proportional to the element's smaller dimension
  const scale = Math.max(14, Math.min(r.width, r.height) * 0.15);
  _feDisp.setAttribute("scale", String(scale));

  // Apply as backdropFilter (bends the page content behind the element)
  const f = `url(#${FILTER_ID}) blur(0.5px) contrast(1.18) brightness(1.06) saturate(1.18)`;
  el.style.setProperty("backdrop-filter", f);
  el.style.setProperty("-webkit-backdrop-filter", f);
}

/** Remove the liquid-glass backdropFilter from `el`. */
export function detachLiquidGlass(el: HTMLElement): void {
  el.style.removeProperty("backdrop-filter");
  el.style.removeProperty("-webkit-backdrop-filter");
}

// ── React component (renders the SVG + hidden canvas into the DOM) ────────────

export function LiquidGlassFilter() {
  const filterRef = useRef<SVGFilterElement>(null);
  const feImgRef  = useRef<SVGFEImageElement>(null);
  const feDispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (prefersReducedMotion()) return;

    _filter = filterRef.current;
    _feImg  = feImgRef.current;
    _feDisp = feDispRef.current;

    // Build the displacement map once and cache it
    if (!_mapURL) _mapURL = buildDisplacementMap();

    // Load the data URL into feImage (must use setAttributeNS for xlink:href)
    if (_feImg && _mapURL) {
      _feImg.setAttributeNS("http://www.w3.org/1999/xlink", "href", _mapURL);
    }

    return () => { _filter = _feImg = _feDisp = null; };
  }, []);

  return (
    <svg
      width="0" height="0"
      style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: -1 }}
      aria-hidden="true"
    >
      <defs>
        <filter
          ref={filterRef}
          id={FILTER_ID}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
          x="0" y="0" width="100" height="100"
        >
          <feImage
            ref={feImgRef}
            width="100" height="100"
            result={`${FILTER_ID}_map`}
          />
          <feDisplacementMap
            ref={feDispRef}
            in="SourceGraphic"
            in2={`${FILTER_ID}_map`}
            xChannelSelector="R"
            yChannelSelector="G"
            scale="0"
          />
        </filter>
      </defs>
    </svg>
  );
}
