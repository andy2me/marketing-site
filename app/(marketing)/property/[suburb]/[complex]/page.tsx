// Complex profile — /property/{suburb}/{complex}/.
//
// Recipe (top → bottom):
//   ProfileNav (Header) → Breadcrumb → Hero (with MapEmbed) → Stats band →
//   Matt's commentary → [LatestReportBlock — M6] → Activity feed →
//   [Units section — M5] → Buyer-interest band → About this data.
//
// `dynamicParams: false` so unknown suburb/complex slugs hard-404 rather than
// re-rendering on every miss.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/lib/wp/mock";
import {
  getComplexBySlug,
  getComplexSlugs,
  getLatestReport,
  stackPlanRows,
} from "@/lib/complexes/store";
import {
  ComplexAboutData,
  ComplexActivityFeed,
  ComplexBreadcrumb,
  ComplexBuyerInterestBand,
  ComplexCommentary,
  ComplexHero,
  ComplexStats,
} from "@/components/complex/ComplexParts";
import { LatestReportBlock } from "@/components/complex/ReportLinks";
import { UnitsSection } from "@/components/complex/UnitsSection";
import { BuyerInterestProvider } from "@/components/buyer-interest/BuyerInterestProvider";
import {
  ComplexPageView,
  ScrollDepthTracker,
} from "@/components/property/ProfileTrackers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

export const dynamicParams = false;
export const revalidate = 1800;

export async function generateStaticParams() {
  return getComplexSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string; complex: string }>;
}): Promise<Metadata> {
  const { suburb, complex } = await params;
  const profile = getComplexBySlug(suburb, complex);
  if (!profile) return { title: "Property not found" };
  const canonical = `/property/${profile.suburbSlug}/${profile.slug}`;
  return {
    title: `${profile.name}, ${profile.suburbName} — Property Profile`,
    description: profile.intro,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${profile.name}, ${profile.suburbName}`,
      description: profile.intro,
      url: `${SITE_URL}${canonical}`,
    },
  };
}

export default async function ComplexProfilePage({
  params,
}: {
  params: Promise<{ suburb: string; complex: string }>;
}) {
  const { suburb, complex } = await params;
  const profile = getComplexBySlug(suburb, complex);
  if (!profile) notFound();

  const settings = await getSiteSettings();

  return (
    <>
      <Header current="Locations" nav={settings.nav} />

      <BuyerInterestProvider
        entity={{
          complexSlug: profile.slug,
          complexName: profile.name,
        }}
      >
        <main style={{ background: "var(--color-bg-page)", minHeight: "100vh" }}>
          <ComplexPageView
            complexId={profile.id}
            totalUnits={profile.stats.totalUnits}
            recentEventsCount={profile.events.length}
          />
          <ScrollDepthTracker />
          <ComplexBreadcrumb profile={profile} />
          <ComplexHero profile={profile} />
          <ComplexStats profile={profile} />
          <ComplexCommentary profile={profile} />
          <LatestReportBlock report={getLatestReport(profile)} />
          <ComplexActivityFeed profile={profile} />
          <UnitsSection
            units={profile.units}
            rows={stackPlanRows(profile)}
            unitHrefBase={`/property/${profile.suburbSlug}/${profile.slug}/`}
            totalUnits={profile.stats.totalUnits}
          />
          <ComplexBuyerInterestBand profile={profile} />
          <ComplexAboutData />
        </main>
      </BuyerInterestProvider>
    </>
  );
}
