import type { NextRequest } from "next/server";

/**
 * On-demand ISR endpoint (§6). Receives authenticated webhooks from WordPress (content
 * publish) and Rex (listing change) and revalidates affected paths/tags.
 *
 * TODO(§6): verify the per-source secret/signature (WP_PREVIEW_SECRET / REX_WEBHOOK_SECRET),
 * then call revalidatePath / revalidateTag. Note Next 16 requires a cacheLife profile:
 *   revalidateTag("listings", "max")
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret) {
    return Response.json({ revalidated: false, error: "missing secret" }, { status: 401 });
  }

  return Response.json(
    { revalidated: false, note: "stub — wire WP/Rex webhook auth + revalidation (§6)" },
    { status: 501 },
  );
}
