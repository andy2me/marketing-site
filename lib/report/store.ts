// Max Property — Appraisal Builder report store (accessor seam).
//
// Per-property reports are authored as typed data files in data/reports/{slug}.ts. This module
// is the single lookup surface the app depends on — pages call getReport / getReportSlugs and
// never touch the file layout directly.
//
// SWAP PATH: if reports ever move behind a CMS or DB, replace the registry below with a fetch
// of the same shapes — call sites (getReport, getReportSlugs) stay identical, mirroring the
// Rex / WordPress seams (code handoff §6–8).

import type { Report } from "./types";
import { report as noosaParade } from "@/data/reports/17-140-noosa-parade-noosaville";

const REPORTS: Record<string, Report> = {
  [noosaParade.slug]: noosaParade,
};

/** Resolve a report by its stable slug. null → 404 (notFound). */
export async function getReport(slug: string): Promise<Report | null> {
  return REPORTS[slug] ?? null;
}

/** Every report slug — drives generateStaticParams for the section routes. */
export async function getReportSlugs(): Promise<string[]> {
  return Object.keys(REPORTS);
}
