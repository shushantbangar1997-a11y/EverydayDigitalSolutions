import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";

const isBuild = process.env.NODE_ENV === "production" || process.argv.includes("build");
const isReplit = process.env.REPL_ID !== undefined;

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;

const basePath = process.env.BASE_PATH ?? "/";

if (!isBuild && isReplit && !process.env.PORT) {
  throw new Error("PORT environment variable is required in Replit dev mode.");
}

const replitPlugins =
  !isBuild && isReplit
    ? await Promise.all([
        import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default()),
        import("@replit/vite-plugin-cartographer").then((m) =>
          m.cartographer({
            root: path.resolve(import.meta.dirname, ".."),
          }),
        ),
        import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
      ])
    : [];

// ─── Sitemap & Prerender Plugin ─────────────────────────────────────────────

const DOMAIN = "https://everydaydigitalsolutions.com";
const TODAY = new Date().toISOString().split("T")[0];

interface RouteEntry {
  /** URL path relative to root, e.g. "contact" or "work/quasar-salon" */
  urlPath: string;
  title: string;
  description: string;
  changefreq: string;
  priority: string;
}

/** All currently implemented routes (App.tsx) */
const CURRENT_ROUTES: RouteEntry[] = [
  {
    urlPath: "",
    title: "Everyday Digital Solutions — AI & Custom Software Studio · Mohali, India",
    description:
      "Senior-led custom software, AI voice agents, and automation systems for ambitious service businesses across Chandigarh, Mohali & Jalandhar. Shipped in 30 days.",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    urlPath: "contact",
    title: "Start a Project — Everyday Digital Solutions",
    description:
      "Tell us what you're building. We'll scope it on a 15-minute call and send a clear, fixed proposal. Custom apps, AI voice agents, and automation — based in Mohali & Jalandhar.",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    urlPath: "work/quasar-salon",
    title: "Quasar Salon — Mobile App Case Study — Everyday Digital Solutions",
    description:
      "How EDS built Tricity's first celebrity-grade salon booking app in 30 days. 60% of bookings went digital in month one. 40% drop in no-shows.",
    changefreq: "monthly",
    priority: "0.7",
  },
];

function buildSitemapXml(routes: RouteEntry[]): string {
  const entries = routes
    .map(
      (r) => `  <url>
    <loc>${DOMAIN}/${r.urlPath}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join("\n\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${entries}

</urlset>
`;
}

function patchRouteHtml(html: string, route: RouteEntry): string {
  const canonical = route.urlPath ? `${DOMAIN}/${route.urlPath}` : `${DOMAIN}/`;
  // Escape special chars for use in replacement string
  const safeTitle = route.title.replace(/&/g, "&amp;");
  const safeDesc = route.description.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${safeDesc}"`
    )
    .replace("</head>", `  <link rel="canonical" href="${canonical}" />\n  </head>`);
}

function edsSeoPlugin(): Plugin {
  const publicDir = path.resolve(import.meta.dirname, "public");
  const outDir = path.resolve(import.meta.dirname, "dist/public");

  return {
    name: "eds-seo",

    // Regenerate sitemap.xml in public/ before the build copies it to dist/
    buildStart() {
      if (!isBuild) return;
      const sitemapPath = path.resolve(publicDir, "sitemap.xml");
      writeFileSync(sitemapPath, buildSitemapXml(CURRENT_ROUTES), "utf-8");
      console.log(`[eds-seo] sitemap.xml generated (${CURRENT_ROUTES.length} URLs)`);
    },

    // After bundle is written, create prerendered HTML per route
    closeBundle() {
      if (!isBuild) return;
      const indexPath = path.resolve(outDir, "index.html");
      if (!existsSync(indexPath)) {
        console.warn("[eds-seo] index.html not found — skipping prerender");
        return;
      }
      const template = readFileSync(indexPath, "utf-8");

      for (const route of CURRENT_ROUTES) {
        const html = patchRouteHtml(template, route);

        if (route.urlPath) {
          // Sub-route: create <outDir>/<urlPath>/index.html
          const routeDir = path.resolve(outDir, route.urlPath);
          mkdirSync(routeDir, { recursive: true });
          writeFileSync(path.resolve(routeDir, "index.html"), html, "utf-8");
        } else {
          // Homepage: overwrite dist/public/index.html with patched version
          writeFileSync(indexPath, html, "utf-8");
        }
        console.log(`[eds-seo] prerendered → /${route.urlPath || ""}`);
      }
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss(), edsSeoPlugin(), ...replitPlugins],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
