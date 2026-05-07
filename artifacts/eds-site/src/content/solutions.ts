export interface SolutionFeature {
  title: string;
  description: string;
}

export interface SolutionFAQ {
  q: string;
  a: string;
}

export interface SolutionPage {
  slug: string;
  industry: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  heroHeadline: string;
  heroParagraph: string;
  problemHeading: string;
  problemText: string;
  solutionHeading: string;
  solutionText: string;
  features: SolutionFeature[];
  caseStudyLink?: { href: string; label: string };
  faqs: SolutionFAQ[];
}

export const solutionPages: Record<string, SolutionPage> = {
  "salons-and-spas": {
    slug: "salons-and-spas",
    industry: "Salons & Spas",
    seoTitle: "Salon App Development India — Booking, Loyalty & POS for Salons & Spas",
    seoDescription:
      "We build custom salon and spa apps for Indian businesses — online booking, loyalty programmes, push notifications, and POS integration. See how we built Tricity's top salon app in 30 days.",
    canonical: "/solutions/salons-and-spas",
    heroHeadline: "The digital experience your clients expect — and your competitors have not built yet.",
    heroParagraph:
      "Salon and spa businesses in India run on loyalty, referrals, and repeat visits. A custom branded app is the platform that makes all three more reliable, more measurable, and more automated. We built Tricity's first celebrity-grade salon app in 30 days — and we bring the same precision to every salon and spa project.",
    problemHeading: "Phone bookings, WhatsApp chaos, and no-shows are costing you revenue",
    problemText:
      "Your front desk is fielding calls during colour appointments. Your WhatsApp is full of booking requests that fall through the gaps. Clients forget their appointments, leave empty chair time, and neither you nor they get a reminder because sending them manually is too time-consuming. Your loyalty programme — if you have one — lives in a stamp card that clients lose. The premium brand you have built deserves better infrastructure.",
    solutionHeading: "A custom app that feels like your brand and runs your operations",
    solutionText:
      "We design and build custom iOS and Android apps for salons and spas — from the booking flow to the loyalty engine to the admin dashboard. Every screen reflects your brand. Every workflow is designed around how your team actually works. We handle App Store and Play Store submission, backend infrastructure, and ongoing maintenance. You focus on the service.",
    features: [
      { title: "Online Booking", description: "Real-time stylist and room availability, service duration, and branch selection. Faster than calling — clients actually prefer it." },
      { title: "Upfront Payment", description: "Razorpay and UPI integration. Clients pay when they book. No-shows drop 40% within the first month." },
      { title: "Loyalty Points", description: "Points accrual on every visit, tier-based rewards, and redemption — all managed in the app. No stamp cards." },
      { title: "Push Notifications", description: "Automated 24-hour and 2-hour appointment reminders. Promotional campaigns. Re-engagement nudges for lapsed clients." },
      { title: "Stylist Profiles", description: "Showcase your team's specialisations and photos. Clients book their preferred stylist directly." },
      { title: "Admin Dashboard", description: "Daily schedule overview, revenue tracking, stylist performance, and booking history across all branches." },
      { title: "Multi-Location Sync", description: "Real-time availability across all branches in one backend. Managers see the full picture." },
      { title: "Gift Cards", description: "Digital gift card purchase and redemption — drives new client acquisition and increases average transaction value." },
    ],
    caseStudyLink: { href: "/work/quasar-salon", label: "Read the Quasar Salon case study" },
    faqs: [
      {
        q: "Can the app handle multiple branches?",
        a: "Yes. We build multi-location support as a standard feature — real-time availability sync across all branches, per-branch staff management, and consolidated reporting for owners and managers.",
      },
      {
        q: "Do clients need to download a new app just for our salon?",
        a: "Yes — and this is actually an advantage. A branded app creates a direct channel to your client that no booking platform owns. Clients who download your app have a measurably higher rebooking rate than those who book through third-party platforms.",
      },
      {
        q: "How does the loyalty programme work?",
        a: "We build a custom points engine based on your rules — points per rupee spent, bonus points for certain services, tier thresholds with named benefits. Clients see their points balance in the app after every visit and can redeem directly at checkout.",
      },
    ],
  },

  "real-estate": {
    slug: "real-estate",
    industry: "Real Estate",
    seoTitle: "Real Estate CRM & AI Voice Agent Development India — Lead Automation for Developers",
    seoDescription:
      "We build AI voice agents, CRM systems, and automation workflows for real estate developers across India. Automated lead qualification in Hindi, English & Punjabi. WhatsApp drip. Portal integration.",
    canonical: "/solutions/real-estate",
    heroHeadline: "Every lead called within 60 seconds. Every follow-up sent automatically. Every site visit booked without a human in the loop.",
    heroParagraph:
      "Real estate developers across India — from Tricity to Tier-2 Punjab cities — are losing 40–60% of their leads to response-time lag. We build the AI and automation infrastructure that closes that gap: instant outbound calls, WhatsApp nurture sequences, CRM integration, and site visit booking that runs around the clock.",
    problemHeading: "The lead you missed was bought by someone else",
    problemText:
      "A prospect fills out your site inquiry form at 9 PM. Your sales team calls at 10 AM the next morning. By that time they have toured two competitor properties. This is not a hypothetical — it describes the majority of real estate lead loss in India today. The solution is not more salespeople. It is a system that responds in 60 seconds, 24 hours a day, qualifies the lead, and puts the booking in the calendar automatically.",
    solutionHeading: "AI-powered lead response and WhatsApp nurture",
    solutionText:
      "We build custom AI voice agents that call every new lead within 60 seconds in Hindi, English, or Punjabi, qualify them on budget, timeline, and location preference, and book site visits directly into your CRM and team calendars. WhatsApp drip sequences keep unready leads warm over weeks. Portal lead integration means inquiries from 99homes, MagicBricks, and Housing feed directly into the system.",
    features: [
      { title: "60-Second Lead Response", description: "AI voice agent calls every new inquiry within 60 seconds — day, night, weekend." },
      { title: "Hindi, English & Punjabi", description: "Natural conversational AI in the three languages that matter across North India and Punjab." },
      { title: "Site Visit Booking", description: "Qualified leads book directly into your CRM and Google Calendar. Sales team only joins when the lead is warm." },
      { title: "WhatsApp Drip Sequences", description: "Multi-message nurture sequences for leads not ready to book — triggered automatically over 30, 60, or 90 days." },
      { title: "Portal Lead Integration", description: "99homes, MagicBricks, Housing, and your website forms — all feed into one qualification system." },
      { title: "Cold Database Revival", description: "Rework a year's worth of cold inquiries over a weekend. Recover 15–22% of leads your team never followed up." },
      { title: "CRM Integration", description: "Qualified data, call recordings, and transcripts pushed to Salesforce, Zoho, or your existing CRM in real time." },
      { title: "Call Analytics", description: "Dashboard showing qualification rates, conversion by source, and agent performance. Improve every month." },
    ],
    faqs: [
      {
        q: "Will the AI sound natural enough for a premium property conversation?",
        a: "Yes. Our AI voice agents are trained on natural conversational patterns specific to real estate — budget discussions, location preferences, RERA registration questions, and site visit logistics. The voice quality is high enough that callers engage naturally. We also offer hybrid setups where the AI qualifies and a human closes.",
      },
      {
        q: "Can the system handle the volume of portal leads we receive?",
        a: "Yes. The system is designed to handle any lead volume — it scales automatically and calls every inquiry within 60 seconds regardless of how many come in simultaneously.",
      },
      {
        q: "How does it integrate with our existing CRM?",
        a: "We integrate with whatever CRM you use — Salesforce, Zoho, PropSpace, or a custom-built system. If you manage leads in a Google Sheet, we integrate with that. The integration is built during the scoping phase and is a standard part of every deployment.",
      },
    ],
  },

  "clinics-and-healthcare": {
    slug: "clinics-and-healthcare",
    industry: "Clinics & Healthcare",
    seoTitle: "Clinic Management Software India — Doctor Appointment App Punjab",
    seoDescription:
      "Custom clinic management software and patient appointment apps for doctors and healthcare businesses in Punjab and India. Appointment booking, patient records, prescription management, and push reminders.",
    canonical: "/solutions/clinics-and-healthcare",
    heroHeadline: "A patient experience your clinic is proud of — from first appointment to follow-up.",
    heroParagraph:
      "Clinics and healthcare businesses in Punjab are competing on more than clinical excellence. The booking experience, the reminders, the follow-up, the prescription delivery — these are all part of the patient relationship. We build custom software that makes every touchpoint feel as professional as your in-clinic service.",
    problemHeading: "Phone bookings, paper records, and missed follow-ups are limiting your clinic's potential",
    problemText:
      "Your receptionist fields appointment calls while managing walk-ins. Patient records are scattered across paper files, Excel sheets, and WhatsApp messages. Prescribed follow-up appointments are forgotten — by patients and staff alike. No-shows leave empty appointment slots that cannot be filled at short notice. These problems are common across clinics in Punjab, and they all have software solutions that pay for themselves within months.",
    solutionHeading: "Custom clinic management software built for the way your practice works",
    solutionText:
      "We build end-to-end clinic management systems and patient-facing apps — from online appointment booking to digital patient records, prescription management, push reminders, and follow-up automation. Every system is built around your specific workflows, not a generic template. HIPAA-aligned data handling as standard.",
    features: [
      { title: "Online Appointment Booking", description: "Patients book 24/7 without calling. Doctor availability, department selection, and specialist routing." },
      { title: "Digital Patient Records", description: "Secure, searchable patient history — visits, prescriptions, lab results, and notes in one place." },
      { title: "Prescription Management", description: "Digital prescriptions issued at the point of care. Pharmacy integration optional." },
      { title: "Push Reminder System", description: "Automated appointment reminders, medication reminders, and follow-up prompts via app and WhatsApp." },
      { title: "Multi-Doctor Support", description: "Multiple doctors, departments, and consultation types — all managed in one backend." },
      { title: "Lab Integration", description: "Link lab results to the patient record. Automatic patient notification when results are ready." },
      { title: "Revenue Dashboard", description: "Daily OPD count, billing summary, and department-wise performance — visible to clinic managers." },
      { title: "Follow-Up Automation", description: "Automatically prompt follow-up appointments based on the doctor's prescribed timeline." },
    ],
    faqs: [
      {
        q: "Can the system handle multiple doctors and departments?",
        a: "Yes. We build multi-doctor, multi-department support as standard. Each doctor has their own schedule and availability. Patients route to the right doctor or department through the booking flow.",
      },
      {
        q: "Is the patient data secure?",
        a: "Data is stored in encrypted databases on secure cloud infrastructure. We follow HIPAA-aligned data handling practices, including access control, audit logging, and secure backup. Patient data is never shared with third parties.",
      },
      {
        q: "Can you integrate with the lab and pharmacy systems we already use?",
        a: "In most cases, yes — through API integration or direct database connection. We assess the integration options during the scoping phase and build accordingly.",
      },
    ],
  },

  "restaurants-and-cafes": {
    slug: "restaurants-and-cafes",
    industry: "Restaurants & Cafes",
    seoTitle: "Restaurant App Development India — Online Ordering, Table Booking & Loyalty",
    seoDescription:
      "Custom restaurant apps for Indian food businesses — online ordering, table booking, loyalty programmes, kitchen display systems, and delivery integration. Built for restaurants and cafes across Punjab and India.",
    canonical: "/solutions/restaurants-and-cafes",
    heroHeadline: "Your restaurant. Your app. Your data — not a commission to Swiggy.",
    heroParagraph:
      "Swiggy and Zomato take 25–30% of every order. A branded restaurant app lets you own the ordering channel — keeping the commission, owning the customer relationship, and building a loyalty base that returns without needing to be advertised to every time.",
    problemHeading: "Third-party platforms are eating your margins and your customer data",
    problemText:
      "Aggregator platforms are a valid customer acquisition channel — but they are an expensive retention channel. Every repeat order placed through Swiggy costs you 25–30% in commission. The customer does not see your brand; they see the platform. You have no way to contact them directly, offer them a personalised deal, or understand their ordering behaviour. A branded app changes all of that.",
    solutionHeading: "A branded ordering and loyalty platform that you own",
    solutionText:
      "We build custom restaurant apps — online ordering, table booking, loyalty programmes, and kitchen display systems — that your regulars use directly. You keep 100% of the order value, you own the customer data, and you have a push notification channel to bring customers back without paying for it.",
    features: [
      { title: "Online Ordering", description: "Full menu with photos, customisation options, and real-time availability. Delivery and takeaway supported." },
      { title: "Table Booking", description: "Real-time table availability, party size selection, and special requests — confirmed instantly." },
      { title: "Loyalty Programme", description: "Points on every order, tier-based rewards, and redemption at checkout. Drives repeat visits measurably." },
      { title: "Push Notifications", description: "Daily specials, new menu items, loyalty milestones, and re-engagement campaigns. Your direct channel." },
      { title: "Kitchen Display System", description: "Orders flow directly to the kitchen screen. No paper tickets. No missed orders during peak service." },
      { title: "Razorpay Integration", description: "UPI, cards, and wallets. Fast, reliable payment at checkout. No cash-on-delivery complications." },
      { title: "Delivery Management", description: "Delivery zone management, estimated delivery time, and live order tracking for customers." },
      { title: "Admin Dashboard", description: "Real-time order feed, daily revenue, popular items, and customer analytics. Make menu decisions with data." },
    ],
    faqs: [
      {
        q: "Should we stop using Swiggy and Zomato?",
        a: "No — aggregators are good for customer acquisition. The strategy is to convert aggregator customers to direct app users over time, using loyalty incentives and direct order promotions. Most restaurant clients run both channels simultaneously, with the branded app handling their loyal repeat customer base.",
      },
      {
        q: "How long does it take to build a restaurant app?",
        a: "A focused restaurant app — ordering, table booking, loyalty, push notifications, and kitchen display — typically takes four to six weeks from kick-off to App Store submission.",
      },
      {
        q: "Can the app handle high order volume during peak hours?",
        a: "Yes. We build on cloud infrastructure that auto-scales with demand. Peak-hour performance is a specific test scenario in our QA process.",
      },
    ],
  },
};
