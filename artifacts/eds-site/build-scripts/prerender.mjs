/**
 * Post-build prerender script.
 *
 * Run after:
 *   1. vite build            → dist/public/ (client bundle + static assets)
 *   2. vite build --ssr      → dist/ssr/entry-server.js (SSR bundle)
 *
 * For each configured route this script:
 *   - Calls render(url) from the SSR bundle to get the full React HTML tree
 *   - Injects it into dist/public/index.html's <div id="root">
 *   - Patches <title>, <meta name="description">, and <link rel="canonical">
 *   - Writes the result to dist/public/<route>/index.html
 *
 * Google (and other crawlers) then receive complete HTML instead of an empty
 * app shell, which is the SEO goal of this step.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist/public");
const ssrDir = resolve(__dirname, "../dist/ssr");
const DOMAIN = "https://everydaydigitalsolutions.com";

const ROUTES = [
  {
    urlPath: "",
    url: "/",
    title: "Everyday Digital Solutions — AI & Custom Software Studio · Mohali, India",
    description:
      "Senior-led custom software, AI voice agents, and automation systems for ambitious service businesses across Chandigarh, Mohali & Jalandhar. Shipped in 30 days.",
  },
  {
    urlPath: "contact",
    url: "/contact",
    title: "Start a Project — Everyday Digital Solutions",
    description:
      "Tell us what you're building. We'll scope it on a 15-minute call and send a clear, fixed proposal. Custom apps, AI voice agents, and automation — Mohali & Jalandhar.",
  },
  {
    urlPath: "work/quasar-salon",
    url: "/work/quasar-salon",
    title: "Quasar Salon — Mobile App Case Study — Everyday Digital Solutions",
    description:
      "How EDS built Tricity's first celebrity-grade salon booking app in 30 days. 60% of bookings went digital in month one. 40% drop in no-shows.",
  },
];

function patchHead(html, route) {
  const canonical = route.urlPath ? `${DOMAIN}/${route.urlPath}` : `${DOMAIN}/`;
  const safeTitle = route.title.replace(/&/g, "&amp;");
  const safeDesc = route.description.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${safeDesc}"`)
    .replace("</head>", `  <link rel="canonical" href="${canonical}" />\n  </head>`);
}

const ssrEntry = pathToFileURL(resolve(ssrDir, "entry-server.js")).href;
const { render } = await import(ssrEntry);

const template = readFileSync(resolve(distDir, "index.html"), "utf-8");

for (const route of ROUTES) {
  let appHtml;
  try {
    appHtml = render(route.url);
  } catch (err) {
    console.error(`[prerender] Error rendering ${route.url}:`, err.message);
    process.exit(1);
  }

  const html = patchHead(template, route).replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

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
