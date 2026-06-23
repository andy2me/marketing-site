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

// Rex stores a person's name in `first_name` / `last_name`, not a single `name`
// field — sending `name` is rejected with "A person cannot be saved without a
// name". Split our combined display name into the two, always populating
// last_name so the record is valid even for a one-word or email-only lead.
function splitName(full: string): { first?: string; last: string } {
  const tokens = full.trim().split(/\s+/).filter(Boolean);
  if (tokens.length > 1) return { first: tokens[0], last: tokens.slice(1).join(" ") };
  return { last: tokens[0] ?? "Website lead" };
}

function toRexContact(lead: Lead): Record<string, unknown> {
  const { first, last } = splitName(lead.name ?? lead.email ?? lead.phone ?? "Website lead");
  return {
    ...(first ? { first_name: first } : {}),
    last_name: last,
    ...(lead.email ? { email_address: lead.email } : {}),
    ...(lead.phone ? { phone_number: lead.phone } : {}),
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
