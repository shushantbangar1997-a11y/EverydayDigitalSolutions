import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist/public");
const ssrDir = resolve(__dirname, "../dist/ssr");

const ROUTES = [
  { urlPath: "",                  url: "/" },
  { urlPath: "contact",           url: "/contact" },
  { urlPath: "work/quasar-salon", url: "/work/quasar-salon" },
];

/**
 * React 19 renderToString hoists <title>, <meta>, <link>, and
 * <script type="application/ld+json"> inline into the component output.
 * This function extracts those tags from appHtml and returns them separately
 * so they can be injected into the document <head> where crawlers expect them.
 */
function extractHeadTags(appHtml) {
  const patterns = [
    /<title>[\s\S]*?<\/title>/g,
    /<meta\b[^>]*\/?>/g,
    /<link\b[^>]*rel="canonical"[^>]*\/?>/g,
    /<link\b[^>]*rel="preload"[^>]*\/?>/g,
    /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g,
  ];

  const extracted = [];
  let bodyHtml = appHtml;

  for (const re of patterns) {
    bodyHtml = bodyHtml.replace(re, (match) => {
      extracted.push(match);
      return "";
    });
  }

  return { headHtml: extracted.join("\n  "), bodyHtml };
}

const { render } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);

// Strip fallback <title> and <meta name="description"> from the template;
// per-route equivalents are extracted from renderToString output below.
const baseTemplate = readFileSync(resolve(distDir, "index.html"), "utf-8")
  .replace(/<title>[^<]*<\/title>\n?/, "")
  .replace(/[ \t]*<meta name="description"[^>]*\/?>\n?/, "");

for (const route of ROUTES) {
  let appHtml;
  try {
    appHtml = render(route.url);
  } catch (err) {
    console.error(`[prerender] Error rendering ${route.url}:`, err.message);
    process.exit(1);
  }

  const { headHtml, bodyHtml } = extractHeadTags(appHtml);

  const html = baseTemplate
    .replace("</head>", `  ${headHtml}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

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
