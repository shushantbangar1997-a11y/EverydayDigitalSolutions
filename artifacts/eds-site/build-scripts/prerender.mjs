import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist/public");
const ssrDir = resolve(__dirname, "../dist/ssr");

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

const { render, blogPosts, localityPagesList } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);

// Derive blog post routes dynamically from the exported blogPosts array.
const blogRoutes = blogPosts.map((post) => ({
  urlPath: `blog/${post.slug}`,
  url: `/blog/${post.slug}`,
}));

// Derive locality routes dynamically from the exported localityPagesList array.
const localityRoutes = localityPagesList.map((p) => ({
  urlPath: p.slug,
  url: `/${p.slug}`,
}));

const ROUTES = [
  // Core pages
  { urlPath: "",                                    url: "/" },
  { urlPath: "contact",                             url: "/contact" },
  { urlPath: "work/quasar-salon",                   url: "/work/quasar-salon" },
  { urlPath: "work/open-humana",                    url: "/work/open-humana" },

  // Service pages
  { urlPath: "services/mobile-app-development",     url: "/services/mobile-app-development" },
  { urlPath: "services/ai-voice-agents",             url: "/services/ai-voice-agents" },
  { urlPath: "services/automation-systems",          url: "/services/automation-systems" },

  // Location pages
  { urlPath: "chandigarh",                          url: "/chandigarh" },
  { urlPath: "mohali",                              url: "/mohali" },
  { urlPath: "panchkula",                           url: "/panchkula" },
  { urlPath: "jalandhar",                           url: "/jalandhar" },
  { urlPath: "punjab",                              url: "/punjab" },

  // Solution pages
  { urlPath: "solutions/salons-and-spas",           url: "/solutions/salons-and-spas" },
  { urlPath: "solutions/real-estate",               url: "/solutions/real-estate" },
  { urlPath: "solutions/clinics-and-healthcare",    url: "/solutions/clinics-and-healthcare" },
  { urlPath: "solutions/restaurants-and-cafes",     url: "/solutions/restaurants-and-cafes" },

  // Locality pages (3 Chandigarh sectors, 3 Mohali phases, 2 Jalandhar localities)
  ...localityRoutes,

  // Quote engine
  { urlPath: "get-a-quote",                         url: "/get-a-quote" },

  // Free interactive tools
  { urlPath: "tools/app-cost-calculator",           url: "/tools/app-cost-calculator" },
  { urlPath: "tools/ai-voice-agent-roi-calculator", url: "/tools/ai-voice-agent-roi-calculator" },

  // Blog index
  { urlPath: "blog",                                url: "/blog" },

  // Blog posts — derived dynamically from blogPosts exported by entry-server
  ...blogRoutes,

  // Legal — prerendered so crawlers and slow connections get content immediately
  { urlPath: "privacy",                             url: "/privacy" },
  { urlPath: "terms",                               url: "/terms" },
  { urlPath: "cookies",                             url: "/cookies" },
];

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
