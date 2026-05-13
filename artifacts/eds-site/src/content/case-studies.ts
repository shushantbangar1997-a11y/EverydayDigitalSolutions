export const caseStudies = {
  oneClickAssist: {
    id: "one-click-assist",
    title: "We built a social-scheduling and lead-capture SaaS so small businesses can post everywhere — and capture every enquiry.",
    client: "Everyday Digital Solutions (In-House Product)",
    tag: "IN-HOUSE PRODUCT · SOCIAL & LEAD GEN SAAS",
    meta: {
      launched: "2025",
      category: "Social Media & Lead Generation SaaS"
    },
    dashboard: {
      scheduledPosts: [
        { platform: "IG", preview: "Diwali offer — early bird booking now open...", time: "Today, 3:00 PM", status: "SCHEDULED" },
        { platform: "LI", preview: "5 reasons your salon needs a booking app in 2026...", time: "Today, 5:30 PM", status: "SCHEDULED" },
        { platform: "FB", preview: "Client spotlight: 300 bookings in a single month", time: "Tomorrow, 10:00 AM", status: "DRAFT" },
      ],
      capturedLeads: [
        { name: "R. Kapoor", source: "Instagram", time: "2m ago" },
        { name: "S. Patel", source: "Facebook", time: "14m ago" },
        { name: "M. Singh", source: "LinkedIn", time: "1h ago" },
      ]
    },
    story: {
      problem: "Small service businesses need a consistent social presence to stay in the pipeline — but posting across Instagram, Facebook, and LinkedIn every day is a part-time job. Missed posts mean missed visibility. Missed DMs and comments mean missed leads.",
      solution: "OneClickAssist is a SaaS dashboard that lets business owners schedule posts across all three platforms in one go, generate captions with AI, and capture every inbound lead from comments and DMs into a lightweight CRM. One click to post. Every enquiry in one inbox.",
      result: "OneClickAssist is live at oneclickassist.com, built and run in-house. The platform serves Indian small business owners who need to stay visible and capture pipeline leads without hiring a social media team."
    },
    features: [
      "Post scheduling for Instagram, Facebook & LinkedIn",
      "AI caption generation",
      "Social inbox — all DMs and comments in one place",
      "Lead capture from social interactions",
      "Simple lead CRM with follow-up reminders",
      "Analytics: reach, engagement, lead count",
      "Team collaboration",
      "White-label option for agencies"
    ],
    featuredMetrics: [
      { value: "Live", label: "In production" },
      { value: "3", label: "Platforms connected" },
      { value: "SMB", label: "Indian market focus" }
    ],
    liveUrl: "https://oneclickassist.com"
  },

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
        { name: "P. Sharma", status: "TRANSFERRED", duration: "4:12", time: "2m ago" },
        { name: "R. Verma", status: "VOICEMAIL", duration: "0:28", time: "5m ago" },
        { name: "S. Kapoor", status: "CONNECTED", duration: "6:47", time: "11m ago" },
        { name: "A. Singh", status: "TRANSFERRED", duration: "3:55", time: "18m ago" },
        { name: "M. Khan", status: "VOICEMAIL", duration: "0:31", time: "24m ago" }
      ]
    },
    story: {
      problem: "Sales reps at high-volume outbound teams spend the majority of their dial time on unanswered calls — ringing out, hitting voicemail, navigating call trees. By the time a real human picks up, the rep's energy and call list are both depleted.",
      solution: "Open Humana deploys Alex, an AI voice agent that handles every outbound dial autonomously. Alex navigates voicemail, leaves personalised messages, and detects live pickups within milliseconds — instantly transferring the live call to a human rep with full context.",
      result: "Open Humana is live at openhumana.com. The platform serves sales teams across Indian and US markets with calls in Hindi, English, and Punjabi. Results depend on team size, call volume, and campaign type — contact us or visit the site for a demo."
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
      "Hindi, English & Punjabi language support"
    ],
    featuredMetrics: [
      { value: "Live", label: "In production" },
      { value: "IN + US", label: "Markets" },
      { value: "3", label: "Languages" }
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
      "/photos/quasar/screen-05.png",
      "/photos/quasar/screen-06.png",
      "/photos/quasar/screen-07.png"
    ],
    story: {
      problem: "Quasar Salon was growing fast, but their booking process was stuck in the past. Customers were calling the front desk, stylists were being double-booked, and loyalty points were tracked on paper cards. They needed a digital experience that matched their premium in-salon service.",
      solution: "We designed and shipped a custom iOS and Android app in 30 days. It features real-time booking, stylist availability, an automated loyalty programme, and push notifications for appointments.",
      result: "The app is built, tested, and launching May 2026. All 13 features shipped within the 30-day build window. We will update this page with real impact numbers once the app is live — no made-up metrics here."
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
    outcome: "Tricity's first custom-branded salon app. Shipped in 30 days. Launching May 2026.",
    tags: ["React Native", "Firebase", "iOS & Android"],
    hasFullCaseStudy: true,
    caseStudyUrl: "/work/quasar-salon"
  },
  {
    id: "open-humana",
    category: "AI Voice Agent",
    client: "Everyday Digital Solutions (In-House)",
    title: "AI dialler SaaS that transfers only live calls — reps exclusively close",
    outcome: "Live in production. Serving sales teams across Indian and US markets in Hindi, English & Punjabi.",
    tags: ["AI Voice", "Node.js", "React", "SaaS"],
    hasFullCaseStudy: true,
    caseStudyUrl: "/work/open-humana"
  }
];
