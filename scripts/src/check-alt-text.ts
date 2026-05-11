import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, relative, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(__dirname, "../../artifacts/eds-site/src");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (s.isFile() && p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

const files = walk(SRC_DIR);

const violations: { file: string; line: number; snippet: string }[] = [];

const IMG_OPEN_RE = /<img\b([^>]*)>/g;
const HAS_ALT_RE = /\balt\s*=\s*("[^"]*"|'[^']*'|\{[^}]*\})/;

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");
  let cumulative = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let m: RegExpExecArray | null;
    IMG_OPEN_RE.lastIndex = 0;
    while ((m = IMG_OPEN_RE.exec(line)) !== null) {
      const attrs = m[1] ?? "";
      if (!HAS_ALT_RE.test(attrs)) {
        violations.push({
          file: relative(SRC_DIR, file),
          line: i + 1,
          snippet: line.trim(),
        });
      }
    }
    cumulative += line.length + 1;
  }
}

if (violations.length > 0) {
  console.error(`\n[check-alt-text] FAIL — ${violations.length} <img> tag(s) missing alt attribute:\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}`);
    console.error(`    ${v.snippet}\n`);
  }
  console.error(`Every <img> must have an alt attribute. Use alt="" only for purely decorative images.\n`);
  process.exit(1);
}

console.log(`[check-alt-text] OK — scanned ${files.length} .tsx file(s); no <img> missing alt.`);
