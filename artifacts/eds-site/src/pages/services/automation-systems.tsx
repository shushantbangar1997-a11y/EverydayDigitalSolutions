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

const page = servicePages["automation-systems"];

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
  "areaServed": ["India", "Punjab", "Chandigarh", "Mohali", "Jalandhar"],
  "serviceType": "Business Automation"
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

const tools = ["n8n", "Make", "Zapier", "Twilio", "WhatsApp Business API", "Razorpay", "OpenAI", "Firebase"];

export default function AutomationSystems() {
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
          tag="Service — Business Automation"
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

        <FeatureGrid heading="What we automate for your business" features={page.features} />

        {/* Tools we use */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
          <h2 className="text-2xl font-serif mb-6 text-center">Tools we work with</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {tools.map((tool) => (
              <span key={tool} className="border border-border/40 bg-card text-sm text-muted-foreground px-4 py-2 font-mono">
                {tool}
              </span>
            ))}
          </div>
        </section>

        <ProcessSteps heading="From audit to managed operations" steps={page.process} />

        {/* Industries */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
          <h2 className="text-2xl font-serif mb-6 text-center">Who we automate for</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {page.industries.map((ind) => (
              <span key={ind} className="border border-border/40 text-sm text-muted-foreground px-4 py-2">
                {ind}
              </span>
            ))}
          </div>
        </section>

        {/* Blog link */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="bg-card border border-border/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-1">Blog</p>
              <p className="font-serif text-lg">Business automation for service businesses in Punjab: what to automate first and why.</p>
            </div>
            <Link href="/blog/business-automation-service-businesses-punjab" className="shrink-0 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap">
              Read the article →
            </Link>
          </div>
        </section>

        {/* Related services */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl font-serif mb-6">Related services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/services/ai-voice-agents" className="border border-border/40 bg-card p-5 hover:border-primary transition-colors group">
              <p className="font-medium text-foreground mb-1 text-sm group-hover:text-primary transition-colors">AI Voice Agents</p>
              <p className="text-xs text-muted-foreground">Automated lead qualification in Hindi, English & Punjabi. 60-second first call response.</p>
            </Link>
            <Link href="/services/mobile-app-development" className="border border-border/40 bg-card p-5 hover:border-primary transition-colors group">
              <p className="font-medium text-foreground mb-1 text-sm group-hover:text-primary transition-colors">Custom Mobile Apps</p>
              <p className="text-xs text-muted-foreground">Native iOS & Android apps for service businesses. Shipped in 30 days.</p>
            </Link>
          </div>
        </section>

        <InlinePageFAQ items={page.faqs} />
        <PageCTA
          heading="Ready to automate your operations?"
          subtext="We start with a free audit of your current workflows — identifying the highest-ROI automation candidates before we build anything."
          secondaryLabel="Read the blog"
          secondaryHref="/blog/business-automation-service-businesses-punjab"
        />
      </main>
      <Footer />
    </>
  );
}
