// Shared atoms used across complex + unit property profiles.
//
// Ported from the prototype's src/profiles-shared.jsx + slices of shared.jsx.
// Server-safe (no client hooks). Styling stays inline so it tracks the design
// 1:1 against the prototype while iteration is hot; once the surface stabilises
// these atoms can move to CSS Modules to match the rest of the codebase.

import Link from "next/link";
import { type ReactNode } from "react";
import {
  IconArea,
  IconArrowR,
  IconBath,
  IconBed,
  IconCar,
  IconPin,
} from "@/components/icons";
import { STATUS_COLOR_VAR } from "@/lib/complexes/derive";
import type {
  AttributionAgency,
  ComplexEvent,
  EventStatus,
  EventType,
} from "@/lib/complexes/types";

// ── Crumbs ────────────────────────────────────────────────────────────────
// items: [label, isCurrent, href?] — href can be omitted for the current
// segment. Renders the prototype's `Property › Noosaville › The Islander` band.
type CrumbItem = readonly [label: string, current: boolean, href?: string];

export function Crumbs({ items }: { items: ReadonlyArray<CrumbItem> }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        fontSize: 13,
        color: "var(--color-text-secondary)",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.04em",
      }}
    >
      {items.map(([label, current, href], i) => (
        <span key={`${label}-${i}`}>
          {i > 0 && <span style={{ margin: "0 8px", opacity: 0.6 }}>›</span>}
          {current || !href ? (
            <span
              aria-current={current ? "page" : undefined}
              style={{ color: current ? "var(--color-text-primary)" : undefined }}
            >
              {label}
            </span>
          ) : (
            <Link href={href} style={{ color: "inherit" }}>
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────
// Tiny coloured pill driven by EventStatus. Single source of truth for the
// status colour mapping — both the cards and the stack plan read it.
export function StatusBadge({
  status,
  size = "md",
}: {
  status: EventStatus;
  size?: "sm" | "md";
}) {
  const color = STATUS_COLOR_VAR[status];
  const isMd = size === "md";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: isMd ? "6px 12px" : "4px 10px",
        borderRadius: 999,
        border: `1px solid ${color}`,
        background: `color-mix(in srgb, ${color} 14%, var(--color-bg-surface))`,
        color: "var(--color-text-strong)",
        fontSize: isMd ? 12 : 11,
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: color,
        }}
      />
      {status}
    </span>
  );
}

// ── Attribution ───────────────────────────────────────────────────────────
// Matt's own events get a small ember "Max Property" tag; competitor events
// are credited by name only — no logos, no brand colour, no links. The
// component renders <span>, never <a>, regardless of agency.
//
// Wire this everywhere an agency is shown so the rule is enforced once.
export function Attribution({
  agency,
  prefix,
}: {
  agency: AttributionAgency;
  prefix: string;
}) {
  if (agency.kind === "self") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: "var(--color-text-secondary)",
        }}
      >
        {prefix}{" "}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 8px",
            borderRadius: 999,
            background: "var(--ember)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 13,
              height: 13,
              borderRadius: 3,
              background: "#fff",
              color: "var(--ember)",
              display: "inline-grid",
              placeItems: "center",
              fontSize: 9,
              fontWeight: 700,
            }}
          >
            M
          </span>
          {agency.name}
        </span>
      </span>
    );
  }
  return (
    <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
      {prefix} <span style={{ color: "var(--color-text-primary)" }}>{agency.name}</span>
    </span>
  );
}

// ── MetaRow ───────────────────────────────────────────────────────────────
// Bed / bath / car / area icon row used in headers, cards, and comparables.
export function MetaRow({
  beds,
  baths,
  car,
  area,
  color = "var(--color-text-secondary)",
  gap = 16,
}: {
  beds: number;
  baths: number;
  car: number;
  area: string;
  color?: string;
  gap?: number;
}) {
  const item = {
    display: "inline-flex" as const,
    alignItems: "center" as const,
    gap: 6,
    fontSize: 14,
    color,
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap, flexWrap: "wrap" }}>
      <span style={item}><IconBed size={16} /> {beds}</span>
      <span style={item}><IconBath size={16} /> {baths}</span>
      <span style={item}><IconCar size={16} /> {car}</span>
      <span style={item}><IconArea size={16} /> {area}</span>
    </div>
  );
}

// ── SectionHead ───────────────────────────────────────────────────────────
// Overline + serif H2 + sub-paragraph, with an optional right-side action slot.
export function SectionHead({
  over,
  title,
  sub,
  action,
}: {
  over: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
        marginBottom: 28,
      }}
    >
      <div style={{ maxWidth: 620 }}>
        <p
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-text-secondary)",
          }}
        >
          {over}
        </p>
        <h2
          style={{
            marginTop: 12,
            fontSize: "clamp(28px, 3vw, 38px)",
            lineHeight: 1.06,
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.015em",
            color: "var(--color-text-strong)",
          }}
        >
          {title}
        </h2>
        {sub && (
          <p
            style={{
              marginTop: 12,
              fontSize: 16,
              lineHeight: 1.55,
              color: "var(--color-text-secondary)",
              maxWidth: 560,
            }}
          >
            {sub}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

// ── EventCard ─────────────────────────────────────────────────────────────
// One event tile in the complex-profile activity feed. Status badge top-left,
// price + sub-line in the body, date + agency attribution at the foot. The
// whole card is a Link to the unit profile.
const PREFIX: Record<EventType, string> = {
  sold: "Sold by",
  listed: "Listed by",
  rented: "Leased by",
};

export function EventCard({
  event,
  unitHref,
}: {
  event: ComplexEvent;
  unitHref: string;
}) {
  return (
    <Link
      href={unitHref}
      style={{
        display: "grid",
        gap: 18,
        padding: "22px 22px 20px",
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 12,
        boxShadow: "var(--shadow-sm)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <StatusBadge status={event.status} size="sm" />
        <span
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.06em",
            color: "var(--color-text-secondary)",
          }}
        >
          Unit {event.unit}
        </span>
      </div>
      <div>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 26,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            color: "var(--color-text-strong)",
          }}
        >
          {event.price}
        </p>
        <p
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "var(--color-text-secondary)",
          }}
        >
          {event.sub}
        </p>
      </div>
      <div
        style={{
          paddingTop: 14,
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Attribution agency={event.agency} prefix={PREFIX[event.type]} />
        <span
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            whiteSpace: "nowrap",
          }}
        >
          {event.date}
        </span>
      </div>
    </Link>
  );
}

// ── MattCommentary ────────────────────────────────────────────────────────
// The editorial centerpiece. Byline + ember rule + serif lead paragraph + body.
// Variants beyond "editorial" (note, card) exist in the prototype as Tweaks —
// not shipping per the design README.
export function MattCommentary({
  author,
  role,
  updated,
  paragraphs,
}: {
  author: string;
  role: string;
  updated: string;
  paragraphs: ReadonlyArray<string>;
}) {
  const [lead, ...rest] = paragraphs;
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 760 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 13,
          color: "var(--color-text-secondary)",
        }}
      >
        <span style={{ color: "var(--color-text-strong)", fontWeight: 500 }}>
          {author}
        </span>
        <span style={{ opacity: 0.6 }}>·</span>
        <span>{role}</span>
        <span style={{ opacity: 0.6 }}>·</span>
        <span>{updated}</span>
      </div>
      <hr
        style={{
          width: 56,
          height: 2,
          background: "var(--ember)",
          border: 0,
        }}
      />
      {lead && (
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(22px, 2.2vw, 28px)",
            lineHeight: 1.32,
            letterSpacing: "-0.005em",
            color: "var(--color-text-strong)",
          }}
        >
          {lead}
        </p>
      )}
      {rest.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: "var(--color-text-primary)",
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

// ── MapEmbed ──────────────────────────────────────────────────────────────
// Pin-only placeholder. The real embed (Mapbox / Google Maps) lands when the
// API key is provisioned (open dependency #3 in the plan). Crucially: no
// street view in v1 — see handoff §"Imagery rules". This component does not
// accept a street-view prop, so any future implementation that adds one would
// be a deliberate API change.
export function MapEmbed({
  label,
  height = 420,
}: {
  label: string;
  height?: number;
}) {
  return (
    <div
      role="img"
      aria-label={`Map · ${label}`}
      style={{
        position: "relative",
        height,
        borderRadius: 16,
        overflow: "hidden",
        background:
          "linear-gradient(135deg, var(--soft-linen-500) 0%, var(--soft-linen-300) 100%)",
        border: "1px solid var(--color-border)",
      }}
    >
      <svg
        aria-hidden
        viewBox="0 0 600 420"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <pattern id="mp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="rgba(86,76,68,.08)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="600" height="420" fill="url(#mp-grid)" />
        <path
          d="M-20 280 C 120 240, 240 320, 380 260 S 620 200, 700 240 L 700 420 L -20 420 Z"
          fill="rgba(54, 64, 37, .14)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: "var(--ember)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <IconPin size={18} />
        </span>
        <span
          style={{
            width: 2,
            height: 16,
            background: "var(--ember)",
          }}
        />
      </div>
      <span
        style={{
          position: "absolute",
          left: 16,
          bottom: 14,
          padding: "5px 10px",
          borderRadius: 999,
          background: "rgba(26,18,12,.78)",
          color: "#fff",
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Re-exports — make the named icon symbols available alongside the atoms.
export { IconArrowR };
