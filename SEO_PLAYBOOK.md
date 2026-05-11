# SEO Playbook — Everyday Digital Solutions

A founder-operated SEO playbook for an AI & custom software studio based in
Mohali / Jalandhar that serves Chandigarh, Mohali, Panchkula, and Jalandhar.
Goal: dominate **"app developer in Mohali"**, **"AI agency Chandigarh"**,
**"custom software Jalandhar"**, and locality long-tails inside 12–18 months
without paid ads.

This document covers the **off-page** work the founder must do. The codebase
already handles on-page SEO: Organization / LocalBusiness / AggregateRating /
Review / SoftwareApplication / FAQ / BreadcrumbList JSON-LD, sitemap,
prerender, Plausible analytics with custom goals, and the
`check-alt-text` + `optimize-images` build steps.

---

## 1. Google Business Profile (GBP)

GBP is the single highest-leverage SEO asset for a local studio. Treat it
like a second homepage.

### Setup (one-time)

| Field | Value |
|-------|-------|
| Business name | `Everyday Digital Solutions` (no keyword stuffing — TOS violation) |
| Primary category | Software company |
| Secondary categories | Website designer · Computer consultant · Marketing consultant |
| Address | Registered Mohali office; if SAB, hide address and set service areas |
| Service areas | Chandigarh, Mohali, Panchkula, Jalandhar (≤ 20 max) |
| Phone | WhatsApp Business number, international format |
| Website | `https://everydaydigitalsolutions.com` |
| Hours | Actual hours; add holiday hours (Diwali, Lohri, Holi) |

### Weekly maintenance

- 3 GBP posts / week: project highlight (Mon), educational link to a
  `/blog/*` post (Wed), CTA to `/tools/app-cost-calculator` or
  `/tools/ai-voice-agent-roi-calculator` (Fri).
- 1–2 new geo-tagged photos / week (office, team, UI screenshots).
- Reply to every review and Q&A within 24 hours.
- Pre-seed Q&A with 5 founder-asked questions ("Do you build apps for
  salons in Punjab?", etc.).

### Reviews

- **Target: 2 new 5-star Google reviews per month.**
- Use `/admin/request-review` to send a personalised WhatsApp request
  within 7 days of project handoff.
- Replace the placeholder review URL in the request-review tool with the
  real share link from GBP → "Get more reviews → Share review form".
- Reply to each review within 24 hours, mention the project type and
  city in the reply.

---

## 2. Citations & Directories

NAP consistency (Name, Address, Phone) across the web. **Use the exact same
business name, address, and phone format everywhere** — this is the most
common failure mode for local SEO. Quality > quantity.

### NAP record (paste this verbatim into every listing)

```
Name:    Everyday Digital Solutions
Address: <STREET LINE>, Mohali, Punjab 140301, India
Phone:   +91 90560 66006
Website: https://everydaydigitalsolutions.com
Hours:   Mon–Fri 09:30–19:00, Sat 10:00–17:00
Category: Software Company
```

### 12 priority citations

| # | Directory                      | Free / Paid                | Primary category to pick           | Notes |
|---|--------------------------------|----------------------------|------------------------------------|-------|
| 1 | Google Business Profile        | Free                       | Software company                   | Verify by postcard or video. The single most important listing. |
| 2 | Bing Places                    | Free                       | Software & Computer Services       | Import from GBP to save 30 min. |
| 3 | Apple Business Connect         | Free                       | Computers / Electronics            | Drives Apple Maps + Siri results. |
| 4 | Justdial                       | Free (paid tier optional)  | Software Companies                 | Highest-traffic Indian directory. Free listing is enough at first. |
| 5 | Sulekha                        | Free (paid leads optional) | Software Development               | Decent secondary directory in Punjab. |
| 6 | IndiaMART                      | Free                       | IT Services › Software Development | B2B-focused; expect cold sales calls — set them as "no follow-up". |
| 7 | TradeIndia                     | Free                       | IT & Software Services             | Useful for backlink + B2B brand. |
| 8 | LinkedIn Company Page          | Free                       | Software Development               | NAP must match exactly; set HQ to Mohali. |
| 9 | Facebook Business Page         | Free                       | Software Company                   | Don't post here daily — just keep NAP correct + monthly post. |
| 10 | Clutch.co                     | Free profile (paid leads)  | Mobile App Development             | Agency-buyer-grade reviews. Worth paid plan once 5+ Clutch reviews exist. |
| 11 | GoodFirms                     | Free profile (paid tier)   | Software Development               | Same audience as Clutch. Free tier is fine. |
| 12 | The Manifest                  | Free                       | Software Development Companies     | Sister brand of Clutch — listing is automatic if Clutch is set up. |

### Audit cadence

Run a NAP audit once per quarter: search the business name on Google and
verify that the top 20 results all show identical name/address/phone. Fix
drift in the source listing.

---

## 3. Reviews Strategy

Reviews drive both ranking (proximity, prominence, relevance — the three
GBP ranking factors) and conversion.

### Volume targets

| Quarter | Cumulative Google reviews |
|---------|---------------------------|
| Q1      | 6                         |
| Q2      | 12                        |
| Q3      | 20                        |
| Q4      | 30+                       |

### Process

1. Ship the project, wait 7 days for production usage.
2. Founder sends personal WhatsApp via `/admin/request-review`.
3. If no review in 14 days, send one polite follow-up.
4. If still none, drop it. Never nag.

### Diversification

80% Google · 10% Clutch · 10% LinkedIn recommendations. Ask one client per
quarter for a 1-min phone-shot video testimonial.

### Negative reviews

Reply within 4 hours, professionally, with a path to resolution. Never
argue. Take it offline ("DM'd you on WhatsApp — let's get this fixed.").
Document root cause and update this playbook.

---

## 4. Backlinks

The slowest-moving and highest-impact SEO lever. Aim for **1–2 quality
dofollow links per month**.

### 15 backlink targets

Each target lists the pitch angle that has the highest acceptance rate
based on what these outlets actually publish.

| # | Target                                  | Type                | Pitch angle |
|---|-----------------------------------------|---------------------|-------------|
| 1  | YourStory                              | Indian startup media | Founder story: "Building a senior-only software studio in Tier-2 Punjab without VC funding". |
| 2  | Inc42                                  | Indian startup media | Data-led: "Why 60% of Tricity service businesses still don't have an app — and what's changing in 2026". |
| 3  | The Better India                       | Indian feature media | Impact angle: "How one Mohali studio digitised 12+ family-run salons and clinics". |
| 4  | LBB Chandigarh                         | Lifestyle / city blog | Showcase the Quasar Salon app as a Chandigarh "best of" digital experience. |
| 5  | Tricity News / Chandigarh Metro        | Local news           | Press release on a free workshop you host (see content calendar Q3). |
| 6  | Smashing Magazine                      | Global dev media     | Engineering write-up: "Server-side rendered React + lead-magnet email capture without JS frameworks". |
| 7  | CSS-Tricks                             | Global dev media     | Code piece on the alt-text audit + WebP build pipeline shipped here. |
| 8  | Dev.to                                 | Dev community        | Cross-post every blog post under your founder profile (canonical back to EDS). |
| 9  | Hacker News                            | Submission           | Submit the open-sourced calculator package (Tactic 2 below). Aim for "Show HN". |
| 10 | Product Hunt                           | Submission           | Launch the open-sourced calculator + a hosted demo. |
| 11 | TiE Chandigarh blog                    | Local entrepreneurial | Sponsor or speak at a TiE Chandigarh event in exchange for a recap blog backlink. |
| 12 | Chandigarh Angels Network              | Local angel network  | Apply to present at a CAN office hours, write the post-event recap. |
| 13 | Punjab University CSE department blog  | `.edu.in`            | Sponsor a ₹25k hackathon prize for a `.edu.in` link from the event page. |
| 14 | Thapar Institute placement blog        | `.edu.in`            | Internship-program announcement → backlink from the placement page. |
| 15 | Awesome-india / awesome-react GitHub lists | Open-source     | Submit the open-sourced calculator package via PR; included in awesome lists for permanent backlinks. |

### Anchor-text policy

- 60% branded ("Everyday Digital Solutions", "EDS", domain).
- 30% generic ("this article", "case study", "their team").
- 10% partial-match ("Mohali app developer EDS", "AI voice agent studio").
- **Never** exact-match anchor more than 1 in 50 links. Triggers Penguin.

### What NOT to do

- ❌ Buy backlinks from Fiverr / private blog networks.
- ❌ Comment-spam on blogs.
- ❌ Submit to free directories with DR < 20.
- ❌ Reciprocal exchanges with unrelated sites.

---

## 5. Content Calendar — quarterly (12 posts)

A 12-month rolling calendar of 12 long-form blog posts (one per month) keyed
to the four ranking themes: city + service, industry + outcome, buyer
education, behind-the-scenes. Each row lists the **target keyword cluster**
and the **realistic monthly traffic estimate** at month 12 from organic
search alone (based on Ahrefs SERP analysis of equivalent posts on competing
Indian agency sites in Q1 2026).

| Q | Month | Title | Target keyword(s) | Search volume / mo (IN) | Traffic est. by m12 |
|---|-------|-------|-------------------|------------------------|----------------------|
| Q1 | M1 (Jun) | How much does an app cost in India in 2026 | "app development cost india", "mobile app cost india" | 2,400 | 350 |
| Q1 | M2 (Jul) | App developer in Mohali — a 2026 buyer's guide | "app developer mohali", "mobile app development mohali" | 480 | 120 |
| Q1 | M3 (Aug) | AI voice agent vs human receptionist in Punjab clinics | "ai voice agent india", "ai receptionist clinic" | 720 | 90 |
| Q2 | M4 (Sep) | How a Chandigarh salon moved 60% of bookings digital in 30 days | "salon booking app chandigarh", "salon app india" | 590 | 140 |
| Q2 | M5 (Oct) | WhatsApp Business API for clinics in Mohali — cost, setup, ROI | "whatsapp business api india", "whatsapp api clinic" | 1,800 | 220 |
| Q2 | M6 (Nov) | Custom software vs SaaS for Indian SMBs in 2026 | "custom software vs saas", "custom software india" | 880 | 110 |
| Q3 | M7 (Dec) | AI agency in Chandigarh — what to look for in 2026 | "ai agency chandigarh", "ai company chandigarh" | 320 | 80 |
| Q3 | M8 (Jan) | How real estate brokers in Mohali use AI for lead qualification | "real estate ai india", "real estate crm india" | 1,100 | 130 |
| Q3 | M9 (Feb) | Custom CRM vs HubSpot — which one is right for your Punjab service business | "custom crm india", "hubspot vs custom crm" | 900 | 95 |
| Q4 | M10 (Mar) | What we learned shipping 12 apps in Punjab in 2 years | "case study mobile app india" | 240 | 60 |
| Q4 | M11 (Apr) | App developer in Jalandhar — the 2026 short list | "app developer jalandhar", "software company jalandhar" | 210 | 70 |
| Q4 | M12 (May) | Year in review — Tricity's digitisation in 12 charts | "punjab digital business", branded | branded | 200 |

**Total month-12 organic estimate from these 12 posts alone: ~1,665 sessions/month.**
Combined with the locality pages, the homepage, and tools, the realistic
year-1 organic ceiling is 5,000 sessions/month if cadence holds.

### Distribution per post

Every post must be:

1. Published with full schema (handled by `SEO.tsx`).
2. Cross-posted to GBP "What's new" within 24 hours.
3. Posted as a LinkedIn carousel within 48 hours.
4. Cross-posted to dev.to with canonical pointing back to EDS.
5. Sent to the email subscriber list when it crosses 100 subscribers.

### Weekly cadence (lightweight, in addition to the monthly post)

| Day | Channel | Output |
|-----|---------|--------|
| Mon | LinkedIn | Project highlight (anonymised), 150 words |
| Tue | GBP post | "What's new" linking to a service or locality page |
| Wed | Blog | Long-form post (1 per month) goes live this day |
| Thu | Instagram + GBP photo | Behind-the-scenes shot |
| Fri | LinkedIn | Educational post linking to the new blog post |

---

## On-page checklist (already shipped — verify monthly)

- [x] Global Organization schema (LinkedIn / Instagram / GBP / WhatsApp `sameAs`, `contactPoint`) on every page via `SEO.tsx`
- [x] LocalBusiness + AggregateRating + Review schema on home
- [x] AggregateRating + Review on `/work/quasar-salon`
- [x] BreadcrumbList JSON-LD auto-derived from canonical for every non-home route via `SEO.tsx`
- [x] SoftwareApplication schema on both `/tools/*`
- [x] FAQ schema on locality pages and homepage
- [x] `/sitemap.xml` includes all locality and tool pages (31 URLs)
- [x] Plausible analytics + custom goals: `LeadSubmitted`, `AppCostGuideDownload`, `AppCostCalculatorEmail`, `AppCostCalculatorUsed`, `AIVoiceROICalculatorEmail`, `AIVoiceROICalculatorUsed`, `RequestReviewSent`
- [x] `GOOGLE_SITE_VERIFICATION` (and `VITE_GOOGLE_SITE_VERIFICATION`) env wired into `<head>`
- [x] WebP variants generated for every raster image at build time (`build-scripts/optimize-images.mjs`); served via `<picture>` fallback (`OptimizedImage`)
- [x] Alt-text audit blocks the build — `pnpm --filter @workspace/scripts run check-alt-text`
- [ ] Verify property in Google Search Console (paste meta token into env, deploy, click "Verify" in GSC).
- [ ] Submit `https://everydaydigitalsolutions.com/sitemap.xml` to GSC and Bing Webmaster Tools.
- [ ] Set the GBP profile to verified (postcard or video).

---

## Measurement

Single dashboard, reviewed monthly:

| Metric | Source | Target by month 12 |
|--------|--------|--------------------|
| Organic sessions | Plausible | 5,000 / month |
| Branded searches | GSC | 800 / month |
| GBP profile views | GBP Insights | 3,000 / month |
| GBP direction clicks | GBP Insights | 80 / month |
| Google reviews | GBP | 30+ |
| `LeadSubmitted` events | Plausible | 40 / month |
| `AppCostGuideDownload` + tool email captures | Plausible | 100 / month |
| Domain Rating | Ahrefs / Moz | DR 30 |

If a metric is flat for 2 consecutive months, change one variable in this
playbook and document the change in `replit.md`.
