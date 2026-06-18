// Max Property — Insights child template · /insights/{slug}
// Two render paths: (1) full article when ARTICLES[slug] is present; (2) "coming
// soon" placeholder when only a CARDS stub exists, so headline rows in the
// editorial calendar (and inline XLinks from the suburb cluster) don't 404.
// Section order ported from the §7 content-cluster design handoff.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/lib/wp/mock";
import {
  getAllInsightSlugs,
  getArticle,
  getCard,
  getRelated,
  listCards,
} from "@/lib/insights/store";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/insight";
import { ArticleBody } from "@/components/content/ArticleBody";
import {
  Breadcrumb,
  Byline,
  HeroTitle,
  HeroMedia,
  ContentCTA,
  RelatedRail,
} from "@/components/content/ArticleParts";
import s from "@/components/content/Article.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

// SSG every slug in the editorial calendar — full articles render their body,
// stubs render the placeholder. Both still get prerendered + a 200 response.
export async function generateStaticParams() {
  const slugs = await getAllInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (article) {
    return {
      title: article.title,
      description: article.seoDescription ?? article.dek,
      alternates: { canonical: `/insights/${slug}` },
      openGraph: {
        type: "article",
        title: article.title,
        description: article.seoDescription ?? article.dek,
        url: `${SITE_URL}/insights/${slug}`,
        publishedTime: article.isoDate,
        authors: [article.author.name],
        section: article.category,
      },
    };
  }
  // Placeholder metadata (stub-only slug)
  const card = await getCard(slug);
  if (!card) return { title: "Article not found" };
  return {
    title: `${card.title} — coming soon`,
    description: `An upcoming piece from the Max Property journal — ${card.title}`,
    alternates: { canonical: `/insights/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, card, settings] = await Promise.all([
    getArticle(slug),
    getCard(slug),
    getSiteSettings(),
  ]);

  // No article + no card → genuine 404 (caller mistyped or slug deleted).
  if (!article && !card) notFound();

  // ── Stub render path ─────────────────────────────────────────────────────
  if (!article && card) {
    // Pull 3 cards from the same category (or newest 3) for the related rail.
    const all = await listCards();
    const sameCat = all.filter((c) => c.category === card.category && c.slug !== slug);
    const related = (sameCat.length >= 3 ? sameCat : all.filter((c) => c.slug !== slug)).slice(0, 3);

    return (
      <>
        <Header current="Insights" nav={settings.nav} />
        <main>
          <section className={s.hero}>
            <div className="container">
              <Breadcrumb
                trail={[
                  { label: "Home", href: "/" },
                  { label: "Insights", href: "/insights" },
                  { label: card.category },
                ]}
              />
              <div className={s.heroInner}>
                <div className={s.pillRow}>
                  <span className={`${s.pill} ${s.pillFilled}`}>{card.category}</span>
                </div>
                <h1 className={s.title}>{card.title}</h1>
              </div>
            </div>
          </section>
          <section className={s.body}>
            <div className="container">
              <div className={s.comingSoon}>
                <span className={s.comingSoonBadge}>
                  <span className={s.comingSoonBadgeDot} aria-hidden />
                  Coming soon
                </span>
                <h2 className={s.comingSoonH2}>
                  We&rsquo;re still writing this one.
                </h2>
                <p className={s.comingSoonBody}>
                  This piece is on the editorial calendar for {card.date}. In the
                  meantime, the rest of the journal — and the cornerstone Noosaville
                  guide — are available below.
                </p>
                <div className={s.comingSoonBtns}>
                  <Link href="/insights" className="btn btn-primary">
                    Browse the journal
                  </Link>
                  <Link href="/noosaville/buying" className="btn btn-secondary">
                    The Noosaville buying guide
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <RelatedRail
            heading="From the journal"
            items={related}
            allHref="/insights"
            allLabel="All insights"
          />
        </main>
      </>
    );
  }

  // ── Full-article render path ─────────────────────────────────────────────
  if (!article) notFound(); // narrowing — unreachable in practice
  const related = await getRelated(article.related);
  const url = `${SITE_URL}/insights/${article.slug}`;

  return (
    <>
      <Header current="Insights" nav={settings.nav} />

      <main>
        {/* Hero */}
        <section className={s.hero}>
          <div className="container">
            <Breadcrumb
              trail={[
                { label: "Home", href: "/" },
                { label: "Insights", href: "/insights" },
                { label: article.category },
              ]}
            />
            <div className={s.heroInner}>
              <div className={s.pillRow}>
                <span className={`${s.pill} ${s.pillFilled}`}>{article.category}</span>
                {article.badge ? (
                  <span className={`${s.pill} ${s.pillOutline}`}>{article.badge}</span>
                ) : null}
              </div>
              <HeroTitle title={article.title} emphasis={article.titleEmphasis} />
              <p className={s.dek}>{article.dek}</p>
            </div>
            <div className={s.metaRow}>
              <Byline author={article.author} />
              <div className={s.pubBlock}>
                <time className={s.pubDate} dateTime={article.isoDate}>
                  {article.date}
                </time>
                <span className={s.pubSep} aria-hidden />
                <span className={s.pubRead}>{article.readMinutes} min read</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hero media */}
        <HeroMedia hero={article.hero} />

        {/* Body */}
        <section className={s.body}>
          <div className="container">
            <div className={s.bodyInner}>
              <ArticleBody body={article.body} />
              <ContentCTA
                eyebrow="Stay current"
                title="Get the quarterly market note."
                body="A short, honest letter on the Sunshine Coast market — four times a year, no spam."
                action="Subscribe"
                href="/insights#newsletter"
              />
            </div>
          </div>
        </section>

        {/* Related */}
        <RelatedRail
          heading="More from the journal"
          items={related}
          allHref="/insights"
          allLabel="All insights"
        />
      </main>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article, url)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(SITE_URL, article.slug, article.title)),
        }}
      />
    </>
  );
}
