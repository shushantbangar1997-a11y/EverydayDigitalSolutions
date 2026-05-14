import { useState } from "react";
import { useCreateSubscriber } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, CheckCircle2 } from "lucide-react";

const GUIDE_PATH = "/resources/app-cost-guide-2026";

export function LeadMagnet({
  source = "homepage",
  variant = "banner",
}: {
  source?: string;
  variant?: "banner" | "compact";
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mutation = useCreateSubscriber();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    mutation.mutate(
      { data: { email: trimmed, source } },
      {
        onSuccess: () => {
          setSubmitted(true);
          if (typeof window !== "undefined" && typeof (window as { plausible?: (e: string, o?: unknown) => void }).plausible === "function") {
            (window as unknown as { plausible: (e: string, o?: unknown) => void }).plausible("AppCostGuideDownload", {
              props: { source },
            });
          }
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.open(GUIDE_PATH, "_blank", "noopener,noreferrer");
            }
          }, 400);
        },
        onError: () => {
          setError("Could not save your email. Please try again or use WhatsApp.");
        },
      },
    );
  }

  if (variant === "compact") {
    return (
      <div className="space-y-3">
        {submitted ? (
          <div className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Guide on its way.</p>
              <p className="text-muted-foreground mt-1">
                If a new tab didn't open,{" "}
                <a href={GUIDE_PATH} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  click here to read it
                </a>
                .
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type="email"
              required
              placeholder="you@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-border rounded-sm"
            />
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-primary text-black hover:bg-primary/90 rounded-sm font-medium"
            >
              {mutation.isPending ? "Sending..." : "Send me the guide"}
            </Button>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <p className="text-[11px] text-muted-foreground">No spam. We send the guide once and that's it.</p>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className="border-y border-border/50" style={{ background: "var(--glass-fill)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-border px-3 py-1 rounded-full text-xs font-medium tracking-wide text-muted-foreground mb-5">
              <FileDown className="w-3.5 h-3.5" />
              Free guide · 18 pages
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.1] mb-5">
              The <em className="italic text-primary">App Cost Guide</em> for Indian businesses, 2026.
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-6">
              Built from 7 years of building digital systems for service businesses, plus our 2026 flagship build for Quasar Salon. What a custom app actually costs in 2026 — and what makes the bill move up or down.
            </p>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span><span>Honest price ranges by app type (booking, CRM, marketplace, internal tools)</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span><span>Hidden costs most agencies don't mention upfront</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span><span>How to cut 30–50% by sequencing features correctly</span></li>
            </ul>
          </div>
          <div className="glass-elevated rounded-md p-6 sm:p-8">
            <h3 className="font-serif text-xl text-foreground mb-1">Get the guide</h3>
            <p className="text-sm text-muted-foreground mb-5">Enter your email — opens immediately in a new tab.</p>
            {submitted ? (
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Guide opening in a new tab.</p>
                  <p className="text-muted-foreground mt-1">
                    Or{" "}
                    <a href={GUIDE_PATH} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      click here to read it
                    </a>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="email"
                  required
                  placeholder="you@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border rounded-sm py-6"
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-primary text-black hover:bg-primary/90 rounded-sm font-medium py-6 text-base"
                >
                  {mutation.isPending ? "Sending..." : "Send me the guide"}
                </Button>
                {error && <p className="text-xs text-destructive">{error}</p>}
                <p className="text-[11px] text-muted-foreground">No spam. We send the guide once and that's it.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
