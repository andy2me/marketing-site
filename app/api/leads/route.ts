import type { NextRequest } from "next/server";

import { isEmailConfigured, sendLeadEmail } from "@/lib/leads/email";
import { clientIp, rateLimit } from "@/lib/leads/rate-limit";
import { leadHasContactPoint, normaliseLead } from "@/lib/leads/types";
import { createRexContact, isRexConfigured } from "@/lib/rex/contacts";

// First-party lead intake (code handoff §9). Every site form posts here as
// FormData over same-origin fetch — no third-party script or iframe, so ad
// blockers and tracking protection can't break submissions. From here a lead
// fans out to the agency inbox (Resend) and the Rex CRM.
//
// Anti-spam without blockable third-party JS: a hidden honeypot field, a
// minimum fill-time trap, and an in-memory IP rate limit.

const HONEYPOT_FIELD = "_company";
const TIMESTAMP_FIELD = "_ts";
const MIN_FILL_MS = 1500;

function ok() {
  return Response.json({ ok: true });
}

export async function POST(req: NextRequest) {
  // Rate limit first — cheap, and shields the parsing/delivery below.
  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const raw: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (typeof v === "string") raw[k] = v;
  }

  // Honeypot: real users never fill the hidden field. Bots that do get a 200 so
  // they don't learn they were filtered — we just drop the submission.
  if (raw[HONEYPOT_FIELD]) return ok();

  // Time-trap: a genuine fill takes longer than a fraction of a second.
  const ts = Number(raw[TIMESTAMP_FIELD]);
  if (Number.isFinite(ts) && Date.now() - ts < MIN_FILL_MS) return ok();

  const formId = raw.formId || "contact";
  const lead = normaliseLead(formId, raw, { source: req.headers.get("referer") });

  if (!leadHasContactPoint(lead)) {
    return Response.json({ ok: false, error: "missing_contact" }, { status: 422 });
  }

  // Outside production we surface per-channel detail in the response so a failed
  // submission can be diagnosed from the Network tab without server-log access.
  const debug = process.env.VERCEL_ENV !== "production";

  // No delivery configured (local dev without keys): mirror the old stub so the
  // forms stay usable, and surface the lead in the server log.
  const emailOn = isEmailConfigured();
  const rexOn = isRexConfigured();
  if (!emailOn && !rexOn) {
    console.info(`[leads:${formId}] received (no delivery configured)`, lead);
    return Response.json({ ok: true, ...(debug ? { note: "no delivery configured" } : {}) });
  }

  // Fan out in parallel. Email is the primary, guaranteed channel; Rex is
  // best-effort — a CRM failure must not lose a lead the inbox already has.
  const channels: { name: string; run: Promise<unknown> }[] = [];
  if (emailOn) channels.push({ name: "email", run: sendLeadEmail(lead) });
  if (rexOn) channels.push({ name: "rex", run: createRexContact(lead) });

  const results = await Promise.allSettled(channels.map((c) => c.run));
  const failures: Record<string, string> = {};
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      const name = channels[i]!.name;
      const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
      failures[name] = msg;
      console.error(`[leads:${formId}] ${name} delivery failed:`, r.reason);
    }
  });

  // Which configured channels never even ran (e.g. env vars missing in this scope).
  const skipped = { email: !emailOn, rex: !rexOn };

  if (!results.some((r) => r.status === "fulfilled")) {
    return Response.json(
      { ok: false, error: "delivery_failed", ...(debug ? { failures, skipped } : {}) },
      { status: 502 },
    );
  }

  // At least one channel succeeded — report partial failures in non-prod.
  return Response.json({
    ok: true,
    ...(debug && Object.keys(failures).length ? { failures, skipped } : {}),
  });
}
