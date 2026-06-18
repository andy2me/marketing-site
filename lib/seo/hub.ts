// JSON-LD for a Suburb Hub (design handoff §7 / SeoNote table).
// Place schema localises the page geographically; BreadcrumbList anchors it in
// the geographic-first IA (Home → Locations → Suburb).

import type { SuburbHub } from "@/lib/suburbs/types";

export function placeJsonLd(hub: SuburbHub, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: hub.name,
    description: hub.hero.intro,
    address: {
      "@type": "PostalAddress",
      addressLocality: hub.name,
      addressRegion: "QLD",
      postalCode: hub.postcode,
      addressCountry: "AU",
    },
    url: `${siteUrl}/${hub.slug}`,
  };
}

export function hubBreadcrumbJsonLd(siteUrl: string, hub: SuburbHub) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Locations",
        item: `${siteUrl}/locations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hub.name,
        item: `${siteUrl}/${hub.slug}`,
      },
    ],
  };
}
