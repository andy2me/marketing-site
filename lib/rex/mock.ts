// Max Property — MOCK listings behind the Rex seam (code handoff §8).
// Ported from the prototype LISTINGS (src/shared.jsx) into the production Listing type,
// with the schematic % positions replaced by real-ish Noosa coordinates.
//
// SWAP PATH: replace these functions with a real Rex client (lib/rex/client.ts) + mappers
// (lib/rex/mappers.ts). Call sites (getActiveListings/getFeaturedListings/getListingBySlug)
// stay identical — the rest of the app never learns Rex's payload shape.

import type { Listing, ListingCard } from "./types";

const AGENTS = {
  eliza: { id: "eliza-hart", name: "Eliza Hart", photo: null },
  james: { id: "james-whitlam", name: "James Whitlam", photo: null },
  mae: { id: "mae-robinson", name: "Mae Robinson", photo: null },
} as const;

const LISTINGS: Listing[] = [
  {
    id: "24-hilltop", slug: "24-hilltop", status: "For Sale", price: "$2,450,000",
    street: "24 Hilltop Crescent", suburb: "Noosaville QLD 4566",
    beds: 4, baths: 3, cars: 2, land: "612m²", agent: AGENTS.eliza,
    coords: { lat: -26.3955, lng: 153.0762 }, featured: true,
    gallery: [], description: "", features: [], inspections: [],
  },
  {
    id: "7-banksia", slug: "7-banksia", status: "Auction", price: "Auction · Sat 14 Jun",
    street: "7 Banksia Avenue", suburb: "Sunshine Beach QLD 4567",
    beds: 5, baths: 4, cars: 2, land: "840m²", agent: AGENTS.james,
    coords: { lat: -26.4045, lng: 153.1011 }, featured: true,
    gallery: [], description: "", features: [], inspections: [],
  },
  {
    id: "18-tea-tree", slug: "18-tea-tree", status: "For Sale", price: "Offers over $1,890,000",
    street: "18 Tea Tree Lane", suburb: "Tewantin QLD 4565",
    beds: 3, baths: 2, cars: 2, land: "540m²", agent: AGENTS.mae,
    coords: { lat: -26.3871, lng: 153.0386 }, featured: true,
    gallery: [], description: "", features: [], inspections: [],
  },
  {
    id: "3-headland", slug: "3-headland", status: "Under Offer", price: "$3,950,000",
    street: "3 Headland Drive", suburb: "Noosa Heads QLD 4567",
    beds: 5, baths: 4, cars: 3, land: "1,120m²", agent: AGENTS.james,
    coords: { lat: -26.3915, lng: 153.0921 },
    gallery: [], description: "", features: [], inspections: [],
  },
  {
    id: "11-river", slug: "11-river", status: "For Sale", price: "$1,275,000",
    street: "11 River Reach", suburb: "Noosaville QLD 4566",
    beds: 3, baths: 2, cars: 1, land: "410m²", agent: AGENTS.eliza,
    coords: { lat: -26.3982, lng: 153.0689 },
    gallery: [], description: "", features: [], inspections: [],
  },
  {
    id: "42-quamby", slug: "42-quamby", status: "For Sale", price: "Contact Agent",
    street: "42 Quamby Place", suburb: "Noosa Heads QLD 4567",
    beds: 6, baths: 5, cars: 4, land: "1,540m²", agent: AGENTS.james,
    coords: { lat: -26.3897, lng: 153.0935 },
    gallery: [], description: "", features: [], inspections: [],
  },
  {
    id: "9-saltwater", slug: "9-saltwater", status: "Sold", price: "Sold · $2,800,000",
    street: "9 Saltwater Court", suburb: "Sunshine Beach QLD 4567",
    beds: 4, baths: 3, cars: 2, land: "720m²", agent: AGENTS.mae,
    coords: { lat: -26.4068, lng: 153.0998 },
    gallery: [], description: "", features: [], inspections: [],
  },
  {
    id: "5-pandanus", slug: "5-pandanus", status: "For Sale", price: "$1,650,000",
    street: "5 Pandanus Way", suburb: "Tewantin QLD 4565",
    beds: 4, baths: 2, cars: 2, land: "680m²", agent: AGENTS.eliza,
    coords: { lat: -26.3859, lng: 153.0421 },
    gallery: [], description: "", features: [], inspections: [],
  },
  {
    id: "16-laguna", slug: "16-laguna", status: "For Sale", price: "$2,150,000",
    street: "16 Laguna Way", suburb: "Noosaville QLD 4566",
    beds: 4, baths: 3, cars: 2, land: "590m²", agent: AGENTS.james,
    coords: { lat: -26.3941, lng: 153.0805 },
    gallery: [], description: "", features: [], inspections: [],
  },
];

export async function getActiveListings(): Promise<ListingCard[]> {
  return LISTINGS;
}

export async function getFeaturedListings(limit = 3): Promise<ListingCard[]> {
  return LISTINGS.filter((l) => l.featured).slice(0, limit);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  return LISTINGS.find((l) => l.slug === slug) ?? null;
}

export async function getListingSlugs(): Promise<string[]> {
  return LISTINGS.map((l) => l.slug);
}
