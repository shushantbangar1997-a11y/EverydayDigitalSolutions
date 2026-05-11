import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CaseStudy } from "@/components/CaseStudy";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { AboutSection } from "@/components/AboutSection";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { LeadMagnet } from "@/components/LeadMagnet";
import { Footer } from "@/components/Footer";
import { faqs } from "@/content/faqs";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://everydaydigitalsolutions.com/#organization",
  "name": "Everyday Digital Solutions",
  "url": "https://everydaydigitalsolutions.com",
  "logo": "https://everydaydigitalsolutions.com/logo.png",
  "image": "https://everydaydigitalsolutions.com/opengraph.jpg",
  "description": "Senior-led custom software, AI voice agents, and automation systems for ambitious service businesses. Studio based in Mohali, Punjab — built with precision, shipped in 30 days.",
  "telephone": "+91-9056066006",
  "email": "admin@everydaydigitalsolutions.com",
  "priceRange": "₹₹",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "10:00",
      "closes": "19:00"
    }
  ],
  "foundingDate": "2018",
  "founder": {
    "@type": "Person",
    "name": "Shushant Bangar"
  },
  "areaServed": [
    { "@type": "City", "name": "Chandigarh" },
    { "@type": "City", "name": "Mohali" },
    { "@type": "City", "name": "Panchkula" },
    { "@type": "City", "name": "Jalandhar" },
    { "@type": "AdministrativeArea", "name": "Punjab" }
  ],
  "location": [
    {
      "@type": "Place",
      "name": "Everyday Digital Solutions — Mohali",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Tecfin Tower, 264-265, Phase 8B, Sector 74, Sahibzada Ajit Singh Nagar",
        "addressLocality": "Mohali",
        "addressRegion": "Punjab",
        "postalCode": "140307",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "30.7046",
        "longitude": "76.7207"
      }
    },
    {
      "@type": "Place",
      "name": "Everyday Digital Solutions — Jalandhar",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "SCO 210, Silver Plaza Complex, Sodal Road",
        "addressLocality": "Jalandhar",
        "addressRegion": "Punjab",
        "postalCode": "144004",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "31.3256",
        "longitude": "75.5727"
      }
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software & AI Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Mobile App Development",
          "description": "Native iOS & Android mobile apps for service businesses — bookings, payments, loyalty programmes, push notifications. App Store & Play Store deployment handled end-to-end."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Voice Agents",
          "description": "Automated inbound and outbound AI calling agents in Hindi, English & Punjabi with CRM and calendar integration. Never miss a lead again."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Business Automation & AI Systems",
          "description": "Custom workflow automation connecting WhatsApp, CRM, email, and calendar with AI agents. Built on n8n, Twilio, and OpenAI."
        }
      }
    ]
  },
  "sameAs": [
    "https://www.linkedin.com/company/everyday-digital-solutions",
    "https://wa.me/919056066006"
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <SEO
        title="Everyday Digital Solutions — AI & Custom Software Studio · Mohali, India"
        description="Senior-led custom software, AI voice agents, and automation systems for ambitious service businesses across Chandigarh, Mohali & Jalandhar. Shipped in 30 days. Senior talent on every project."
        canonical="/"
        jsonLd={[localBusinessSchema, faqSchema]}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="pt-[4.5rem]">
        <Hero />
        <TrustStrip />
        <ServicesGrid />
        <CaseStudy />
        <ProcessTimeline />
        <AboutSection />
        <LeadMagnet source="homepage" />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
