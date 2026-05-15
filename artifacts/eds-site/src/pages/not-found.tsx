import { Link } from "wouter";
import { Compass } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const POPULAR_LINKS: { href: string; label: string }[] = [
  { href: "/services/mobile-app-development", label: "Mobile App Development" },
  { href: "/services/ai-voice-agents", label: "AI Voice Agents" },
  { href: "/services/automation-systems", label: "Automation Systems" },
  { href: "/tools/app-cost-calculator", label: "App Cost Calculator" },
  { href: "/tools/ai-voice-agent-roi-calculator", label: "Voice Agent ROI Calculator" },
  { href: "/resources/app-cost-guide-2026", label: "2026 App Cost Guide" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Get in touch" },
];

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page not found"
        description="The page you were looking for doesn't exist. Here are some useful places to go on Everyday Digital Solutions."
        noindex
      />
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-background">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
            <Compass className="w-7 h-7 text-primary" />
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            404 · Page not found
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-4">
            That page <em className="italic text-primary">moved</em> — or never existed.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            Either we&apos;ve changed the URL or the link that brought you here is
            out of date. Here are a few places that probably do exist:
          </p>

          <ul className="grid sm:grid-cols-2 gap-2 mb-10 text-left">
            {POPULAR_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 text-sm text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="inline-flex items-center btn-glass-primary rounded-full font-medium px-6 py-2 text-sm"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
