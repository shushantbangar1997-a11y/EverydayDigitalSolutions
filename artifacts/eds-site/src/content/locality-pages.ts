export interface LocalityFAQ {
  q: string;
  a: string;
}

export interface LocalityPage {
  slug: string;
  parentCity: "Chandigarh" | "Mohali" | "Jalandhar";
  parentSlug: "chandigarh" | "mohali" | "jalandhar";
  localityName: string;
  canonical: string;
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroParagraph: string;
  introParagraph1: string;
  introParagraph2: string;
  landmarks: string[];
  industriesServed: { title: string; body: string }[];
  whyHerePoints: { title: string; body: string }[];
  faqs: LocalityFAQ[];
  geo: { latitude: string; longitude: string };
  nearbyLocalities?: { label: string; href: string }[];
}

export const localityPages: Record<string, LocalityPage> = {
  // ── CHANDIGARH ────────────────────────────────────────────────────────────
  "chandigarh/sector-17": {
    slug: "chandigarh/sector-17",
    parentCity: "Chandigarh",
    parentSlug: "chandigarh",
    localityName: "Sector 17",
    canonical: "/chandigarh/sector-17",
    seoTitle: "App Developer Sector 17 Chandigarh — Custom Software & AI",
    seoDescription:
      "Custom mobile app development, AI voice agents, and business automation for Sector 17 Chandigarh. Studio in Mohali, 12 minutes from Plaza. Senior team, fixed-price, 30-day delivery.",
    heroEyebrow: "Sector 17, Chandigarh",
    heroHeadline: "Custom App & Software Development for Sector 17 Businesses",
    heroParagraph:
      "Sector 17 is the commercial heart of Chandigarh — the Plaza, the brand showrooms, the headquarters of half the Tricity's premium service businesses. We build the digital infrastructure that lets those businesses compete on more than location.",
    introParagraph1:
      "Sector 17 hosts the densest concentration of premium retail and service businesses in the Tricity. The Plaza and its adjoining commercial corridor are home to flagship stores, salons, restaurants, banks, jewellery showrooms, and travel agencies whose customers expect a digital experience that matches the quality of the in-store one. Yet the vast majority of Sector 17 businesses still rely on phone-based booking, paper loyalty cards, and a WhatsApp number a junior staff member checks twice a day.",
    introParagraph2:
      "We have shipped custom mobile apps, AI voice agents, and automation systems for businesses across Chandigarh — including the kind of high-touch service brand that Sector 17 is full of. Our Mohali studio (Tecfin Tower, Phase 8B) is a 12–15 minute drive from the Plaza, so face-to-face scoping, weekly demos, and on-site launch support are completely standard.",
    landmarks: [
      "Sector 17 Plaza",
      "Neelam Theatre",
      "Bus Stand Sector 17",
      "Bridge Market",
      "Sector 22 retail belt (5 min)",
    ],
    industriesServed: [
      { title: "Premium retail & jewellery", body: "Branded loyalty apps, appointment booking for high-value consultations, and WhatsApp follow-up automation." },
      { title: "Salons, spas & wellness", body: "Booking apps with stylist availability, automated reminders, and loyalty programmes — like the one we built for Quasar Salon." },
      { title: "Restaurants & cafés", body: "Reservation flows, table management, and AI voice agents that take bookings in Hindi, English, and Punjabi." },
      { title: "Travel agencies & tour operators", body: "Itinerary builders, AI-powered enquiry follow-up, and CRM automation for international travel desks." },
    ],
    whyHerePoints: [
      { title: "12 minutes from the Plaza", body: "Our Mohali studio is a short drive from Sector 17. We work face-to-face with Sector 17 clients throughout the build." },
      { title: "Built for Tricity service brands", body: "We specialise in the verticals that fill Sector 17 — retail, beauty, hospitality, and professional services." },
      { title: "30-day delivery", body: "A focused custom mobile app — booking, payments, loyalty, push — can be live in the App Store and Play Store in four weeks." },
      { title: "Founder-led engagement", body: "The senior engineer who scopes your project is the same one who builds it. No bait-and-switch to a junior team." },
    ],
    faqs: [
      { q: "Do you have an office in Sector 17?", a: "Our primary studio is in Mohali (Phase 8B, Sector 74), a 12–15 minute drive from Sector 17 Plaza. We meet Sector 17 clients in person regularly — at our office or at theirs — throughout every project." },
      { q: "How long does a salon or restaurant booking app take to build?", a: "A focused custom mobile app — booking, payments, loyalty, push notifications, an admin dashboard — typically takes four weeks from kickoff to App Store and Play Store live. Larger marketplace-style builds run six to eight weeks." },
      { q: "What does a Sector 17-grade app cost?", a: "Custom mobile apps for Tricity service businesses generally fall between INR 4 lakh and 12 lakh, depending on feature scope. Download our free App Cost Guide for a detailed breakdown." },
      { q: "Can the AI voice agent speak Hindi and Punjabi?", a: "Yes. Every AI voice agent we build supports Hindi, Punjabi, and English natively, with a tone that matches the local market — not a generic English bot translated into Hindi." },
    ],
    geo: { latitude: "30.7414", longitude: "76.7842" },
    nearbyLocalities: [
      { label: "Sector 22, Chandigarh", href: "/chandigarh/sector-22" },
      { label: "Industrial Area Phase 1", href: "/chandigarh/industrial-area-phase-1" },
      { label: "All Chandigarh", href: "/chandigarh" },
    ],
  },

  "chandigarh/sector-22": {
    slug: "chandigarh/sector-22",
    parentCity: "Chandigarh",
    parentSlug: "chandigarh",
    localityName: "Sector 22",
    canonical: "/chandigarh/sector-22",
    seoTitle: "Software Company Sector 22 Chandigarh — App & AI Development",
    seoDescription:
      "Mobile apps, AI voice agents, and automation for Sector 22 Chandigarh businesses — clinics, coaching institutes, restaurants, and retail. 30-day delivery from our Mohali studio.",
    heroEyebrow: "Sector 22, Chandigarh",
    heroHeadline: "Custom Software & AI Development for Sector 22",
    heroParagraph:
      "Sector 22 is one of Chandigarh's most densely commercial sectors — a mix of restaurants, retail, banks, clinics, and coaching institutes that serve students, professionals, and families across the Tricity. We build the digital systems that help those businesses scale without scaling their staff.",
    introParagraph1:
      "Sector 22's commercial core — particularly the strip running along the Bus Stand and the parallel inner-market roads — hosts a uniquely diverse customer base. A coaching institute on one floor, a multi-cuisine restaurant on the next, a chartered accountant on the third, and a salon on the ground floor is a typical Sector 22 building. Each of those businesses faces a different version of the same problem: too many enquiries, not enough staff to handle them properly, and no reliable system to follow up after the first call.",
    introParagraph2:
      "Our work with Sector 22 businesses focuses on three things: a custom mobile app or web booking flow that captures intent the moment a client opens it, an AI voice agent that qualifies leads in Hindi or Punjabi when the front desk is busy, and a WhatsApp automation system that follows up automatically until the lead converts or asks to stop. Most of these go live within four weeks.",
    landmarks: [
      "Sector 22 Bus Stand",
      "Aroma Hotel area",
      "Kiran Cinema",
      "Sector 22 inner market",
      "Sector 17 Plaza (3 min)",
    ],
    industriesServed: [
      { title: "Coaching institutes & education", body: "Admission portals, student apps, lead-qualification AI for new enquiries, and WhatsApp automation for fee reminders." },
      { title: "Clinics & specialty practices", body: "Appointment booking, patient records, and automated follow-up for diagnostics and consultations." },
      { title: "Restaurants & food brands", body: "Reservation systems, table management, and AI voice agents for outbound order confirmation." },
      { title: "Banks & financial services", body: "Customer onboarding flows, KYC integrations, and lead-qualification automation for advisors." },
    ],
    whyHerePoints: [
      { title: "Tricity proximity", body: "Our Mohali studio is 12 minutes from Sector 22. Face-to-face scoping and on-site launch support are standard." },
      { title: "Multi-vertical experience", body: "We have shipped projects across the exact mix of industries that fill Sector 22 — clinics, coaching, retail, hospitality." },
      { title: "Hindi & Punjabi AI", body: "Voice agents that speak the languages your customers actually use, built for Tricity's specific dialect mix." },
      { title: "Fixed price, no surprises", body: "Every project is scoped and priced upfront. No hourly billing surprises, no scope creep invoices." },
    ],
    faqs: [
      { q: "We are a coaching institute in Sector 22 — can you build us an admissions app?", a: "Yes. We have built admissions and student apps for coaching institutes across Punjab and the Tricity. A typical admissions app — enquiry capture, application form, fee payment, and a parent dashboard — takes four to six weeks." },
      { q: "Do you handle ongoing support after launch?", a: "Yes. Every project includes 30 days of post-launch support at no additional cost. Beyond that, we offer monthly retainer plans for businesses that want guaranteed response times for changes and new features." },
      { q: "How do you handle data privacy for clinic apps?", a: "Patient data is stored in Indian data centres, encrypted at rest and in transit, with role-based access. We follow the IT Act 2000 and ITSAR-aligned security practices for clinic and healthcare clients." },
      { q: "Can your AI voice agent integrate with our existing CRM?", a: "Yes. We integrate with the major CRMs used in India (Zoho, HubSpot, LeadSquared, custom CRMs) and with WhatsApp Business API, so qualified leads land in your existing pipeline automatically." },
    ],
    geo: { latitude: "30.7345", longitude: "76.7812" },
    nearbyLocalities: [
      { label: "Sector 17, Chandigarh", href: "/chandigarh/sector-17" },
      { label: "Industrial Area Phase 1", href: "/chandigarh/industrial-area-phase-1" },
      { label: "All Chandigarh", href: "/chandigarh" },
    ],
  },

  "chandigarh/industrial-area-phase-1": {
    slug: "chandigarh/industrial-area-phase-1",
    parentCity: "Chandigarh",
    parentSlug: "chandigarh",
    localityName: "Industrial Area Phase 1",
    canonical: "/chandigarh/industrial-area-phase-1",
    seoTitle: "Custom Software Industrial Area Phase 1, Chandigarh — Apps & Automation",
    seoDescription:
      "Custom internal software, ERP integrations, AI automation, and B2B mobile apps for Industrial Area Phase 1 Chandigarh manufacturers and exporters. Mohali studio, senior team, fixed-price.",
    heroEyebrow: "Industrial Area Phase 1, Chandigarh",
    heroHeadline: "Custom Software for Industrial Area Phase 1 Manufacturers",
    heroParagraph:
      "Industrial Area Phase 1 is home to Chandigarh's manufacturing, logistics, and B2B services backbone. We build the internal software, ERP integrations, and automation systems that let those businesses run leaner and ship faster.",
    introParagraph1:
      "Industrial Area Phase 1 hosts a different category of business than Sector 17 or Sector 22 — manufacturers, exporters, B2B service providers, and the support businesses (logistics, packaging, machinery dealers) that serve them. The digital problem is also different: it is rarely a customer-facing booking app. It is more often an internal tool that ties together spreadsheets, ERP records, and WhatsApp conversations into a single system the operations team can actually use.",
    introParagraph2:
      "Our work with Industrial Area businesses focuses on internal tooling — order tracking dashboards, dispatch and logistics apps, custom ERP integrations, AI agents that answer B2B enquiries from international buyers, and WhatsApp-based field reporting for sales and service teams. Many of these projects pay back inside six months by removing two or three full-time data-entry roles.",
    landmarks: [
      "Industrial Area Phase 1 main road",
      "EPIP-aligned plots",
      "Madhya Marg connection",
      "Phase 2 industrial extension",
      "Sector 29 / Tribune chowk",
    ],
    industriesServed: [
      { title: "Manufacturers & assemblers", body: "Production-floor dashboards, order tracking systems, and quality-check apps for shop-floor staff." },
      { title: "Exporters & trading houses", body: "Buyer-portal apps, AI-powered enquiry handling for international leads, and shipment tracking dashboards." },
      { title: "Logistics & dispatch", body: "Route planning apps, driver mobile apps, and real-time delivery tracking for B2B clients." },
      { title: "B2B service providers", body: "CRM integrations, proposal automation, and AI agents that qualify inbound enquiries before a human gets involved." },
    ],
    whyHerePoints: [
      { title: "Internal-tool specialists", body: "We build the dashboards and operational tools that ERPs cannot — and integrate cleanly with the ERP you already use." },
      { title: "B2B AI experience", body: "We have built AI agents that handle international B2B enquiries in English, with auto-translation for Hindi and Punjabi sales teams." },
      { title: "On-site discovery", body: "We come to your factory or office, sit with the operations team, and map the actual workflow before we propose anything." },
      { title: "Senior engineers only", body: "Industrial software needs people who understand operations, not just code. Every project is led by a senior engineer." },
    ],
    faqs: [
      { q: "We use an existing ERP — can you build a custom dashboard on top?", a: "Yes. Most Indian ERPs (Tally, Marg, Zoho, custom Oracle/SAP installations) expose data via API or direct database access. We build modern dashboards and mobile apps on top of that data without disrupting the existing ERP." },
      { q: "Can you build an app for our shop-floor staff who do not speak English?", a: "Yes. We design shop-floor apps with Hindi and Punjabi UI, large-touch-target buttons, and offline-first architecture so they keep working when the factory Wi-Fi drops." },
      { q: "Do you do AI for B2B lead qualification?", a: "Yes. We have built AI voice and chat agents that qualify inbound B2B enquiries — quantity, geography, payment terms, certifications required — and route only the qualified ones to the sales team." },
      { q: "How is pricing structured for industrial projects?", a: "We quote a fixed price for the initial build (typically INR 6–18 lakh depending on scope), followed by a monthly retainer for ongoing maintenance, integrations, and new modules." },
    ],
    geo: { latitude: "30.7059", longitude: "76.8051" },
    nearbyLocalities: [
      { label: "Sector 17, Chandigarh", href: "/chandigarh/sector-17" },
      { label: "Sector 22, Chandigarh", href: "/chandigarh/sector-22" },
      { label: "All Chandigarh", href: "/chandigarh" },
    ],
  },

  // ── MOHALI ────────────────────────────────────────────────────────────────
  "mohali/phase-7": {
    slug: "mohali/phase-7",
    parentCity: "Mohali",
    parentSlug: "mohali",
    localityName: "Phase 7",
    canonical: "/mohali/phase-7",
    seoTitle: "App Developer Phase 7 Mohali — Custom Software & AI Solutions",
    seoDescription:
      "Custom mobile app development, AI voice agents, and automation systems for Phase 7 Mohali businesses. Local Mohali studio, senior engineers, fixed-price 30-day delivery.",
    heroEyebrow: "Phase 7, Mohali",
    heroHeadline: "Custom App & Software Development in Phase 7, Mohali",
    heroParagraph:
      "Phase 7 is one of Mohali's most established commercial sectors — a mix of established service businesses, clinics, salons, and the retail backbone that serves Mohali's professional residential phases. Our office is a 5-minute drive away.",
    introParagraph1:
      "Phase 7's commercial markets serve the dense residential populations of Phases 6, 7, 8, and 9 — Mohali's professional middle and upper-middle class. The businesses that have grown alongside this resident base — neighbourhood salons, family clinics, branded restaurants, mobile and electronics retailers, fitness studios — increasingly compete with national chains that arrived with apps and CRMs already in place. Custom digital infrastructure is no longer a luxury.",
    introParagraph2:
      "Our Mohali studio at Tecfin Tower (Phase 8B, Sector 74) is approximately five minutes from central Phase 7. We work with Phase 7 businesses on custom mobile apps for booking and loyalty, AI voice agents that handle calls in Punjabi and Hindi when staff are busy, and WhatsApp automation that turns the existing customer database into a steady stream of repeat bookings.",
    landmarks: [
      "Phase 7 main market",
      "Phase 7 community centre",
      "Phase 8A boundary",
      "Sector 61 commercial belt",
      "Mohali Stadium (8 min)",
    ],
    industriesServed: [
      { title: "Salons, spas & wellness", body: "Booking apps with stylist availability, automated reminders, and loyalty programmes." },
      { title: "Family clinics & dental", body: "Appointment booking, automated reminders, patient records, and prescription history." },
      { title: "Neighbourhood restaurants", body: "Reservation apps, takeaway ordering, and AI voice agents for outbound order confirmation." },
      { title: "Fitness studios & gyms", body: "Class booking, membership management, and automated renewal reminders." },
    ],
    whyHerePoints: [
      { title: "5 minutes from Phase 7", body: "Our office is in Phase 8B, Sector 74. We meet Phase 7 clients face-to-face throughout every project." },
      { title: "Mohali-resident team", body: "Most of our team lives within Mohali. We understand the customer base and the local competitive landscape directly." },
      { title: "Punjabi-fluent AI", body: "Voice agents that speak natural Punjabi and Hindi — designed for Mohali's specific dialect mix, not a generic Indian English bot." },
      { title: "Fixed-price 30-day delivery", body: "A custom mobile app — booking, payments, loyalty, push — live in the stores in four weeks for a fixed price." },
    ],
    faqs: [
      { q: "How is your studio different from app developers I can find in Phase 8B IT Park?", a: "Most IT Park firms in Mohali focus on outsourced enterprise work for foreign clients. We focus exclusively on India-market service businesses — salons, clinics, real estate, restaurants, coaching — which means we already know the patterns that work and the shortcuts that do not." },
      { q: "Can I see your office before I commit?", a: "Yes. Walk-ins and scheduled visits are both welcome. Tecfin Tower, 264-265, Phase 8B, Sector 74 — just message us on WhatsApp first to make sure the senior engineer for your project is available to meet you." },
      { q: "Do you build apps for Mohali clinics?", a: "Yes — appointment booking, patient records, prescription history, and automated reminders are a standard pattern. We have shipped clinic apps for Tricity and Punjab clients with HIPAA-aligned data practices and Indian data residency." },
      { q: "What does a Phase 7-grade app cost?", a: "Custom mobile apps for Phase 7-style service businesses generally fall between INR 4 lakh and 10 lakh, depending on feature scope. Download our free App Cost Guide for a detailed breakdown." },
    ],
    geo: { latitude: "30.7095", longitude: "76.7010" },
    nearbyLocalities: [
      { label: "Phase 8B IT Park", href: "/mohali/phase-8b-it-park" },
      { label: "Sector 82 Aerocity", href: "/mohali/sector-82-aerocity" },
      { label: "All Mohali", href: "/mohali" },
    ],
  },

  "mohali/phase-8b-it-park": {
    slug: "mohali/phase-8b-it-park",
    parentCity: "Mohali",
    parentSlug: "mohali",
    localityName: "Phase 8B / IT Park",
    canonical: "/mohali/phase-8b-it-park",
    seoTitle: "Software Company Phase 8B Mohali IT Park — Custom App & AI",
    seoDescription:
      "Everyday Digital Solutions is based at Tecfin Tower, Phase 8B, Mohali — inside the IT Park ecosystem. Custom mobile apps, AI voice agents, and automation for India-market service businesses.",
    heroEyebrow: "Phase 8B / IT Park, Mohali",
    heroHeadline: "Mohali Software Studio — Phase 8B / IT Park",
    heroParagraph:
      "Our primary studio is in Tecfin Tower, 264-265, Phase 8B, Sector 74 — at the centre of Mohali's IT Park ecosystem. We build for India-market service businesses, not outsourced enterprise projects for the West.",
    introParagraph1:
      "Phase 8B and the surrounding IT Park sectors (8A, 74, 82) host the densest concentration of software firms in Punjab. Most of those firms focus on outsourced work for US, UK, and European enterprises — building staff augmentation models on hourly billing. Everyday Digital Solutions is deliberately positioned differently: we work exclusively with India-market service businesses on owned, fixed-price product builds where we are accountable for the outcome, not just the timesheet.",
    introParagraph2:
      "We are headquartered at Tecfin Tower, 264-265, Phase 8B, Sector 74. Walk-ins are welcome — for a coffee, an introductory chat, or a working session on an active project. Our IT Park location means we can collaborate with adjacent specialist teams (design, infrastructure, niche AI) when a project genuinely needs it, while keeping core engineering in-house.",
    landmarks: [
      "Tecfin Tower, Phase 8B",
      "Quark City",
      "Bestech Business Tower",
      "Sector 74 commercial",
      "Phase 8A IT corridor",
    ],
    industriesServed: [
      { title: "India-market SaaS founders", body: "MVP builds, design partnerships, and full product engineering for India-first SaaS aimed at SMB and consumer markets." },
      { title: "Funded D2C and consumer startups", body: "Mobile apps, web platforms, and back-office automation for D2C brands scaling beyond the founder-led phase." },
      { title: "Adjacent IT Park firms", body: "We sub-contract on India-market product work where the partner firm is set up for offshore enterprise delivery." },
      { title: "Service businesses with HQs in IT Park", body: "Custom internal tools, CRM integrations, and AI automation for businesses headquartered in or near IT Park." },
    ],
    whyHerePoints: [
      { title: "Walk-in office", body: "Tecfin Tower, 264-265, Phase 8B, Sector 74. Drop in any business day — message ahead on WhatsApp so the right engineer is in." },
      { title: "Fixed-price product builds", body: "We do not bill hourly for staff augmentation. We scope a product, price it upfront, and deliver it." },
      { title: "India-first DNA", body: "We build for the Indian payment, language, and behavioural context — not as an afterthought to a Western product." },
      { title: "Specialist network on tap", body: "When a project needs niche specialists (3D, ML research, hardware integration), we plug into the IT Park ecosystem rather than padding our own team." },
    ],
    faqs: [
      { q: "Are you an outsourcing firm?", a: "No. We do not do staff augmentation, hourly billing, or pure outsourcing. Every engagement is a fixed-price product build where we are accountable for shipping a working product, not for clocking hours." },
      { q: "Can I visit your office in Phase 8B?", a: "Yes — Tecfin Tower, 264-265, Phase 8B, Sector 74. Walk-ins are welcome but we recommend WhatsApping us first so the senior engineer for your project is in." },
      { q: "Do you partner with other IT Park firms?", a: "We sub-contract selectively on India-market product work where the partner firm is set up for offshore enterprise delivery and needs an India-DNA team. Reach out via WhatsApp to discuss." },
      { q: "What is your engagement model for funded startups?", a: "Two options. Option A: a fixed-price MVP delivered in 6–10 weeks (typical INR 8–25 lakh). Option B: a longer design-partnership engagement where we co-build the product over 3–6 months. We do not do open-ended hourly billing." },
    ],
    geo: { latitude: "30.7046", longitude: "76.7207" },
    nearbyLocalities: [
      { label: "Phase 7, Mohali", href: "/mohali/phase-7" },
      { label: "Sector 82 Aerocity", href: "/mohali/sector-82-aerocity" },
      { label: "All Mohali", href: "/mohali" },
    ],
  },

  "mohali/sector-82-aerocity": {
    slug: "mohali/sector-82-aerocity",
    parentCity: "Mohali",
    parentSlug: "mohali",
    localityName: "Sector 82 / Aerocity",
    canonical: "/mohali/sector-82-aerocity",
    seoTitle: "App & AI Development Sector 82 Aerocity Mohali — Real Estate & Premium Brands",
    seoDescription:
      "Custom apps, AI voice agents, and lead-qualification automation for Sector 82 Mohali and Aerocity real estate developers, premium service brands, and aerocity-belt businesses.",
    heroEyebrow: "Sector 82 / Aerocity, Mohali",
    heroHeadline: "Custom Software for Sector 82 Aerocity Real Estate & Premium Brands",
    heroParagraph:
      "The Aerocity belt and Sector 82 host the Tricity's most active premium real estate developers, branded hospitality, and the new wave of upscale service businesses targeting the Tricity's growing high-net-worth consumer base. We build the AI lead-qualification and CRM automation that closes those leads before competitors do.",
    introParagraph1:
      "The PR7 / Aerocity corridor is the fastest-growing premium commercial belt in the Tricity. Real estate developers are launching projects every quarter. Premium hospitality, branded fitness, and high-end clinics are opening to serve the residential build-out. The shared problem across all of these businesses is the same: a single inbound lead is worth between INR 25,000 and INR 5 lakh depending on the vertical, but the average response time is over an hour, and most leads never get a follow-up call at all.",
    introParagraph2:
      "Our work with Aerocity and Sector 82 businesses focuses on AI voice agents that respond to inbound enquiries in under 60 seconds, in Hindi or Punjabi or English depending on the caller, and qualify the lead before passing it to a human sales executive. Combined with WhatsApp follow-up automation and CRM integration, the result is typically a 2–3x improvement in lead-to-meeting conversion within the first 60 days.",
    landmarks: [
      "Aerocity (PR7) main road",
      "Sector 82 commercial",
      "International Airport Road",
      "Sector 66B / 66A boundary",
      "Janta Land developers belt",
    ],
    industriesServed: [
      { title: "Real estate developers", body: "AI voice agents for inbound lead qualification, WhatsApp automation for site-visit reminders, and CRM dashboards for sales managers." },
      { title: "Premium hospitality", body: "Reservation apps, automated guest follow-up, and AI agents for outbound booking confirmation." },
      { title: "Specialty clinics & wellness", body: "Appointment booking, automated reminders, and AI consultations triage for high-volume specialty practices." },
      { title: "Branded fitness & lifestyle", body: "Class booking, membership management, and AI-powered renewal automation." },
    ],
    whyHerePoints: [
      { title: "Real estate AI specialists", body: "We have shipped AI voice-agent and CRM-automation projects for multiple Tricity real estate developers. The patterns that close are the patterns we already know." },
      { title: "10 minutes from Aerocity", body: "Our Phase 8B studio is a short drive from PR7 / Aerocity. Site visits and on-location demos are standard." },
      { title: "Hindi, Punjabi, English voice", body: "AI agents that switch language automatically based on the caller — no language-mismatch awkwardness on a INR 50 lakh lead." },
      { title: "CRM-agnostic", body: "We integrate with Zoho, HubSpot, LeadSquared, Sell.do, custom CRMs, and pure-WhatsApp pipelines." },
    ],
    faqs: [
      { q: "Can your AI voice agent handle Aerocity real estate enquiries?", a: "Yes. We have built and run AI voice agents for Tricity real estate developers handling inbound enquiries from portals (99acres, Magicbricks, Housing.com), classifying intent (browsing vs investor vs site-visit ready), and booking site visits directly into the sales calendar." },
      { q: "How fast does the AI respond to a new lead?", a: "Typically under 30 seconds from the moment the lead lands in our webhook — usually before the lead has finished filling out a competitor's form. Speed is the single biggest driver of real estate lead conversion in our data." },
      { q: "Do you integrate with our existing CRM?", a: "Yes. We integrate with all major CRMs used in Indian real estate (Sell.do, LeadSquared, Zoho, HubSpot, custom CRMs), and with WhatsApp Business API for follow-up automation." },
      { q: "What does an AI voice agent for a real estate developer cost?", a: "Setup typically runs INR 1.5–4 lakh depending on integrations, plus a monthly fee that covers AI usage, voice minutes, and ongoing optimisation. Most developers see payback inside 30 days from a single additional booking." },
    ],
    geo: { latitude: "30.6850", longitude: "76.6850" },
    nearbyLocalities: [
      { label: "Phase 7, Mohali", href: "/mohali/phase-7" },
      { label: "Phase 8B IT Park", href: "/mohali/phase-8b-it-park" },
      { label: "All Mohali", href: "/mohali" },
    ],
  },

  // ── JALANDHAR ─────────────────────────────────────────────────────────────
  "jalandhar/model-town": {
    slug: "jalandhar/model-town",
    parentCity: "Jalandhar",
    parentSlug: "jalandhar",
    localityName: "Model Town",
    canonical: "/jalandhar/model-town",
    seoTitle: "App Developer Model Town Jalandhar — Custom Software & AI",
    seoDescription:
      "Custom mobile apps, AI voice agents, and automation systems for Model Town Jalandhar businesses — salons, clinics, coaching institutes, real estate. Local Jalandhar office on Sodal Road.",
    heroEyebrow: "Model Town, Jalandhar",
    heroHeadline: "Custom App & Software Development in Model Town, Jalandhar",
    heroParagraph:
      "Model Town is the heart of Jalandhar's premium residential and commercial economy — home to the city's most active salons, clinics, branded restaurants, and the established coaching institute belt. Our Jalandhar office (SCO 210, Silver Plaza, Sodal Road) is a short drive away.",
    introParagraph1:
      "Model Town and its surrounding sectors — Model Town Extension, Maqsudan, the markets around Guru Nanak Mission Chowk — host the densest concentration of premium service businesses in Jalandhar. The customer base here is sophisticated, brand-aware, and increasingly comfortable with app-based interactions thanks to consistent exposure to national chains. Local Model Town businesses that match that experience win; those that do not lose share quietly, year after year.",
    introParagraph2:
      "We work with Model Town businesses on custom mobile apps (booking, loyalty, payments), AI voice agents that handle calls in Punjabi when staff are busy, and WhatsApp automation that converts the existing customer list into repeat business. Our Jalandhar office is at SCO 210, Silver Plaza Complex, Sodal Road — about 10 minutes from central Model Town.",
    landmarks: [
      "Guru Nanak Mission Chowk",
      "Model Town main market",
      "Maqsudan area",
      "Doaba Chowk",
      "Civil Lines (5 min)",
    ],
    industriesServed: [
      { title: "Premium salons & spas", body: "Booking apps with stylist availability, automated reminders, and loyalty programmes." },
      { title: "Specialty clinics & dental", body: "Appointment booking, patient records, prescription history, and automated follow-up." },
      { title: "Branded restaurants & cafés", body: "Reservation apps, takeaway ordering, and AI voice agents for outbound order confirmation." },
      { title: "Coaching institutes", body: "Admission portals, student apps, AI lead-qualification for new enquiries, and WhatsApp automation for fee reminders." },
    ],
    whyHerePoints: [
      { title: "Local Jalandhar office", body: "SCO 210, Silver Plaza Complex, Sodal Road. 10 minutes from central Model Town. In-person meetings throughout every project." },
      { title: "Punjabi-fluent AI", body: "Voice agents that speak natural Punjabi — Doaba dialect — designed specifically for the Jalandhar market." },
      { title: "Coaching institute expertise", body: "We have built admission portals and student apps for coaching institutes across Punjab." },
      { title: "Senior, Jalandhar-aware team", body: "We understand the Doaba customer base and the Jalandhar competitive landscape directly." },
    ],
    faqs: [
      { q: "Do you have an office in Jalandhar?", a: "Yes — SCO 210, Silver Plaza Complex, Sodal Road, Jalandhar 144004. Approximately 10 minutes from central Model Town. Walk-ins are welcome; please WhatsApp first to confirm a meeting time." },
      { q: "Do you build apps for Model Town salons?", a: "Yes. Booking, loyalty, payments, push notifications, and automated reminders are a standard pattern. We shipped a similar app for Quasar Salon (Tricity) and the same pattern adapts directly to Jalandhar." },
      { q: "Can the AI voice agent speak Punjabi?", a: "Yes — natural Doaba-dialect Punjabi, plus Hindi and English. The AI switches language automatically based on the caller." },
      { q: "What does a Model Town-grade app cost?", a: "Custom mobile apps for Model Town-style premium service businesses generally fall between INR 4 lakh and 10 lakh, depending on feature scope. Download our free App Cost Guide for a detailed breakdown." },
    ],
    geo: { latitude: "31.3260", longitude: "75.5762" },
    nearbyLocalities: [
      { label: "Civil Lines, Jalandhar", href: "/jalandhar/civil-lines" },
      { label: "All Jalandhar", href: "/jalandhar" },
    ],
  },

  "jalandhar/civil-lines": {
    slug: "jalandhar/civil-lines",
    parentCity: "Jalandhar",
    parentSlug: "jalandhar",
    localityName: "Civil Lines",
    canonical: "/jalandhar/civil-lines",
    seoTitle: "Software Company Civil Lines Jalandhar — App, AI & Automation",
    seoDescription:
      "Custom mobile apps, AI voice agents, and business automation for Civil Lines Jalandhar — clinics, professional services, real estate, and premium retail. Local office on Sodal Road.",
    heroEyebrow: "Civil Lines, Jalandhar",
    heroHeadline: "Custom Software & AI Development in Civil Lines, Jalandhar",
    heroParagraph:
      "Civil Lines is Jalandhar's professional and institutional core — home to the city's specialty clinics, law and accounting practices, premium retail, and the corporate offices of established Jalandhar business families. We build the digital infrastructure that lets those businesses scale without scaling staff.",
    introParagraph1:
      "Civil Lines hosts a different category of business than Model Town — it is the city's professional and institutional belt rather than its premium retail belt. Specialty doctors, multi-partner clinics, chartered accountancy firms, law practices, and the Jalandhar offices of national insurance and financial services companies cluster here. The shared problem across these businesses is administrative: too many enquiries, too much paperwork, too little time for the partners to focus on the client work that actually generates revenue.",
    introParagraph2:
      "Our work with Civil Lines clients focuses on practice-management apps, patient and client portals, automated documentation flows, and AI agents that handle routine enquiries before they reach the partners. Our Jalandhar office at SCO 210, Silver Plaza Complex, Sodal Road is approximately five minutes from the Civil Lines core.",
    landmarks: [
      "Civil Lines main road",
      "Jalandhar Cantt boundary",
      "GT Road (3 min)",
      "Sodal Road",
      "Maqsudan boundary",
    ],
    industriesServed: [
      { title: "Specialty clinics & multi-partner practices", body: "Appointment booking, patient records, multi-doctor scheduling, and automated follow-up for diagnostics and consultations." },
      { title: "Chartered accountants & legal practices", body: "Client portals, document automation, deadline reminders, and AI assistants for routine query handling." },
      { title: "Insurance & financial services", body: "Client onboarding, automated KYC flows, and AI agents for renewal and lead-qualification calls." },
      { title: "Premium retail & jewellery", body: "Customer apps, appointment-based consultation booking, and WhatsApp automation for high-value clients." },
    ],
    whyHerePoints: [
      { title: "5 minutes from Civil Lines", body: "Our Jalandhar office is on Sodal Road, a short drive from the Civil Lines core. In-person meetings are standard." },
      { title: "Practice-management expertise", body: "We have built portals and apps for clinics, accountancy firms, and legal practices across Punjab." },
      { title: "Data-residency aware", body: "All client data stored in Indian data centres, encrypted at rest and in transit, with role-based access for partners and staff." },
      { title: "Professional-grade design", body: "Our designers build interfaces that match the formality your professional clients expect — not consumer-app aesthetics." },
    ],
    faqs: [
      { q: "Can you build a multi-doctor appointment system for our Civil Lines clinic?", a: "Yes. We have built multi-doctor scheduling, patient records, and prescription-history apps for clinics across Punjab. A typical multi-doctor clinic app takes 4–6 weeks." },
      { q: "Do you build practice-management software for accountancy or legal firms?", a: "Yes — client portals, document automation, deadline tracking, and team-collaboration tools. We integrate with Tally, Zoho Books, and the major legal practice-management platforms used in India." },
      { q: "How do you handle client confidentiality for legal and accountancy clients?", a: "Indian data residency, role-based access, full audit logs, encryption at rest and in transit, and signed confidentiality agreements with the entire engineering team. We treat practice client data the same way the practice itself does." },
      { q: "Can the AI voice agent handle insurance renewal calls?", a: "Yes. We have built AI agents for insurance renewal, lapsed-policy reactivation, and inbound enquiry handling — in Punjabi, Hindi, and English, with full call transcripts and CRM integration." },
    ],
    geo: { latitude: "31.3215", longitude: "75.5895" },
    nearbyLocalities: [
      { label: "Model Town, Jalandhar", href: "/jalandhar/model-town" },
      { label: "All Jalandhar", href: "/jalandhar" },
    ],
  },
};

export const localityPagesList: LocalityPage[] = Object.values(localityPages);
