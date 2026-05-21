// Max Property — MOCK listings behind the Rex seam (code handoff §8).
// Card data ported from the prototype LISTINGS, with real-ish Noosa coordinates and numeric
// price/type so filtering/sorting are real. Detail content is built on lookup (bespoke for
// the hero listing, sensibly generated for the rest).
//
// SWAP PATH: replace these functions with a real Rex client (lib/rex/client.ts) + mappers
// (lib/rex/mappers.ts). Call sites stay identical — the app never learns Rex's payload shape.

import type { Inspection, Listing, ListingCard } from "./types";

const AGENTS = {
  eliza: { id: "eliza-hart", name: "Eliza Hart", photo: null },
  james: { id: "james-whitlam", name: "James Whitlam", photo: null },
  mae: { id: "mae-robinson", name: "Mae Robinson", photo: null },
} as const;

const CARDS: ListingCard[] = [
  {
    id: "24-hilltop", slug: "24-hilltop", status: "For Sale", price: "$2,450,000", priceValue: 2450000,
    street: "24 Hilltop Crescent", suburb: "Noosaville QLD 4566", type: "House",
    beds: 4, baths: 3, cars: 2, land: "612m²", agent: AGENTS.eliza,
    coords: { lat: -26.3955, lng: 153.0762 }, featured: true,
  },
  {
    id: "7-banksia", slug: "7-banksia", status: "Auction", price: "Auction · Sat 14 Jun", priceValue: null,
    street: "7 Banksia Avenue", suburb: "Sunshine Beach QLD 4567", type: "House",
    beds: 5, baths: 4, cars: 2, land: "840m²", agent: AGENTS.james,
    coords: { lat: -26.4045, lng: 153.1011 }, featured: true,
  },
  {
    id: "18-tea-tree", slug: "18-tea-tree", status: "For Sale", price: "Offers over $1,890,000", priceValue: 1890000,
    street: "18 Tea Tree Lane", suburb: "Tewantin QLD 4565", type: "Townhouse",
    beds: 3, baths: 2, cars: 2, land: "540m²", agent: AGENTS.mae,
    coords: { lat: -26.3871, lng: 153.0386 }, featured: true,
  },
  {
    id: "3-headland", slug: "3-headland", status: "Under Offer", price: "$3,950,000", priceValue: 3950000,
    street: "3 Headland Drive", suburb: "Noosa Heads QLD 4567", type: "House",
    beds: 5, baths: 4, cars: 3, land: "1,120m²", agent: AGENTS.james,
    coords: { lat: -26.3915, lng: 153.0921 },
  },
  {
    id: "11-river", slug: "11-river", status: "For Sale", price: "$1,275,000", priceValue: 1275000,
    street: "11 River Reach", suburb: "Noosaville QLD 4566", type: "Apartment",
    beds: 3, baths: 2, cars: 1, land: "410m²", agent: AGENTS.eliza,
    coords: { lat: -26.3982, lng: 153.0689 },
  },
  {
    id: "42-quamby", slug: "42-quamby", status: "For Sale", price: "Contact Agent", priceValue: null,
    street: "42 Quamby Place", suburb: "Noosa Heads QLD 4567", type: "House",
    beds: 6, baths: 5, cars: 4, land: "1,540m²", agent: AGENTS.james,
    coords: { lat: -26.3897, lng: 153.0935 },
  },
  {
    id: "9-saltwater", slug: "9-saltwater", status: "Sold", price: "Sold · $2,800,000", priceValue: 2800000,
    street: "9 Saltwater Court", suburb: "Sunshine Beach QLD 4567", type: "House",
    beds: 4, baths: 3, cars: 2, land: "720m²", agent: AGENTS.mae,
    coords: { lat: -26.4068, lng: 153.0998 },
  },
  {
    id: "5-pandanus", slug: "5-pandanus", status: "For Sale", price: "$1,650,000", priceValue: 1650000,
    street: "5 Pandanus Way", suburb: "Tewantin QLD 4565", type: "House",
    beds: 4, baths: 2, cars: 2, land: "680m²", agent: AGENTS.eliza,
    coords: { lat: -26.3859, lng: 153.0421 },
  },
  {
    id: "16-laguna", slug: "16-laguna", status: "For Sale", price: "$2,150,000", priceValue: 2150000,
    street: "16 Laguna Way", suburb: "Noosaville QLD 4566", type: "House",
    beds: 4, baths: 3, cars: 2, land: "590m²", agent: AGENTS.james,
    coords: { lat: -26.3941, lng: 153.0805 },
  },
];

const suburbName = (suburb: string) => suburb.replace(/\s+QLD.*$/, "");

const GENERIC_FEATURES = [
  "Open-plan living + dining",
  "Stone kitchen with quality appliances",
  "Reverse-cycle ducted air-conditioning",
  "Covered outdoor entertaining",
  "Master with walk-in robe + ensuite",
  "Secure off-street parking",
  "Established, low-maintenance gardens",
  "Walk to local cafés + transport",
];

const GENERIC_INSPECTIONS: Inspection[] = [
  { day: "Sat", date: "24 May", time: "11:00 – 11:30am", type: "Open home" },
  { day: "Wed", date: "28 May", time: "5:30 – 6:00pm", type: "Twilight open" },
  { day: "Sat", date: "31 May", time: "11:00 – 11:30am", type: "Open home" },
];

// Bespoke detail for the hero listing (ported from the prototype).
const HILLTOP_DETAIL = {
  overviewHeading: "A considered Queenslander, recast for how we live now.",
  description: [
    "Set on a quiet rise just minutes from the Noosa River, this fully renovated four-bedroom Queenslander balances the warmth of its original bones with a contemporary, calm interior. Vaulted ceilings, polished timber floors and a deep northerly aspect carry light through the home from dawn to last light.",
    "The kitchen is the quiet hero — Carrara stone, a 1.2m gas cooktop, integrated joinery — flowing out to a covered entertaining deck and a 12-metre saltwater pool framed by mature tea-trees.",
  ],
  features: [
    "12m heated saltwater pool",
    "Carrara stone kitchen with integrated Miele",
    "Reverse-cycle ducted air-conditioning",
    "Polished spotted-gum timber floors",
    "North-facing entertaining deck",
    "Walk-in robe + ensuite to master",
    "Double remote garage + workshop",
    "6.6kW solar with battery",
    "Auto-irrigated established gardens",
    "Walk to Noosa Marina + River Boardwalk",
  ],
  floorArea: "248m²",
  ref: "MX-2402-NSV",
  distances: [
    { label: "Noosa River", value: "450m" },
    { label: "Hastings St", value: "3.2km" },
    { label: "Noosa Junction", value: "2.4km" },
    { label: "Sunshine Coast Airport", value: "24km" },
  ],
};

function buildListing(card: ListingCard): Listing {
  const name = suburbName(card.suburb);
  const base: Listing = {
    ...card,
    agent: { ...card.agent, role: "Sales agent", patch: `${name} patch` },
    gallery: [],
    nextOpen: "Open · Sat 24 May · 11:00 – 11:30am",
    overviewHeading: `A considered ${card.type.toLowerCase()} in the heart of ${name}.`,
    description: [
      `Positioned in sought-after ${name}, ${card.street} pairs relaxed coastal living with genuine day-to-day function. Light-filled living zones open to the outdoors, with quality finishes throughout.`,
      `The bedrooms are zoned for privacy and the outdoor spaces are made for the climate — a short distance to the river, beaches and village amenity.`,
    ],
    features: GENERIC_FEATURES,
    inspections: GENERIC_INSPECTIONS,
    floorArea: `${card.beds * 55 + 60}m²`,
    ref: `MX-${card.id.replace(/\D/g, "").padStart(4, "0")}-${name.slice(0, 3).toUpperCase()}`,
    distances: [
      { label: `${name} village`, value: "600m" },
      { label: "Nearest beach", value: "1.8km" },
      { label: "Noosa Junction", value: "2.4km" },
      { label: "Sunshine Coast Airport", value: "24km" },
    ],
  };

  if (card.id === "24-hilltop") {
    return {
      ...base,
      ...HILLTOP_DETAIL,
      agent: { ...card.agent, role: "Principal", patch: "Noosaville patch" },
    };
  }
  return base;
}

export async function getActiveListings(): Promise<ListingCard[]> {
  return CARDS;
}

export async function getFeaturedListings(limit = 3): Promise<ListingCard[]> {
  return CARDS.filter((l) => l.featured).slice(0, limit);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const card = CARDS.find((l) => l.slug === slug);
  return card ? buildListing(card) : null;
}

/** Other active listings in the same suburb, for the "similar" rail. */
export async function getSimilarListings(slug: string, limit = 3): Promise<ListingCard[]> {
  const current = CARDS.find((l) => l.slug === slug);
  if (!current) return [];
  const sameSuburb = CARDS.filter((l) => l.slug !== slug && l.suburb === current.suburb);
  const fill = CARDS.filter((l) => l.slug !== slug && l.suburb !== current.suburb);
  return [...sameSuburb, ...fill].slice(0, limit);
}

export async function getListingSlugs(): Promise<string[]> {
  return CARDS.map((l) => l.slug);
}
