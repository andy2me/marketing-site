import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import {
  HomeHero,
  HomeAudienceSplit,
  HomeProofBar,
  HomeWhy,
  HomeFeatured,
  HomeLocations,
  HomeInsights,
  HomeTestimonials,
  HomeCTABand,
} from "@/components/home/HomeSections";
import { getHomeContent, getSiteSettings } from "@/lib/wp/mock";
import { getFeaturedListings } from "@/lib/rex";
import { getRatingSummary, getReviews } from "@/lib/reviews/mock";
import { listCards } from "@/lib/insights/store";

export const metadata: Metadata = {
  title: { absolute: "Max Property — Estate Agents, Sunshine Coast" },
  description:
    "Boutique estate agents on the Sunshine Coast. Maximum outcomes whether you're buying or selling — personalised service, trusted expertise.",
  alternates: { canonical: "/" },
};

// ISR (§6): Home revalidates hourly + on-demand via the WP publish webhook.
export const revalidate = 3600;

export default async function HomePage() {
  const [content, settings, featured, ratingSummary, reviews, insightCards] = await Promise.all([
    getHomeContent(),
    getSiteSettings(),
    getFeaturedListings(3),
    getRatingSummary(),
    getReviews(),
    listCards(),
  ]);

  const insights = {
    ...content.insights,
    articles: insightCards.slice(0, 3).map((c) => ({
      category: c.category,
      title: c.title,
      date: c.date,
      readTime: c.readLabel.replace(/\s*read$/, ""),
      slug: c.slug,
      image: c.heroSrc,
      imageAlt: c.heroAlt,
    })),
  };

  return (
    <>
      <Header transparent nav={settings.nav} />
      <main>
        <HomeHero hero={content.hero} />
        <HomeAudienceSplit audience={content.audience} />
        <HomeProofBar proof={content.proof} />
        <HomeWhy why={content.why} />
        <HomeFeatured featured={content.featured} listings={featured} />
        <HomeLocations locations={content.locations} />
        <HomeInsights insights={insights} />
        <HomeTestimonials testimonials={content.testimonials} summary={ratingSummary} reviews={reviews} />
        <HomeCTABand cta={content.cta} />
      </main>
    </>
  );
}
