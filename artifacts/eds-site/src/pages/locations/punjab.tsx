import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PageCTA } from "@/components/pages/PageCTA";
import { locationPages } from "@/content/location-pages";

const page = locationPages["punjab"];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Everyday Digital Solutions",
  "url": "https://everydaydigitalsolutions.com",
  "telephone": "+91-9056066006",
  "areaServed": { "@type": "AdministrativeArea", "name": "Punjab" },
  "description": page.seoDescription,
};

const cities = [
  { label: "Chandigarh", href: "/chandigarh" },
  { label: "Mohali", href: "/mohali" },
  { label: "Panchkula", href: "/panchkula" },
  { label: "Jalandhar", href: "/jalandhar" },
];

export default function Punjab() {
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
            Serving All of Punjab
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

        {/* City links */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif mb-8">Cities we serve across Punjab</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link key={city.href} href={city.href} className="bg-card border border-border/40 p-6 hover:border-primary transition-colors group text-center">
                <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">{city.label}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif mb-8">What we build across Punjab</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Custom Mobile Apps", href: "/services/mobile-app-development", desc: "Native iOS & Android apps for service businesses across all of Punjab. Shipped in 30 days." },
              { title: "AI Voice Agents", href: "/services/ai-voice-agents", desc: "Automated lead calls in Punjabi, Hindi & English. Built for Punjab's real estate, insurance, and coaching businesses." },
              { title: "Business Automation", href: "/services/automation-systems", desc: "WhatsApp automation, n8n workflows, and CRM integration for Punjab's growing service economy." },
            ].map((s) => (
              <Link key={s.title} href={s.href} className="bg-card border border-border/40 p-6 hover:border-primary transition-colors group">
                <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Solutions */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif mb-8">Industry solutions across Punjab</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Salons & Spas", href: "/solutions/salons-and-spas" },
              { label: "Real Estate", href: "/solutions/real-estate" },
              { label: "Clinics & Healthcare", href: "/solutions/clinics-and-healthcare" },
              { label: "Restaurants & Cafes", href: "/solutions/restaurants-and-cafes" },
            ].map((s) => (
              <Link key={s.href} href={s.href} className="border border-border/40 bg-card p-5 hover:border-primary transition-colors group">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{s.label}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Why EDS */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif mb-8">Why Punjab businesses choose EDS</h2>
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

        <PageCTA
          heading="Running a business in Punjab?"
          subtext="With offices in Mohali and Jalandhar, we are never far. Tell us about your project and we'll connect you with the right team."
          primaryLabel="Start a Conversation"
          secondaryLabel="View our work"
          secondaryHref="/work/quasar-salon"
        />
      </main>
      <Footer />
    </>
  );
}
