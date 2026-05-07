import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CaseStudy } from "@/components/CaseStudy";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { AboutSection } from "@/components/AboutSection";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    document.title = "Everyday Digital Solutions — AI & Custom Software Studio · Mohali, India";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Custom mobile apps, AI voice agents, and automation systems for ambitious service businesses. Studio based in Mohali and Jalandhar, shipping in 30 days at one-tenth of agency cost.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Custom mobile apps, AI voice agents, and automation systems for ambitious service businesses. Studio based in Mohali and Jalandhar, shipping in 30 days at one-tenth of agency cost.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="pt-20">
        <Hero />
        <TrustStrip />
        <ServicesGrid />
        <CaseStudy />
        <ProcessTimeline />
        <AboutSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}