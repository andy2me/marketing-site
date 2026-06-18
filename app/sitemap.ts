import type { MetadataRoute } from "next";
import { getListingSlugs } from "@/lib/rex";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

// Dynamic sitemap (§10): static routes + every listing. Insights articles + location
// pages get added once that content is wired.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/sell",
    "/buy",
    "/sold",
    "/locations",
    "/insights",
    "/team",
    "/contact",
    "/privacy",
  ];
  const staticEntries = staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
  }));

  const listingEntries = (await getListingSlugs()).map((slug) => ({
    url: `${base}/properties/${slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...listingEntries];
}
