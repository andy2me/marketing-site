// JSON-LD for property profiles (handoff §"Structured data").
//
// Three builders:
//   - apartmentComplexJsonLd  → complex profile (schema.org/ApartmentComplex)
//   - apartmentJsonLd         → unit profile (schema.org/Apartment), with
//                               containedInPlace pointing to its complex and
//                               an array of RealEstateListing events from the
//                               unit's history
//   - propertyBreadcrumbJsonLd → BreadcrumbList for both pages
//
// Validated via Google's Rich Results Test before launch (M12 checklist).

import type {
  AttributionAgency,
  ComplexEvent,
  ComplexProfile,
  ComplexUnit,
  EventType,
  UnitDetail,
} from "@/lib/complexes/types";

// Map our EventType → schema.org event-status convention. Listings use
// EventScheduled (the listing is "live"); sold/rented use a closing status.
function eventStatus(type: EventType): string {
  switch (type) {
    case "listed":
      return "https://schema.org/EventScheduled";
    case "sold":
      return "https://schema.org/EventCompleted"; // dwelling transferred
    case "rented":
      return "https://schema.org/EventCompleted"; // lease commenced
  }
}

function offerName(type: EventType): string {
  switch (type) {
    case "listed":
      return "For sale";
    case "sold":
      return "Sale";
    case "rented":
      return "Lease";
  }
}

function seller(agency: AttributionAgency) {
  // Spec: "seller" is the agency on record. For competitors we keep it as a
  // plain string Organisation with a name only (matches the no-logos / no-
  // links attribution rule, just structured for crawlers).
  return {
    "@type": "Organization",
    name: agency.name,
  };
}

// Best-effort numeric extraction from "$1,485,000" / "$980 / week" — strips
// non-digits and returns the first integer found. Returns null when the
// string carries no number (extremely unlikely with our data, but safe).
function priceAmount(price: string): number | null {
  const m = /(\d[\d,]*)/.exec(price);
  if (!m) return null;
  const n = Number.parseInt(m[1].replace(/,/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function eventToListing(
  event: Pick<ComplexEvent, "type" | "price" | "date" | "agency"> & {
    featuredIn?: ReadonlyArray<string>;
  },
) {
  const amount = priceAmount(event.price);
  return {
    "@type": "RealEstateListing",
    name: `${offerName(event.type)} · ${event.date}`,
    eventStatus: eventStatus(event.type),
    startDate: event.date, // Display string; the live feed will give us ISO dates.
    offers: amount
      ? {
          "@type": "Offer",
          price: amount,
          priceCurrency: "AUD",
          seller: seller(event.agency),
        }
      : {
          "@type": "Offer",
          seller: seller(event.agency),
        },
  };
}

function address(profile: ComplexProfile) {
  return {
    "@type": "PostalAddress",
    streetAddress: profile.street,
    addressLocality: profile.suburbName,
    addressRegion: profile.state,
    postalCode: profile.suburbPostcode,
    addressCountry: "AU",
  };
}

function geo(profile: ComplexProfile) {
  return {
    "@type": "GeoCoordinates",
    latitude: profile.geo.lat,
    longitude: profile.geo.lng,
  };
}

// Pull a number from "112m²" / "168m²".
function areaSqm(area: string): number | null {
  const m = /(\d+)/.exec(area);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

export function apartmentComplexJsonLd(
  profile: ComplexProfile,
  siteUrl: string,
) {
  const canonical = `${siteUrl}/property/${profile.suburbSlug}/${profile.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: `${profile.name}, ${profile.suburbName}`,
    description: profile.intro,
    url: canonical,
    address: address(profile),
    geo: geo(profile),
    numberOfAccommodationUnits: profile.stats.totalUnits,
  };
}

export function apartmentJsonLd(
  profile: ComplexProfile,
  unit: ComplexUnit,
  detail: UnitDetail | null,
  siteUrl: string,
) {
  const complexUrl = `${siteUrl}/property/${profile.suburbSlug}/${profile.slug}`;
  const canonical = `${complexUrl}/${unit.id}`;
  const sqm = areaSqm(unit.area);
  const history = detail?.history?.length
    ? detail.history
    : profile.events
        .filter((e) => e.unit === unit.number)
        .map((e) => ({
          type: e.type,
          price: e.price,
          date: e.date,
          agency: e.agency,
          featuredIn: e.featuredIn,
        }));
  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: `Unit ${unit.number}, ${profile.name}`,
    url: canonical,
    numberOfRooms: unit.beds,
    numberOfBathroomsTotal: unit.baths,
    floorSize:
      sqm !== null
        ? { "@type": "QuantitativeValue", value: sqm, unitCode: "MTK" } // MTK = m²
        : undefined,
    address: address(profile),
    geo: geo(profile),
    containedInPlace: {
      "@type": "ApartmentComplex",
      name: profile.name,
      url: complexUrl,
    },
    subjectOf: history.map(eventToListing),
  };
}

export function propertyBreadcrumbJsonLd(
  siteUrl: string,
  profile: ComplexProfile,
  unit?: ComplexUnit,
) {
  const items: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: profile.suburbName,
      item: `${siteUrl}/${profile.suburbSlug}`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: profile.name,
      item: `${siteUrl}/property/${profile.suburbSlug}/${profile.slug}`,
    },
  ];
  if (unit) {
    items.push({
      "@type": "ListItem",
      position: 4,
      name: `Unit ${unit.number}`,
      item: `${siteUrl}/property/${profile.suburbSlug}/${profile.slug}/${unit.id}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
