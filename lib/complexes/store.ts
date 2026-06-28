// Property-profiles accessors (handoff §"Data requirements", §"Architecture").
//
// One ComplexProfile today (The Islander). Add a complex by appending to
// COMPLEXES — the dynamic routes pick it up via getComplexSlugs / getUnitSlugs.
// When the licensed feed lands (Cotality / Domain / Titles + CMS commentary),
// swap COMPLEXES for the live loader; the accessor surface stays the same.

import {
  comparablesFor as _comparablesFor,
  eventsForUnit as _eventsForUnit,
  getLatestReport as _getLatestReport,
  reportsFor as _reportsFor,
  stackPlanRows as _stackPlanRows,
  unitNumberFromSlug,
} from "./derive";
import { THE_ISLANDER } from "./mock";
import type {
  ComplexEvent,
  ComplexProfile,
  ComplexUnit,
  Report,
  UnitDetail,
} from "./types";
import type { StackPlanRow } from "./derive";

export type { StackPlanRow } from "./derive";

const COMPLEXES: ReadonlyArray<ComplexProfile> = [THE_ISLANDER];

// One (suburbSlug, complexSlug) pair per profile — drives generateStaticParams
// on the complex page.
export function getComplexSlugs(): Array<{ suburb: string; complex: string }> {
  return COMPLEXES.map((c) => ({ suburb: c.suburbSlug, complex: c.slug }));
}

export function getComplexBySlug(
  suburbSlug: string,
  complexSlug: string,
): ComplexProfile | null {
  return (
    COMPLEXES.find(
      (c) => c.suburbSlug === suburbSlug && c.slug === complexSlug,
    ) ?? null
  );
}

// (suburb, complex, unit-slug) triples for every dwelling — drives
// generateStaticParams on the unit page. unit-12, unit-13, ... unit-48.
export function getUnitSlugs(): Array<{
  suburb: string;
  complex: string;
  unit: string;
}> {
  const out: Array<{ suburb: string; complex: string; unit: string }> = [];
  for (const c of COMPLEXES) {
    for (const u of c.units) {
      out.push({ suburb: c.suburbSlug, complex: c.slug, unit: u.id });
    }
  }
  return out;
}

export function getUnitByNumber(
  profile: ComplexProfile,
  unitNumber: number,
): ComplexUnit | null {
  return profile.units.find((u) => u.number === unitNumber) ?? null;
}

export function getUnitBySlug(
  profile: ComplexProfile,
  slug: string,
): ComplexUnit | null {
  const n = unitNumberFromSlug(slug);
  if (n === null) return null;
  return getUnitByNumber(profile, n);
}

export function getUnitDetail(
  profile: ComplexProfile,
  unitNumber: number,
): UnitDetail | null {
  return profile.unitDetails[unitNumber] ?? null;
}

export function eventsForUnit(
  profile: ComplexProfile,
  unitNumber: number,
): ComplexEvent[] {
  return _eventsForUnit(profile.events, unitNumber);
}

export function comparablesFor(
  profile: ComplexProfile,
  unitNumber: number,
  limit = 3,
): number[] {
  return _comparablesFor(profile.units, unitNumber, profile.levels, limit);
}

export function stackPlanRows(profile: ComplexProfile): StackPlanRow[] {
  return _stackPlanRows(profile.units, profile.levels);
}

export function getLatestReport(profile: ComplexProfile): Report | null {
  return _getLatestReport(profile);
}

export function reportsFor(
  profile: ComplexProfile,
  ids: ReadonlyArray<string> | undefined,
): Report[] {
  return _reportsFor(profile.reports, ids);
}
