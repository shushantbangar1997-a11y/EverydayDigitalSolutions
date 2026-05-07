export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServicePage {
  slug: string;
  title: string;
  tagline: string;
  heroHeadline: string;
  heroParagraph: string;
  problemHeading: string;
  problemText: string;
  solutionHeading: string;
  solutionText: string;
  features: { title: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  industries: string[];
  faqs: ServiceFAQ[];
  seoTitle: string;
  seoDescription: string;
  canonical: string;
}

export const servicePages: Record<string, ServicePage> = {
  "mobile-app-development": {
    slug: "mobile-app-development",
    title: "Custom Mobile App Development",
    tagline: "Native iOS & Android apps for ambitious service businesses.",
    heroHeadline: "Your business deserves an app built around it — not a template built around everyone.",
    heroParagraph:
      "We design and build custom mobile apps for service businesses across Chandigarh, Mohali, and Jalandhar — from first wireframe to App Store and Play Store launch. Every app we ship reflects your brand, matches your workflow, and earns a real return.",
    problemHeading: "Off-the-shelf apps look generic and perform worse",
    problemText:
      "Booking platforms and white-label apps give every business the same experience. Your clients can tell. Generic flows, restricted branding, and missing integrations create friction that costs you bookings, retention, and trust. When the app is the first touchpoint of your service experience, a template is not good enough.",
    solutionHeading: "Custom-built, shipped in 30 days",
    solutionText:
      "We build native iOS and Android apps from scratch — designed to your brand, scoped around your actual workflow, and deployed in four to six weeks. No compromises on the features that matter. No bloat from features you will never use. Just a focused, fast app that your clients actually open.",
    features: [
      { title: "Custom UI/UX Design", description: "Every screen designed to your brand guidelines. Your palette, your typography, your feel." },
      { title: "Real-Time Booking", description: "Live availability, instant confirmation, multi-location support, and stylist or practitioner selection." },
      { title: "Integrated Payments", description: "Razorpay and UPI integration built in. Upfront payment reduces no-shows by up to 40%." },
      { title: "Push Notifications", description: "Automated reminders, loyalty alerts, and promotional messages that drive repeat visits." },
      { title: "Loyalty Programme", description: "Points accrual, tiers, and redemption — all managed in the app without a separate system." },
      { title: "Admin Dashboard", description: "Real-time schedule overview, revenue tracking, staff management, and booking history." },
      { title: "App Store Deployment", description: "We handle the App Store and Play Store submission process, including review compliance." },
      { title: "Backend & API", description: "Firebase or custom REST API backend with real-time sync across locations and devices." },
    ],
    process: [
      { step: "01", title: "Scoping", description: "We map your workflow, define the MVP feature set, and agree on a fixed scope and timeline." },
      { step: "02", title: "Design", description: "UI/UX design in Figma — every screen, every state. You review and approve before a line of code is written." },
      { step: "03", title: "Build", description: "Parallel native development for iOS and Android. Weekly demos. No surprises at handoff." },
      { step: "04", title: "Launch", description: "App Store and Play Store submission, internal testing, and go-live support. We are with you on launch day." },
    ],
    industries: ["Salons & Spas", "Clinics & Healthcare", "Gyms & Fitness", "Restaurants & Cafes", "Coaching Institutes", "Real Estate"],
    faqs: [
      {
        q: "How long does it take to build a custom mobile app?",
        a: "Our typical mobile app project runs four to six weeks from kick-off to App Store submission. Simple apps with a defined scope (booking, payments, push notifications) are often live in 30 days. Complex multi-feature products take six to ten weeks.",
      },
      {
        q: "Do you build for both iOS and Android?",
        a: "Yes. We build native apps for both platforms in parallel and submit to both the App Store and Play Store. You get two fully functional apps, not a cross-platform compromise that performs worse on both.",
      },
      {
        q: "What does it cost to build a custom mobile app in India?",
        a: "A focused service-business app — booking, payments, loyalty, push notifications, admin dashboard — typically falls in the ₹8–18 lakh range depending on complexity. We provide a detailed fixed-price quote after scoping, with no hidden costs.",
      },
      {
        q: "Will I own the app and source code?",
        a: "Fully. On project completion you receive the complete source code, App Store and Play Store listings in your accounts, and all backend credentials. We retain no ongoing rights to your intellectual property.",
      },
    ],
    seoTitle: "Custom Mobile App Development Company — Chandigarh, Mohali, India",
    seoDescription:
      "We build custom iOS and Android apps for service businesses in Chandigarh, Mohali, and Jalandhar. Bookings, payments, loyalty, push notifications — shipped in 30 days. Senior-led team, fixed price.",
    canonical: "/services/mobile-app-development",
  },

  "ai-voice-agents": {
    slug: "ai-voice-agents",
    title: "AI Voice Agents",
    tagline: "A senior salesperson who never sleeps — in Hindi, English, or Punjabi.",
    heroHeadline: "Never miss a lead again. Your AI voice agent answers every call, qualifies every prospect, and books every appointment.",
    heroParagraph:
      "We build custom AI voice agents for businesses across India that speak naturally, handle objections, and integrate with your CRM and calendar — so your human team only talks to leads that are already warm.",
    problemHeading: "Response-time lag is costing you deals",
    problemText:
      "Leads that are not contacted within five minutes convert at a fraction of the rate of those contacted immediately. Yet most businesses in India still rely on a human to make that first call — and that human is busy, sleeping, or unavailable when the inquiry comes in at 9 PM. The lead goes cold. The deal goes to a competitor.",
    solutionHeading: "60-second automated response, every time",
    solutionText:
      "Our AI voice agents call every new lead within 60 seconds of their inquiry, speak naturally in Hindi, English, or Punjabi, qualify them based on your criteria, and book site visits or appointments directly into your calendar. When a human joins the conversation, they already know the lead's budget, timeline, and intent.",
    features: [
      { title: "Hindi, English & Punjabi", description: "Natural language AI trained on local conversational patterns. Switches language mid-call based on caller preference." },
      { title: "Inbound & Outbound", description: "Handle inbound inquiries automatically. Run outbound campaigns to reactivate cold lead databases." },
      { title: "Live Calendar Integration", description: "Books site visits and appointments directly into Google Calendar or your CRM — no human in the loop." },
      { title: "CRM Integration", description: "Pushes qualified lead data, call recordings, and transcripts to Salesforce, Zoho, or any system with an API." },
      { title: "WhatsApp Follow-Up", description: "Triggers WhatsApp drip sequences after the voice call for multi-channel lead nurture." },
      { title: "Call Analytics Dashboard", description: "Review any call by recording or transcript. Track qualification rates, conversion, and agent performance." },
      { title: "Custom Scripts", description: "Trained on your brand voice, your services, and your objection-handling playbook. Sounds like you, not a bot." },
      { title: "Cold Database Revival", description: "Rework a year's worth of cold leads over a weekend. Recover 15–22% of inquiries your team never had time to follow up." },
    ],
    process: [
      { step: "01", title: "Requirements", description: "We map your lead flow, qualification criteria, and CRM setup. Define success metrics." },
      { step: "02", title: "Script Design", description: "Build the conversation flow based on your sales playbook. Train on real call recordings where available." },
      { step: "03", title: "Fine-Tuning", description: "Internal testing with your team playing the role of the caller. Iterate on edge cases and objections." },
      { step: "04", title: "Live Rollout", description: "Soft launch with a subset of leads, then full rollout. Ongoing monthly improvement from call analytics." },
    ],
    industries: ["Real Estate", "Insurance", "Coaching & Education", "Healthcare & Clinics", "Financial Services", "Hospitality"],
    faqs: [
      {
        q: "Will callers know they are talking to an AI?",
        a: "Our AI voice agents are transparent about being automated systems when asked directly. The voice quality and conversational fluency are high enough that many callers engage naturally. We do not design agents to deceive — but we do design them to be helpful enough that the distinction becomes less important to the caller.",
      },
      {
        q: "What happens when the AI cannot handle a question?",
        a: "The agent is trained to recognise questions outside its scope and hand off gracefully — either escalating to a live agent (if you have one available), sending a WhatsApp message flagging the query, or scheduling a human callback within a specified window.",
      },
      {
        q: "How long does it take to deploy an AI voice agent?",
        a: "A standard deployment takes four to six weeks from kick-off to live calls — two weeks for requirements and script design, two weeks for testing, and one to two weeks for soft launch before full rollout.",
      },
      {
        q: "Can the AI agent handle calls in multiple languages?",
        a: "Yes. Our agents are trained in Hindi, English, and Punjabi and switch based on the caller's language signal. Additional languages can be added depending on your market.",
      },
    ],
    seoTitle: "AI Voice Agents for Business India — Automated Lead Calling & CRM Integration",
    seoDescription:
      "AI voice agents that call every lead within 60 seconds, qualify in Hindi, English & Punjabi, and book appointments automatically. Built for real estate, insurance, coaching, and healthcare businesses across India.",
    canonical: "/services/ai-voice-agents",
  },

  "automation-systems": {
    slug: "automation-systems",
    title: "Business Automation & AI Systems",
    tagline: "Systematic. Reliable. Always on.",
    heroHeadline: "Stop doing manually what a system could do perfectly — every time.",
    heroParagraph:
      "We build custom automation and AI systems that connect WhatsApp, CRM, email, calendar, and payments into unified workflows. For growing businesses in India that want to scale without scaling headcount.",
    problemHeading: "Manual processes are costing you more than you realise",
    problemText:
      "Your team sends the same follow-up WhatsApp messages every day. They manually create CRM records from contact form submissions. They chase invoice payments by phone. They copy data between systems. These tasks feel small individually — but they consume hours every week, introduce errors, and create inconsistency in the customer experience that erodes trust over time.",
    solutionHeading: "Fully automated workflows, built on proven tools",
    solutionText:
      "We design and build automation systems using n8n, Make, Twilio, and the WhatsApp Business API — connected to whatever tools you already use. Every workflow is monitored, version-controlled, and documented. When something breaks (it will, eventually), we fix it. You never have to think about it.",
    features: [
      { title: "WhatsApp Automation", description: "Booking confirmations, reminders, lead follow-up, and drip sequences — all triggered automatically via WhatsApp Business API." },
      { title: "CRM Integration", description: "Auto-create leads, update statuses, and trigger follow-up sequences from any source — forms, calls, WhatsApp, ads." },
      { title: "n8n Workflows", description: "Open-source automation backbone — no per-task fees, full flexibility, and runs on your own infrastructure." },
      { title: "Email Sequences", description: "Onboarding, nurture, and re-engagement email sequences triggered by real business events." },
      { title: "Calendar Automation", description: "Auto-booking, reschedule handling, reminder sequences, and post-appointment follow-up." },
      { title: "Payment & Invoice Automation", description: "Auto-send invoices, trigger payment reminders, and reconcile payments with your accounting system." },
      { title: "AI Agents", description: "Custom AI agents trained on your business that handle specific decisions — qualifying leads, routing requests, answering FAQs." },
      { title: "Monitoring & Alerts", description: "Every workflow is monitored. You are alerted before a failure affects your business. We fix it, you carry on." },
    ],
    process: [
      { step: "01", title: "Audit", description: "We map your current manual processes, identify the highest-ROI automation candidates, and prioritise." },
      { step: "02", title: "Design", description: "Build the workflow maps — triggers, conditions, actions, and fallbacks. You approve before we build." },
      { step: "03", title: "Build & Test", description: "Deploy in a staging environment, stress-test with realistic data volumes, and run with your team before go-live." },
      { step: "04", title: "Managed Operations", description: "Ongoing monitoring, maintenance, and improvement. We own the system so you do not have to." },
    ],
    industries: ["Salons & Wellness", "Real Estate", "Coaching & Education", "Healthcare", "Insurance", "E-Commerce & Retail"],
    faqs: [
      {
        q: "Do you use Zapier or Make?",
        a: "We work with n8n as our primary automation platform for most builds because it avoids per-task fees and gives us full control over the workflow logic. We also work with Make (formerly Integromat) and Zapier when clients already have existing paid plans or specific integrations that are better supported on those platforms.",
      },
      {
        q: "What is WhatsApp Business API and why does it matter?",
        a: "The WhatsApp Business API allows businesses to send automated, programmatic messages — unlike the standard WhatsApp Business app, which is manual only. With the API, you can trigger messages from any system event, run structured sequences, and maintain shared team inboxes. For businesses in India where WhatsApp is the primary communication channel, API access is the most impactful single infrastructure upgrade available.",
      },
      {
        q: "How long does it take to build an automation system?",
        a: "Simple, focused automations (appointment reminders, lead acknowledgement) can be live in one to two weeks. A comprehensive system covering multiple workflows typically takes three to six weeks to design, build, and test properly.",
      },
      {
        q: "Who maintains the automations after launch?",
        a: "We do. All automation systems we build come with ongoing managed operations — monitoring, incident response, and monthly reviews. APIs change, tools update, and edge cases emerge. We handle all of that so you never have to think about it.",
      },
    ],
    seoTitle: "Business Automation Company India — n8n, WhatsApp & AI Workflows",
    seoDescription:
      "We build custom business automation systems for Indian companies — WhatsApp automation, n8n workflows, CRM integration, AI agents, and managed operations. For businesses ready to scale without adding headcount.",
    canonical: "/services/automation-systems",
  },
};
