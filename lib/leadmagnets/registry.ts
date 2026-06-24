// Lead-magnet asset registry. Each entry binds an `assetId` (the slug we put
// in the form's `formId=leadmagnet-<assetId>`) to the guide whose content the
// auto-generated PDF is built from. New lead-magnets land by adding one line.

import type { Guide } from "@/lib/guides/types";
import { noosavilleSellingPresentationChecklist } from "@/data/guides/noosaville-selling-presentation-checklist";

export type LeadMagnetAsset = {
  assetId: string;
  /** Plain title used in the asset email subject and PDF cover. */
  title: string;
  /** Suggested filename for the download (sans `.pdf`). */
  filename: string;
  /** Source guide — the PDF generator walks its sections. */
  guide: Guide;
};

const ASSETS: Record<string, LeadMagnetAsset> = {
  "noosaville-presentation-checklist": {
    assetId: "noosaville-presentation-checklist",
    title: "The Noosaville presentation checklist",
    filename: "noosaville-presentation-checklist",
    guide: noosavilleSellingPresentationChecklist,
  },
};

export function getLeadMagnetAsset(assetId: string): LeadMagnetAsset | null {
  return ASSETS[assetId] ?? null;
}
