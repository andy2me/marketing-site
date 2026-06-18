import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PropertyDetailView } from "@/components/property/PropertyDetailView";
import { getListingBySlug, getListingSlugs, getSimilarListings } from "@/lib/rex";
import { getSiteSettings } from "@/lib/wp/mock";
import { listingJsonLd } from "@/lib/seo/listing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

// ISR over current listings (§8); on-demand via the Rex webhook.
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Property not found" };
  const locality = listing.suburb.replace(/\s+QLD.*$/, "");
  const title = `${listing.street}, ${locality}`;
  return {
    title,
    description: `${listing.beds}-bed ${listing.type.toLowerCase()} — ${listing.street}, ${listing.suburb}. ${listing.price}.`,
    alternates: { canonical: `/properties/${slug}` },
    openGraph: { title: `${title} — Max Property`, url: `${siteUrl}/properties/${slug}` },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [listing, settings] = await Promise.all([getListingBySlug(slug), getSiteSettings()]);
  if (!listing) notFound();

  const similar = await getSimilarListings(slug, 3);
  const jsonLd = listingJsonLd(listing, `${siteUrl}/properties/${slug}`);

  return (
    <>
      <Header current="Buy" nav={settings.nav} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailView listing={listing} similar={similar} />
    </>
  );
}
