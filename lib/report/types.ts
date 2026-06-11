// Max Property — Appraisal Builder report types (design handoff "Property data schema").
//
// This is the AUTHORING CONTRACT for a vendor appraisal page. One Report = one property's
// proposal. The Cowork → Claude Code pipeline collects these fields; per-property data lives
// as a typed file in data/reports/{slug}.ts and is read through lib/report/store.ts.
//
// Values are display strings where the prototype showed pre-formatted figures (e.g. "$1.65M",
// "+8.2% YoY") — formatting is the author's responsibility, mirroring the design. Numeric
// series feed the charts (lib charts in components/report/Charts.tsx).

/** Feature-colour tokens used for data-driven theming (buyer segments, phase cards, accent). */
export type BrandTone =
  | "fern"
  | "clay"
  | "mulberry"
  | "ember"
  | "sunrise"
  | "lime";

export type Vendor = {
  firstName: string;
  lastName: string;
  /** Full salutation, e.g. "Catherine & David Hoffmann". */
  fullName: string;
  /** Captured post-gate; never required at generation. Persisted client-side + dispatched. */
  emailCaptured?: string;
};

export type AgentSale = { addr: string; price: string; days: number };

export type Agent = {
  name: string;
  /** e.g. "Principal · Noosaville patch". */
  role: string;
  phone: string;
  email: string;
  bio: string;
  /** 4:5 portrait. null/undefined → striped placeholder. */
  portraitUrl?: string | null;
  recent: AgentSale[];
};

/** A single cell in the welcome "At a glance" facts strip. When `Property.facts` is set, it
 *  replaces the default 5-cell strip derived from beds/baths/cars/internal/outdoor. */
export type PropertyFactIcon = "bed" | "bath" | "car" | "area";
export type PropertyFact = {
  icon: PropertyFactIcon;
  /** Big numeral / value (e.g. 4, "635m²", "None"). */
  v: string | number;
  /** Small uppercase label (e.g. "Bedrooms", "Land", "Garage"). */
  l: string;
};

export type Property = {
  street: string; // "17/140 Noosa Parade"
  suburb: string; // "Noosaville"
  state: string; // "QLD"
  postcode: string; // "4566"
  type: string; // "Apartment · river-front"
  beds: number;
  baths: number;
  cars: number;
  /** Internal floor area (e.g. "162m²"). Omit when not supplied by the data source. */
  internal?: string;
  /** Outdoor / terrace (e.g. "38m²"). Omit when not applicable. */
  outdoor?: string;
  /** Override the auto-derived 5-cell facts strip with a bespoke list (e.g. include "Land"
   *  or "Pool" instead of internal m²). When absent, beds/baths/cars/internal/outdoor are used. */
  facts?: PropertyFact[];
  /** Serif overture quote, one sentence. */
  overture: string;
  /** 1–2 sentence prose intro. */
  blurb: string;
  features: string[]; // 4–8 bullets
  heroUrl?: string | null;
  galleryUrls?: string[];
};

export type Market = {
  suburb: string;
  segment: string; // "Apartments · 3 bed"
  median: string; // "$1.65M"
  medianChange: string; // "+8.2% YoY"
  medianSeries: number[]; // 24 monthly values in $M
  dom: number; // median days on market
  domChange: string; // "−9 days vs metro"
  domSeries: number[]; // 8 quarterly values
  searchVolume: number; // enquiries / month
  searchChange: string; // "+38% YoY"
  searchSeries: number[]; // 12 monthly values
  inventory: number; // active listings
  monthsSupply: number; // months of supply
  clearanceRate: number; // % (shown in the desktop demand band)
  indicativeRangeLow: string; // "$1.78M"
  indicativeRangeHigh: string; // "$1.92M"
};

export type Comp = {
  addr: string;
  suburb: string;
  price: string;
  beds: number;
  baths: number;
  cars: number;
  /** Days on market. Omit when not supplied (some sources only give the sold date). */
  days?: number;
  sold: string; // "Apr 2026"
  imageUrl?: string | null;
};

export type BuyerSegment = {
  pct: number;
  label: string;
  detail: string;
  tone: BrandTone;
};

export type Buyer = {
  headline: string;
  /** Stacked-bar + cards; should sum to ~100. */
  segments: BuyerSegment[];
  /** Caption under the stacked bar, e.g. "n = 286". */
  sampleNote: string;
  /** Dark "inside our database" band — 3 signals. */
  signals: Array<{ k: string; v: string }>;
};

export type ApproachPhase = {
  n: string; // "01"
  phase: string; // "Preparing"
  weeks: string; // "Weeks 0–2"
  summary: string; // italic one-liner
  detail: string; // prose
  items: string[]; // checklist
  tone: BrandTone | "linen"; // card background
};

export type Marketing = {
  inclusions: Array<{ c: string; v: string }>; // 9 inclusions
  indicativeBudget: string; // "$11,400"
};

export type Testimonial = {
  quote: string;
  author: string;
  detail: string; // "Sold · 18 Hilltop Crescent, Noosaville · $2.65M · 21 days"
  note: string; // overline, e.g. "Vendor story · Henley · 2026"
};

export type Agency = {
  collective: Array<{ n: string; l: string }>; // 4 stats
  rating: { score: string; outOf: string; stars: number; reviews: string };
  testimonial: Testimonial;
};

export type Report = {
  // ── core identity ──────────────────────────────────────────────
  /** Stable across regenerations — the shareable URL slug. */
  slug: string;
  preparedOn: string; // "26 May 2026"
  ref: string; // "MX-AP-0517"
  /** Optional per-property accent (follows agent or positioning tone). Defaults to ember. */
  accent?: BrandTone;

  vendor: Vendor;
  agent: Agent;
  property: Property;
  market: Market;
  comps: Comp[];
  buyer: Buyer;
  approach: ApproachPhase[];
  marketing: Marketing;
  agency: Agency;
};

// ── Section model — 8 independently-routed sections ──────────────────────
export type SectionId =
  | "welcome"
  | "market"
  | "buyer"
  | "approach"
  | "marketing"
  | "team"
  | "why"
  | "next";

export type SectionDef = {
  id: SectionId;
  /** URL segment, e.g. "the-market". */
  route: string;
  n: string; // "01"
  title: string; // short header label
  long: string; // nav label
  hint: string; // sub-label in nav
};

export const SECTIONS: SectionDef[] = [
  { id: "welcome", route: "welcome", n: "01", title: "Welcome", long: "Welcome", hint: "A first look at your apartment" },
  { id: "market", route: "the-market", n: "02", title: "The market", long: "The market", hint: "Noosaville right now" },
  { id: "buyer", route: "your-buyer", n: "03", title: "Your buyer", long: "Your buyer", hint: "Who's likely to buy this home" },
  { id: "approach", route: "approach", n: "04", title: "Approach", long: "Approach to market", hint: "How we'd run the campaign" },
  { id: "marketing", route: "marketing", n: "05", title: "Marketing", long: "Marketing", hint: "What's included" },
  { id: "team", route: "your-team", n: "06", title: "Your team", long: "Your team", hint: "Who looks after you" },
  { id: "why", route: "why-max", n: "07", title: "Why Max.", long: "Why Max.", hint: "Track record & proof" },
  { id: "next", route: "next-steps", n: "08", title: "Next steps", long: "Next steps", hint: "Where to from here" },
];

/** Resolve a URL segment ("the-market") to its section definition + index. */
export function sectionByRoute(route: string): { def: SectionDef; index: number } | null {
  const index = SECTIONS.findIndex((s) => s.route === route);
  return index === -1 ? null : { def: SECTIONS[index], index };
}

/** Map a BrandTone to its CSS custom property. */
export function toneVar(tone: BrandTone): string {
  return `var(--${tone})`;
}
