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
// NOTE: the exact Wings payload for Contacts/create should be confirmed against
// https://api-docs.rexsoftware.com. The mapping is isolated in `toRexContact`
// below so it's a one-function change if a field name differs. Failures here are
// non-fatal — /api/leads still succeeds on the strength of the email so a lead
// is never lost to a CRM hiccup.

export { isRexConfigured };

type RexCreateResult = { id?: string | number } | string | number;

function compose(lead: Lead): string | null {
  // Fold the enquiry message + captured context into one note so nothing the
  // visitor told us is dropped, even though Rex's typed contact fields are sparse.
  const parts: string[] = [];
  if (lead.message) parts.push(lead.message);
  if (lead.listing) parts.push(`Listing: ${lead.listing}`);
  if (lead.agentName) parts.push(`Requested agent: ${lead.agentName}`);
  if (lead.source) parts.push(`Source: ${lead.source}`);
  for (const [k, v] of Object.entries(lead.fields)) parts.push(`${k}: ${v}`);
  const note = parts.join("\n").trim();
  return note.length ? note : null;
}

function toRexContact(lead: Lead): Record<string, unknown> {
  return {
    name: lead.name ?? lead.email ?? lead.phone ?? "Website lead",
    ...(lead.email ? { email_address: lead.email } : {}),
    ...(lead.phone ? { phone_number: lead.phone } : {}),
    // Free-text context; safe to drop if Rex rejects the field (caught below).
    ...(compose(lead) ? { system_ctime_note: compose(lead) } : {}),
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
