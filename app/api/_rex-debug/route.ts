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
    const rows = await searchPublishedListings({ limit: 3 }, { revalidate: 0 });
    const first = rows[0] as
      | Partial<{
          _id: unknown;
          system_listing_state: unknown;
          address: { latitude?: unknown; longitude?: unknown };
          images: unknown[];
        }>
      | undefined;
    broadSearch = {
      ok: true,
      rowCount: rows.length,
      firstRowKeys: first ? Object.keys(first).sort() : null,
      firstRowSample: first
        ? {
            _id: first._id ?? null,
            system_listing_state: first.system_listing_state ?? null,
            address_lat: first.address?.latitude ?? null,
            address_lng: first.address?.longitude ?? null,
            image_count: (first.images ?? []).length,
          }
        : null,
    };
  } catch (err) {
    broadSearch = { ok: false, error: err instanceof Error ? err.message : String(err) };
  }

  // Try the "current" filter we actually use in production.
  let currentSearch: unknown;
  try {
    const rows = await searchPublishedListings(
      {
        criteria: [{ name: "listing.system_listing_state", value: "current" }],
        limit: 3,
      },
      { revalidate: 0 },
    );
    currentSearch = { ok: true, rowCount: rows.length };
  } catch (err) {
    currentSearch = { ok: false, error: err instanceof Error ? err.message : String(err) };
  }

  return Response.json({ env, broadSearch, currentSearch });
}
