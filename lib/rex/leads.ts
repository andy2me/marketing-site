import "server-only";

import { rexCall } from "./client";
import { findOrCreateContact, isRexConfigured } from "./contacts";
import {
  LEAD_ASSIGNEE_ID,
  LEAD_SOURCE_ID,
  isUnconfigured,
  resolveLeadType,
  tagForFormId,
  WEBSITE_TAG,
} from "./lead-config";
import type { Lead } from "@/lib/leads/types";

// Website-lead → Rex Leads write (the enquiry-log record). This replaces the
// contact-only write that came before: a contact alone doesn't appear in the
// Leads log, doesn't get auto-assigned, and can't carry a listing/property
// association. The lead is the object that does all three.
//
// Per submission, in order:
//   1. find-or-create contact (see lib/rex/contacts.ts) → capture contact_id
//   2. create lead referencing that contact + listing/property when applicable
//
// Failures here are non-fatal: /api/leads still succeeds on the strength of the
// email channel, and the contact is already written even if step 2 fails.
//
// Tenant-scoped ids (lead_type / lead_source / assignee) live in
// lib/rex/lead-config.ts. While any required id is still a TODO sentinel, the
// lead-create step is skipped with a warning and the flow degrades to
// contact-only — keeping pre-config deploys safe.

export type SubmitOutcome = {
  contactId: string | null;
  leadId: string | null;
  /** Set when the lead step was skipped because lead-config is incomplete. */
  skippedLead?: string;
};

type RexCreateResult = { id?: string | number } | string | number;

function extractId(result: RexCreateResult): string | null {
  if (result && typeof result === "object") return result.id != null ? String(result.id) : null;
  if (typeof result === "string" || typeof result === "number") return String(result);
  return null;
}

function buildNote(lead: Lead): string {
  const parts: string[] = [`Form: ${lead.formId}`];
  if (lead.source) parts.push(`Page: ${lead.source}`);

  // Subject-property address for appraisal/contact flows where the property
  // doesn't yet exist in Rex (v1 — see brief §5.2). Matt links/creates the
  // property record on processing. Always include even when the property is
  // known so the lead is readable without clicking through.
  const address = lead.fields.address ?? lead.listing;
  if (address) parts.push(`Subject property: ${address}`);

  if (lead.message) parts.push("", lead.message);

  // Surface the rest of the captured fields (timeline, beds, budget,
  // preferredContact, asset, …) for Matt's eyeball at triage time.
  const extras = Object.entries(lead.fields)
    .filter(([k]) => k !== "address" && k !== "enquiry")
    .map(([k, v]) => `${k}: ${v}`);
  if (extras.length) {
    parts.push("", "---", ...extras);
  }

  return parts.join("\n");
}

function buildTags(lead: Lead): string[] {
  return [WEBSITE_TAG, tagForFormId(lead.formId, lead.kind)];
}

function buildLeadPayload(args: {
  lead: Lead;
  contactId: string;
  leadTypeId: string;
}): Record<string, unknown> {
  const { lead, contactId, leadTypeId } = args;

  // Variant A — property-detail enquiry. Only when we have a real Rex listing
  // id (set by EnquiryForm). Never send a fabricated id; never send a
  // listing on the seller-side flows where the subject property doesn't exist
  // in Rex yet (see brief §5.2 v1 path).
  const associations: Record<string, unknown> = {};
  if (lead.listingId) {
    associations.listing = { id: lead.listingId };
    if (lead.propertyId) associations.property = { id: lead.propertyId };
  }

  return {
    note: buildNote(lead),
    contact: { id: contactId },
    lead_type: { id: leadTypeId },
    lead_source: { id: LEAD_SOURCE_ID },
    assignee: { id: LEAD_ASSIGNEE_ID },
    tags: buildTags(lead),
    ...associations,
  };
}

/** Create the Rex lead record. Exported for the lookup-script test path. */
export async function createRexLead(args: {
  lead: Lead;
  contactId: string;
  leadTypeId: string;
}): Promise<string | null> {
  const result = await rexCall<RexCreateResult>("Leads/create", {
    data: buildLeadPayload(args),
  });
  return extractId(result);
}

/**
 * Top-level orchestrator: contact → lead. Called by /api/leads.
 *
 * Throws if Rex isn't configured (so the caller logs it); the caller treats
 * every Rex failure as best-effort and never fails the request on it.
 */
export async function submitLeadToRex(lead: Lead): Promise<SubmitOutcome> {
  if (!isRexConfigured()) {
    throw new Error("Rex not configured: set REX_USERNAME and REX_PASSWORD");
  }

  const contactId = await findOrCreateContact(lead);

  const leadTypeId = resolveLeadType(lead.formId, lead.kind, lead.fields);

  // Pre-config deploys: every tenant-scoped id starts as a TODO sentinel. Skip
  // the lead-create cleanly so submissions still land via contact + email.
  if (!leadTypeId || isUnconfigured(leadTypeId)) {
    return { contactId, leadId: null, skippedLead: "lead_type unconfigured" };
  }
  if (isUnconfigured(LEAD_SOURCE_ID)) {
    return { contactId, leadId: null, skippedLead: "lead_source unconfigured" };
  }
  if (isUnconfigured(LEAD_ASSIGNEE_ID)) {
    return { contactId, leadId: null, skippedLead: "assignee unconfigured" };
  }

  if (!contactId) {
    // findOrCreateContact returned null — Rex accepted the call but gave no id.
    // Without a contact id we can't create a lead per Rex's schema.
    return { contactId: null, leadId: null, skippedLead: "no contact id returned" };
  }

  const leadId = await createRexLead({ lead, contactId, leadTypeId });
  return { contactId, leadId };
}
