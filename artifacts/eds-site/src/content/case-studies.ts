export const caseStudies = {
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
  }
];
