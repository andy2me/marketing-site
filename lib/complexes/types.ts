// Property-profiles types (handoff §"Entity model").
//
// A *complex* is a multi-dwelling building (The Islander is the pilot). A *unit*
// is one dwelling within. Each carries a permanent profile that accrues sale,
// listing and rental events over time. Standalone (non-complex) properties will
// use the same shape with no parent complex — out of scope for v1.

export type EventType = "sold" | "listed" | "rented";

export type EventStatus =
  | "For Sale"
  | "For Rent"
  | "Under Offer"
  | "Recently Sold"
  | "Off Market";

// Attribution rules (handoff §"Attribution rules"): Matt's own events carry the
// small ember "Max Property" tag; competitor events are credited by name only,
// never as a logo, brand colour, link, or hero photography.
export type AttributionAgency =
  | { kind: "self"; name: string }                       // Max Property
  | { kind: "competitor"; name: string };                // any other agency

// A `Report` is a quarterly/annual market report on the complex. The report
// surface itself is out of scope for v1 — these records only power the two
// wayfinding elements (handoff §"Profile ↔ Report cross-linking"):
//   • LatestReportBlock on the complex profile
//   • ReportBacklink beneath cited events on the unit timeline
export type Report = {
  id: string;                  // e.g. "q1-2026"
  title: string;               // "The Islander — Q1 2026"
  backlinkLabel: string;       // inline back-link text — "Q1 2026 report"
  date: string;                // publish date (display string)
  url: string;                 // in-site report URL ("#" while the surface is unbuilt)
  excerpt: string;             // one-line preview for the LatestReportBlock
};

// One event on the dwelling's permanent record. Newest-first wherever rendered.
export type ComplexEvent = {
  id: string;
  unit: number;                // dwelling number — see ComplexUnit.number
  type: EventType;
  status: EventStatus;
  price: string;               // pre-formatted display string ("$1,485,000", "$980 / week")
  sub: string;                 // sub-line on the card ("2 bed · 2 bath · 1 car")
  date: string;                // display string ("14 Mar 2026")
  agency: AttributionAgency;
  hero?: boolean;              // marks the headline event for the unit (gallery permitted)
  featuredIn?: string[];       // ids of Reports that cited this event (drives ReportBacklink)
};

// A single dwelling within the complex. Status + lastEvent are derived from the
// most recent event in the feed — see lib/complexes/derive.applyEventsToUnits.
export type ComplexUnit = {
  id: string;                  // "unit-12"
  number: number;              // 12
  level: string;               // "G", "1" .. "5"
  levelName: string;           // "Ground", "Level 1" ..
  beds: number;
  baths: number;
  car: number;
  area: string;                // "112m²"
  aspect: string;              // "North-east · river" | "South-west · garden"
  river: boolean;              // even unit numbers = river-facing (north-east)
  status: EventStatus;
  lastEvent: {
    type: EventType;
    price: string;
    date: string;
    agency: AttributionAgency;
  } | null;
};

// The post-event "result" panel rendered on authored unit pages. Stats are
// optional — authored Unit 12 has them; pages backed only by the live feed don't.
export type UnitResult = {
  kind: EventType;
  over: string;                // overline label ("The result", "Current listing")
  label: string;               // "Sold · 14 March 2026"
  price: string;
  agency: AttributionAgency;
  stats: ReadonlyArray<readonly [string, string]> | null;  // [["4","Registered bidders"], ...]
};

// Optional, authored deep-detail for a specific unit. Pilot ships Unit 12 only.
// Anything not provided falls back to the live `ComplexUnit` + derived data.
export type UnitDetail = {
  number: number;
  statusBadge?: EventStatus;
  headline?: string;
  gallery?: boolean;           // photography permitted (Matt's own listing/sale)
  result?: UnitResult;
  panel?: { price: string; caption: string };
  commentary?: {
    kind: "pre-event" | "post-event";
    body: string;
  };
  history?: ReadonlyArray<{
    type: EventType;
    label: string;
    price: string;
    date: string;
    agency: AttributionAgency;
    featuredIn?: string[];
  }>;
  comparables?: ReadonlyArray<number>;   // unit numbers
};

export type ComplexStats = {
  totalUnits: number;
  recentSales: number;         // rolling 24 months
  medianSale: string;          // display string ("$1.46M")
  currentListings: number;
  rentalYield: string;         // display string ("4.1%")
};

export type ComplexCommentary = {
  author: string;
  role: string;
  updated: string;             // display string ("Updated Mar 2026")
  body: ReadonlyArray<string>; // paragraphs
};

// The top-level profile of a building. Wired to live feeds (Cotality / Domain /
// Titles) post-pilot; today it's the hand-curated mock in lib/complexes/mock.ts.
export type ComplexProfile = {
  id: string;                  // "the-islander"
  slug: string;                // "the-islander"
  suburbSlug: string;          // "noosaville"
  suburbName: string;          // "Noosaville"
  suburbPostcode: string;      // "4566"
  state: string;               // "QLD"
  name: string;                // "The Islander"
  street: string;              // "187 Gympie Terrace"
  levels: ReadonlyArray<string>; // ["G", "1", "2", "3", "4", "5"]
  geo: { lat: number; lng: number };
  intro: string;               // hero intro paragraph
  stats: ComplexStats;
  commentary: ComplexCommentary;
  units: ReadonlyArray<ComplexUnit>;
  events: ReadonlyArray<ComplexEvent>;
  unitDetails: Record<number, UnitDetail>;
  reports: ReadonlyArray<Report>;
  latestReportId: string | null;        // null suppresses the LatestReportBlock entirely
};

// Buyer-interest payload for the modal — wired into the existing /api/leads
// pipeline in M8. Two kinds (complex / unit) with the same fields.
export type BuyerInterestKind = "complex" | "unit";

export type BuyerInterestPayload = {
  kind: BuyerInterestKind;
  complexId: string;           // e.g. "the-islander"
  unitNumber?: number;         // unit-level only
  name: string;
  email: string;
  phone: string;
  budgetRange?: string;
  timeframe?: string;
  note?: string;
};
