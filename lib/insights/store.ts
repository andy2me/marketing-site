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

const ARTICLES: Record<string, Article> = {
  [sunshineCoastMay2026.slug]: sunshineCoastMay2026,
};

// Editorial calendar — full articles + stubs together. Order = newest first.
// Matt Powe is the single canonical author across the cluster (handoff §9.3).
const CARDS: ArticleCard[] = [
  {
    slug: sunshineCoastMay2026.slug,
    category: sunshineCoastMay2026.category,
    title: sunshineCoastMay2026.title,
    date: sunshineCoastMay2026.date,
    readLabel: `${sunshineCoastMay2026.readMinutes} min read`,
    author: sunshineCoastMay2026.author.name,
  },
  { slug: "auction-or-private-treaty", category: "Selling", title: "Auction or private treaty? How we'd decide for you.", date: "04 May 2026", readLabel: "4 min read", author: "Matt Powe" },
  { slug: "noosaville-supply-story", category: "Buying", title: "Inside Noosaville's quiet supply story.", date: "28 Apr 2026", readLabel: "5 min read", author: "Matt Powe" },
  { slug: "units-vs-houses-river", category: "Buying", title: "Units vs houses on the river: what actually holds value.", date: "22 Apr 2026", readLabel: "6 min read", author: "Matt Powe" },
  { slug: "tewantin-buyers", category: "Locations", title: "What we love about Tewantin (and why buyers are catching on).", date: "21 Apr 2026", readLabel: "5 min read", author: "Matt Powe" },
  { slug: "stylist-roi", category: "Design", title: "How a stylist actually pays for themselves on a $2M home.", date: "14 Apr 2026", readLabel: "6 min read", author: "Matt Powe" },
  { slug: "q1-clearance-rates", category: "Market", title: "Sunshine Coast auction clearance rates — Q1 wrap.", date: "07 Apr 2026", readLabel: "7 min read", author: "Matt Powe" },
  { slug: "boring-properties", category: "Investors", title: "The case for boring properties in a noisy year.", date: "30 Mar 2026", readLabel: "5 min read", author: "Matt Powe" },
  { slug: "photographer-vs-portal", category: "Selling", title: "Why your photographer matters more than your portal package.", date: "23 Mar 2026", readLabel: "4 min read", author: "Matt Powe" },
  { slug: "first-home-buyers", category: "Buying", title: "What we tell first-home buyers (that no-one else will).", date: "16 Mar 2026", readLabel: "6 min read", author: "Matt Powe" },
  { slug: "sunshine-beach-winter", category: "Locations", title: "Sunshine Beach in winter — a buyer's-eye walkthrough.", date: "09 Mar 2026", readLabel: "5 min read", author: "Matt Powe" },
];

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
