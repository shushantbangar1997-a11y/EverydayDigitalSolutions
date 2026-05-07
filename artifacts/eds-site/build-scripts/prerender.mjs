/**
 * Post-build prerender script.
 *
 * Run after:
 *   1. vite build                          → dist/public/ (client bundle + static assets)
 *   2. vite build --config vite.ssr.config.ts → dist/ssr/entry-server.js (SSR bundle)
 *
 * For each route this script:
 *   - Calls render(url) to obtain:
 *       appHtml  — full React HTML tree (goes into <div id="root">)
 *       helmet   — HelmetServerState with .toString() for each tag group
 *   - Strips the fallback <title> and <meta name="description"> from the template
 *   - Injects Helmet-generated head tags: <title>, all <meta> (description, OG,
 *     Twitter), <link> (canonical), and <script type="application/ld+json"> (JSON-LD)
 *   - Injects rendered React HTML into <div id="root">
 *   - Writes the result to dist/public/<route>/index.html
 *
 * Google and other crawlers receive complete, route-specific HTML without JS.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist/public");
const ssrDir = resolve(__dirname, "../dist/ssr");

const ROUTES = [
  { urlPath: "",                 url: "/" },
  { urlPath: "contact",         url: "/contact" },
  { urlPath: "work/quasar-salon", url: "/work/quasar-salon" },
];

/** Safely call .toString() on a Helmet tag group, returning "" on failure. */
function helmetStr(tagGroup) {
  try {
    if (!tagGroup) return "";
    const s = tagGroup.toString();
    return s === "undefined" ? "" : s;
  } catch {
    return "";
  }
}

const ssrEntry = pathToFileURL(resolve(ssrDir, "entry-server.js")).href;
const { render } = await import(ssrEntry);

const rawTemplate = readFileSync(resolve(distDir, "index.html"), "utf-8");

// Strip the fallback title and meta description from the template.
// Helmet's per-route equivalents (plus OG, Twitter, canonical, JSON-LD) are
// injected below, so we must remove the fallbacks to avoid duplication.
const baseTemplate = rawTemplate
  .replace(/<title>[^<]*<\/title>\n?/, "")
  .replace(/[ \t]*<meta name="description"[^>]*\/?>\n?/, "");

for (const route of ROUTES) {
  let renderResult;
  try {
    renderResult = render(route.url);
  } catch (err) {
    console.error(`[prerender] Error rendering ${route.url}:`, err.message);
    process.exit(1);
  }

  const { appHtml, helmet } = renderResult;

  // Build the injected head block from Helmet-captured tags.
  // Order: title → meta (description + OG + Twitter) → link (canonical) → script (JSON-LD)
  const headBlock = [
    helmetStr(helmet.title),
    helmetStr(helmet.meta),
    helmetStr(helmet.link),
    helmetStr(helmet.script),
  ]
    .filter(Boolean)
    .join("\n  ");

  const html = baseTemplate
    .replace("</head>", `  ${headBlock}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  if (route.urlPath) {
    const dir = resolve(distDir, route.urlPath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "index.html"), html, "utf-8");
  } else {
    writeFileSync(resolve(distDir, "index.html"), html, "utf-8");
  }

  console.log(`[prerender] ✓ /${route.urlPath || ""}`);
}

console.log(`[prerender] Done — ${ROUTES.length} routes prerendered.`);
