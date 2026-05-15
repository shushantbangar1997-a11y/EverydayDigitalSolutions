import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const LAST_UPDATED = "May 14, 2026";

interface CookieRow {
  name: string;
  kind: "Cookie" | "localStorage";
  purpose: string;
  expires: string;
  required: boolean;
}

const COOKIES: CookieRow[] = [
  {
    name: "eds_cid",
    kind: "Cookie",
    purpose:
      "Anonymous visitor ID. Lets us recognise returning visitors without identifying you. Only set after you accept the consent banner.",
    expires: "2 years",
    required: false,
  },
  {
    name: "eds_consent",
    kind: "localStorage",
    purpose:
      "Stores your consent decision (granted / denied) so we do not show the banner on every page.",
    expires: "Persistent (until you clear browser storage)",
    required: true,
  },
  {
    name: "eds_admin",
    kind: "Cookie",
    purpose:
      "Admin session token. Set only after the founder signs in to the admin dashboard. HTTP-only, encrypted.",
    expires: "7 days",
    required: true,
  },
  {
    name: "eds-theme",
    kind: "localStorage",
    purpose:
      "Stores your dark / light theme preference so the site renders without a flash on subsequent visits.",
    expires: "Persistent",
    required: false,
  },
];

export default function Cookies() {
  return (
    <>
      <SEO
        title="Cookies"
        description="Every cookie and localStorage entry this website uses, what it does, and how long it lasts."
        canonical="/cookies"
      />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <article className="max-w-3xl mx-auto px-6 py-10 lg:py-16 prose prose-neutral dark:prose-invert prose-headings:font-serif">
          <Link
            href="/"
            className="not-prose inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>

          <header className="not-prose mb-10 pb-6 border-b border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Legal · Last updated {LAST_UPDATED}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-3">
              Cookies <em className="italic text-primary">we set</em>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              We do not use any third-party advertising cookies. Below is the
              complete list of cookies and browser-storage entries that
              everydaydigitalsolutions.com uses.
            </p>
          </header>

          <h2>What sets each cookie</h2>
          <div className="not-prose my-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 font-medium text-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-foreground">
                    Purpose
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-foreground">
                    Expires
                  </th>
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((c) => (
                  <tr key={c.name} className="border-b border-border/40 align-top">
                    <td className="py-3 pr-4 font-mono text-xs text-primary">
                      {c.name}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {c.kind}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {c.purpose}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                      {c.expires}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>How to opt out</h2>
          <p>If you do not want us to set the analytics cookie:</p>
          <ol>
            <li>
              Click <strong>Decline</strong> on the consent banner that
              appears on your first visit. (If you have already accepted,
              clear <code>eds_consent</code> from your browser&apos;s
              localStorage and reload — the banner will reappear.)
            </li>
            <li>
              You can also send a Do-Not-Track signal via your browser
              settings; we respect it and skip all analytics if it is set.
            </li>
          </ol>

          <h2>How to delete cookies we have already set</h2>
          <p>
            In your browser&apos;s settings, find the section for cookies
            and site data, search for{" "}
            <code>everydaydigitalsolutions.com</code>, and click delete.
            Doing so removes all four entries above.
          </p>

          <p className="not-prose mt-12 pt-6 border-t border-border text-sm text-muted-foreground">
            See also:{" "}
            <Link className="text-primary hover:underline" href="/privacy">
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link className="text-primary hover:underline" href="/terms">
              Terms of Service
            </Link>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
