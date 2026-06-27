#!/usr/bin/env node
// One-off lookup against the live Rex tenant: dumps lead types, lead sources
// and admin users so the values in lib/rex/lead-config.ts can be filled in.
// Runs against the same Wings API as the rest of the app, with the same creds
// (REX_USERNAME / REX_PASSWORD / optional REX_ACCOUNT_ID).
//
//   node --env-file=.env.local scripts/rex-lookup.mjs
//
// Or pipe to a file the team can review:
//
//   node --env-file=.env.local scripts/rex-lookup.mjs > docs/REX-LOOKUP.md
//
// This is a one-shot; once the lead-config is populated and verified, the
// script doesn't need to run again until the tenant adds new lead types or
// reassigns leads to a different user.

const BASE = process.env.REX_API_BASE ?? "https://api.rexsoftware.com";
const USER = process.env.REX_USERNAME;
const PASS = process.env.REX_PASSWORD;
const ACCOUNT_ID = process.env.REX_ACCOUNT_ID;

if (!USER || !PASS) {
  console.error(
    "REX_USERNAME / REX_PASSWORD are required. Pass them via .env.local with:",
  );
  console.error("  node --env-file=.env.local scripts/rex-lookup.mjs");
  process.exit(2);
}

async function login() {
  const res = await fetch(`${BASE}/v1/rex/Authentication/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: USER,
      password: PASS,
      ...(ACCOUNT_ID ? { account_id: Number(ACCOUNT_ID) } : {}),
      token_lifetime: 3600,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error || typeof data.result !== "string") {
    throw new Error(`Rex login failed: ${data.error?.message ?? `HTTP ${res.status}`}`);
  }
  return data.result;
}

async function rexCall(token, method, args = {}) {
  const res = await fetch(`${BASE}/v1/rex/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(args),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `HTTP ${res.status}`);
  }
  return data.result;
}

function unwrap(result) {
  if (Array.isArray(result)) return result;
  if (result && Array.isArray(result.rows)) return result.rows;
  return [];
}

// Try a couple of plausible method names per concept — Rex's Wings surface is
// large and some collections live under different names depending on tenant
// tier. Stop at the first one that returns rows.
async function lookup(token, label, candidates) {
  let lastError = null;
  for (const { method, args } of candidates) {
    try {
      const result = await rexCall(token, method, args);
      const rows = unwrap(result);
      return { label, method, rows };
    } catch (err) {
      lastError = err;
    }
  }
  return { label, method: null, rows: [], error: lastError?.message ?? "no method succeeded" };
}

// Merge two sources of lead_type values: the schema (Leads/describeModel) and
// the values seen on actual leads in the tenant (Leads/search). Either one
// alone can miss — the schema can omit a custom type, and the existing-leads
// path can omit types nobody's used yet. Together they're a solid catalogue.
function mergeLeadTypeSources(model, leads) {
  const rows = [];
  const seen = new Set();
  const push = (id, label, source) => {
    const key = String(id ?? label);
    if (!key || seen.has(key)) return;
    seen.add(key);
    rows.push({ id: id ?? label, text: label ?? id, source });
  };

  // Pass 1 — the schema: walk for any node containing "lead_type" with an
  // array of enum values.
  if (model) {
    const walk = (node) => {
      if (!node) return;
      if (Array.isArray(node)) {
        for (const v of node) walk(v);
        return;
      }
      if (typeof node === "object") {
        for (const [k, v] of Object.entries(node)) {
          if (/lead_?type/i.test(k) && Array.isArray(v)) {
            for (const entry of v) {
              if (typeof entry === "string") push(entry, entry, "describeModel");
              else if (entry && typeof entry === "object") {
                push(
                  entry.id ?? entry.value ?? entry.name,
                  entry.text ?? entry.label ?? entry.name ?? entry.value,
                  "describeModel",
                );
              }
            }
          }
          walk(v);
        }
      }
    };
    walk(model);
  }

  // Pass 2 — values seen on existing leads.
  for (const lead of leads ?? []) {
    if (!lead || typeof lead !== "object") continue;
    const lt = lead.lead_type;
    if (lt == null) continue;
    if (typeof lt === "string") push(lt, lt, "existing lead");
    else if (typeof lt === "object") {
      push(lt.id ?? lt.value, lt.text ?? lt.label ?? lt.name, "existing lead");
    }
  }

  return {
    label: "Lead types",
    method: rows.length ? "Leads/describeModel + Leads/search" : null,
    rows,
    error: rows.length ? undefined : "no lead_type values found in model or existing leads",
  };
}

function table(rows, columns) {
  if (!rows.length) return "_no rows returned_\n";
  const header = `| ${columns.map((c) => c.label).join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows
    .map((r) => `| ${columns.map((c) => formatCell(r[c.key])).join(" | ")} |`)
    .join("\n");
  return `${header}\n${divider}\n${body}\n`;
}

function formatCell(v) {
  if (v == null) return "";
  if (typeof v === "object") return JSON.stringify(v).replace(/\|/g, "\\|");
  return String(v).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

async function main() {
  const token = await login();

  // Step 1: get every value-list name so we can match lead types / sources by
  // the actual list_name this tenant uses (varies by Rex version).
  let valueListNames = [];
  try {
    const result = await rexCall(token, "AdminValueLists/getValueListNames", {});
    valueListNames = unwrap(result);
  } catch {
    // Empty list will surface as a no-method block in the report.
  }

  // Heuristic: pick lists whose name suggests lead types / lead sources.
  const matchLeadType = (n) => /^(lead[_ -]?type)s?$/i.test(n);
  const matchLeadSource = (n) => /^(lead[_ -]?source|enquiry[_ -]?source)s?$/i.test(n);

  const leadTypeListName = valueListNames.find((v) =>
    matchLeadType(typeof v === "string" ? v : v?.name ?? v?.list_name ?? ""),
  );
  const leadSourceListName = valueListNames.find((v) =>
    matchLeadSource(typeof v === "string" ? v : v?.name ?? v?.list_name ?? ""),
  );

  function nameOf(v) {
    return typeof v === "string" ? v : v?.name ?? v?.list_name ?? "";
  }

  // Lead types in this tenant aren't in AdminValueLists — Rex treats them as
  // a system enum on the Leads service. Two paths: describeModel surfaces the
  // schema-level enum; a search over existing leads surfaces the values
  // actually in use. Run both — they corroborate each other.
  let leadsModel = null;
  try {
    leadsModel = await rexCall(token, "Leads/describeModel", {});
  } catch {
    leadsModel = null;
  }
  let existingLeads = [];
  try {
    const result = await rexCall(token, "Leads/search", {
      limit: 25,
      result_format: "default",
    });
    existingLeads = unwrap(result);
  } catch {
    existingLeads = [];
  }
  const leadTypes = mergeLeadTypeSources(leadsModel, existingLeads);

  const leadSources = leadSourceListName
    ? await lookup(token, "Lead sources", [
        {
          method: "AdminValueLists/getListValues",
          args: { list_name: nameOf(leadSourceListName) },
        },
      ])
    : { label: "Lead sources", method: null, rows: [], error: "no lead_source value list found" };

  // AccountUsers/search returns only ids in the default result format. The
  // real fields live behind extra_options.extra_fields per Rex's search
  // signature.
  const users = await lookup(token, "Account users", [
    {
      method: "AccountUsers/search",
      args: {
        limit: 100,
        extra_options: { extra_fields: ["name", "email_address", "first_name", "last_name", "is_active"] },
      },
    },
    { method: "AccountUsers/search", args: { limit: 100 } },
  ]);

  const stamp = new Date().toISOString().slice(0, 10);
  process.stdout.write(`# Rex tenant lookup — ${stamp}\n\n`);
  process.stdout.write(
    "Generated by `scripts/rex-lookup.mjs`. Use this to populate" +
      " `lib/rex/lead-config.ts` (the `TODO_REX_LOOKUP_*` sentinels).\n\n",
  );

  // AdminValueLists/getListValues returns rows whose shape varies by tenant.
  // Show every key found across rows so nothing useful is hidden.
  const valueListCols = (() => {
    const keys = new Set();
    for (const r of [...leadTypes.rows, ...leadSources.rows]) {
      if (r && typeof r === "object") for (const k of Object.keys(r)) keys.add(k);
    }
    // Promote the ones we expect to the front, fall through to whatever else.
    const order = ["id", "value", "text", "name", "list_item_active"];
    const ordered = [...order.filter((k) => keys.has(k)), ...[...keys].filter((k) => !order.includes(k))];
    return ordered.map((k) => ({ key: k, label: k }));
  })();

  process.stdout.write(`## Value-list names this tenant has\n\n`);
  process.stdout.write(
    table(
      valueListNames.map((v) => ({ name: nameOf(v) })),
      [{ key: "name", label: "list_name" }],
    ),
  );
  process.stdout.write(
    `\n_Picked for lead types: \`${nameOf(leadTypeListName) || "(none matched)"}\` · ` +
      `for lead sources: \`${nameOf(leadSourceListName) || "(none matched)"}\`_\n\n`,
  );

  process.stdout.write(`## Lead types  _(${leadTypes.method ?? "no method"})_\n\n`);
  process.stdout.write(table(leadTypes.rows, [
    { key: "id", label: "id" },
    { key: "text", label: "label" },
    { key: "source", label: "source" },
  ]));
  process.stdout.write("\n");

  if (leadsModel) {
    process.stdout.write("<details><summary>Raw Leads/describeModel (for manual inspection if auto-extract missed)</summary>\n\n```json\n");
    process.stdout.write(JSON.stringify(leadsModel, null, 2).slice(0, 20000));
    process.stdout.write("\n```\n\n</details>\n\n");
  }
  if (existingLeads.length) {
    process.stdout.write(`<details><summary>${existingLeads.length} existing lead row(s) (for shape reference)</summary>\n\n\`\`\`json\n`);
    process.stdout.write(JSON.stringify(existingLeads.slice(0, 5), null, 2).slice(0, 12000));
    process.stdout.write("\n```\n\n</details>\n\n");
  }

  process.stdout.write(`## Lead sources  _(${leadSources.method ?? "no method"})_\n\n`);
  process.stdout.write(table(leadSources.rows, valueListCols));
  process.stdout.write("\n");

  process.stdout.write(`## Account users  _(${users.method ?? "no method"})_\n\n`);
  process.stdout.write(
    table(users.rows, [
      { key: "id", label: "id" },
      { key: "name", label: "name" },
      { key: "email_address", label: "email" },
      { key: "is_active", label: "active" },
    ]),
  );
  process.stdout.write("\n");

  process.stdout.write("## Next steps\n\n");
  process.stdout.write(
    "1. Pick the `lead_type.id` for each formId mapping in `lib/rex/lead-config.ts`.\n" +
      "2. Pick the `lead_source.id` representing the website. If none exists, ask Matt to add one in **Settings → Lead sources**, then re-run this lookup.\n" +
      "3. Pick the `assignee.id` for Matt (or whoever owns website leads).\n" +
      "4. Replace each `TODO_REX_LOOKUP_*` sentinel and open a small PR.\n",
  );

  for (const r of [leadTypes, leadSources, users]) {
    if (r.error) {
      process.stderr.write(`! ${r.label}: ${r.error}\n`);
    }
  }
}

main().catch((err) => {
  console.error("rex-lookup failed:", err);
  process.exit(1);
});
