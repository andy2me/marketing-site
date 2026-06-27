#!/usr/bin/env node
// Targeted probe: which field in our Leads/create payload upsets Rex.
// Runs against the live tenant — creates a real test lead each time. Delete
// the resulting leads in Rex Settings after probing.
//
//   node --env-file=.env.local scripts/rex-leads-probe.mjs

const BASE = "https://api.rexsoftware.com";
const USER = process.env.REX_USERNAME;
const PASS = process.env.REX_PASSWORD;

const LEAD_SOURCE_ID = process.env.REX_LEAD_SOURCE_ID ?? "189";

const login = async () => {
  const r = await fetch(BASE + "/v1/rex/Authentication/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: USER, password: PASS, token_lifetime: 3600 }),
  });
  return (await r.json()).result;
};

const call = async (token, method, args = {}) => {
  const r = await fetch(BASE + "/v1/rex/" + method, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(args),
  });
  return r.json();
};

(async () => {
  const token = await login();

  // First find/create a single test contact we can reuse across probes.
  const email = "claude-probe@onefivethree.co";
  const search = await call(token, "Contacts/search", {
    criteria: [{ name: "email_address", value: email }],
    limit: 1,
  });
  const rows = Array.isArray(search.result) ? search.result : (search.result?.rows ?? []);
  let contactId = rows[0]?.id ?? null;
  console.log("\n[contacts/search by email] rows:", rows.length, "first:", JSON.stringify(rows[0] ?? null).slice(0, 200));

  if (!contactId) {
    const created = await call(token, "Contacts/create", {
      data: {
        type: "person",
        marketing_enquiry_source: "Internet",
        related: {
          contact_names: [{ name_first: "Claude", name_last: "Probe" }],
          contact_emails: [{ email_address: email, email_desc: "work", email_primary: true }],
        },
      },
    });
    contactId = created.result?.id ?? created.result;
    console.log("[contacts/create] new id:", contactId, "error:", created.error?.message ?? "none");
  }
  console.log("--- using contact id:", contactId);

  const variants = [
    {
      name: "A. minimal — contact + lead_type only",
      data: { contact: { id: contactId }, lead_type: { id: "general" }, note: "PROBE A" },
    },
    {
      name: "B. + lead_source",
      data: { contact: { id: contactId }, lead_type: { id: "general" }, lead_source: { id: LEAD_SOURCE_ID }, note: "PROBE B" },
    },
    {
      name: "C. + tags string array (current code)",
      data: { contact: { id: contactId }, lead_type: { id: "general" }, lead_source: { id: LEAD_SOURCE_ID }, tags: ["website", "website-probe"], note: "PROBE C" },
    },
    {
      name: "D. + tags as {id} array (likely wrong shape but worth testing)",
      data: { contact: { id: contactId }, lead_type: { id: "general" }, lead_source: { id: LEAD_SOURCE_ID }, tags: [{ tag: "website" }, { tag: "website-probe" }], note: "PROBE D" },
    },
    {
      name: "E. numeric contact.id (vs string)",
      data: { contact: { id: Number(contactId) }, lead_type: { id: "general" }, lead_source: { id: LEAD_SOURCE_ID }, note: "PROBE E" },
    },
  ];

  for (const v of variants) {
    const r = await call(token, "Leads/create", { data: v.data });
    const id = r.result?.id ?? r.result;
    const err = r.error?.message ?? null;
    console.log(`\n${v.name}`);
    console.log(`  result_id: ${id ?? "(none)"}  error: ${err ?? "(none)"}`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
