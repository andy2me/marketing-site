import { isRexConfigured, readPublishedListing, searchPublishedListings } from "./client";
import { mapPublishedListingToCard, mapPublishedListingToDetail } from "./mappers";
import * as mockSource from "./mock";
import type { Listing, ListingCard } from "./types";

export type { Inspection, Listing, ListingAgent, ListingCard, ListingStatus, PropertyType } from "./types";
export { STATUS_COLOR } from "./types";

const DEFAULT_FEATURED = 3;
const DEFAULT_SIMILAR = 3;

const extractRexId = (slug: string): string | null => slug.match(/-(\d+)$/)?.[1] ?? null;

async function fetchActiveCards(): Promise<ListingCard[]> {
  const rows = await searchPublishedListings({
    criteria: [{ name: "listing.system_listing_state", value: "current" }],
  });
  return rows.flatMap((row) => {
    const card = mapPublishedListingToCard(row);
    return card ? [card] : [];
  });
}

export async function getActiveListings(): Promise<ListingCard[]> {
  if (!isRexConfigured()) return mockSource.getActiveListings();
  return fetchActiveCards();
}

export async function getFeaturedListings(limit = DEFAULT_FEATURED): Promise<ListingCard[]> {
  if (!isRexConfigured()) return mockSource.getFeaturedListings(limit);
  const all = await fetchActiveCards();
  return all.slice(0, limit);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  if (!isRexConfigured()) return mockSource.getListingBySlug(slug);
  const id = extractRexId(slug);
  if (!id) return null;
  const rex = await readPublishedListing(id);
  if (!rex) return null;
  return mapPublishedListingToDetail(rex);
}

export async function getSimilarListings(slug: string, limit = DEFAULT_SIMILAR): Promise<ListingCard[]> {
  if (!isRexConfigured()) return mockSource.getSimilarListings(slug, limit);
  const all = await fetchActiveCards();
  const current = all.find((l) => l.slug === slug);
  if (!current) return [];
  const sameSuburb = all.filter((l) => l.slug !== slug && l.suburb === current.suburb);
  const fill = all.filter((l) => l.slug !== slug && l.suburb !== current.suburb);
  return [...sameSuburb, ...fill].slice(0, limit);
}

export async function getListingSlugs(): Promise<string[]> {
  if (!isRexConfigured()) return mockSource.getListingSlugs();
  const all = await fetchActiveCards();
  return all.map((l) => l.slug);
}
