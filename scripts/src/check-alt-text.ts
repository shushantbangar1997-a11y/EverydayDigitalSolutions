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

function lineNumberAt(content: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < content.length; i++) {
    if (content[i] === "\n") line++;
  }
  return line;
}

const files = walk(SRC_DIR);

const violations: { file: string; line: number; snippet: string }[] = [];

// Match a full <img ...> or <OptimizedImage ...> tag, including multi-line
// attribute lists. The `[\s\S]*?` (non-greedy any-char including newlines)
// captures everything up to the closing `>` (or `/>`). We then check the
// captured attrs for an `alt=...` attribute.
const IMG_TAG_RE = /<(img|OptimizedImage)\b([\s\S]*?)\/?>/g;
const HAS_ALT_RE = /(?<![A-Za-z0-9_])alt\s*=\s*("[^"]*"|'[^']*'|\{[^}]*\})/;

function stripComments(src: string): string {
  // Replace block comments with same-length whitespace (preserves line numbers).
  // Catches /* ... */ JSDoc and {/* ... */} JSX comments alike.
  let out = src.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, " "),
  );
  // Strip // line comments (best-effort; we don't try to track string state,
  // but TSX rarely contains `//` inside JSX attributes).
  out = out.replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (_m, p) => p);
  return out;
}

for (const file of files) {
  const raw = readFileSync(file, "utf-8");
  const content = stripComments(raw);
  let m: RegExpExecArray | null;
  IMG_TAG_RE.lastIndex = 0;
  while ((m = IMG_TAG_RE.exec(content)) !== null) {
    const attrs = m[2] ?? "";
    if (!HAS_ALT_RE.test(attrs)) {
      const line = lineNumberAt(content, m.index);
      const snippet = m[0].replace(/\s+/g, " ").trim().slice(0, 200);
      violations.push({
        file: relative(SRC_DIR, file),
        line,
        snippet,
      });
    }
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
