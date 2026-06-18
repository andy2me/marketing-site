import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

// On-demand ISR endpoint (§6). Today: Rex listing-change webhooks. WordPress publish
// webhooks will share this endpoint once that integration lands.
//
// Rex sends `v1_context_only` payloads — ID-only refs; we map them onto cache tags
// set by lib/rex/client.ts (`listings` for the collection, `listing:<id>` per detail).
// Using `{ expire: 0 }` rather than the "max" profile because a listing-change
// notification is the user telling us the cache is wrong *now*, not "stale soon".

const REX_SECRET = process.env.REX_WEBHOOK_SECRET;

type RexWebhookEvent = {
  id?: string | number;
  listing_id?: string | number;
  context?: { id?: string | number };
};

type RexWebhookBody = {
  events?: RexWebhookEvent[];
  context?: { id?: string | number };
  id?: string | number;
};

function extractListingIds(body: unknown): string[] {
  if (!body || typeof body !== "object") return [];
  const b = body as RexWebhookBody;
  const ids = new Set<string>();
  const add = (v: unknown) => {
    if (typeof v === "string" || typeof v === "number") ids.add(String(v));
  };
  add(b.id);
  add(b.context?.id);
  for (const ev of b.events ?? []) {
    add(ev.id);
    add(ev.listing_id);
    add(ev.context?.id);
  }
  return [...ids];
}

export async function POST(req: NextRequest) {
  if (!REX_SECRET) {
    return Response.json({ revalidated: false, error: "REX_WEBHOOK_SECRET not set" }, { status: 500 });
  }

  const presented =
    req.headers.get("x-webhook-secret") ?? req.nextUrl.searchParams.get("secret");
  if (presented !== REX_SECRET) {
    return Response.json({ revalidated: false, error: "bad secret" }, { status: 401 });
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    // Body might be empty / non-JSON — that's fine, we'll just blow the broad tag.
  }

  const ids = extractListingIds(body);
  revalidateTag("listings", { expire: 0 });
  for (const id of ids) revalidateTag(`listing:${id}`, { expire: 0 });

  return Response.json({ revalidated: true, tags: ["listings", ...ids.map((id) => `listing:${id}`)] });
}
