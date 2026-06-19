import type {
  Inspection,
  Listing,
  ListingAgent,
  ListingCard,
  ListingStatus,
  PropertyType,
} from "./types";

type RexNullable<T> = T | null | undefined;
type RexBoolish = "0" | "1" | 0 | 1 | true | false | null | undefined;

export type RexImage = {
  url: string;
  thumbs?: Record<string, string>;
  dimensions?: string;
  priority?: number;
};

export type RexAgent = {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email_address?: RexNullable<string>;
  phone_direct?: RexNullable<string>;
  phone_mobile?: RexNullable<string>;
  position?: RexNullable<string>;
  profile_image?: RexNullable<RexImage>;
};

export type RexAddress = {
  latitude?: RexNullable<string>;
  longitude?: RexNullable<string>;
  unit_number?: RexNullable<string>;
  street_number?: RexNullable<string>;
  street_name?: RexNullable<string>;
  suburb_or_town?: RexNullable<string>;
  state_or_region?: RexNullable<string>;
  postcode?: RexNullable<string>;
  hide_address?: RexBoolish;
  formats?: {
    street_name_number?: RexNullable<string>;
    street_name_number_w_suburb?: RexNullable<string>;
    full_address?: RexNullable<string>;
  };
};

export type RexAttributes = {
  bedrooms?: RexNullable<string | number>;
  bathrooms?: RexNullable<string | number>;
  ensuites?: RexNullable<string | number>;
  garages?: RexNullable<string | number>;
  carports?: RexNullable<string | number>;
  open_spaces?: RexNullable<string | number>;
  total_car_accom?: RexNullable<string | number>;
  buildarea?: RexNullable<string | number>;
  buildarea_m2?: RexNullable<string | number>;
  landarea?: RexNullable<string | number>;
  landarea_m2?: RexNullable<string | number>;
};

export type RexEvent = {
  id?: string | number;
  event_type?: "auction" | "open_home" | string;
  event_type_display?: string;
  event_date?: string;
  event_time_start?: string;
  event_time_end?: string;
  event_datetime_start?: string;
  event_datetime_end?: string;
  event_venue?: RexNullable<string>;
};

export type RexAdvertInternet = { heading?: RexNullable<string>; body?: RexNullable<string> };

export type RexLink = { link_type?: string; link_url?: string };

export type RexPublishedListing = {
  // Normal search responses return `id`; etags-format responses return `_id`. Accept both.
  id?: string | number;
  _id?: string | number;
  property_id?: RexNullable<string>;
  system_listing_state?: "current" | "sold" | "leased" | "withdrawn" | string;
  system_publication_timestamp?: RexNullable<string>;
  listing_category_id?: RexNullable<string>;
  listing_category?: RexNullable<string>;
  listing_sale_or_rental?: RexNullable<"Sale" | "Rent" | string>;
  state_value_price?: RexNullable<string | number>;
  state_value_price_display?: RexNullable<string>;
  state_hide_price?: RexBoolish;
  under_contract?: RexBoolish;
  address?: RexAddress;
  attributes?: RexAttributes;
  listing_agent_1?: RexNullable<RexAgent>;
  listing_agent_2?: RexNullable<RexAgent>;
  subcategories?: string[];
  advert_internet?: RexAdvertInternet;
  images?: RexImage[];
  floorplans?: RexImage[];
  links?: RexLink[];
  events?: RexEvent[];
  features?: string[];
  meta?: Record<string, RexNullable<string>>;
};

const PROPERTY_TYPE_FROM_SUBCATEGORY: Record<string, PropertyType> = {
  House: "House",
  Townhouse: "Townhouse",
  Unit: "Apartment",
  Apartment: "Apartment",
  Studio: "Apartment",
  Land: "Land",
  "Vacant Land": "Land",
};

const kebab = (s: string): string =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const toInt = (v: RexNullable<string | number>): number => {
  if (v == null || v === "") return 0;
  const n = typeof v === "number" ? v : parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};

const toIntOrNull = (v: RexNullable<string | number>): number | null => {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

const truthyBool = (v: RexBoolish): boolean => v === true || v === "1" || v === 1;

const ensureHttps = (url: string): string => (url.startsWith("//") ? `https:${url}` : url);

/** Rex returns suburb_or_town in ALL CAPS (e.g. "NOOSAVILLE"). Convert to Title Case while
 *  leaving the state (QLD) and postcode digits untouched downstream. */
const toTitleCase = (s: string): string =>
  s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());

/** Drop a trailing ".00" from Rex's price display so $1,075,000.00 → $1,075,000.
 *  Keeps cents when non-zero (e.g. "$995,000.50" is left alone). */
const stripZeroCents = (s: string): string => s.replace(/\.00(?!\d)/g, "");

const rexId = (rex: RexPublishedListing): string => String(rex.id ?? rex._id ?? "");

function deriveStreet(addr: RexAddress | undefined): string {
  if (!addr) return "";
  if (addr.formats?.street_name_number) return addr.formats.street_name_number;
  return [addr.unit_number, addr.street_number, addr.street_name]
    .filter((p): p is string => Boolean(p))
    .join(" ")
    .trim();
}

function deriveSuburb(addr: RexAddress | undefined): string {
  if (!addr) return "";
  const town = addr.suburb_or_town ? toTitleCase(addr.suburb_or_town) : "";
  return [town, addr.state_or_region, addr.postcode]
    .filter((p): p is string => Boolean(p))
    .join(" ")
    .trim();
}

export function deriveSlug(rex: RexPublishedListing): string {
  const id = rexId(rex);
  const street = deriveStreet(rex.address);
  const suburb = rex.address?.suburb_or_town ?? "";
  const base = [street, suburb].filter(Boolean).map(kebab).filter(Boolean).join("-");
  return base ? `${base}-${id}` : `listing-${id}`;
}

function deriveStatus(rex: RexPublishedListing): ListingStatus {
  const state = rex.system_listing_state;
  if (state === "sold" || state === "leased") return "Sold";
  if (truthyBool(rex.under_contract)) return "Under Offer";
  if (rex.events?.some((e) => e.event_type === "auction")) return "Auction";
  return "For Sale";
}

function derivePropertyType(rex: RexPublishedListing): PropertyType {
  const sub = rex.subcategories?.find((s) => s in PROPERTY_TYPE_FROM_SUBCATEGORY);
  return sub ? PROPERTY_TYPE_FROM_SUBCATEGORY[sub] : "House";
}

function formatNextAuctionEvent(events: RexEvent[] | undefined): string | undefined {
  const next = events
    ?.filter((e) => e.event_type === "auction" && e.event_datetime_start)
    .sort((a, b) => (a.event_datetime_start! < b.event_datetime_start! ? -1 : 1))[0];
  if (!next) return undefined;
  const d = new Date(next.event_datetime_start!);
  if (Number.isNaN(d.getTime())) return undefined;
  const day = d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
  return `Auction · ${day}`;
}

function derivePriceDisplay(rex: RexPublishedListing, status: ListingStatus): string {
  if (truthyBool(rex.state_hide_price)) return "Contact Agent";
  const display = rex.state_value_price_display?.trim();
  const clean = display ? stripZeroCents(display) : "";
  if (status === "Auction") return formatNextAuctionEvent(rex.events) ?? (clean || "Auction");
  if (status === "Sold") return clean ? `Sold · ${clean}` : "Sold";
  return clean || "Contact Agent";
}

function derivePriceValue(rex: RexPublishedListing): number | null {
  if (truthyBool(rex.state_hide_price)) return null;
  return toIntOrNull(rex.state_value_price);
}

function deriveCoords(addr: RexAddress | undefined): { lat: number; lng: number } | null {
  if (!addr?.latitude || !addr?.longitude) return null;
  const lat = parseFloat(addr.latitude);
  const lng = parseFloat(addr.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function deriveCars(attr: RexAttributes | undefined): number {
  if (!attr) return 0;
  const total = toIntOrNull(attr.total_car_accom);
  if (total !== null) return total;
  return toInt(attr.garages) + toInt(attr.carports) + toInt(attr.open_spaces);
}

function deriveLand(attr: RexAttributes | undefined): string {
  const m2 = toIntOrNull(attr?.landarea_m2);
  if (m2) return `${m2.toLocaleString("en-AU")}m²`;
  const raw = toIntOrNull(attr?.landarea);
  return raw ? `${raw.toLocaleString("en-AU")}m²` : "—";
}

function deriveImage(rex: RexPublishedListing): string | null {
  const first = rex.images?.[0]?.url;
  return first ? ensureHttps(first) : null;
}

function deriveGallery(rex: RexPublishedListing): string[] {
  return (rex.images ?? []).map((img) => ensureHttps(img.url)).filter(Boolean);
}

function deriveFloorplan(rex: RexPublishedListing): string | undefined {
  const first = rex.floorplans?.[0]?.url;
  return first ? ensureHttps(first) : undefined;
}

function findLinkByType(rex: RexPublishedListing, match: RegExp): string | undefined {
  const link = rex.links?.find((l) => l.link_type && match.test(l.link_type) && l.link_url);
  return link?.link_url ? ensureHttps(link.link_url) : undefined;
}

function deriveAgent(rex: RexPublishedListing): ListingAgent {
  const a = rex.listing_agent_1;
  if (!a) return { id: "unknown", name: "Max Property", photo: null };
  return {
    id: a.id,
    name: a.name,
    photo: a.profile_image?.url ? ensureHttps(a.profile_image.url) : null,
    role: a.position ?? undefined,
  };
}

function deriveInspections(events: RexEvent[] | undefined): Inspection[] {
  if (!events?.length) return [];
  return events
    .filter((e) => e.event_type === "open_home" && e.event_date)
    .map((e) => {
      const d = new Date(`${e.event_date}T${e.event_time_start ?? "00:00:00"}`);
      const day = Number.isNaN(d.getTime())
        ? ""
        : d.toLocaleDateString("en-AU", { weekday: "short" });
      const date = Number.isNaN(d.getTime())
        ? (e.event_date ?? "")
        : d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
      const time =
        e.event_time_start && e.event_time_end
          ? `${e.event_time_start.slice(0, 5)} – ${e.event_time_end.slice(0, 5)}`
          : (e.event_time_start?.slice(0, 5) ?? "");
      return { day, date, time, type: e.event_type_display ?? "Open home" };
    });
}

function deriveNextOpen(events: RexEvent[] | undefined): string | undefined {
  const inspections = deriveInspections(events);
  if (!inspections.length) return undefined;
  const next = inspections[0];
  return `Open · ${next.day} ${next.date} · ${next.time}`;
}

function deriveRef(rex: RexPublishedListing): string {
  const suburb = rex.address?.suburb_or_town ?? "";
  const tag = suburb ? suburb.slice(0, 3).toUpperCase() : "MAX";
  return `MX-${rexId(rex)}-${tag}`;
}

export function mapPublishedListingToCard(rex: RexPublishedListing): ListingCard | null {
  const coords = deriveCoords(rex.address);
  if (!coords) return null;
  const status = deriveStatus(rex);
  const attrs = rex.attributes;
  return {
    id: rexId(rex),
    slug: deriveSlug(rex),
    image: deriveImage(rex),
    status,
    price: derivePriceDisplay(rex, status),
    priceValue: derivePriceValue(rex),
    street: deriveStreet(rex.address),
    suburb: deriveSuburb(rex.address),
    beds: toInt(attrs?.bedrooms),
    baths: toInt(attrs?.bathrooms),
    cars: deriveCars(attrs),
    land: deriveLand(attrs),
    type: derivePropertyType(rex),
    agent: deriveAgent(rex),
    coords,
  };
}

export function mapPublishedListingToDetail(rex: RexPublishedListing): Listing | null {
  const card = mapPublishedListingToCard(rex);
  if (!card) return null;
  const body = rex.advert_internet?.body ?? "";
  const description = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const suburb = rex.address?.suburb_or_town ? toTitleCase(rex.address.suburb_or_town) : "";
  const overviewHeading =
    rex.advert_internet?.heading?.trim() ||
    `A considered ${card.type.toLowerCase()} in the heart of ${suburb || "Noosa"}.`;
  return {
    ...card,
    gallery: deriveGallery(rex),
    nextOpen: deriveNextOpen(rex.events),
    overviewHeading,
    description: description.length ? description : [body || ""].filter(Boolean),
    features: rex.features ?? [],
    inspections: deriveInspections(rex.events),
    floorArea: toIntOrNull(rex.attributes?.buildarea_m2)
      ? `${toIntOrNull(rex.attributes?.buildarea_m2)}m²`
      : undefined,
    videoTour: findLinkByType(rex, /video/i),
    walkthrough: findLinkByType(rex, /virtual|3d|tour|matterport/i),
    floorplan: deriveFloorplan(rex),
    ref: deriveRef(rex),
    distances: [],
  };
}
