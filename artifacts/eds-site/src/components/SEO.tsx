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

interface JsonLdObject {
  [key: string]: unknown;
}

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  jsonLd?: JsonLdObject | JsonLdObject[];
  noindex?: boolean;
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} — ${SITE_NAME}`;
  const canonicalUrl = canonical
    ? `${BASE_URL}${canonical}`
    : BASE_URL;

  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

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
      {jsonLdArray.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
