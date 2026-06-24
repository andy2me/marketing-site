import type { NextRequest } from "next/server";
import { generateLeadMagnetPdf } from "@/lib/leadmagnets/pdf";
import { getLeadMagnetAsset } from "@/lib/leadmagnets/registry";

// Public download endpoint for an auto-generated lead-magnet PDF. The URL is
// what the asset email points the submitter to — opening the link should
// stream a clean PDF straight to their browser. Content is derived from the
// guide's section text so the file stays in sync with the article.

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await ctx.params;
  const asset = getLeadMagnetAsset(assetId);
  if (!asset) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const pdf = await generateLeadMagnetPdf({
    guide: asset.guide,
    title: asset.title,
    siteUrl: SITE_URL,
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${asset.filename}.pdf"`,
      "Content-Length": String(pdf.byteLength),
      // Content is stable for a given assetId; let the CDN cache aggressively.
      "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
    },
  });
}
