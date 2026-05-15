import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/constants";

const LAST_UPDATED = "May 14, 2026";

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="How Everyday Digital Solutions collects, uses, and protects your data. Compliant with India's Digital Personal Data Protection Act (DPDP) 2023."
        canonical="/privacy"
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
              Privacy <em className="italic text-primary">Policy</em>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Plain-English summary of what we collect, why, and how to ask us
              to delete it. Compliant with India's DPDP Act 2023.
            </p>
          </header>

          <h2>Who we are</h2>
          <p>
            <strong>Everyday Digital Solutions</strong> (referred to as &ldquo;EDS&rdquo;,
            &ldquo;we&rdquo;, or &ldquo;us&rdquo;) is a software studio based in Mohali, Punjab,
            India. We operate the website{" "}
            <a href="https://everydaydigitalsolutions.com">everydaydigitalsolutions.com</a>{" "}
            and own the data described below.
          </p>
          <p>
            For privacy questions or data requests, write to{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>What we collect when you visit the site</h2>
          <p>
            We collect first-party analytics so we can improve the site and
            understand which content is useful. <strong>We do not use third-party
            advertising trackers.</strong> All analytics data is stored in our own
            database in India.
          </p>

          <h3>Per-visit data</h3>
          <ul>
            <li>
              <strong>Anonymous visitor ID</strong> — a random UUID stored in a
              cookie (<code>eds_cid</code>) so we can recognise returning
              visitors. It is not linked to your identity unless you submit a
              form.
            </li>
            <li>
              <strong>Network info</strong> — your IP address (used to derive
              approximate city/region via an offline geo-IP database), and a
              flag indicating whether you are in our service area (Tri-City).
              Raw IP addresses are anonymised (last octet removed) after 90
              days.
            </li>
            <li>
              <strong>Device info</strong> — device type (mobile / tablet /
              desktop), operating system, browser, screen size. Used to make
              sure the site renders correctly on your device.
            </li>
            <li>
              <strong>Behaviour</strong> — pages you visit, time spent on each,
              scroll depth, and clicks on tracked elements (buttons, links).
              Used to understand which parts of the site are useful.
            </li>
            <li>
              <strong>Source</strong> — the referrer (e.g. Instagram, Google) and
              any UTM tags that brought you here.
            </li>
            <li>
              <strong>Tool inputs</strong> — if you use our calculators (App
              Cost, Voice ROI), we store the inputs and the result so we can
              improve the tools.
            </li>
          </ul>

          <h3>If you submit a form</h3>
          <ul>
            <li>
              <strong>Lead intake form</strong> (
              <Link href="/contact">/contact</Link>) — name, WhatsApp number,
              email, city, industry, project goal, budget, timeline.
            </li>
            <li>
              <strong>Quote form</strong> (<Link href="/get-a-quote">/get-a-quote</Link>) —
              same contact details plus project description.
            </li>
            <li>
              <strong>Lead magnet subscription</strong> — email and the source
              page.
            </li>
          </ul>

          <h2>Why we collect it</h2>
          <ul>
            <li>To respond to your enquiry (forms).</li>
            <li>To make the site faster and more useful (analytics).</li>
            <li>To understand where our audience comes from so we can serve
              them better (geo + source).</li>
            <li>To improve our calculators (tool inputs).</li>
          </ul>
          <p>
            We never sell your data, share it with advertising networks, or use
            it for purposes other than running this business.
          </p>

          <h2>How long we keep it</h2>
          <ul>
            <li><strong>Raw IP addresses</strong> — 90 days, then anonymised.</li>
            <li><strong>Session and pageview data</strong> — 24 months, then
              aggregated and pseudonymised.</li>
            <li><strong>Lead submissions</strong> — kept until you ask us to
              delete them, or until 3 years after our last interaction.</li>
            <li><strong>Cookies</strong> — see our{" "}
              <Link href="/cookies">Cookies page</Link> for individual
              expiries.</li>
          </ul>

          <h2>Your rights under the DPDP Act</h2>
          <p>
            India's Digital Personal Data Protection Act 2023 gives you the
            following rights over data we hold about you:
          </p>
          <ul>
            <li><strong>Access</strong> — ask us what we have on you.</li>
            <li><strong>Correction</strong> — ask us to fix anything wrong.</li>
            <li><strong>Deletion</strong> — ask us to erase it (we will delete
              within 30 days unless we are legally required to retain it).</li>
            <li><strong>Withdraw consent</strong> — visit our{" "}
              <Link href="/cookies">Cookies</Link> page and click
              &ldquo;Opt out of analytics&rdquo;. You can also enable
              Do-Not-Track in your browser; we respect it.</li>
            <li><strong>Grievance</strong> — write to{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> and we will
              respond within 15 business days.</li>
          </ul>

          <h2>Third-party services we use</h2>
          <p>
            We do not use third-party advertising or behavioural tracking
            services. The only third-party services that may process your data
            are:
          </p>
          <ul>
            <li><strong>Railway</strong> — our hosting provider, which sees the
              raw HTTP request (IP, headers). Their privacy policy is at{" "}
              <a href="https://railway.com/legal/privacy" target="_blank" rel="noopener noreferrer">railway.com/legal/privacy</a>.</li>
            <li><strong>CallMeBot</strong> — used only when you submit a lead
              form, to send a WhatsApp notification to our founder. Only the
              lead summary is sent; no analytics data.</li>
            <li><strong>OpenAI</strong> — used by the AI quote generator at
              <Link href="/get-a-quote">/get-a-quote</Link>. Your project
              description is sent to OpenAI to draft scope copy. OpenAI does
              not train on API inputs by default.</li>
          </ul>

          <h2>Data security</h2>
          <p>
            All traffic to the site is encrypted via HTTPS. Our database runs
            inside Railway's private network and is not exposed to the public
            internet. Admin access to the analytics dashboard is password
            protected.
          </p>

          <h2>Children</h2>
          <p>
            This site is intended for business audiences. We do not knowingly
            collect data from anyone under 18.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If we materially change what we collect or how we use it, we will
            update the &ldquo;Last updated&rdquo; date at the top and, where
            practical, show a notice on the site for 30 days.
          </p>

          <p className="not-prose mt-12 pt-6 border-t border-border text-sm text-muted-foreground">
            Questions? Email{" "}
            <a className="text-primary hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            . See also: <Link className="text-primary hover:underline" href="/cookies">
              Cookies
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
