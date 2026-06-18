"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconBed, IconBath, IconCar } from "@/components/icons";
import type { ListingCard } from "@/lib/rex/types";
import s from "./PropertyMap.module.css";

/**
 * Editorial map view. Pins are projected from real coordinates onto a schematic base, with
 * card↔pin hover sync (hoverId) carried over from the prototype.
 *
 * TODO(§8): swap the schematic base for MapLibre GL (or Mapbox) using `MAP_TILES_TOKEN` —
 * keep muted/desaturated tiles, custom status-coloured markers, no default UI chrome. This
 * component is already lazy-loaded (next/dynamic, ssr:false) so it costs nothing until the
 * map view is opened.
 */

function priceShort(l: ListingCard): string {
  if (l.priceValue === null) return "POA";
  if (l.priceValue >= 1_000_000) {
    return `$${(l.priceValue / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  return `$${Math.round(l.priceValue / 1000)}k`;
}

const STATUS_PIN: Record<ListingCard["status"], string> = {
  "For Sale": "var(--fern)",
  Auction: "var(--ember)",
  "Under Offer": "var(--mulberry)",
  Sold: "var(--white-mist-700)",
};

export function PropertyMap({
  listings,
  hoverId,
  setHoverId,
}: {
  listings: ListingCard[];
  hoverId: string | null;
  setHoverId: (id: string | null) => void;
}) {
  // Project lat/lng into the box (with padding); invert lat so north is up.
  const lats = listings.map((l) => l.coords.lat);
  const lngs = listings.map((l) => l.coords.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const PAD = 14;
  const span = (a: number, b: number) => (b - a === 0 ? 1 : b - a);
  const pos = (l: ListingCard) => ({
    left: ((l.coords.lng - minLng) / span(minLng, maxLng)) * (100 - 2 * PAD) + PAD,
    top: ((maxLat - l.coords.lat) / span(minLat, maxLat)) * (100 - 2 * PAD) + PAD,
  });

  return (
    <div className={s.wrap}>
      {/* List column */}
      <div className={s.listCol}>
        <div className={s.listHead}>{listings.length} on this map</div>
        <div className={s.listScroll}>
          {listings.map((p) => (
            <Link
              key={p.id}
              href={`/properties/${p.slug}`}
              className={`${s.item} ${hoverId === p.id ? s.itemActive : ""}`}
              onMouseEnter={() => setHoverId(p.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <div className={s.itemThumb}>
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.street}
                    fill
                    sizes="120px"
                    className={s.itemThumbImg}
                  />
                ) : (
                  <ImageSlot ratio="3/2" className={s.itemThumbSlot} />
                )}
              </div>
              <div className={s.itemBody}>
                <div className={s.itemPrice}>{p.price}</div>
                <div className={s.itemStreet}>{p.street}</div>
                <div className={s.itemSuburb}>{p.suburb}</div>
                <div className={s.itemMeta}>
                  <span className={s.metaItem}>
                    <IconBed size={16} /> {p.beds}
                  </span>
                  <span className={s.metaItem}>
                    <IconBath size={16} /> {p.baths}
                  </span>
                  <span className={s.metaItem}>
                    <IconCar size={16} /> {p.cars}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Map column */}
      <div className={s.mapCol}>
        <svg
          className={s.mapBase}
          viewBox="0 0 800 760"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <pattern id="mp-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(86,76,68,.06)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="760" fill="var(--soft-linen-500)" />
          <rect width="800" height="760" fill="url(#mp-grid)" />
          <path
            d="M0,0 L420,0 Q500,180 460,320 Q420,460 540,560 Q640,640 800,640 L800,760 L0,760 Z"
            fill="var(--soft-linen-300)"
            opacity="0.6"
          />
          <path
            d="M620,0 L800,0 L800,180 Q740,140 700,80 Q660,40 620,0 Z"
            fill="var(--lime)"
            opacity="0.18"
          />
          <path d="M40,640 Q280,500 540,560 T800,520" stroke="var(--white-mist-300)" strokeWidth="3" fill="none" />
          <path d="M120,40 Q260,200 460,320" stroke="var(--white-mist-300)" strokeWidth="2.5" fill="none" />
        </svg>

        {listings.map((p) => {
          const { left, top } = pos(p);
          const active = hoverId === p.id;
          return (
            <div
              key={p.id}
              className={`${s.pin} ${active ? s.pinActive : ""}`}
              style={{ left: `${left}%`, top: `${top}%`, zIndex: active ? 5 : 1 }}
              onMouseEnter={() => setHoverId(p.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <div
                className={s.pinLabel}
                style={{
                  background: active ? "var(--color-action)" : "var(--color-bg-surface)",
                  color: active ? "#fff" : "var(--color-text-strong)",
                  borderColor: active ? "var(--color-action)" : STATUS_PIN[p.status],
                }}
              >
                {priceShort(p)}
              </div>
              {active && (
                <Link href={`/properties/${p.slug}`} className={s.pinPopover}>
                  <div className={s.popThumb}>
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.street}
                        fill
                        sizes="260px"
                        className={s.popThumbImg}
                      />
                    ) : (
                      <ImageSlot ratio="3/2" className={s.popThumbSlot} />
                    )}
                  </div>
                  <div className={s.popBody}>
                    <div className={s.itemPrice}>{p.price}</div>
                    <div className={s.itemStreet}>{p.street}</div>
                    <div className={s.itemSuburb}>{p.suburb}</div>
                  </div>
                </Link>
              )}
            </div>
          );
        })}

        <div className={s.mapControls}>
          <button type="button" className={s.mapCtrlBtn} aria-label="Zoom in">
            +
          </button>
          <button type="button" className={s.mapCtrlBtn} aria-label="Zoom out">
            −
          </button>
        </div>
      </div>
    </div>
  );
}
