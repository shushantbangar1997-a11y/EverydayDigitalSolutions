import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://everydaydigitalsolutions.com";
const TODAY = new Date().toISOString().split("T")[0];

interface SitemapEntry {
  path: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

const routes: SitemapEntry[] = [
  { path: "/",                                             changefreq: "weekly",  priority: "1.0" },
  { path: "/contact",                                      changefreq: "monthly", priority: "0.9" },
  { path: "/work/quasar-salon",                            changefreq: "monthly", priority: "0.7" },

  { path: "/services/mobile-app-development",              changefreq: "monthly", priority: "0.9" },
  { path: "/services/ai-voice-agents",                     changefreq: "monthly", priority: "0.9" },
  { path: "/services/automation-systems",                  changefreq: "monthly", priority: "0.9" },

  { path: "/chandigarh",                                   changefreq: "monthly", priority: "0.85" },
  { path: "/mohali",                                       changefreq: "monthly", priority: "0.85" },
  { path: "/panchkula",                                    changefreq: "monthly", priority: "0.85" },
  { path: "/jalandhar",                                    changefreq: "monthly", priority: "0.85" },
  { path: "/punjab",                                       changefreq: "monthly", priority: "0.85" },

  // Locality pages
  { path: "/chandigarh/sector-17",                         changefreq: "monthly", priority: "0.8" },
  { path: "/chandigarh/sector-22",                         changefreq: "monthly", priority: "0.8" },
  { path: "/chandigarh/industrial-area-phase-1",           changefreq: "monthly", priority: "0.8" },
  { path: "/mohali/phase-7",                               changefreq: "monthly", priority: "0.8" },
  { path: "/mohali/phase-8b-it-park",                      changefreq: "monthly", priority: "0.8" },
  { path: "/mohali/sector-82-aerocity",                    changefreq: "monthly", priority: "0.8" },
  { path: "/jalandhar/model-town",                         changefreq: "monthly", priority: "0.8" },
  { path: "/jalandhar/civil-lines",                        changefreq: "monthly", priority: "0.8" },

  // Free interactive tools
  { path: "/tools/app-cost-calculator",                    changefreq: "monthly", priority: "0.85" },
  { path: "/tools/ai-voice-agent-roi-calculator",          changefreq: "monthly", priority: "0.85" },

  { path: "/solutions/salons-and-spas",                    changefreq: "monthly", priority: "0.85" },
  { path: "/solutions/real-estate",                        changefreq: "monthly", priority: "0.85" },
  { path: "/solutions/clinics-and-healthcare",             changefreq: "monthly", priority: "0.85" },
  { path: "/solutions/restaurants-and-cafes",              changefreq: "monthly", priority: "0.85" },

  { path: "/blog",                                         changefreq: "weekly",  priority: "0.8" },
  { path: "/blog/ai-voice-agents-real-estate-india",       changefreq: "monthly", priority: "0.7" },
  { path: "/blog/custom-app-vs-off-the-shelf-chandigarh",  changefreq: "monthly", priority: "0.7" },
  { path: "/blog/app-development-cost-india-2025",         changefreq: "monthly", priority: "0.7" },
  { path: "/blog/salon-booking-automation-case-study",     changefreq: "monthly", priority: "0.7" },
  { path: "/blog/business-automation-service-businesses-punjab", changefreq: "monthly", priority: "0.7" },
];

function buildSitemap(entries: SitemapEntry[]): string {
  const urlNodes = entries
    .map(
      (e) => `  <url>
    <loc>${BASE_URL}${e.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join("\n\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urlNodes}

</urlset>
`;
}

const outPath = resolve(__dirname, "../../artifacts/eds-site/public/sitemap.xml");
writeFileSync(outPath, buildSitemap(routes), "utf-8");
console.log(`Sitemap written → ${outPath} (${routes.length} URLs)`);
