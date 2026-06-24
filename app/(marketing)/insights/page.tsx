import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconArrowR } from "@/components/icons";
import { getSiteSettings } from "@/lib/wp/mock";
import { getFeatured, listCards } from "@/lib/insights/store";
import { InsightsBrowser, type Article } from "./InsightsBrowser";
import { InsightsNewsletter } from "./InsightsNewsletter";
import s from "./insights.module.css";

export const metadata: Metadata = {
  title: "Insights — Market Notes & Journal",
  description:
    "Data led. Human centred. Honest market commentary, quarterly outlooks and the occasional rant — written by the Max Property agents.",
  alternates: { canonical: "/insights" },
};

export const revalidate = 1800; // 30 min + on WP publish (§6)

export default async function InsightsPage() {
  const [settings, featured, cards] = await Promise.all([
    getSiteSettings(),
    getFeatured(),
    listCards(),
  ]);

  // Everything except the featured piece flows into the browser grid.
  const articles: Article[] = cards
    .filter((c) => c.slug !== featured?.slug)
    .map((c) => ({
      cat: c.category,
      title: c.title,
      date: c.date,
      read: c.readLabel.replace(/\s*read$/, ""),
      author: c.author,
      slug: c.slug,
      heroSrc: c.heroSrc,
      heroAlt: c.heroAlt,
    }));

  return (
    <>
      <Header current="Insights" nav={settings.nav} />

      <main>
        {/* Intro */}
        <section className={s.intro}>
          <Container>
            <div className={`${s.split} ${s.introGrid}`}>
              <div>
                <div className="overline">§ Insights · Journal</div>
                <h1 className={s.introH1}>
                  Data led.
                  <br />
                  <em style={{ fontStyle: "italic", color: "var(--color-action)" }}>Human</em>{" "}
                  centred.
                </h1>
              </div>
              <div>
                <p className={s.introText}>
                  Honest market commentary, quarterly outlooks, and the occasional rant. Written by
                  our agents, edited only lightly — so you can hear how they really think.
                </p>
                <div className={s.introMeta}>Updated Mondays · {cards.length} articles</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Featured */}
        {featured ? (
          <section className={s.featured}>
            <Container>
              <Link href={`/insights/${featured.slug}`} style={{ display: "block" }}>
                <div className={s.featGrid}>
                  <div className={s.featMedia}>
                    <span className={s.featBadge}>{featured.badge ?? "Editor’s pick"}</span>
                    {featured.hero.src ? (
                      <img
                        src={featured.hero.src}
                        alt={featured.hero.alt}
                        className={s.featMediaImg}
                      />
                    ) : (
                      <ImageSlot ratio="5/4" style={{ borderRadius: 0, position: "absolute", inset: 0 }} />
                    )}
                  </div>
                  <div>
                    <div className={`overline ${s.featCat}`}>
                      {featured.category} · {featured.date}
                    </div>
                    <h2 className={s.featH2}>
                      {featured.titleEmphasis && featured.title.includes(featured.titleEmphasis) ? (
                        <>
                          {featured.title.split(featured.titleEmphasis)[0]}
                          <em style={{ fontStyle: "italic", color: "var(--color-action)" }}>
                            {featured.titleEmphasis}
                          </em>
                          {featured.title.split(featured.titleEmphasis)[1]}
                        </>
                      ) : (
                        featured.title
                      )}
                    </h2>
                    <p className={s.featText}>{featured.dek}</p>
                    <div className={s.featByline}>
                      {featured.author.portraitUrl ? (
                        <img
                          src={featured.author.portraitUrl}
                          alt={`${featured.author.name} portrait`}
                          className={s.featAvatar}
                        />
                      ) : (
                        <span className={s.featAvatar} aria-hidden />
                      )}
                      <div>
                        <span style={{ color: "var(--color-text-strong)" }}>
                          {featured.author.name}
                        </span>{" "}
                        · {featured.date} · {featured.readMinutes} min read
                      </div>
                    </div>
                    <span className={s.featReadLink}>
                      Read the full piece <IconArrowR />
                    </span>
                  </div>
                </div>
              </Link>
            </Container>
          </section>
        ) : null}

        {/* Category bar + grid (client filter) */}
        <InsightsBrowser articles={articles} />

        {/* Newsletter */}
        <InsightsNewsletter />
      </main>
    </>
  );
}
