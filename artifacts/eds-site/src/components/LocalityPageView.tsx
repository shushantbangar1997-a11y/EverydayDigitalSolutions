import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PageCTA } from "@/components/pages/PageCTA";
import type { LocalityPage } from "@/content/locality-pages";

const PARENT_HREF: Record<LocalityPage["parentSlug"], string> = {
  chandigarh: "/chandigarh",
  mohali: "/mohali",
  jalandhar: "/jalandhar",
};

export function LocalityPageView({ page }: { page: LocalityPage }) {
  const fullName = `${page.localityName}, ${page.parentCity}`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Everyday Digital Solutions — ${fullName}`,
    url: `https://everydaydigitalsolutions.com${page.canonical}`,
    telephone: "+91-9056066006",
    email: "admin@everydaydigitalsolutions.com",
    description: page.seoDescription,
    areaServed: {
      "@type": "Place",
      name: fullName,
      geo: {
        "@type": "GeoCoordinates",
        latitude: page.geo.latitude,
        longitude: page.geo.longitude,
      },
    },
    address: {
      "@type": "PostalAddress",
      streetAddress:
        page.parentSlug === "jalandhar"
          ? "SCO 210, Silver Plaza Complex, Sodal Road"
          : "Tecfin Tower, 264-265, Phase 8B, Sector 74",
      addressLocality: page.parentSlug === "jalandhar" ? "Jalandhar" : "Mohali",
      addressRegion: "Punjab",
      postalCode: page.parentSlug === "jalandhar" ? "144004" : "140307",
      addressCountry: "IN",
    },
    priceRange: "₹₹",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SEO
        title={page.seoTitle}
        description={page.seoDescription}
        canonical={page.canonical}
        jsonLd={[localBusinessSchema, faqSchema]}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: page.parentCity, path: PARENT_HREF[page.parentSlug] },
          { name: page.localityName, path: page.canonical },
        ]}
      />
      <Navbar />
      <main className="bg-background min-h-[100dvh] pt-[5.75rem]">
        {/* Breadcrumb visible nav */}
        <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={PARENT_HREF[page.parentSlug]} className="hover:text-primary">{page.parentCity}</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{page.localityName}</li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-8 lg:pt-16 lg:pb-20">
          <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6">
            {page.heroEyebrow}
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

        {/* Landmarks */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Around {page.localityName}</h2>
          <p className="text-sm text-foreground leading-relaxed">
            We work with businesses near {page.landmarks.join(", ")}.
          </p>
        </section>

        {/* Industries served */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif mb-8">What we build for {page.localityName} businesses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {page.industriesServed.map((s) => (
              <div key={s.title} className="glass rounded-sm p-6">
                <h3 className="font-medium text-foreground mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why here */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif mb-8">Why {page.localityName} businesses choose EDS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {page.whyHerePoints.map((point) => (
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

        {/* FAQs */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif mb-8">Common questions from {page.localityName}</h2>
          <div className="space-y-6">
            {page.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-medium text-foreground mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby localities */}
        {page.nearbyLocalities && page.nearbyLocalities.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-lg font-serif mb-4 text-muted-foreground">We also serve</h2>
            <div className="flex flex-wrap gap-3">
              {page.nearbyLocalities.map((link) => (
                <Link key={link.href} href={link.href} className="border border-border/40 text-sm text-muted-foreground hover:text-foreground hover:border-primary px-4 py-2 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        <PageCTA
          heading={`Ready to talk about your ${page.localityName} project?`}
          subtext="Send us a message — we'll set up a scoping conversation within one business day."
          primaryLabel="Start a Conversation"
          secondaryLabel="Our services"
          secondaryHref="/services/mobile-app-development"
        />
      </main>
      <Footer />
    </>
  );
}
