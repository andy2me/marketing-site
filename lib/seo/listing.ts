// JSON-LD for a property-detail page (code handoff §10).
import type { Listing } from "@/lib/rex/types";

export function listingJsonLd(listing: Listing, url: string) {
  const locality = listing.suburb.replace(/\s+QLD.*$/, "");
  const postcode = listing.suburb.match(/\b(\d{4})\b/)?.[1];

  return {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    name: `${listing.street}, ${locality}`,
    url,
    numberOfBedrooms: listing.beds,
    numberOfBathroomsTotal: listing.baths,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.street,
      addressLocality: locality,
      addressRegion: "QLD",
      ...(postcode ? { postalCode: postcode } : {}),
      addressCountry: "AU",
    },
    ...(listing.priceValue
      ? {
          offers: {
            "@type": "Offer",
            price: listing.priceValue,
            priceCurrency: "AUD",
            availability:
              listing.status === "Sold"
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
          },
        }
      : {}),
  };
}
