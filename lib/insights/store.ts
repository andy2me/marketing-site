// Max Property — Insights store (accessor seam).
//
// Mirrors lib/report/store.ts. Full articles (with body Blocks) live as typed data files under
// data/insights/{slug}.ts and are registered below. The remaining headline rows from the
// editorial calendar are listed as `ArticleCard` stubs so the /insights index + related rail
// keep rendering — their detail routes resolve to a "coming soon" placeholder until written.
//
// SWAP PATH: when a headless CMS lands, the call sites (getArticle / getArticleSlugs /
// listCards / getRelated) stay identical; only this registry moves to a fetcher.

import type { Article, ArticleCard } from "./types";
import { article as sunshineCoastMay2026 } from "@/data/insights/sunshine-coast-market-may-2026";
import { article as whyQldAuctionsNoPriceGuide } from "@/data/insights/why-queensland-auctions-no-price-guide";
import { article as whatTheListingDoesntTellYou } from "@/data/insights/what-the-listing-doesnt-tell-you";
import { article as whosMovingToTheSunshineCoast } from "@/data/insights/whos-moving-to-the-sunshine-coast";

// Newest first — drives the /insights browser order and the featured pick fallback.
const ALL_ARTICLES: Article[] = [
  whyQldAuctionsNoPriceGuide,
  whatTheListingDoesntTellYou,
  whosMovingToTheSunshineCoast,
  sunshineCoastMay2026,
];

const ARTICLES: Record<string, Article> = Object.fromEntries(
  ALL_ARTICLES.map((a) => [a.slug, a]),
);

// Editorial calendar — live articles only. Matt Powe is the single canonical author
// across the cluster (handoff §9.3).
const CARDS: ArticleCard[] = ALL_ARTICLES.map((a) => ({
  slug: a.slug,
  category: a.category,
  title: a.title,
  date: a.date,
  readLabel: `${a.readMinutes} min read`,
  author: a.author.name,
}));

/** Full article (with body) — null when the slug isn't fully written yet. */
export async function getArticle(slug: string): Promise<Article | null> {
  return ARTICLES[slug] ?? null;
}

/** Every slug that resolves to a full article — drives generateStaticParams. */
export async function getArticleSlugs(): Promise<string[]> {
  return Object.keys(ARTICLES);
}

/** Every slug that has a /insights/{slug} page — full articles + stub placeholders. */
export async function getAllInsightSlugs(): Promise<string[]> {
  return CARDS.map((c) => c.slug);
}

/** Every published row (full + stub) for the /insights browser + related rail. */
export async function listCards(): Promise<ArticleCard[]> {
  return CARDS;
}

/** Card metadata for a slug — works for both full + stub entries. */
export async function getCard(slug: string): Promise<ArticleCard | null> {
  return CARDS.find((c) => c.slug === slug) ?? null;
}

/** Resolve a list of related slugs to cards. Missing slugs are dropped silently. */
export async function getRelated(slugs: string[]): Promise<ArticleCard[]> {
  return slugs
    .map((slug) => CARDS.find((c) => c.slug === slug))
    .filter((c): c is ArticleCard => Boolean(c));
}

/** The article that occupies the "Editor's pick" slot on /insights. */
export async function getFeatured(): Promise<Article | null> {
  const featured = Object.values(ARTICLES).find((a) => a.badge === "Editor's pick");
  return featured ?? null;
}
