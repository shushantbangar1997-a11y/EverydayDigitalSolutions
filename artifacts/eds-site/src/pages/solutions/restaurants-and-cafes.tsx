import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/pages/PageHero";
import { FeatureGrid } from "@/components/pages/FeatureGrid";
import { InlinePageFAQ } from "@/components/pages/InlinePageFAQ";
import { PageCTA } from "@/components/pages/PageCTA";
import { solutionPages } from "@/content/solutions";

const page = solutionPages["restaurants-and-cafes"];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Restaurant App Development — Ordering, Table Booking & Loyalty",
  "description": page.seoDescription,
  "provider": {
    "@type": "Organization",
    "name": "Everyday Digital Solutions",
    "url": "https://everydaydigitalsolutions.com"
  },
  "areaServed": ["India", "Punjab", "Chandigarh", "Mohali", "Jalandhar"],
  "serviceType": "Restaurant App Development"
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

export default function RestaurantsAndCafes() {
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
          tag="Solution — Restaurants & Cafes"
          headline={page.heroHeadline}
          paragraph={page.heroParagraph}
          cta={{ label: "Start a Project", href: "/contact" }}
        />

        {/* Commission stat */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 glass rounded-2xl p-6 sm:p-8">
            {[
              { stat: "25–30%", label: "Commission Swiggy/Zomato take per order" },
              { stat: "0%", label: "Commission on orders through your own app" },
              { stat: "100%", label: "Customer data you own with a branded app" },
            ].map((item) => (
              <div key={item.stat} className="text-center">
                <p className="text-3xl font-serif text-primary mb-1">{item.stat}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Problem / Solution */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="glass rounded-2xl p-8">
            <h2 className="font-serif text-xl mb-4">{page.problemHeading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{page.problemText}</p>
          </div>
          <div className="bg-[var(--accent-soft)] border border-primary/20 rounded-2xl p-8">
            <h2 className="font-serif text-xl mb-4">{page.solutionHeading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{page.solutionText}</p>
          </div>
        </section>

        <FeatureGrid heading="What we build for your restaurant" features={page.features} />

        {/* Related services */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
          <h2 className="text-xl font-serif mb-6">Complete the stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/services/automation-systems" className="glass rounded-2xl p-5 hover:border-primary/60 transition-colors group">
              <p className="font-medium text-foreground mb-1 text-sm group-hover:text-primary transition-colors">Automation & AI Systems</p>
              <p className="text-xs text-muted-foreground">WhatsApp order updates, loyalty reminders, and re-engagement campaigns for your regulars.</p>
            </Link>
            <Link href="/services/mobile-app-development" className="glass rounded-2xl p-5 hover:border-primary/60 transition-colors group">
              <p className="font-medium text-foreground mb-1 text-sm group-hover:text-primary transition-colors">Custom Mobile Apps</p>
              <p className="text-xs text-muted-foreground">Full detail on what goes into building a custom restaurant app — from scoping to the app stores.</p>
            </Link>
          </div>
        </section>

        <InlinePageFAQ items={page.faqs} />
        <PageCTA
          heading="Ready to own your ordering channel?"
          subtext="Tell us about your restaurant — average covers, current ordering setup, and what commission is costing you per month — and we'll scope a solution."
          secondaryLabel="See our services"
          secondaryHref="/services/mobile-app-development"
        />
      </main>
      <Footer />
    </>
  );
}
