// Max Property — client-side listing filter/sort (code handoff §8).
// Pure functions over the ISR-cached listing set. Volume is small (boutique agency) so
// client-side filtering is fine; if stock grows large, move this server-side.

import type { ListingCard } from "./types";

export type SortKey = "newest" | "price-asc" | "price-desc" | "beds-desc";

export type Filters = {
  suburb: string | null;
  price: string | null;
  beds: string | null;
  type: string | null;
  status: string | null;
};

export const EMPTY_FILTERS: Filters = {
  suburb: null,
  price: null,
  beds: null,
  type: null,
  status: null,
};

export const SUBURB_OPTIONS = ["Noosaville", "Noosa Heads", "Sunshine Beach", "Tewantin"];
export const PRICE_OPTIONS = ["Under $1M", "1M – 3M", "3M – 5M", "5M+"];
export const BEDS_OPTIONS = ["2+", "3+", "4+", "5+"];
export const TYPE_OPTIONS = ["House", "Apartment", "Townhouse", "Land"];
export const STATUS_OPTIONS = ["For Sale", "Auction", "Under Offer"];

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price low → high" },
  { key: "price-desc", label: "Price high → low" },
  { key: "beds-desc", label: "Most beds" },
];

export const FILTER_LABELS: Record<keyof Filters, string> = {
  suburb: "Suburb",
  price: "Price range",
  beds: "Beds",
  type: "Property type",
  status: "Status",
};

function priceInRange(value: number | null, label: string): boolean {
  if (value === null) return false; // undisclosed price can't satisfy a range filter
  switch (label) {
    case "Under $1M":
      return value < 1_000_000;
    case "1M – 3M":
      return value >= 1_000_000 && value < 3_000_000;
    case "3M – 5M":
      return value >= 3_000_000 && value < 5_000_000;
    case "5M+":
      return value >= 5_000_000;
    default:
      return true;
  }
}

export function filterAndSort(
  listings: ListingCard[],
  filters: Filters,
  sort: SortKey,
): ListingCard[] {
  const result = listings.filter((l) => {
    if (filters.suburb && !l.suburb.toLowerCase().startsWith(filters.suburb.toLowerCase()))
      return false;
    if (filters.beds && l.beds < parseInt(filters.beds, 10)) return false;
    if (filters.type && l.type !== filters.type) return false;
    if (filters.status && l.status !== filters.status) return false;
    if (filters.price && !priceInRange(l.priceValue, filters.price)) return false;
    return true;
  });

  const byPrice = (dir: 1 | -1) => (a: ListingCard, b: ListingCard) => {
    if (a.priceValue === null) return 1; // nulls last regardless of direction
    if (b.priceValue === null) return -1;
    return (a.priceValue - b.priceValue) * dir;
  };

  switch (sort) {
    case "price-asc":
      return [...result].sort(byPrice(1));
    case "price-desc":
      return [...result].sort(byPrice(-1));
    case "beds-desc":
      return [...result].sort((a, b) => b.beds - a.beds);
    case "newest":
    default:
      return result;
  }
}
