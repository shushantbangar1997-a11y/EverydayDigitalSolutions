import { readdirSync, statSync, existsSync } from "fs";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

const SOURCE_EXTS = new Set([".png", ".jpg", ".jpeg"]);
// Skip OS/icon files we don't want to convert.
const SKIP_FILES = new Set(["favicon.svg", "robots.txt", "sitemap.xml"]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_FILES.has(entry)) continue;
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (s.isFile() && SOURCE_EXTS.has(extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

const sources = existsSync(PUBLIC_DIR) ? walk(PUBLIC_DIR) : [];
let created = 0;
let skipped = 0;

for (const src of sources) {
  const ext = extname(src);
  const webp = src.slice(0, -ext.length) + ".webp";
  if (existsSync(webp)) {
    const srcStat = statSync(src);
    const webpStat = statSync(webp);
    if (webpStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++;
      continue;
    }
  }
  await sharp(src).webp({ quality: 82, effort: 5 }).toFile(webp);
  created++;
  console.log(`[optimize-images] ${basename(src)} → ${basename(webp)}`);
}

console.log(`[optimize-images] OK — ${created} created, ${skipped} up-to-date.`);
