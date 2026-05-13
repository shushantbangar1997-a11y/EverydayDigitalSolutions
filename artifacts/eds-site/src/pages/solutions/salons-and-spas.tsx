import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/pages/PageHero";
import { FeatureGrid } from "@/components/pages/FeatureGrid";
import { InlinePageFAQ } from "@/components/pages/InlinePageFAQ";
import { PageCTA } from "@/components/pages/PageCTA";
import { solutionPages } from "@/content/solutions";

const page = solutionPages["salons-and-spas"];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Salon & Spa App Development",
  "description": page.seoDescription,
  "provider": {
    "@type": "Organization",
    "name": "Everyday Digital Solutions",
    "url": "https://everydaydigitalsolutions.com"
  },
  "areaServed": ["India", "Punjab", "Chandigarh", "Mohali", "Jalandhar"],
  "serviceType": "Mobile App Development for Salons"
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": page.faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": { "@type": "Answer", "text": faq.a }
  }))
};

export default function SalonsAndSpas() {
  return (
    <>
      <SEO
        title={page.seoTitle}
        description={page.seoDescription}
        canonical={page.canonical}
        jsonLd={[serviceSchema, faqSchema]}
      />
      <Navbar />
      <main className="bg-background min-h-[100dvh]">
        <PageHero
          tag="Solution — Salons & Spas"
          headline={page.heroHeadline}
          paragraph={page.heroParagraph}
          cta={{ label: "Start a Project", href: "/contact" }}
        />

        {/* Problem / Solution */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-card border border-border/40 p-8">
            <h2 className="font-serif text-xl mb-4">{page.problemHeading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{page.problemText}</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 p-8">
            <h2 className="font-serif text-xl mb-4">{page.solutionHeading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{page.solutionText}</p>
          </div>
        </section>

        <FeatureGrid heading="What we build into your salon app" features={page.features} />

        {/* Case study callout */}
        {page.caseStudyLink && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
            <div className="bg-card border border-primary/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-primary mb-1">Case Study</p>
                <p className="font-serif text-lg">Quasar Salon — Tricity's first celebrity-grade booking app. Built in 30 days. 60% of bookings digital in month one.</p>
              </div>
              <Link href={page.caseStudyLink.href} className="shrink-0 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap">
                {page.caseStudyLink.label} →
              </Link>
            </div>
          </section>
        )}

        {/* Related service */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl font-serif mb-6">Take it further</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/services/mobile-app-development" className="border border-border/40 bg-card p-5 hover:border-primary transition-colors group">
              <p className="font-medium text-foreground mb-1 text-sm group-hover:text-primary transition-colors">Custom Mobile App Development</p>
              <p className="text-xs text-muted-foreground">Everything that goes into building your branded iOS & Android app.</p>
            </Link>
            <Link href="/services/automation-systems" className="border border-border/40 bg-card p-5 hover:border-primary transition-colors group">
              <p className="font-medium text-foreground mb-1 text-sm group-hover:text-primary transition-colors">Automation & AI Systems</p>
              <p className="text-xs text-muted-foreground">WhatsApp reminders, re-engagement campaigns, and CRM automation for your salon.</p>
            </Link>
          </div>
        </section>

        <InlinePageFAQ items={page.faqs} />
        <PageCTA
          heading="Ready to build your salon app?"
          subtext="We've built for salons and spas across Tricity. Tell us about your business and we'll scope your app."
          secondaryLabel="Read the Quasar case study"
          secondaryHref="/work/quasar-salon"
        />
      </main>
      <Footer />
    </>
  );
}
