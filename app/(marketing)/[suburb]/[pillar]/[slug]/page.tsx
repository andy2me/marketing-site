// Supporting (cluster) article route — design handoff §6.
// /{suburb}/{pillar}/{slug}/. Third-level dynamic; `dynamicParams: false` keeps
// unknown spokes hard-404 rather than catching typos meant for sibling routes.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/lib/wp/mock";
import { getSpoke, getSpokeSlugs } from "@/lib/guides/store";
import {
  guideArticleJsonLd,
  guideBreadcrumbJsonLd,
  guideFAQJsonLd,
} from "@/lib/seo/guide";
import { ReadingProgressBar } from "@/components/content/ReadingProgressBar";
import {
  GuideClosing,
  GuideFAQSection,
  GuideHero,
  GuideRelated,
  GuideSupportingBody,
} from "@/components/content/GuideParts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

export const dynamicParams = false;
export const revalidate = 1800;

export async function generateStaticParams() {
  return getSpokeSlugs().map(({ suburb, pillar, slug }) => ({
    suburb,
    pillar,
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string; pillar: string; slug: string }>;
}): Promise<Metadata> {
  const { suburb, pillar, slug } = await params;
  const guide = getSpoke(suburb, pillar, slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: { canonical: `/${guide.suburb}/${guide.pillar}/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.metaDescription,
      url: `${SITE_URL}/${guide.suburb}/${guide.pillar}/${guide.slug}`,
      authors: [guide.author.name],
      publishedTime: guide.publishedISO,
      modifiedTime: guide.modifiedISO,
    },
  };
}

export default async function SpokePage({
  params,
}: {
  params: Promise<{ suburb: string; pillar: string; slug: string }>;
}) {
  const { suburb, pillar, slug } = await params;
  const guide = getSpoke(suburb, pillar, slug);
  if (!guide) notFound();

  const settings = await getSiteSettings();
  const pillarName =
    guide.pillar.charAt(0).toUpperCase() + guide.pillar.slice(1);
  const suburbName = guide.suburb
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

  // Gate related-rail cards: registered spokes stay clickable, others render as
  // "Coming soon" tiles so the rail isn't a graveyard of 404 links.
  const liveRelated = new Set<string>(
    (guide.related ?? [])
      .map((r) => r.href)
      .filter((href) => {
        const [, suburbSlug, pillarSlug, spokeSlug] = href.split("/");
        return spokeSlug ? getSpoke(suburbSlug, pillarSlug, spokeSlug) !== null : false;
      }),
  );

  return (
    <>
      <ReadingProgressBar />
      <Header current="Insights" nav={settings.nav} />

      <main>
        <GuideHero guide={guide} variant="supporting" />
        <GuideSupportingBody guide={guide} />
        <GuideFAQSection
          heading={guide.faqHeading ?? "Common questions."}
          eyebrow={guide.faqEyebrow ?? "§ Questions, answered"}
          items={guide.faqs}
        />
        {guide.related && guide.related.length > 0 ? (
          <GuideRelated
            heading={
              guide.relatedHeading ?? `More in ${pillarName} in ${suburbName}`
            }
            items={guide.related}
            allHref={`/${guide.suburb}/${guide.pillar}`}
            allLabel={`All ${pillarName} guides`}
            liveHrefs={liveRelated}
          />
        ) : null}
        <GuideClosing guide={guide} />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guideArticleJsonLd(guide, SITE_URL)),
        }}
      />
      {guide.faqs.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(guideFAQJsonLd(guide)),
          }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guideBreadcrumbJsonLd(guide, SITE_URL)),
        }}
      />
    </>
  );
}
