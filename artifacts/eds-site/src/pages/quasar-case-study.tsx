import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { caseStudies } from "@/content/case-studies";
import { PhoneMockup } from "@/components/PhoneMockup";

const breadcrumb = {
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://everydaydigitalsolutions.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Work",
      "item": "https://everydaydigitalsolutions.com/#work"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Quasar Salon Case Study",
      "item": "https://everydaydigitalsolutions.com/work/quasar-salon"
    }
  ]
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://everydaydigitalsolutions.com/work/quasar-salon#webpage",
  "url": "https://everydaydigitalsolutions.com/work/quasar-salon",
  "name": "Quasar Salon — Mobile App Case Study — Everyday Digital Solutions",
  "description": "How EDS built Tricity's first celebrity-grade salon booking app in 30 days. 60% of bookings went digital in month one. 40% drop in no-shows.",
  "inLanguage": "en-IN",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://everydaydigitalsolutions.com/#website",
    "url": "https://everydaydigitalsolutions.com",
    "name": "Everyday Digital Solutions"
  },
  "breadcrumb": breadcrumb
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How we built Tricity's first celebrity-grade salon app in 30 days",
  "description": "Quasar Salon needed a digital booking experience to match their premium brand. EDS designed and shipped a custom iOS & Android app in 30 days — 60% of bookings moved digital within the first month.",
  "image": "https://everydaydigitalsolutions.com/opengraph.jpg",
  "datePublished": "2024-06-01",
  "dateModified": "2025-05-07",
  "author": {
    "@type": "Person",
    "name": "Shushant Bangar"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Everyday Digital Solutions",
    "logo": {
      "@type": "ImageObject",
      "url": "https://everydaydigitalsolutions.com/logo.png"
    }
  },
  "breadcrumb": breadcrumb,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://everydaydigitalsolutions.com/work/quasar-salon"
  }
};

export default function QuasarCaseStudy() {
  const cs = caseStudies.quasar;

  const problemDetails = cs.story.problem + " They had multiple locations across Tricity, and the operational drag of manually managing schedules was costing them potential revenue. Stylists were frustrated with scheduling conflicts, and clients often had to wait on hold during peak hours just to book a haircut.";
  const solutionDetails = cs.story.solution + " We integrated a robust backend using Firebase to sync real-time availability across all branches. The app includes a sleek user interface for clients to browse services, select their preferred stylist, and pay upfront. We also built an admin dashboard for salon managers to oversee daily operations, track revenue, and manage staff schedules effortlessly.";
  const resultDetails = cs.story.result + " Customer retention improved by 25% within three months as the automated loyalty points incentivized repeat visits. The salon was able to reallocate front-desk staff to more customer-facing roles, enhancing the overall in-salon experience. The app essentially paid for itself in less than two months.";

  return (
    <>
      <SEO
        title="Quasar Salon — Mobile App Case Study"
        description="How Everyday Digital Solutions built Tricity's first celebrity-grade salon booking app in 30 days. 60% of bookings went digital in month one. 40% drop in no-shows."
        canonical="/work/quasar-salon"
        ogType="article"
        jsonLd={[webPageSchema, articleSchema]}
      />
      <Navbar />
      <main className="pt-8 pb-16 sm:pt-12 lg:pt-28 lg:pb-32 bg-background min-h-[100dvh]">

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 lg:mb-24">
          <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6 lg:mb-8">
            {cs.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-8 lg:mb-12 leading-tight">
            How we built Tricity's first celebrity-grade salon app — <em className="text-primary italic">in 30 days</em>.
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-6 text-sm text-muted-foreground border-y border-border/40 py-6 sm:py-8">
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1 text-xs sm:text-sm">Client</span>
              <span className="text-foreground">{cs.client}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1 text-xs sm:text-sm">Timeline</span>
              <span className="text-foreground">{cs.meta.timeline}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1 text-xs sm:text-sm">Scope</span>
              <span className="text-foreground">{cs.meta.features}</span>
            </div>
          </div>
        </div>

        {/* Mockup Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-32 flex justify-center">
          <PhoneMockup screens={cs.screens} />
        </div>

        {/* Story Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-32 space-y-12 lg:space-y-16">
          <section>
            <h2 className="text-xl sm:text-2xl font-serif mb-5 lg:mb-6 text-foreground">The Problem</h2>
            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">{problemDetails}</p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-serif mb-5 lg:mb-6 text-foreground">What We Built</h2>
            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">{solutionDetails}</p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-serif mb-5 lg:mb-6 text-foreground">The Result</h2>
            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">{resultDetails}</p>
          </section>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-32 bg-card border border-border/40 rounded-xl p-6 sm:p-8 lg:p-12">
          <h3 className="text-xl sm:text-2xl font-serif mb-8 lg:mb-10 text-center">Everything we shipped</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {cs.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <div>
                  <h4 className="font-medium text-foreground mb-1 text-sm sm:text-base">{feature}</h4>
                  <p className="text-xs text-muted-foreground">Seamlessly integrated for a smooth experience.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pull Quote */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-32 text-center">
          <blockquote className="space-y-5 lg:space-y-6">
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl italic text-foreground leading-relaxed">
              "{cs.quote.text}"
            </p>
            <footer className="text-muted-foreground uppercase tracking-widest text-xs sm:text-sm font-bold">
              — {cs.quote.author}
            </footer>
          </blockquote>
        </div>

        {/* Salons & Spas solution link */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <div className="bg-card border border-border/40 p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-1">Related Solution</p>
              <p className="text-sm font-medium text-foreground">Salon & Spa App Development — features, pricing, and what we build.</p>
            </div>
            <Link href="/solutions/salons-and-spas" className="shrink-0 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap">
              See the solution →
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-card border border-border/40 p-8 sm:p-12 rounded-xl">
          <h2 className="text-2xl sm:text-3xl font-serif mb-6 sm:mb-8">Ready for your version?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="bg-primary text-black px-8 py-4 rounded-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto text-center">
              Let's talk
            </Link>
            <Link href="/services/mobile-app-development" className="border border-border bg-transparent text-foreground px-8 py-4 rounded-sm font-medium hover:bg-muted transition-colors w-full sm:w-auto text-center">
              Our app service
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
