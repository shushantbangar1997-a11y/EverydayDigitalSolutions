export interface LocationPage {
  slug: string;
  city: string;
  stateLabel: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  heroHeadline: string;
  heroParagraph: string;
  introParagraph1: string;
  introParagraph2: string;
  hasOffice: boolean;
  officeAddress?: string[];
  nearbyCity?: string;
  whyEDSPoints: { title: string; body: string }[];
  testimonial?: { text: string; author: string; role: string };
  cityLinks?: { label: string; href: string }[];
}

export const locationPages: Record<string, LocationPage> = {
  chandigarh: {
    slug: "chandigarh",
    city: "Chandigarh",
    stateLabel: "Union Territory, India",
    seoTitle: "Software Development Company Chandigarh — App & AI Solutions",
    seoDescription:
      "Looking for a software or app development company in Chandigarh? Everyday Digital Solutions builds custom mobile apps, AI voice agents, and automation systems for businesses across Chandigarh and Tricity.",
    canonical: "/chandigarh",
    heroHeadline: "Custom App & Software Development in Chandigarh",
    heroParagraph:
      "Everyday Digital Solutions serves ambitious businesses across Chandigarh — the planned capital with a growing tech ecosystem and a concentration of high-end service businesses ready for digital transformation.",
    introParagraph1:
      "Chandigarh's business community — from the premium salons of Sector 8 and Sector 17 to the clinics of the medical hub in Sector 44, the coaching institutes clustered near the universities, and the real estate developers working across Phase 1 to Phase 11 — increasingly competes on the digital experience they offer clients. Our Mohali office (Tecfin Tower, Phase 8B, Sector 74) is a 15-minute drive from most of Chandigarh's commercial hubs, making face-to-face strategy sessions and on-site demos straightforward.",
    introParagraph2:
      "We bring senior-led development talent to Chandigarh's service businesses — the same quality of product thinking and engineering that SaaS companies in Bangalore take for granted, without the agency overhead or the time-zone awkwardness of offshore development. Every project is scoped, designed, built, and supported by experienced engineers who understand the North Indian business context.",
    hasOffice: false,
    nearbyCity: "Mohali",
    whyEDSPoints: [
      { title: "Tricity proximity", body: "Our Mohali office is 15 minutes from central Chandigarh. In-person meetings, on-site demos, and launch-day support are all standard." },
      { title: "Service-business focus", body: "We specialise in the verticals that drive Chandigarh's economy — salons, clinics, coaching institutes, real estate, and restaurants." },
      { title: "30-day delivery", body: "A focused custom mobile app — booking, payments, loyalty, push notifications — can be live in the app stores in four weeks." },
      { title: "Local language AI", body: "Our AI voice agents speak in Hindi, English, and Punjabi — the languages that matter across Chandigarh's diverse business community." },
    ],
    testimonial: {
      text: "The app felt like it was built for our brand from day one. 60% of our bookings moved digital within the first month.",
      author: "Quasar Salon",
      role: "Tricity — Mobile App Client",
    },
    cityLinks: [
      { label: "Mohali", href: "/mohali" },
      { label: "Panchkula", href: "/panchkula" },
      { label: "Punjab", href: "/punjab" },
    ],
  },

  mohali: {
    slug: "mohali",
    city: "Mohali",
    stateLabel: "Punjab, India",
    seoTitle: "Software Company Mohali — Custom App & AI Development",
    seoDescription:
      "Everyday Digital Solutions is a custom app and AI software studio based in Mohali (Phase 8B, Sector 74). We build mobile apps, AI voice agents, and automation systems for businesses across Mohali and Tricity.",
    canonical: "/mohali",
    heroHeadline: "Custom Software & App Development in Mohali",
    heroParagraph:
      "Everyday Digital Solutions is based in Mohali — Tecfin Tower, Phase 8B, Sector 74. We work with the businesses growing alongside this city: salons, clinics, real estate developers, coaching institutes, and service brands building competitive advantage through custom digital products.",
    introParagraph1:
      "Mohali has rapidly become one of the most dynamic business environments in Punjab. IT companies cluster in the IT Park on Phase 8A and Phase 8B. The commercial sectors along the Aerocity highway are home to premium service businesses targeting the Tricity's growing upper-middle-class consumer base. And the real estate market — driven by projects from large national developers as well as established local names — remains one of the most active in North India. Our office is at the centre of this ecosystem.",
    introParagraph2:
      "We work with Mohali businesses on three core products: custom mobile apps (the digital touchpoint for your clients), AI voice agents (automated lead qualification and appointment booking in Hindi, English, and Punjabi), and business automation systems (WhatsApp follow-up, CRM integration, and workflow automation). Every project starts with a scoping conversation at our Phase 8B office, and we work face-to-face with Mohali clients throughout the build.",
    hasOffice: true,
    officeAddress: [
      "Tecfin Tower, 264-265, Phase 8B",
      "Sector 74, Sahibzada Ajit Singh Nagar",
      "Mohali, Punjab 140307",
    ],
    whyEDSPoints: [
      { title: "Based in Mohali", body: "Our primary studio is in Phase 8B, Sector 74. Face-to-face strategy sessions, weekly demos, and on-site support." },
      { title: "Tricity expertise", body: "We understand Mohali's business landscape — from IT Park-adjacent tech companies to the service businesses along PR7 and Aerocity." },
      { title: "Fixed-price delivery", body: "Every project is scoped and priced upfront. No hourly billing surprises. No scope creep invoices." },
      { title: "Senior engineers on every project", body: "No juniors hidden behind a senior sales team. The people who pitch are the people who build." },
    ],
    testimonial: {
      text: "Working with a Mohali-based studio meant we could walk into their office when we needed to. That made a real difference to the project.",
      author: "Mohali Real Estate Client",
      role: "AI Voice Agent — Lead Qualification",
    },
    cityLinks: [
      { label: "Chandigarh", href: "/chandigarh" },
      { label: "Panchkula", href: "/panchkula" },
      { label: "Jalandhar", href: "/jalandhar" },
      { label: "Punjab", href: "/punjab" },
    ],
  },

  panchkula: {
    slug: "panchkula",
    city: "Panchkula",
    stateLabel: "Haryana, India",
    seoTitle: "App Developer Panchkula — Custom Software & AI Solutions",
    seoDescription:
      "Looking for an app developer or IT company in Panchkula? Everyday Digital Solutions builds custom mobile apps, AI voice agents, and automation systems for businesses in Panchkula and the wider Tricity area.",
    canonical: "/panchkula",
    heroHeadline: "Custom App & Software Development for Panchkula Businesses",
    heroParagraph:
      "From Sector 11 to the industrial area, Panchkula's growing service economy needs digital infrastructure that matches its ambition. Everyday Digital Solutions serves Panchkula businesses from our Mohali studio — 20 minutes away, and as close as any local vendor.",
    introParagraph1:
      "Panchkula's commercial sectors — from the organised retail in Sector 11 to the clinic clusters in Sector 8 and Sector 12A, and the premium residential projects that continue to attract Chandigarh's professional class — host a growing base of service businesses competing on client experience. The sectors adjoining MDC have seen a sharp rise in premium salons, specialty clinics, and coaching brands over the past three years.",
    introParagraph2:
      "Our Mohali office at Phase 8B, Sector 74 is approximately 20–25 minutes from central Panchkula. We treat Panchkula the same as any local project — in-person meetings, regular check-ins, and on-site support are standard. We have worked with businesses from across Tricity and understand the subtle differences in clientele and competitive landscape between Panchkula, Chandigarh, and Mohali.",
    hasOffice: false,
    nearbyCity: "Mohali",
    whyEDSPoints: [
      { title: "Tricity proximity", body: "Our Mohali studio is 20 minutes from central Panchkula. We work face-to-face with Panchkula clients as a matter of course." },
      { title: "Healthcare & wellness expertise", body: "We have built apps and automation systems for clinics and wellness businesses — the segment growing fastest in Panchkula's commercial sectors." },
      { title: "30-day delivery", body: "A focused custom mobile app can be live in the app stores in four weeks. No 6-month build cycles." },
      { title: "Managed automation", body: "We build and manage the automation systems, so your team can focus on delivering service rather than managing software." },
    ],
    cityLinks: [
      { label: "Chandigarh", href: "/chandigarh" },
      { label: "Mohali", href: "/mohali" },
      { label: "Punjab", href: "/punjab" },
    ],
  },

  jalandhar: {
    slug: "jalandhar",
    city: "Jalandhar",
    stateLabel: "Punjab, India",
    seoTitle: "Software Company Jalandhar — App & IT Development Services",
    seoDescription:
      "Everyday Digital Solutions has an office in Jalandhar (SCO 210, Silver Plaza Complex, Sodal Road). We build custom mobile apps, AI voice agents, and automation systems for businesses across Jalandhar and Punjab.",
    canonical: "/jalandhar",
    heroHeadline: "Custom Software & App Development in Jalandhar",
    heroParagraph:
      "Everyday Digital Solutions operates from two offices in Punjab — including our Jalandhar location at SCO 210, Silver Plaza Complex, Sodal Road. We serve Jalandhar's ambitious businesses: salons, clinics, coaching institutes, real estate developers, and manufacturing exporters making the digital shift.",
    introParagraph1:
      "Jalandhar is one of Punjab's most commercially active cities — the sports goods capital of India, home to one of the country's largest coaching institute clusters, a growing medical tourism economy, and a dense network of service businesses serving both the city's middle class and the large diaspora-connected consumer base. Businesses in Jalandhar face fierce local competition, and the ones that win increasingly do so by offering a better digital experience alongside a better in-person service.",
    introParagraph2:
      "We opened our Jalandhar office to serve this market directly. Whether you are a coaching institute on Nakodar Road looking to move admissions online, a salon chain on Model Town looking for a branded app, a clinic in Urban Estate wanting appointment management and patient records, or a real estate developer needing AI-powered lead follow-up — we have built comparable systems for businesses in your city and understand the local context.",
    hasOffice: true,
    officeAddress: [
      "SCO 210, Silver Plaza Complex",
      "Sodal Road, Jalandhar 144004",
      "Punjab, India",
    ],
    whyEDSPoints: [
      { title: "Jalandhar office", body: "SCO 210, Silver Plaza Complex, Sodal Road. Local meetings, local understanding, local presence." },
      { title: "Coaching & education expertise", body: "We have built admission portals, student apps, and automation systems for coaching institutes and education businesses across Punjab." },
      { title: "Hindi & Punjabi AI", body: "AI voice agents trained specifically for the Punjabi market — natural Punjabi and Hindi, local context, local trust." },
      { title: "Senior-led projects", body: "Every project is led by a senior engineer and designer who understands the Punjab business context, not a junior team following a template." },
    ],
    testimonial: {
      text: "Having a local office made it easy to discuss our requirements in detail. The final product exceeded what we imagined was possible in our budget.",
      author: "Jalandhar Coaching Institute",
      role: "Admission Portal & Automation Client",
    },
    cityLinks: [
      { label: "Mohali", href: "/mohali" },
      { label: "Chandigarh", href: "/chandigarh" },
      { label: "Punjab", href: "/punjab" },
    ],
  },

  punjab: {
    slug: "punjab",
    city: "Punjab",
    stateLabel: "State, India",
    seoTitle: "Software Company Punjab — App Development & AI Solutions Across Punjab",
    seoDescription:
      "Everyday Digital Solutions builds custom mobile apps, AI voice agents, and automation systems for businesses across Punjab — with offices in Mohali and Jalandhar. Serving Chandigarh, Ludhiana, Amritsar, Patiala, and beyond.",
    canonical: "/punjab",
    heroHeadline: "Custom Software & AI Solutions Across Punjab",
    heroParagraph:
      "Everyday Digital Solutions is a Punjab-born software studio with offices in Mohali and Jalandhar. We serve businesses from Chandigarh to Ludhiana, Amritsar to Patiala — building the digital infrastructure that lets Punjab's service businesses compete at a national level.",
    introParagraph1:
      "Punjab's economy is driven by its service sector — the salons, clinics, coaching institutes, real estate developers, insurance brokers, and hospitality businesses that serve a large, prosperous, and digitally active consumer base. These businesses are increasingly competing not just on price and quality of service, but on the digital experience they deliver: the app, the WhatsApp follow-up, the booking flow, the AI that calls a lead in 60 seconds while the competitor's team is still having chai.",
    introParagraph2:
      "We work with businesses across all of Punjab's major commercial centres — Chandigarh, Mohali, Panchkula, Jalandhar, Ludhiana, Amritsar, Patiala, and Bathinda. Our Mohali office handles the Tricity and the central Punjab belt. Our Jalandhar office covers the Doaba and the Majha regions. Every project is managed in-person with regular face-to-face touchpoints, not handed off to a remote team you never meet.",
    hasOffice: true,
    officeAddress: [
      "Mohali: Tecfin Tower, 264-265, Phase 8B, Sector 74",
      "Jalandhar: SCO 210, Silver Plaza Complex, Sodal Road",
    ],
    whyEDSPoints: [
      { title: "Two Punjab offices", body: "Mohali (Phase 8B, Sector 74) and Jalandhar (Sodal Road). Covering the full length of Punjab from Tricity to the Doaba." },
      { title: "Built for Punjab's verticals", body: "Our portfolio spans the industries that power Punjab's service economy — salons, clinics, coaching, real estate, and restaurants." },
      { title: "Local language AI", body: "AI voice agents fluent in Punjabi and Hindi, designed for the nuances of the Punjab market — not generic English bots." },
      { title: "Fixed price, senior team", body: "Transparent pricing, no hidden costs, and senior engineers on every project. Not a junior team following a template." },
    ],
    cityLinks: [
      { label: "Chandigarh", href: "/chandigarh" },
      { label: "Mohali", href: "/mohali" },
      { label: "Panchkula", href: "/panchkula" },
      { label: "Jalandhar", href: "/jalandhar" },
    ],
  },
};
