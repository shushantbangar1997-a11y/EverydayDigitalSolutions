import { useMemo, useState } from "react";
import {
  useGetAdminSession,
  useListLeads,
} from "@workspace/api-client-react";
import { tracker } from "@/lib/tracker";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lock, ExternalLink, Copy, Check } from "lucide-react";

const DEFAULT_GBP_REVIEW_URL = "https://g.page/r/YOUR_PLACE_ID/review";
const DEFAULT_TEMPLATE = (name: string, project: string, url: string) =>
  `Hi ${name}, hope the ${project} is serving you well — would mean a lot if you could share a quick Google review here: ${url}\n\nThanks!\n— Shushant, Everyday Digital Solutions`;

function LockGate() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 space-y-4 text-center">
        <Lock className="w-6 h-6 text-primary mx-auto" />
        <h1 className="font-serif text-2xl text-foreground">Admin only</h1>
        <p className="text-sm text-muted-foreground">
          Sign in at <a href="/admin" className="text-primary underline">/admin</a> first, then come back to this page.
        </p>
      </div>
    </main>
  );
}

export default function RequestReview() {
  const session = useGetAdminSession();
  const isAuthed = session.data?.authenticated === true;

  return (
    <>
      <SEO title="Request a Review" canonical="/admin/request-review" noindex />
      <Navbar />
      {session.isLoading ? (
        <main className="min-h-[100dvh] flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Checking session…</p>
        </main>
      ) : !isAuthed ? (
        <LockGate />
      ) : (
        <RequestReviewDashboard />
      )}
      <Footer />
    </>
  );
}

function RequestReviewDashboard() {
  const leads = useListLeads();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [project, setProject] = useState("custom mobile app");
  const [reviewUrl, setReviewUrl] = useState(DEFAULT_GBP_REVIEW_URL);
  const [overrideMessage, setOverrideMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reviews are best asked of past customers — show only "closed_won" or "qualified" leads, plus all if list small.
  const candidates = useMemo(() => {
    const all = leads.data ?? [];
    const past = all.filter((l) => l.status === "closed_won" || l.status === "qualified");
    return past.length > 0 ? past : all;
  }, [leads.data]);

  const selected = candidates.find((c) => c.id === selectedId) ?? null;

  const message = useMemo(() => {
    if (!selected) return "";
    const baseName = selected.name?.split(" ")[0] || selected.name || "there";
    return overrideMessage ?? DEFAULT_TEMPLATE(baseName, project, reviewUrl);
  }, [selected, project, reviewUrl, overrideMessage]);

  const waLink = useMemo(() => {
    if (!selected) return null;
    const raw = (selected.whatsappNumber ?? "").trim();
    if (!raw) return null;
    const phone = raw.replace(/\D/g, "");
    // wa.me requires an international number, no leading zeros, ≥ 8 digits.
    if (phone.length < 8) return null;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [selected, message]);

  function copy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-[100dvh] bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <h1 className="font-serif text-xl text-foreground">Request a Google review</h1>
          <a href="/admin" className="text-xs text-muted-foreground hover:text-primary">← Back to admin</a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
        {/* Left: pick a client */}
        <div>
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Pick a client</Label>
          {leads.isLoading && <p className="text-sm text-muted-foreground">Loading leads…</p>}
          {!leads.isLoading && candidates.length === 0 && (
            <p className="text-sm text-muted-foreground">No leads in the system yet.</p>
          )}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {candidates.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => { setSelectedId(l.id); setOverrideMessage(null); }}
                className={`w-full text-left p-3 border rounded-xl transition-colors ${
                  selectedId === l.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="text-sm font-medium text-foreground">
                  {l.name}
                  {l.businessName && <span className="text-muted-foreground font-normal"> · {l.businessName}</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {l.industry} · {l.city} · status: {l.status}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: compose */}
        <div className="space-y-5">
          <div>
            <Label htmlFor="project" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Project name (used in message)</Label>
            <Input
              id="project"
              value={project}
              onChange={(e) => { setProject(e.target.value); setOverrideMessage(null); }}
              placeholder="e.g. Quasar Salon app"
              className="bg-[var(--glass-fill)] border-[var(--glass-stroke)] rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="url" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Google review link</Label>
            <Input
              id="url"
              value={reviewUrl}
              onChange={(e) => { setReviewUrl(e.target.value); setOverrideMessage(null); }}
              className="bg-[var(--glass-fill)] border-[var(--glass-stroke)] rounded-xl font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Default placeholder. Replace with your real review link from Google Business Profile → Get more reviews → Share review form.
            </p>
          </div>

          <div>
            <Label htmlFor="msg" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Message</Label>
            <Textarea
              id="msg"
              value={message}
              onChange={(e) => setOverrideMessage(e.target.value)}
              disabled={!selected}
              className="bg-[var(--glass-fill)] border-[var(--glass-stroke)] rounded-xl min-h-[140px]"
              placeholder={!selected ? "Pick a client on the left first." : ""}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={copy}
              disabled={!selected}
              variant="outline"
              className="rounded-full"
            >
              {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? "Copied" : "Copy text"}
            </Button>
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  tracker.recordEvent("request_review_sent", {
                    element: "admin.request_review.whatsapp",
                  });
                }}
                className="inline-flex items-center btn-glass-primary rounded-full font-medium px-4 py-2 text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Open in WhatsApp
              </a>
            ) : (
              <Button disabled className="rounded-full" title={selected ? "This lead has no valid WhatsApp number on file." : undefined}>Open in WhatsApp</Button>
            )}
          </div>

          {selected && waLink && (
            <p className="text-[11px] text-muted-foreground border-t border-border pt-4">
              Sending to <span className="text-foreground font-medium">{selected.name}</span> at {selected.whatsappNumber}.
              The link opens WhatsApp with the message prefilled — review it, then hit send.
            </p>
          )}
          {selected && !waLink && (
            <p className="text-[11px] text-destructive border-t border-border pt-4">
              {selected.name} has no valid WhatsApp number on file. Update the lead in /admin first.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
