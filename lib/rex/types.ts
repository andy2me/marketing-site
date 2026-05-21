// Max Property — listing types (code handoff §8)
// The app depends on THESE types, never on Rex's raw payload shape. lib/rex/mappers.ts
// (to be built when Rex access lands) maps the Rex Websites API response into these.

export type ListingStatus = "For Sale" | "Auction" | "Under Offer" | "Sold";

export type PropertyType = "House" | "Apartment" | "Townhouse" | "Land";

export type ListingAgent = {
  id: string;
  name: string;
  /** 4:5 portrait. null until real photography lands → render placeholder. */
  photo: string | null;
  role?: string;
  patch?: string;
};

export type Inspection = { day: string; date: string; time: string; type: string };

/** Shape needed for cards (index, featured grids, similar). */
export type ListingCard = {
  id: string;
  slug: string;
  /** Primary photo from Rex (typically gallery[0]). null/undefined → render placeholder. */
  image?: string | null;
  status: ListingStatus;
  /** Display string straight from Rex, e.g. "$2,450,000", "Auction · Sat 14 Jun", "Contact Agent". */
  price: string;
  street: string;
  /** Includes state + postcode, e.g. "Noosaville QLD 4566". */
  suburb: string;
  beds: number;
  baths: number;
  cars: number;
  land: string;
  type: PropertyType;
  /** Numeric price for sort/filter; null when not disclosed (Contact Agent / auction-only). */
  priceValue: number | null;
  agent: ListingAgent;
  /** REAL coordinates (not the prototype's % positions) — for MapLibre. */
  coords: { lat: number; lng: number };
  featured?: boolean;
};

/** Detail page needs more than the card. */
export type Listing = ListingCard & {
  /** Photo URLs; empty → render striped placeholders. */
  gallery: string[];
  /** e.g. "Open · Sat 24 May · 11:00 – 11:30am". */
  nextOpen?: string;
  overviewHeading: string;
  /** Body copy as paragraphs. */
  description: string[];
  features: string[];
  inspections: Inspection[];
  floorArea?: string;
  /** Listing reference, e.g. "MX-2402-NSV". */
  ref: string;
  /** Neighbourhood distances for the location block. */
  distances: { label: string; value: string }[];
};

/** Status → feature colour token (PropertyCard pill, map markers). */
export const STATUS_COLOR: Record<ListingStatus, string> = {
  "For Sale": "var(--fern)",
  Auction: "var(--ember)",
  "Under Offer": "var(--mulberry)",
  Sold: "var(--white-mist-700)",
};
