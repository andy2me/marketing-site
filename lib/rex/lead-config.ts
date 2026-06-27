// Rex-tenant configuration for the lead write path. These values come from
// the live Max Property Rex tenant and must be confirmed against it before the
// Leads write goes live — they are tenant-scoped and not guessable.
//
// To populate this file:
//   1. Run `pnpm tsx scripts/rex-lookup.ts` (requires REX_USERNAME/PASSWORD in
//      env). It prints every lead type / source / assignee the tenant has.
//   2. Drop the chosen ids in below in place of each TODO sentinel.
//   3. Matt sanity-checks in Rex UI that submissions land where expected.
//
// While any required field is unset (sentinel string starts with "TODO_"), the
// Leads write path skips lead-create and logs the formId — submissions still
// reach the email channel + the contact create. See lib/rex/leads.ts.

import type { LeadKind } from "@/lib/leads/types";

/** Rex `lead_type.id` (string slug). Examples Rex ships: "appraisal_request",
 *  "buyer_enquiry", "general_enquiry". Tenants can add custom slugs too. */
export type LeadTypeId = string;

/** Sentinel marking a value that still needs to be filled in from REX-LOOKUP. */
const TODO = (label: string): string => `TODO_REX_LOOKUP_${label}`;

export function isUnconfigured(value: string | number | null | undefined): boolean {
  return typeof value === "string" && value.startsWith("TODO_REX_LOOKUP_");
}

// Lead-type slugs are a Rex-system enum (sourced from a remote "lead_type"
// list per Leads/describeModel). Max Property's tenant exposes two values —
// no `appraisal_request` or buyer-specific slug — so appraisal, contact,
// newsletter and lead-magnet submissions all map to `general`, and only the
// property-page enquiry uses `listing_enquiry`. The per-form Rex tag
// (website-appraisal, website-leadmagnet, etc) still distinguishes them in
// the Leads stream filters. Sourced via `pnpm rex:lookup` 2026-06-27.

const LEAD_TYPE_LISTING_ENQUIRY = "listing_enquiry";
const LEAD_TYPE_GENERAL = "general";

/** Formal mapping of formId / LeadKind → lead_type slug. Per-formId entries
 *  win over LeadKind defaults, so a specific form can route differently
 *  without a new LeadKind. */
export const LEAD_TYPE_BY_FORM_ID: Record<string, LeadTypeId> = {
  // Property-detail enquiry (variant A — listing+property associated).
  enquiry: LEAD_TYPE_LISTING_ENQUIRY,
};

/** Defaults applied when no per-formId entry matches. */
export const LEAD_TYPE_BY_KIND: Record<LeadKind, LeadTypeId> = {
  appraisal: LEAD_TYPE_GENERAL,
  "agent-appraisal": LEAD_TYPE_GENERAL,
  enquiry: LEAD_TYPE_LISTING_ENQUIRY,
  contact: LEAD_TYPE_GENERAL,
  newsletter: LEAD_TYPE_GENERAL,
  leadmagnet: LEAD_TYPE_GENERAL,
};

/** Contact form (formId="contact") subtype overrides. All five values
 *  (sell/buy/media/careers/general) currently route to LEAD_TYPE_BY_KIND.contact
 *  = `general`, since this tenant doesn't carry buyer/seller-specific
 *  lead_types. Kept as an explicit empty map so adding a tenant-specific slug
 *  later is a one-line change. */
export const LEAD_TYPE_BY_CONTACT_ENQUIRY: Record<string, LeadTypeId | undefined> = {};

/** Rex `lead_source.id` for "Website" submissions. Numeric in Rex's standard
 *  lead-source table. Pulled from env so admins can swap it without a deploy. */
export const LEAD_SOURCE_ID: string =
  process.env.REX_LEAD_SOURCE_ID ?? TODO("LEAD_SOURCE_WEBSITE");

/** Rex `assignee.id` (admin user id) every website lead routes to.
 *
 *  Required in practice, even though the field is structurally optional:
 *  Rex silently rolls back lead creates that omit assignee (the API user
 *  can't read back a lead it just created if the lead has no assignee, and
 *  Rex's create flow treats that read failure as fatal).
 *
 *  Assigning to a user *other than* the API user (e.g. Matt) requires the
 *  API user to have the Rex "Assign leads to others" permission. Until that
 *  permission is in place, set this to the API user's own id; leads land
 *  assigned to the API user and the team reassigns from there. See
 *  docs/REX-LEADS-HANDOFF.md. */
export const LEAD_ASSIGNEE_ID: string | null = process.env.REX_LEAD_ASSIGNEE_ID || null;

/** Tag every website-originated lead gets, so they're filterable as a group
 *  in Rex regardless of lead_type. */
export const WEBSITE_TAG = "website";

/** Per-form tag suffix. The full tag is `${WEBSITE_TAG}-${kindSlug(formId)}`,
 *  e.g. "website-appraisal" or "website-enquiry". Matt asked for this so he
 *  can filter the leads log by which form generated each lead. */
export function tagForFormId(formId: string, kind: LeadKind): string {
  // appraisal-agent-<slug> forms collapse to "appraisal" so they group with
  // the /sell appraisals — agent-routing is already captured on the assignee.
  if (formId.startsWith("appraisal-agent-")) return `${WEBSITE_TAG}-appraisal`;
  if (formId.startsWith("leadmagnet-")) return `${WEBSITE_TAG}-leadmagnet`;
  // Otherwise fall back to the LeadKind slug, which already mirrors most formIds.
  return `${WEBSITE_TAG}-${kind}`;
}

/** Resolve the lead_type for a given submission. Returns null when no mapping
 *  is configured for this form yet — the caller should fall back to contact-only. */
export function resolveLeadType(
  formId: string,
  kind: LeadKind,
  fields: Record<string, string>,
): LeadTypeId | null {
  // Per-formId mapping wins (handles the agent-appraisal / leadmagnet patterns).
  if (formId in LEAD_TYPE_BY_FORM_ID) return LEAD_TYPE_BY_FORM_ID[formId]!;

  // Contact form: branch on the `enquiry` dropdown value.
  if (formId === "contact") {
    const enquiry = fields.enquiry;
    if (enquiry && enquiry in LEAD_TYPE_BY_CONTACT_ENQUIRY) {
      const id = LEAD_TYPE_BY_CONTACT_ENQUIRY[enquiry];
      if (id) return id;
    }
  }

  // Per-agent appraisal forms: appraisal-agent-<slug>
  if (formId.startsWith("appraisal-agent-")) {
    return LEAD_TYPE_BY_KIND["agent-appraisal"];
  }

  // Per-asset lead magnets: leadmagnet-<assetId>
  if (formId.startsWith("leadmagnet-")) {
    return LEAD_TYPE_BY_KIND.leadmagnet;
  }

  return LEAD_TYPE_BY_KIND[kind] ?? null;
}
