"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Container } from "@/components/ui/Container";
import { PropertyCard } from "./PropertyCard";
import { FilterDropdown } from "./FilterDropdown";
import { IconSearch, IconGrid, IconMap, IconClose, IconArrowR } from "@/components/icons";
import {
  filterAndSort,
  EMPTY_FILTERS,
  SUBURB_OPTIONS,
  PRICE_OPTIONS,
  BEDS_OPTIONS,
  TYPE_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
  FILTER_LABELS,
  type Filters,
  type SortKey,
} from "@/lib/rex/filter";
import type { ListingCard } from "@/lib/rex/types";
import s from "./properties.module.css";

const PropertyMap = dynamic(() => import("./PropertyMap").then((m) => m.PropertyMap), {
  ssr: false,
  loading: () => <div className={s.mapLoading}>Loading map…</div>,
});

const PAGE_SIZE = 6;
type View = "grid" | "map";

export function PropertiesBrowser({ listings }: { listings: ListingCard[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialise from the URL once (shareable/deep-linkable state, §8).
  const [filters, setFilters] = useState<Filters>(() => ({
    suburb: searchParams.get("suburb"),
    price: searchParams.get("price"),
    beds: searchParams.get("beds"),
    type: searchParams.get("type"),
    status: searchParams.get("status"),
  }));
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [sort, setSort] = useState<SortKey>(
    () => (searchParams.get("sort") as SortKey) || "newest",
  );
  const [view, setView] = useState<View>(() =>
    searchParams.get("view") === "map" ? "map" : "grid",
  );
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Sync state → URL params (debounced enough by React's batching for discrete controls).
  useEffect(() => {
    const params = new URLSearchParams();
    (Object.keys(filters) as (keyof Filters)[]).forEach((k) => {
      const v = filters[k];
      if (v) params.set(k, v);
    });
    if (query.trim()) params.set("q", query.trim());
    if (sort !== "newest") params.set("sort", sort);
    if (view !== "grid") params.set("view", view);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filters, query, sort, view, router, pathname]);

  const results = useMemo(() => {
    const base = filterAndSort(listings, filters, sort);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (l) => l.street.toLowerCase().includes(q) || l.suburb.toLowerCase().includes(q),
    );
  }, [listings, filters, sort, query]);

  const onToggleSave = useCallback(
    (id: string, next: boolean) => setSaved((prev) => ({ ...prev, [id]: next })),
    [],
  );
  // Changing the result set resets pagination — done in the handlers (not an effect).
  const setFilter = (k: keyof Filters, v: string | null) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setVisible(PAGE_SIZE);
  };
  const onQuery = (v: string) => {
    setQuery(v);
    setVisible(PAGE_SIZE);
  };
  const onSort = (key: SortKey) => {
    setSort(key);
    setVisible(PAGE_SIZE);
  };
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setQuery("");
    setVisible(PAGE_SIZE);
  };

  const active = (Object.keys(filters) as (keyof Filters)[]).filter((k) => filters[k]);
  const shown = results.slice(0, visible);
  const sortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "Newest";

  return (
    <>
      <div className={s.filterBar}>
        <Container className={s.filterBarInner}>
          <div className={s.search}>
            <IconSearch />
            <input
              className={s.searchInput}
              placeholder="Suburb, postcode or street"
              aria-label="Search listings"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
            />
          </div>

          <div className={s.pillRow}>
            <FilterDropdown label="Suburb" value={filters.suburb} options={SUBURB_OPTIONS} onSelect={(v) => setFilter("suburb", v)} />
            <FilterDropdown label="Price range" value={filters.price} options={PRICE_OPTIONS} onSelect={(v) => setFilter("price", v)} />
            <FilterDropdown label="Beds" value={filters.beds} options={BEDS_OPTIONS} onSelect={(v) => setFilter("beds", v)} />
            <FilterDropdown label="Property type" value={filters.type} options={TYPE_OPTIONS} onSelect={(v) => setFilter("type", v)} />
            <FilterDropdown label="Status" value={filters.status} options={STATUS_OPTIONS} onSelect={(v) => setFilter("status", v)} />

            <div className={s.barRight}>
              <FilterDropdown
                label="Sort"
                value={sortLabel}
                options={SORT_OPTIONS.map((o) => o.label)}
                includeAny={false}
                neutral
                onSelect={(label) =>
                  onSort(SORT_OPTIONS.find((o) => o.label === label)?.key ?? "newest")
                }
              />
              <div className={s.viewToggle} role="group" aria-label="View">
                <button
                  type="button"
                  className={view === "grid" ? s.viewActive : s.viewBtn}
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                >
                  <IconGrid /> Grid
                </button>
                <button
                  type="button"
                  className={view === "map" ? s.viewActive : s.viewBtn}
                  aria-pressed={view === "map"}
                  onClick={() => setView("map")}
                >
                  <IconMap /> Map
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className={s.toolbar}>
        <div className={s.count} aria-live="polite">
          <strong>{results.length}</strong> properties
          <span className={s.muted}> · live results</span>
        </div>
        <div className={s.rule} />
        <div className={s.chips}>
          {active.map((k) => (
            <button key={k} type="button" className={s.chip} onClick={() => setFilter(k, null)}>
              <span className={s.muted}>{FILTER_LABELS[k]}:</span> {filters[k]}
              <span className={s.muted}>
                <IconClose />
              </span>
            </button>
          ))}
          {active.length > 0 && (
            <button type="button" className={s.clearAll} onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>
      </Container>

      <section className={s.gridSection}>
        <Container>
          {results.length === 0 ? (
            <div className={s.empty}>
              No properties match those filters.{" "}
              <button type="button" className={s.clearAll} onClick={clearAll}>
                Clear all
              </button>
            </div>
          ) : view === "map" ? (
            <PropertyMap listings={results} hoverId={hoverId} setHoverId={setHoverId} />
          ) : (
            <>
              <div className={s.grid}>
                {shown.map((p) => (
                  <PropertyCard key={p.id} p={p} saved={!!saved[p.id]} onToggleSave={onToggleSave} />
                ))}
              </div>
              <div className={s.pagination}>
                <span className={s.muted}>
                  Showing {shown.length} of {results.length} properties
                </span>
                {visible < results.length && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  >
                    Load more <IconArrowR />
                  </button>
                )}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
