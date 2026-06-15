import { NextRequest } from "next/server";
import { isRexConfigured, searchPublishedListings } from "@/lib/rex/client";

// TEMP: diagnostic route for live-Rex troubleshooting. Remove once integration is verified.
// Requires ?secret=$REX_WEBHOOK_SECRET so it's not unauthenticated.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const expected = process.env.REX_WEBHOOK_SECRET;
  const presented = req.nextUrl.searchParams.get("secret");
  if (!expected || presented !== expected) {
    return Response.json({ error: "unauthorised" }, { status: 401 });
  }

  const env = {
    REX_USERNAME: Boolean(process.env.REX_USERNAME),
    REX_PASSWORD: Boolean(process.env.REX_PASSWORD),
    REX_ACCOUNT_ID: process.env.REX_ACCOUNT_ID ? String(process.env.REX_ACCOUNT_ID) : null,
    REX_API_BASE: process.env.REX_API_BASE ?? "(default)",
    isRexConfigured: isRexConfigured(),
  };

  // Try a no-criteria search first (just `publish_to_external` is auto-prepended by the client).
  let broadSearch: unknown;
  try {
    const res = await searchPublishedListings({ limit: 3 }, { revalidate: 0 });
    broadSearch = {
      ok: true,
      total: res.total ?? null,
      rowCount: res.rows.length,
      firstRowKeys: res.rows[0] ? Object.keys(res.rows[0]).sort() : null,
      firstRowSample: res.rows[0]
        ? {
            _id: (res.rows[0] as { _id?: unknown })._id ?? null,
            system_listing_state: (res.rows[0] as { system_listing_state?: unknown })
              .system_listing_state ?? null,
            address_lat: (res.rows[0] as { address?: { latitude?: unknown } }).address?.latitude ?? null,
            address_lng: (res.rows[0] as { address?: { longitude?: unknown } }).address?.longitude ?? null,
            image_count: ((res.rows[0] as { images?: unknown[] }).images ?? []).length,
          }
        : null,
    };
  } catch (err) {
    broadSearch = { ok: false, error: err instanceof Error ? err.message : String(err) };
  }

  // Try the "current" filter we actually use in production.
  let currentSearch: unknown;
  try {
    const res = await searchPublishedListings(
      {
        criteria: [{ name: "listing.system_listing_state", value: ["current"], type: "in" }],
        limit: 3,
      },
      { revalidate: 0 },
    );
    currentSearch = { ok: true, total: res.total ?? null, rowCount: res.rows.length };
  } catch (err) {
    currentSearch = { ok: false, error: err instanceof Error ? err.message : String(err) };
  }

  return Response.json({ env, broadSearch, currentSearch });
}
