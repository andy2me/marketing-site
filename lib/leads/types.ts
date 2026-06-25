// Normalised lead shape. Every site form (contact, appraisal, newsletter,
// property enquiry, per-agent appraisal, gated lead-magnet PDF) posts to
// /api/leads as FormData; we collapse them into one `Lead` here so the email
// + Rex paths don't each have to know every form's field names.

export type LeadKind =
  | "contact"
  | "appraisal"
  | "newsletter"
  | "enquiry"
  | "agent-appraisal"
  | "leadmagnet";

export type Lead = {
  kind: LeadKind;
  /** Raw form identity as sent by the client, e.g. "appraisal-agent-matt-powe". */
  formId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  /** Property street address this lead is about, when known (never re-asked). */
  listing: string | null;
  /** Rex listing id (set on property-page enquiries) — used to associate the lead with the campaign in Rex. */
  listingId: string | null;
  /** Rex property id (set alongside listingId on property-page enquiries). */
  propertyId: string | null;
  agentId: string | null;
  agentName: string | null;
  /** Page the form was submitted from (referer path) — for routing/triage. */
  source: string | null;
  /** Everything captured, verbatim, for the notification email + CRM note. */
  fields: Record<string, string>;
};

// Fields we lift into typed `Lead` slots; everything else stays in `fields`
// (and still appears in the email + CRM note), so adding a form field never
// requires touching this file.
const CORE_KEYS = new Set([
  "formId",
  "firstName",
  "lastName",
  "name",
  "email",
  "phone",
  "contact",
  "message",
  "notes",
  "listing",
  "listingId",
  "propertyId",
  "agentId",
  "agentName",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function kindFromFormId(formId: string): LeadKind {
  if (formId.startsWith("appraisal-agent-")) return "agent-appraisal";
  if (formId.startsWith("leadmagnet")) return "leadmagnet";
  if (formId === "appraisal") return "appraisal";
  if (formId === "newsletter") return "newsletter";
  if (formId === "enquiry") return "enquiry";
  return "contact";
}

function clean(v: FormDataEntryValue | undefined | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

/**
 * Build a `Lead` from raw form fields. `formId` identifies the source form;
 * `extras` carries server-derived context (e.g. referer) that isn't a form field.
 */
export function normaliseLead(
  formId: string,
  raw: Record<string, string>,
  extras: { source?: string | null } = {},
): Lead {
  const get = (k: string) => clean(raw[k]);

  const first = get("firstName");
  const last = get("lastName");
  const name = get("name") ?? ([first, last].filter(Boolean).join(" ") || null);

  // Agent card uses a single "email or phone" field; split it by shape.
  const contact = get("contact");
  let email = get("email");
  let phone = get("phone");
  if (contact) {
    if (EMAIL_RE.test(contact)) email = email ?? contact;
    else phone = phone ?? contact;
  }

  const message = get("message") ?? get("notes");

  // `fields` keeps non-core entries (address, timeline, interests, enquiry, …)
  // so they survive into the email and CRM note without bespoke mapping.
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (CORE_KEYS.has(k)) continue;
    if (k.startsWith("_")) continue; // internal: honeypot / timing
    const c = clean(v);
    if (c) fields[k] = c;
  }

  return {
    kind: kindFromFormId(formId),
    formId,
    name,
    email,
    phone,
    message,
    listing: get("listing"),
    listingId: get("listingId"),
    propertyId: get("propertyId"),
    agentId: get("agentId"),
    agentName: get("agentName"),
    source: extras.source ?? null,
    fields,
  };
}

/** A lead is usable if we can reply to it — email, or phone for the agent card. */
export function leadHasContactPoint(lead: Lead): boolean {
  return Boolean(lead.email || lead.phone);
}
