import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PageCTA } from "@/components/pages/PageCTA";
import { locationPages } from "@/content/location-pages";

const page = locationPages["mohali"];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Everyday Digital Solutions — Mohali",
  "url": "https://everydaydigitalsolutions.com",
  "telephone": "+91-9056066006",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tecfin Tower, 264-265, Phase 8B, Sector 74",
    "addressLocality": "Mohali",
    "addressRegion": "Punjab",
    "postalCode": "140307",
    "addressCountry": "IN"
  },
  "areaServed": { "@type": "City", "name": "Mohali" },
  "description": page.seoDescription,
};

export default function Mohali() {
  return (
    <>
      <SEO
        title={page.seoTitle}
        description={page.seoDescription}
        canonical={page.canonical}
        jsonLd={localBusinessSchema}
      />
      <Navbar />
      <main className="bg-background min-h-[100dvh]">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 lg:pt-28 lg:pb-24">
          <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6">
            Based in Mohali
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
            {page.heroHeadline}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {page.heroParagraph}
          </p>
        </div>

        {/* Intro */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <p className="text-muted-foreground leading-relaxed">{page.introParagraph1}</p>
          <p className="text-muted-foreground leading-relaxed">{page.introParagraph2}</p>
        </section>

        {/* Office address */}
        {page.hasOffice && page.officeAddress && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="bg-card border border-primary/30 p-6 sm:p-8 inline-block">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Our Mohali Studio</h2>
              <address className="not-italic text-sm text-foreground leading-relaxed">
                {page.officeAddress.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </address>
            </div>
          </section>
        )}

        {/* Services overview */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif mb-8">What we build for Mohali businesses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Custom Mobile Apps", href: "/services/mobile-app-development", desc: "Native iOS & Android apps for salons, clinics, restaurants, and service businesses in Mohali and the IT Park ecosystem." },
              { title: "AI Voice Agents", href: "/services/ai-voice-agents", desc: "Automated lead qualification in Hindi, English & Punjabi. Purpose-built for Mohali's real estate and service businesses." },
              { title: "Business Automation", href: "/services/automation-systems", desc: "n8n workflows, WhatsApp automation, and CRM integration for Mohali businesses scaling without adding headcount." },
            ].map((s) => (
              <Link key={s.title} href={s.href} className="bg-card border border-border/40 p-6 hover:border-primary transition-colors group">
                <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Why EDS */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif mb-8">Why Mohali businesses choose EDS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {page.whyEDSPoints.map((point) => (
              <div key={point.title} className="flex gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground mb-1 text-sm">{point.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby cities */}
        {page.cityLinks && page.cityLinks.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-lg font-serif mb-4 text-muted-foreground">We also serve</h2>
            <div className="flex flex-wrap gap-3">
              {page.cityLinks.map((link) => (
                <Link key={link.href} href={link.href} className="border border-border/40 text-sm text-muted-foreground hover:text-foreground hover:border-primary px-4 py-2 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        <PageCTA
          heading="Ready to talk about your Mohali project?"
          subtext="Walk into our Phase 8B studio or send us a message — we'll set up a scoping conversation within one business day."
          primaryLabel="Start a Conversation"
          secondaryLabel="Our services"
          secondaryHref="/services/mobile-app-development"
        />
      </main>
      <Footer />
    </>
  );
}
