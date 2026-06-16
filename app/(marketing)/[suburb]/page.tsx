// Suburb Hub — design handoff §4. Route: /{suburb}/ (e.g. /noosaville).
// Top-level dynamic segment: `dynamicParams: false` makes any non-prerendered
// slug hard-404 so we don't catch typos meant for siblings (/buy, /sell, …).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/wp/mock";
import { getActiveListings } from "@/lib/rex";
import { getHub, getHubSlugs } from "@/lib/suburbs/store";
import { getPillar } from "@/lib/guides/store";
import { hubBreadcrumbJsonLd, placeJsonLd } from "@/lib/seo/hub";
import {
  HubAgent,
  HubClosing,
  HubHero,
  HubInsights,
  HubListings,
  HubPillars,
  HubStats,
} from "@/components/content/HubParts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

export const dynamicParams = false;
export const revalidate = 1800;

export async function generateStaticParams() {
  return getHubSlugs().map((suburb) => ({ suburb }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string }>;
}): Promise<Metadata> {
  const { suburb } = await params;
  const hub = getHub(suburb);
  if (!hub) return { title: "Suburb not found" };
  return {
    title: `${hub.name} — Suburb Guide`,
    description: hub.hero.intro,
    alternates: { canonical: `/${hub.slug}` },
    openGraph: {
      type: "website",
      title: `${hub.name} — Suburb Guide`,
      description: hub.hero.intro,
      url: `${SITE_URL}/${hub.slug}`,
    },
  };
}

export default async function SuburbHubPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb } = await params;
  const hub = getHub(suburb);
  if (!hub) notFound();

  const [settings, listings] = await Promise.all([
    getSiteSettings(),
    getActiveListings(),
  ]);
  const suburbListings = listings
    .filter((l) => l.suburb.toLowerCase().includes(hub.name.toLowerCase()))
    .slice(0, 3);

  // Pillars that have a registered guide. Unregistered ones render as a
  // "Coming soon" tile so the Hub doesn't dangle dead links.
  const available = new Set(
    hub.pillars
      .filter((p) => getPillar(hub.slug, p.key) !== null)
      .map((p) => p.key),
  );

  return (
    <>
      <Header current="Locations" nav={settings.nav} transparent />

      <main>
        <HubHero hub={hub} />
        <HubStats hub={hub} />
        <HubPillars pillars={hub.pillars} available={available} />
        <HubListings
          heading={`Live in ${hub.name}`}
          items={suburbListings}
          joinHref={`/contact?enquiry=buy&suburb=${encodeURIComponent(hub.name)}`}
        />
        <HubInsights suburb={hub.name} items={hub.insights} />
        <HubAgent agent={hub.agent} suburb={hub.name} />
        <HubClosing suburb={hub.name} />
      </main>

      <Footer settings={settings} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeJsonLd(hub, SITE_URL)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hubBreadcrumbJsonLd(SITE_URL, hub)),
        }}
      />
    </>
  );
}
