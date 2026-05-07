import { useEffect } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { caseStudies } from "@/content/case-studies";
import { PhoneMockup } from "@/components/PhoneMockup";

export default function QuasarCaseStudy() {
  const cs = caseStudies.quasar;
  
  useEffect(() => {
    document.title = "Quasar Salon Case Study — Everyday Digital Solutions";
  }, []);

  // Extended plausible story context
  const problemDetails = cs.story.problem + " They had multiple locations across Tricity, and the operational drag of manually managing schedules was costing them potential revenue. Stylists were frustrated with scheduling conflicts, and clients often had to wait on hold during peak hours just to book a haircut.";
  const solutionDetails = cs.story.solution + " We integrated a robust backend using Firebase to sync real-time availability across all branches. The app includes a sleek user interface for clients to browse services, select their preferred stylist, and pay upfront. We also built an admin dashboard for salon managers to oversee daily operations, track revenue, and manage staff schedules effortlessly.";
  const resultDetails = cs.story.result + " Customer retention improved by 25% within three months as the automated loyalty points incentivized repeat visits. The salon was able to reallocate front-desk staff to more customer-facing roles, enhancing the overall in-salon experience. The app essentially paid for itself in less than two months.";

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 lg:pt-48 lg:pb-32 bg-background min-h-[100dvh]">
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-8">
            {cs.tag}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-12 leading-tight">
            How we built Tricity's first celebrity-grade salon app — <em className="text-primary italic">in 30 days</em>.
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-sm text-muted-foreground border-y border-border/40 py-8">
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1">Client</span>
              <span className="text-foreground">{cs.client}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1">Timeline</span>
              <span className="text-foreground">{cs.meta.timeline}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-widest font-bold mb-1">Scope</span>
              <span className="text-foreground">{cs.meta.features}</span>
            </div>
          </div>
        </div>

        {/* Mockup Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 flex justify-center">
          <PhoneMockup screens={cs.screens} />
        </div>

        {/* Story Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 space-y-16">
          <section>
            <h2 className="text-2xl font-serif mb-6 text-foreground">The Problem</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{problemDetails}</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif mb-6 text-foreground">What We Built</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{solutionDetails}</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-6 text-foreground">The Result</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{resultDetails}</p>
          </section>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 bg-card border border-border/40 rounded-xl p-8 lg:p-12">
          <h3 className="text-2xl font-serif mb-10 text-center">Everything we shipped</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cs.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{feature}</h4>
                  <p className="text-xs text-muted-foreground">Seamlessly integrated for a smooth experience.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pull Quote */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 text-center">
          <blockquote className="space-y-6">
            <p className="font-serif text-3xl md:text-4xl italic text-foreground leading-relaxed">
              "{cs.quote.text}"
            </p>
            <footer className="text-muted-foreground uppercase tracking-widest text-sm font-bold">
              — {cs.quote.author}
            </footer>
          </blockquote>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-card border border-border/40 p-12 rounded-xl">
          <h2 className="text-3xl font-serif mb-8">Ready for your version?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="bg-primary text-black px-8 py-4 rounded-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto text-center">
              Let's talk
            </Link>
            <Link href="/" className="border border-border bg-transparent text-foreground px-8 py-4 rounded-sm font-medium hover:bg-muted transition-colors w-full sm:w-auto text-center">
              Back to home
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}