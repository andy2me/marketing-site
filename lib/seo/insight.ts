// JSON-LD for an insights / journal article (code handoff §10).
// Emits Article + BreadcrumbList graphs so search results can show byline + breadcrumb.

import type { Article } from "@/lib/insights/types";

export function articleJsonLd(article: Article, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription ?? article.dek,
    datePublished: article.isoDate,
    dateModified: article.isoDate,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Max Property",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: article.category,
  };
}

export function breadcrumbJsonLd(siteUrl: string, slug: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${siteUrl}/insights` },
      { "@type": "ListItem", position: 3, name: title, item: `${siteUrl}/insights/${slug}` },
    ],
  };
}
