// Content Pillar route — design handoff §5. /{suburb}/{pillar}/.
// Nested dynamic segment under [suburb]. `dynamicParams: false` again — unknown
// pillars under a known suburb hard-404 rather than catching a typo.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/wp/mock";
import { getPillar, getPillarSlugs, getSpoke } from "@/lib/guides/store";
import {
  guideArticleJsonLd,
  guideBreadcrumbJsonLd,
  guideFAQJsonLd,
} from "@/lib/seo/guide";
import { ReadingProgressBar } from "@/components/content/ReadingProgressBar";
import {
  GuideBody,
  GuideClosing,
  GuideClusterIndex,
  GuideFAQSection,
  GuideHero,
} from "@/components/content/GuideParts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

export const dynamicParams = false;
export const revalidate = 1800;

export async function generateStaticParams() {
  return getPillarSlugs().map(({ suburb, pillar }) => ({ suburb, pillar }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string; pillar: string }>;
}): Promise<Metadata> {
  const { suburb, pillar } = await params;
  const guide = getPillar(suburb, pillar);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: { canonical: `/${guide.suburb}/${guide.pillar}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.metaDescription,
      url: `${SITE_URL}/${guide.suburb}/${guide.pillar}`,
      authors: [guide.author.name],
      publishedTime: guide.publishedISO,
      modifiedTime: guide.modifiedISO,
    },
  };
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ suburb: string; pillar: string }>;
}) {
  const { suburb, pillar } = await params;
  const guide = getPillar(suburb, pillar);
  if (!guide) notFound();

  const settings = await getSiteSettings();

  // Which cluster spokes have a registered guide? Unregistered ones render as
  // "Coming soon" rows so the cluster index doesn't dangle dead links.
  const liveSpokes = new Set<string>(
    (guide.cluster ?? [])
      .map((c) => c.href)
      .filter((href) => {
        const [, suburbSlug, pillarSlug, spokeSlug] = href.split("/");
        return spokeSlug ? getSpoke(suburbSlug, pillarSlug, spokeSlug) !== null : false;
      }),
  );
  // Opposite pillar — only show the button if it's actually registered.
  const oppositePillar =
    guide.pillar === "buying"
      ? "selling"
      : guide.pillar === "selling"
        ? "buying"
        : null;
  const oppositeLive =
    oppositePillar !== null && getPillar(guide.suburb, oppositePillar) !== null;

  return (
    <>
      <ReadingProgressBar />
      <Header current="Insights" nav={settings.nav} />

      <main>
        <GuideHero guide={guide} />
        <GuideBody guide={guide} />
        <GuideFAQSection
          heading="You're entitled to clear answers."
          items={guide.faqs}
        />
        {guide.cluster && guide.cluster.length > 0 ? (
          <GuideClusterIndex
            guide={guide}
            items={guide.cluster}
            liveHrefs={liveSpokes}
            oppositeLive={oppositeLive}
          />
        ) : null}
        <GuideClosing guide={guide} />
      </main>

      <Footer settings={settings} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guideArticleJsonLd(guide, SITE_URL)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guideFAQJsonLd(guide)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guideBreadcrumbJsonLd(guide, SITE_URL)),
        }}
      />
    </>
  );
}
