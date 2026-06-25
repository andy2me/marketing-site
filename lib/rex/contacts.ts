import "server-only";

import { isRexConfigured, rexCall } from "./client";
import type { Lead } from "@/lib/leads/types";

// Website-lead → Rex contact. The contact is the people record; the lead
// (lib/rex/leads.ts) is the enquiry-log record that carries the listing/property
// association. Every submission find-or-creates the contact first so a returning
// visitor doesn't accumulate duplicate person records in Rex.
//
// Requires the Rex API user to have Contacts → Read + Create permission (the
// initial setup in docs/REX-ADMIN-SETUP.md had it at None; bump before enabling).
//
// The Wings Contacts/create payload nests name/email/phone under `related`
// (see toRexContact). Failures here are non-fatal — /api/leads still succeeds on
// the strength of the email so a lead is never lost to a CRM hiccup.

export { isRexConfigured };

type RexCreateResult = { id?: string | number } | string | number;

type RexContactSummary = { id?: string | number };

type RexSearchResult<T> = T[] | { rows?: T[]; total?: number };

// Rex's Contacts/create nests the person's name, emails and phones inside
// `related` sub-arrays (not flat fields) — a contact with no `related.contact_names`
// entry is rejected with "A person cannot be saved without a name". We always
// populate name_last so the record is valid even for a one-word or email-only lead.
function splitName(full: string): { first?: string; last: string } {
  const tokens = full.trim().split(/\s+/).filter(Boolean);
  if (tokens.length > 1) return { first: tokens[0], last: tokens.slice(1).join(" ") };
  return { last: tokens[0] ?? "Website lead" };
}

function toRexContact(lead: Lead): Record<string, unknown> {
  const { first, last } = splitName(lead.name ?? lead.email ?? lead.phone ?? "Website lead");

  const related: Record<string, unknown> = {
    contact_names: [{ ...(first ? { name_first: first } : {}), name_last: last }],
  };
  if (lead.email) {
    related.contact_emails = [
      { email_address: lead.email, email_desc: "work", email_primary: true },
    ];
  }
  if (lead.phone) {
    related.contact_phones = [
      { phone_number: lead.phone, phone_type: "mobile", phone_primary: true },
    ];
  }

  // Property address the visitor entered (appraisal/contact "Property address"),
  // or the listing street on a property-detail enquiry. Lands in the contact's
  // Location → address in Rex.
  const address = lead.fields.address ?? lead.listing ?? null;

  return {
    type: "person",
    // Tags the lead source in Rex (matches Rex's enquiry-source vocabulary).
    marketing_enquiry_source: "Internet",
    ...(address ? { address } : {}),
    related,
  };
}

function firstId(result: RexSearchResult<RexContactSummary> | undefined): string | null {
  const rows = Array.isArray(result) ? result : (result?.rows ?? []);
  const id = rows[0]?.id;
  return id != null ? String(id) : null;
}

async function searchContactBy(field: string, value: string): Promise<string | null> {
  try {
    const result = await rexCall<RexSearchResult<RexContactSummary>>("Contacts/search", {
      criteria: [{ name: field, value }],
      limit: 1,
    });
    return firstId(result);
  } catch {
    // A failed search must not block the create. Rex sometimes rejects an
    // unrecognised criterion name on tenants with custom schemas; in that case
    // we fall through to create and accept the duplicate over losing the lead.
    return null;
  }
}

/**
 * Create a Rex contact from a lead. Returns the new contact id when available.
 * Used internally by findOrCreateContact and by the lookup script for tests.
 */
export async function createRexContact(lead: Lead): Promise<string | null> {
  if (!isRexConfigured()) {
    throw new Error("Rex not configured: set REX_USERNAME and REX_PASSWORD");
  }

  const result = await rexCall<RexCreateResult>("Contacts/create", {
    data: toRexContact(lead),
  });

  if (result && typeof result === "object") return result.id != null ? String(result.id) : null;
  if (typeof result === "string" || typeof result === "number") return String(result);
  return null;
}

/**
 * Find an existing Rex contact by email (then phone) or create one. Returns
 * the contact id. Throws if Rex is unreachable so the caller can log it; the
 * caller treats this as best-effort and does not fail the request on it.
 */
export async function findOrCreateContact(lead: Lead): Promise<string | null> {
  if (!isRexConfigured()) {
    throw new Error("Rex not configured: set REX_USERNAME and REX_PASSWORD");
  }

  if (lead.email) {
    const byEmail = await searchContactBy("email_address", lead.email);
    if (byEmail) return byEmail;
  }
  if (lead.phone) {
    const byPhone = await searchContactBy("phone_number", lead.phone);
    if (byPhone) return byPhone;
  }
  return createRexContact(lead);
}
