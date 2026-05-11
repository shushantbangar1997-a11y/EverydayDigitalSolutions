import { Helmet } from "react-helmet-async";

const BASE_URL = "https://everydaydigitalsolutions.com";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export function BreadcrumbsJsonLd({ items }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
