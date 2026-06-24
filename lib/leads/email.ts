import "server-only";

import type { Lead } from "./types";

// Lead notifications go out via Resend's REST API with plain fetch — same
// first-party, dependency-free style as lib/rex/client.ts, and nothing here
// touches the browser. Configure with:
//   RESEND_API_KEY   — server-only Resend key
//   LEADS_EMAIL_TO   — recipient(s), comma-separated
//   LEADS_EMAIL_FROM — verified sender, e.g. "Max Property <leads@maxproperty.au>"

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const API_KEY = process.env.RESEND_API_KEY;
const TO = process.env.LEADS_EMAIL_TO;
const FROM = process.env.LEADS_EMAIL_FROM;

export function isEmailConfigured(): boolean {
  return Boolean(API_KEY && TO && FROM);
}

const KIND_LABEL: Record<Lead["kind"], string> = {
  contact: "Contact enquiry",
  appraisal: "Appraisal request",
  newsletter: "Newsletter signup",
  enquiry: "Property enquiry",
  "agent-appraisal": "Agent appraisal request",
  leadmagnet: "Lead-magnet download",
};

function subjectFor(lead: Lead): string {
  const who = lead.name ?? lead.email ?? lead.phone ?? "Unknown";
  const ctx = lead.listing ? ` · ${lead.listing}` : lead.agentName ? ` · ${lead.agentName}` : "";
  return `[Website] ${KIND_LABEL[lead.kind]} — ${who}${ctx}`;
}

function row(label: string, value: string | null): string {
  return value ? `${label}: ${value}\n` : "";
}

function bodyFor(lead: Lead): { text: string; html: string } {
  const lines = [
    row("Type", KIND_LABEL[lead.kind]),
    row("Name", lead.name),
    row("Email", lead.email),
    row("Phone", lead.phone),
    row("Listing", lead.listing),
    row("Agent", lead.agentName),
    row("Source", lead.source),
    row("Message", lead.message),
  ].join("");

  const extras = Object.entries(lead.fields)
    .map(([k, v]) => row(k, v))
    .join("");

  const text = `${lines}${extras ? `\n${extras}` : ""}`.trim();

  // Keep HTML simple and escaped — this is an internal ops email, not marketing.
  const html = `<pre style="font:14px/1.5 ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(text)}</pre>`;
  return { text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Send the lead-notification email. Throws on failure so the caller can decide. */
export async function sendLeadEmail(lead: Lead): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error("Email not configured: set RESEND_API_KEY, LEADS_EMAIL_TO, LEADS_EMAIL_FROM");
  }

  const { text, html } = bodyFor(lead);
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: TO!.split(",").map((a) => a.trim()).filter(Boolean),
      // Reply-To the submitter so the team can respond straight from the inbox.
      ...(lead.email ? { reply_to: lead.email } : {}),
      subject: subjectFor(lead),
      text,
      html,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`Resend send failed: ${detail}`);
  }
}

/** Send the lead-magnet asset email to the submitter — a link to the PDF
 *  generated from the source article. Throws on failure; caller decides. */
export async function sendLeadMagnetAssetEmail({
  to,
  assetTitle,
  downloadUrl,
}: {
  to: string;
  assetTitle: string;
  downloadUrl: string;
}): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error("Email not configured: set RESEND_API_KEY, LEADS_EMAIL_FROM");
  }

  const subject = `Your download: ${assetTitle}`;
  const safeTitle = escapeHtml(assetTitle);
  const safeUrl = escapeHtml(downloadUrl);
  const text = [
    `Thanks for downloading ${assetTitle}.`,
    "",
    `Your PDF is ready: ${downloadUrl}`,
    "",
    "If anything in it sparks a question about your home, just hit reply — Matt reads every one.",
    "",
    "— Max. Property, Noosaville",
  ].join("\n");
  const html = `
    <div style="font:15px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a120c;max-width:560px">
      <p>Thanks for downloading <strong>${safeTitle}</strong>.</p>
      <p>
        <a href="${safeUrl}"
           style="display:inline-block;padding:12px 20px;background:#9d4d2a;color:#fff;text-decoration:none;border-radius:8px;font-weight:500">
          Download the PDF
        </a>
      </p>
      <p style="color:#564c44">Or paste this link into your browser: <a href="${safeUrl}" style="color:#9d4d2a">${safeUrl}</a></p>
      <p>If anything in it sparks a question about your home, just hit reply — Matt reads every one.</p>
      <p style="color:#564c44;margin-top:32px">— Max. Property, Noosaville</p>
    </div>
  `;

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      text,
      html,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`Resend asset send failed: ${detail}`);
  }
}
