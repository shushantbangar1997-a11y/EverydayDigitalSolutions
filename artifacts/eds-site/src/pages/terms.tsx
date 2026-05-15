import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/constants";

const LAST_UPDATED = "May 14, 2026";

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="The terms under which you may use everydaydigitalsolutions.com and engage Everyday Digital Solutions for work."
        canonical="/terms"
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
              Terms of <em className="italic text-primary">Service</em>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              The rules of the road. Plain English where possible; the
              full contract for a specific project is a separate signed
              document.
            </p>
          </header>

          <h2>1. Who you are agreeing with</h2>
          <p>
            <strong>Everyday Digital Solutions</strong> (referred to as
            &ldquo;EDS&rdquo;, &ldquo;we&rdquo;, or &ldquo;us&rdquo;) is a
            software studio based in Mohali, Punjab, India.
            By using this site, you agree to these terms.
          </p>

          <h2>2. The website</h2>
          <p>
            We provide everydaydigitalsolutions.com as informational content,
            free tools (cost calculator, ROI calculator), and a contact
            channel for prospective clients. The site is provided
            &ldquo;as-is&rdquo; and may change at any time.
          </p>

          <h2>3. The free tools</h2>
          <p>
            The App Cost Calculator, Voice ROI Calculator, and AI Quote
            Generator produce <em>estimates</em>, not binding offers. Real
            project pricing is set after a discovery conversation and
            captured in a signed Statement of Work. We make no warranty that
            the estimates match a real-world quote.
          </p>

          <h2>4. Contact and lead submissions</h2>
          <p>
            When you submit a form, you are inviting us to contact you about
            your project. We do not add you to any marketing list without
            a separate, explicit opt-in. We may keep your submission as a
            record of the enquiry (see our{" "}
            <Link href="/privacy">Privacy Policy</Link>).
          </p>

          <h2>5. Engaging us for work</h2>
          <p>
            Nothing on this site is itself a contract or offer for paid work.
            Paid engagements are governed by:
          </p>
          <ul>
            <li>A signed <strong>Statement of Work</strong> describing the
              scope, deliverables, milestones, and price.</li>
            <li>A signed <strong>Master Services Agreement</strong> covering
              IP assignment, confidentiality, payment terms, and warranties.</li>
          </ul>
          <p>
            If there is any conflict between the website and a signed
            agreement, the signed agreement governs.
          </p>

          <h2>6. Intellectual property</h2>
          <p>
            All site content (copy, images, illustrations, code samples
            shown for educational purposes) is © {new Date().getFullYear()}{" "}
            Everyday Digital Solutions unless otherwise marked. Logos and
            brand marks of clients shown in case studies belong to those
            clients.
          </p>
          <p>
            You may quote short excerpts of our content with proper
            attribution. You may not republish substantial portions
            without written permission.
          </p>

          <h2>7. Code excerpts and educational content</h2>
          <p>
            Code excerpts in blog posts and the resources section are MIT
            licensed unless otherwise marked. Use them at your own risk.
          </p>

          <h2>8. Acceptable use</h2>
          <p>By using this site you agree not to:</p>
          <ul>
            <li>Submit forms with knowingly false information.</li>
            <li>Use the tools to harvest pricing for competing services
              (the API rate-limits abuse).</li>
            <li>Attempt to access non-public endpoints (the admin portal,
              database, internal services).</li>
            <li>Run automated scrapers that disregard our robots.txt.</li>
          </ul>

          <h2>9. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, EDS is not liable for
            any indirect, incidental, special, or consequential damages
            arising from your use of the site or its tools. Our total
            liability is capped at the amount you have paid us in the
            last 12 months (or zero, if you have not paid us anything).
          </p>

          <h2>10. Governing law</h2>
          <p>
            These terms are governed by the laws of India. Disputes will be
            resolved in the courts of Mohali, Punjab.
          </p>

          <h2>11. Changes to these terms</h2>
          <p>
            We may update these terms. If we make a material change, we
            will update the &ldquo;Last updated&rdquo; date and, where
            practical, show a notice on the site for 30 days.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about these terms?{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <p className="not-prose mt-12 pt-6 border-t border-border text-sm text-muted-foreground">
            See also:{" "}
            <Link className="text-primary hover:underline" href="/privacy">
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link className="text-primary hover:underline" href="/cookies">
              Cookies
            </Link>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
