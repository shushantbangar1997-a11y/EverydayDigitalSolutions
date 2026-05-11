import { Helmet } from "react-helmet-async";

const SITE_NAME = "Everyday Digital Solutions";
const BASE_URL = "https://everydaydigitalsolutions.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.jpg`;
const DEFAULT_DESCRIPTION =
  "Senior-led custom software, AI voice agents, and automation systems for ambitious service businesses. Studio based in Mohali, Punjab — built with precision, shipped in 30 days.";

const GOOGLE_SITE_VERIFICATION =
  (typeof process !== "undefined" && process.env && process.env.GOOGLE_SITE_VERIFICATION) ||
  (typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string> }).env?.VITE_GOOGLE_SITE_VERIFICATION) ||
  "";

/**
 * Global Organization schema — emitted on EVERY page so search engines
 * always have a consistent root entity (LinkedIn / Instagram / GBP /
 * WhatsApp contactPoint). Page-level schemas (LocalBusiness on home,
 * Article on blog posts, etc.) are layered on top via the `jsonLd`
 * prop.
 */
const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  "name": SITE_NAME,
  "url": BASE_URL,
  "logo": `${BASE_URL}/logo.png`,
  "image": DEFAULT_OG_IMAGE,
  "description": DEFAULT_DESCRIPTION,
  "founder": {
    "@type": "Person",
    "name": "Shushant Bangar",
    "jobTitle": "Founder & Principal Engineer",
  },
  "foundingDate": "2018",
  "areaServed": [
    { "@type": "City", "name": "Chandigarh" },
    { "@type": "City", "name": "Mohali" },
    { "@type": "City", "name": "Panchkula" },
    { "@type": "City", "name": "Jalandhar" },
    { "@type": "State", "name": "Punjab" },
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "telephone": "+91-9056066006",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi", "pa"],
    },
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "url": "https://wa.me/919056066006",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi", "pa"],
    },
  ],
  "sameAs": [
    "https://www.linkedin.com/company/everyday-digital-solutions",
    "https://www.linkedin.com/in/shushantbangar",
    "https://www.instagram.com/everydaydigitalsolutions",
    "https://g.page/everyday-digital-solutions",
    "https://wa.me/919056066006",
  ],
};

interface JsonLdObject {
  [key: string]: unknown;
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  jsonLd?: JsonLdObject | JsonLdObject[];
  /**
   * If provided, a BreadcrumbList JSON-LD is auto-emitted alongside
   * the page-level schemas. The first item is typically `{ name: "Home", path: "/" }`.
   */
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
}

function makeBreadcrumbList(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": `${BASE_URL}${item.path}`,
    })),
  };
}

function titleizeSegment(segment: string): string {
  // "ai-voice-agents" → "AI Voice Agents"; "phase-8b-it-park" → "Phase 8b IT Park".
  return segment
    .split("-")
    .map((w) => {
      if (!w) return w;
      const upper = w.toUpperCase();
      if (["AI", "ROI", "IT", "EDS", "GBP"].includes(upper)) return upper;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

/**
 * Derive a sensible BreadcrumbList from the canonical URL when the
 * page didn't pass one explicitly. `/services/ai-voice-agents` →
 * `Home › Services › AI Voice Agents`. The home page (`/` or empty)
 * skips breadcrumbs entirely (a 1-item breadcrumb is noise).
 */
function deriveBreadcrumbs(canonical: string | undefined): BreadcrumbItem[] {
  if (!canonical || canonical === "/" || canonical === "") return [];
  const segments = canonical.split("/").filter(Boolean);
  if (segments.length === 0) return [];
  const items: BreadcrumbItem[] = [{ name: "Home", path: "/" }];
  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    items.push({ name: titleizeSegment(seg), path: acc });
  }
  return items;
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  breadcrumbs,
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} — ${SITE_NAME}`;
  const canonicalUrl = canonical
    ? `${BASE_URL}${canonical}`
    : BASE_URL;

  const userJsonLd: JsonLdObject[] = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  const effectiveBreadcrumbs =
    breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : deriveBreadcrumbs(canonical);

  // On noindex/private routes (e.g. /admin) we suppress structured data
  // entirely so we don't pollute the crawl graph with admin-only entities.
  const allJsonLd: JsonLdObject[] = noindex
    ? []
    : [
        ORGANIZATION_SCHEMA,
        ...(effectiveBreadcrumbs.length > 0 ? [makeBreadcrumbList(effectiveBreadcrumbs)] : []),
        ...userJsonLd,
      ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {allJsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
