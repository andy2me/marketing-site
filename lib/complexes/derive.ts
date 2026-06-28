// Pure helpers for property-profile data. No side effects, no I/O — mockable
// substrate for the store and components.

import type {
  ComplexEvent,
  ComplexProfile,
  ComplexUnit,
  EventStatus,
  EventType,
  Report,
} from "./types";

// Status colour map (handoff §Design tokens). Components read from CSS vars;
// these are the token references so any caller can switch on the status alone.
export const STATUS_COLOR_VAR: Record<EventStatus, string> = {
  "For Sale":      "var(--fern)",
  "For Rent":      "var(--clay)",
  "Under Offer":   "var(--mulberry)",
  "Recently Sold": "var(--white-mist-700)",
  "Off Market":    "var(--white-mist-400)",
};

// Verb forms used in card sub-lines and timeline labels.
export const EVENT_VERB: Record<EventType, string> = {
  sold:   "Sold",
  listed: "Listed",
  rented: "Leased",
};

// Per-event prefix when crediting an agency ("Sold by Foo", "Leased by Bar").
export const EVENT_PREFIX: Record<EventType, string> = {
  sold:   "Sold by",
  listed: "Listed by",
  rented: "Leased by",
};

// Sort rank for the units-section "Status" sort — live first, off-market last.
export const STATUS_RANK: Record<EventStatus, number> = {
  "For Sale":      0,
  "Under Offer":   1,
  "For Rent":      2,
  "Recently Sold": 3,
  "Off Market":    4,
};

export const LEVEL_NAMES: Record<string, string> = {
  G: "Ground",
  "1": "Level 1",
  "2": "Level 2",
  "3": "Level 3",
  "4": "Level 4",
  "5": "Level 5",
};

// Slug helpers — handoff §URL structure. Slugs are lowercase; unit slugs accept
// an optional letter suffix ("unit-12a"). The parser returns null for anything
// outside the shape so unknown slugs 404 cleanly.
const UNIT_SLUG = /^unit-(\d+)([a-z])?$/;

export function unitNumberFromSlug(slug: string): number | null {
  const m = UNIT_SLUG.exec(slug);
  if (!m) return null;
  // Letter suffix collapses to the number for routing; if the pilot grows to
  // unit-12a-style suffixes, surface them in a separate field on ComplexUnit.
  return Number.parseInt(m[1], 10);
}

export function unitSlug(unit: Pick<ComplexUnit, "number">): string {
  return `unit-${unit.number}`;
}

// Apply the most recent event on each unit to its `status` + `lastEvent` so the
// stack plan, cards and table all read the same live state without re-walking
// the events feed at every render.
//
// `events` is treated as newest-first (matches mock data and the live feed
// contract). Mutates the unit objects passed in — call once at construction
// time from the store.
export function applyEventsToUnits(
  units: ComplexUnit[],
  events: ReadonlyArray<ComplexEvent>,
): ComplexUnit[] {
  const byNumber = new Map(units.map((u) => [u.number, u]));
  for (const e of events) {
    const u = byNumber.get(e.unit);
    if (!u) continue;
    if (u.status === "Off Market") {
      u.status = e.status;
      u.lastEvent = {
        type:   e.type,
        price:  e.price,
        date:   e.date,
        agency: e.agency,
      };
    }
  }
  return units;
}

// Events on one dwelling, newest-first (input order preserved).
export function eventsForUnit(
  events: ReadonlyArray<ComplexEvent>,
  unitNumber: number,
): ComplexEvent[] {
  return events.filter((e) => e.unit === unitNumber);
}

// Three most-similar units: prioritise same bedrooms, nearest level, same aspect.
// Self is always excluded. Scoring lifted from the prototype's comparablesFor —
// the constants matter (bedroom delta dominates, then level distance, then aspect)
// so changing them is a product decision, not a refactor.
export function comparablesFor(
  units: ReadonlyArray<ComplexUnit>,
  unitNumber: number,
  levels: ReadonlyArray<string>,
  limit = 3,
): number[] {
  const self = units.find((u) => u.number === unitNumber);
  if (!self) return [];
  const levelIndex = (l: string) => levels.indexOf(l);
  return units
    .filter((u) => u.number !== unitNumber)
    .map((u) => ({
      number: u.number,
      score:
        Math.abs(u.beds - self.beds) * 10 +
        Math.abs(levelIndex(u.level) - levelIndex(self.level)) +
        (u.river === self.river ? 0 : 3),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((s) => s.number);
}

// Resolve an event's featuredIn ids → Report records (drops unknown ids).
// Drives the unit-page ReportBacklink (M6). Order is preserved — the prototype
// renders multiple back-links in featuredIn order.
export function reportsFor(
  reports: ReadonlyArray<Report>,
  ids: ReadonlyArray<string> | undefined,
): Report[] {
  if (!ids || ids.length === 0) return [];
  const byId = new Map(reports.map((r) => [r.id, r]));
  const out: Report[] = [];
  for (const id of ids) {
    const r = byId.get(id);
    if (r) out.push(r);
  }
  return out;
}

// Stack-plan row builder — one row per level, top floor first, each row split
// into garden (odd, south-west) and river (even, north-east) sides. Drives
// StackPlan in M5.
//
// Returns a plain shape components can render without knowing the level/aspect
// convention. Empty cells are not generated — every unit belongs to exactly one
// (level, side) bucket by construction.
export type StackPlanRow = {
  level: string;                          // "G", "1" ..
  levelLabel: string;                     // "G" or numeric — display string
  garden: ReadonlyArray<ComplexUnit>;     // sorted by number ascending
  river:  ReadonlyArray<ComplexUnit>;     // sorted by number ascending
};

export function stackPlanRows(
  units: ReadonlyArray<ComplexUnit>,
  levels: ReadonlyArray<string>,
): StackPlanRow[] {
  const byLevel = new Map<string, ComplexUnit[]>();
  for (const lvl of levels) byLevel.set(lvl, []);
  for (const u of units) byLevel.get(u.level)?.push(u);

  // Top floor first (matches the prototype's reversed render order).
  return [...levels].reverse().map((level) => {
    const onLevel = (byLevel.get(level) ?? []).slice().sort((a, b) => a.number - b.number);
    return {
      level,
      levelLabel: level === "G" ? "G" : level,
      garden: onLevel.filter((u) => !u.river),
      river:  onLevel.filter((u) =>  u.river),
    };
  });
}

// Pick the report shown in the LatestReportBlock on the complex profile.
// Returns null if no reports exist or the latest id is missing — the block
// suppresses itself in that case (handoff §"Profile ↔ Report cross-linking").
export function getLatestReport(profile: ComplexProfile): Report | null {
  if (!profile.latestReportId) return null;
  return profile.reports.find((r) => r.id === profile.latestReportId) ?? null;
}
