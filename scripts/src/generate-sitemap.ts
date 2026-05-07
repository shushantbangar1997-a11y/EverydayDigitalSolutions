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
  { path: "/",                   changefreq: "weekly",  priority: "1.0" },
  { path: "/contact",            changefreq: "monthly", priority: "0.9" },
  { path: "/work/quasar-salon",  changefreq: "monthly", priority: "0.7" },
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
