// JSON-LD generators for guide pages (handoff §7).
// A pillar page emits Article + FAQPage + BreadcrumbList. A supporting page
// uses the same Article + BreadcrumbList trio (and FAQPage if it carries Q&As).

import type { Guide } from "@/lib/guides/types";

function pageUrl(siteUrl: string, guide: Guide): string {
  if (guide.variant === "pillar") {
    return `${siteUrl}/${guide.suburb}/${guide.pillar}`;
  }
  return `${siteUrl}/${guide.suburb}/${guide.pillar}/${guide.slug ?? ""}`;
}

function suburbName(slug: string): string {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function pillarName(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function guideArticleJsonLd(guide: Guide, siteUrl: string) {
  const url = pageUrl(siteUrl, guide);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${guide.hero.h1Pre}${guide.hero.h1Em}${guide.hero.h1Post}`.trim(),
    description: guide.metaDescription,
    datePublished: guide.publishedISO,
    dateModified: guide.modifiedISO,
    author: {
      "@type": "Person",
      name: guide.author.name,
      jobTitle: guide.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Max. Property",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function guideFAQJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function guideBreadcrumbJsonLd(guide: Guide, siteUrl: string) {
  const items: { name: string; item: string }[] = [
    { name: "Home", item: `${siteUrl}/` },
    {
      name: suburbName(guide.suburb),
      item: `${siteUrl}/${guide.suburb}`,
    },
    {
      name: pillarName(guide.pillar),
      item: `${siteUrl}/${guide.suburb}/${guide.pillar}`,
    },
  ];
  if (guide.variant === "supporting" && guide.slug) {
    const crumb = guide.slug
      .split("-")
      .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
      .join(" ");
    items.push({
      name: crumb,
      item: `${siteUrl}/${guide.suburb}/${guide.pillar}/${guide.slug}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}
