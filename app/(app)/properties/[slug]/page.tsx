import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";
import { getListingBySlug, getListingSlugs } from "@/lib/rex/mock";

// ISR over current listings (§8); on-demand via Rex webhook.
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Next 16: params is async.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  return { title: listing ? `${listing.street}, ${listing.suburb}` : "Property" };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  return (
    <PagePlaceholder
      title={listing ? listing.street : "Property"}
      current="Buy"
      note="Property detail — gallery + lightbox, key facts, sticky sub-nav, sticky agent panel, similar listings (§8). Built in the Listings stage."
    />
  );
}
