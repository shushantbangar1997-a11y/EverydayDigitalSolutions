export const caseStudies = {
  openHumana: {
    id: "open-humana",
    title: "We built the AI voice agent platform that lets sales teams stop dialling — and start closing.",
    client: "Everyday Digital Solutions (In-House Product)",
    tag: "IN-HOUSE PRODUCT · AI SAAS",
    meta: {
      launched: "2024",
      category: "AI Voice Agent SaaS"
    },
    dashboard: {
      stats: [
        { label: "Total Dials", value: "1,285" },
        { label: "Live Transfers", value: "187" },
        { label: "Voicemails Left", value: "512" },
        { label: "Avg Duration", value: "3:42" }
      ],
      sampleCalls: [
        { name: "Priya Sharma", status: "TRANSFERRED", duration: "4:12", time: "2m ago" },
        { name: "Rajiv Mehta", status: "VOICEMAIL", duration: "0:28", time: "5m ago" },
        { name: "Sunita Rao", status: "CONNECTED", duration: "6:47", time: "11m ago" },
        { name: "Arjun Kapoor", status: "TRANSFERRED", duration: "3:55", time: "18m ago" }
      ]
    },
    story: {
      problem: "Sales reps at high-volume teams spend nearly 70% of their day on wasted dials — ringing out, hitting voicemail, navigating call trees. By the time a real human picks up, the rep's energy and call list are both depleted. Managers have no visibility into where time goes, and CRMs are full of stale data from calls that never connected.",
      solution: "Open Humana deploys Alex, an AI voice agent that handles every outbound dial autonomously. Alex navigates voicemail, leaves personalised messages, and detects live pickups within milliseconds — instantly transferring the live call to a human rep with full context. The dashboard gives managers real-time visibility: total dials, transfers, voicemails, average handle time, and call-by-call history.",
      result: "Teams using Open Humana report that reps spend 100% of their on-phone time speaking to live prospects — not dialling. Dial volume increases 5x to 10x because the AI never tires, never waits, and never misses a pickup. The result is a sales floor that exclusively closes."
    },
    features: [
      "Autonomous AI outbound dialling (Alex)",
      "Real-time live-answer detection",
      "Instant warm transfer to human rep",
      "Personalised voicemail drops",
      "Live call dashboard with full history",
      "Per-rep performance analytics",
      "CRM webhook integration",
      "Campaign and contact list management",
      "Call recording and transcripts",
      "Multi-team workspace support",
      "Custom AI voice and script editor",
      "HIPAA-aware call handling options"
    ],
    industries: ["Real Estate", "Insurance", "SaaS SDR Teams", "Recruiting", "Financial Services"],
    liveUrl: "https://openhumana.com"
  },

  quasar: {
    id: "quasar-salon",
    title: "How we built Tricity's first celebrity-grade salon app — in 30 days.",
    client: "Quasar Salon",
    tag: "CASE STUDY · CUSTOM MOBILE APP",
    meta: {
      timeline: "30 days",
      features: "13 features"
    },
    screens: [
      "/photos/quasar/screen-01.png",
      "/photos/quasar/screen-02.png",
      "/photos/quasar/screen-03.png",
      "/photos/quasar/screen-04.png",
      "/photos/quasar/screen-05.png"
    ],
    story: {
      problem: "Quasar Salon was growing fast, but their booking process was stuck in the past. Customers were calling the front desk, stylists were double-booked, and loyalty points were tracked on paper cards. They needed a digital experience that matched their premium in-salon service.",
      solution: "We designed and shipped a custom iOS and Android app in 30 days. It featured real-time booking, stylist availability, an automated loyalty program, and push notifications for appointments.",
      result: "Within the first month, 60% of bookings moved to the app. The front desk saves 4 hours a day, and no-shows dropped by 40% thanks to automated reminders."
    },
    features: [
      "Real-time Appointment Booking",
      "Multi-stylist Availability",
      "Service Catalog with Pricing",
      "Automated Loyalty Points",
      "Push Notification Reminders",
      "Digital Gift Cards",
      "Customer Profiles & History",
      "In-app Payments",
      "Staff Dashboard",
      "Revenue Analytics",
      "Review System",
      "Marketing Broadcasts",
      "Waitlist Management"
    ],
    quote: {
      text: "We didn't just get an app. We got a technology partner who understood our business — and shipped in a month.",
      author: "Owner, Quasar Salon"
    }
  }
};

export const portfolioProjects = [
  {
    id: "quasar-salon",
    category: "Custom Mobile App",
    client: "Quasar Salon",
    title: "Celebrity-grade salon app for Tricity's most-followed salon brand",
    outcome: "60% of bookings moved digital within 30 days. 40% drop in no-shows.",
    tags: ["React Native", "Firebase", "iOS & Android"],
    hasFullCaseStudy: true,
    caseStudyUrl: "/work/quasar-salon"
  },
  {
    id: "open-humana",
    category: "AI Voice Agent",
    client: "Everyday Digital Solutions (In-House)",
    title: "AI dialler SaaS that transfers only live calls — reps exclusively close",
    outcome: "1,285+ dials/day per campaign. 5x to 10x rep dial volume. Zero wasted rings.",
    tags: ["AI Voice", "Node.js", "React", "SaaS"],
    hasFullCaseStudy: true,
    caseStudyUrl: "/work/open-humana"
  },
  {
    id: "realty-voice",
    category: "AI Voice Agent",
    client: "Tricity Realty Group",
    title: "24/7 AI sales agent handling inbound property enquiries in Hindi & English",
    outcome: "320+ qualified leads contacted per month without a single human SDR.",
    tags: ["Synthflow", "Twilio", "CRM Integration"],
    hasFullCaseStudy: false,
    caseStudyUrl: "/contact"
  },
  {
    id: "medipulse",
    category: "Custom Mobile App",
    client: "MediPulse Clinics",
    title: "Multi-location clinic booking app replacing phone queues across 4 branches",
    outcome: "Patient wait-time complaints dropped by 70%. Staff freed from manual scheduling.",
    tags: ["React Native", "Expo", "Firebase"],
    hasFullCaseStudy: false,
    caseStudyUrl: "/contact"
  },
  {
    id: "growstack",
    category: "Automation & AI",
    client: "GrowStack Commerce",
    title: "End-to-end order + CRM automation eliminating 8 hours of daily manual work",
    outcome: "Order-to-dispatch time cut from 4 hours to 20 minutes. Zero manual data entry.",
    tags: ["n8n", "WhatsApp API", "OpenAI"],
    hasFullCaseStudy: false,
    caseStudyUrl: "/contact"
  },
  {
    id: "spiceroute",
    category: "Custom Mobile App",
    client: "Spice Route Restaurants",
    title: "Table booking + loyalty app across 3 restaurant locations in Chandigarh",
    outcome: "Weekend walk-in wait times eliminated. 35% repeat-visit rate via loyalty rewards.",
    tags: ["React Native", "Razorpay", "Firebase"],
    hasFullCaseStudy: false,
    caseStudyUrl: "/contact"
  },
  {
    id: "learnwithme",
    category: "Automation & AI",
    client: "LearnWithMe Coaching",
    title: "WhatsApp-first lead nurture bot converting cold enquiries to paid enrolments",
    outcome: "Lead-to-enrolment conversion up 3x. Founder reclaimed 2 hrs/day from manual follow-ups.",
    tags: ["WhatsApp Business API", "n8n", "OpenAI"],
    hasFullCaseStudy: false,
    caseStudyUrl: "/contact"
  }
];
