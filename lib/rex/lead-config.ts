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

/** Formal mapping of formId / LeadKind → lead_type slug. Per-formId entries
 *  win over LeadKind defaults, so the contact form's "buy" branch can route to
 *  a different lead_type from its "sell" branch without a new LeadKind. */
export const LEAD_TYPE_BY_FORM_ID: Record<string, LeadTypeId> = {
  // Sell appraisal (free appraisal CTA on /sell)
  appraisal: TODO("LEAD_TYPE_APPRAISAL"),
  // Property-detail enquiry (variant A — listing+property associated)
  enquiry: TODO("LEAD_TYPE_BUYER_ENQUIRY"),
  // Newsletter signup (footer + insights page)
  newsletter: TODO("LEAD_TYPE_NEWSLETTER"),
};

/** Defaults applied when no per-formId entry matches. */
export const LEAD_TYPE_BY_KIND: Record<LeadKind, LeadTypeId> = {
  appraisal: TODO("LEAD_TYPE_APPRAISAL"),
  "agent-appraisal": TODO("LEAD_TYPE_APPRAISAL"),
  enquiry: TODO("LEAD_TYPE_BUYER_ENQUIRY"),
  contact: TODO("LEAD_TYPE_GENERAL_ENQUIRY"),
  newsletter: TODO("LEAD_TYPE_NEWSLETTER"),
  leadmagnet: TODO("LEAD_TYPE_LEADMAGNET"),
};

/** Contact form (formId="contact") splits by `enquiry` dropdown — sell, buy,
 *  media, careers, general. Sell-side routes to the appraisal lead_type;
 *  everything else inherits the general default. */
export const LEAD_TYPE_BY_CONTACT_ENQUIRY: Record<string, LeadTypeId | undefined> = {
  sell: TODO("LEAD_TYPE_APPRAISAL"),
  buy: TODO("LEAD_TYPE_BUYER_ENQUIRY"),
  // media / careers / general fall through to LEAD_TYPE_BY_KIND.contact
};

/** Rex `lead_source.id` for "Website" submissions. Numeric in Rex's standard
 *  lead-source table. Pulled from env so admins can swap it without a deploy. */
export const LEAD_SOURCE_ID: string =
  process.env.REX_LEAD_SOURCE_ID ?? TODO("LEAD_SOURCE_WEBSITE");

/** Rex `assignee.id` (admin user id) every website lead routes to. Matt today.
 *  Pulled from env to avoid a redeploy when routing changes. */
export const LEAD_ASSIGNEE_ID: string =
  process.env.REX_LEAD_ASSIGNEE_ID ?? TODO("LEAD_ASSIGNEE_MATT");

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
