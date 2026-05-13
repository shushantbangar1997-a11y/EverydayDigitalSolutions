import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/pages/PageHero";
import { FeatureGrid } from "@/components/pages/FeatureGrid";
import { InlinePageFAQ } from "@/components/pages/InlinePageFAQ";
import { PageCTA } from "@/components/pages/PageCTA";
import { ProcessSteps } from "@/components/pages/ProcessSteps";
import { servicePages } from "@/content/service-pages";

const page = servicePages["ai-voice-agents"];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": page.title,
  "description": page.seoDescription,
  "provider": {
    "@type": "Organization",
    "name": "Everyday Digital Solutions",
    "url": "https://everydaydigitalsolutions.com"
  },
  "areaServed": ["India", "Punjab", "Chandigarh", "Mohali"],
  "serviceType": "AI Voice Agent Development"
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

export default function AIVoiceAgents() {
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
          tag="Service — AI Voice Agents"
          headline={page.heroHeadline}
          paragraph={page.heroParagraph}
          cta={{ label: "Start a Project", href: "/contact" }}
        />

        {/* Stat bar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border border-border/40 bg-card p-6 sm:p-8">
            {[
              { stat: "60 sec", label: "First call response time" },
              { stat: "3 languages", label: "Hindi, English & Punjabi" },
              { stat: "15–22%", label: "Cold lead revival rate" },
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
          <div className="bg-card border border-border/40 p-8">
            <h2 className="font-serif text-xl mb-4">{page.problemHeading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{page.problemText}</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 p-8">
            <h2 className="font-serif text-xl mb-4">{page.solutionHeading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{page.solutionText}</p>
          </div>
        </section>

        <FeatureGrid heading="What your AI voice agent does" features={page.features} />

        <ProcessSteps heading="Deployment in 4–6 weeks" steps={page.process} />

        {/* Industries */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
          <h2 className="text-2xl font-serif mb-6 text-center">Who uses AI voice agents</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {page.industries.map((ind) => (
              <span key={ind} className="border border-border/40 text-sm text-muted-foreground px-4 py-2">
                {ind}
              </span>
            ))}
          </div>
        </section>

        {/* Real estate link */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="bg-card border border-border/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-1">Deep Dive</p>
              <p className="font-serif text-lg">How AI voice agents are changing lead follow-up for real estate developers in India.</p>
            </div>
            <Link href="/blog/ai-voice-agents-real-estate-india" className="shrink-0 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap">
              Read the article →
            </Link>
          </div>
        </section>

        {/* Related services */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl font-serif mb-6">Related services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/services/automation-systems" className="border border-border/40 bg-card p-5 hover:border-primary transition-colors group">
              <p className="font-medium text-foreground mb-1 text-sm group-hover:text-primary transition-colors">Automation & AI Systems</p>
              <p className="text-xs text-muted-foreground">WhatsApp automation, CRM integration, and n8n workflows for growing businesses.</p>
            </Link>
            <Link href="/services/mobile-app-development" className="border border-border/40 bg-card p-5 hover:border-primary transition-colors group">
              <p className="font-medium text-foreground mb-1 text-sm group-hover:text-primary transition-colors">Custom Mobile Apps</p>
              <p className="text-xs text-muted-foreground">Native iOS & Android apps for service businesses. Shipped in 30 days.</p>
            </Link>
          </div>
        </section>

        <InlinePageFAQ items={page.faqs} />
        <PageCTA
          heading="Ready to automate your lead response?"
          subtext="Tell us about your business and we'll scope an AI voice agent deployment for your specific use case."
          secondaryLabel="Read the blog"
          secondaryHref="/blog"
        />
      </main>
      <Footer />
    </>
  );
}
