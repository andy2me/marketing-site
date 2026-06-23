import "server-only";

import { isRexConfigured, rexCall } from "./client";
import type { Lead } from "@/lib/leads/types";

// Writes website leads into Rex as contacts (code handoff §9 — replaces the
// retired Doorstep seam). This is the ONLY write the site makes to Rex; the
// listings path stays strictly read-only.
//
// Requires the Rex API user to have Contacts → Create permission (the read-only
// setup in docs/REX-ADMIN-SETUP.md has it at None — bump it before enabling).
//
// The Wings Contacts/create payload nests name/email/phone under `related`
// (see toRexContact). Failures here are non-fatal — /api/leads still succeeds on
// the strength of the email so a lead is never lost to a CRM hiccup.

export { isRexConfigured };

type RexCreateResult = { id?: string | number } | string | number;

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

  return {
    type: "person",
    // Tags the lead source in Rex (matches Rex's enquiry-source vocabulary).
    marketing_enquiry_source: "Internet",
    related,
  };
}

/**
 * Create a Rex contact from a lead. Returns the new contact id when available.
 * Throws on Rex error so the caller can log it — but the caller treats this as
 * best-effort and does not fail the request on it.
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
