/**
 * Static check that every `tracker.recordEvent("name", ...)` site in the
 * eds-site source uses a name from a known whitelist. Catches typos that
 * would silently fragment analytics queries.
 *
 * Run via `pnpm --filter @workspace/scripts run check-analytics` (wired into
 * the eds-site build script).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_SRC = path.resolve(__dirname, "..", "..", "artifacts", "eds-site", "src");

// Whitelist — keep in sync with admin dashboard categories.
const ALLOWED_EVENTS = new Set<string>([
  // Form lifecycle (contact + quote)
  "form_view",
  "form_step_complete",
  "form_step_error",
  "form_abandon",
  "form_submit",
  "form_submit_error",

  // Tool engagement
  "tool_email_capture",

  // Lead magnet
  "lead_magnet_download",

  // Admin actions
  "request_review_sent",

  // Auto-tracked types (emitted by tracker.ts itself)
  "click",
  "scroll",
]);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const RECORD_EVENT_RE = /tracker\.recordEvent\(\s*['"`]([^'"`]+)['"`]/g;

let bad = 0;
for (const file of walk(SITE_SRC)) {
  const source = fs.readFileSync(file, "utf8");
  let match: RegExpExecArray | null;
  while ((match = RECORD_EVENT_RE.exec(source))) {
    const name = match[1];
    if (!ALLOWED_EVENTS.has(name)) {
      const lineNo = source.slice(0, match.index).split("\n").length;
      const rel = path.relative(process.cwd(), file);
      console.error(`✗ ${rel}:${lineNo} — unknown analytics event name: "${name}"`);
      bad++;
    }
  }
}

if (bad > 0) {
  console.error(`\n${bad} unknown analytics event name(s). Either fix the typo or add to ALLOWED_EVENTS in scripts/src/check-analytics.ts.`);
  process.exit(1);
}

console.log(`✓ All tracker.recordEvent() names are in the whitelist.`);
