import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconArrowR } from "@/components/icons";
import { getSiteSettings } from "@/lib/wp/mock";
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

// Content → WordPress (post CPT, §7).
const FEATURED = {
  slug: "sunshine-coast-market-may-2026",
  category: "Market · Q2 outlook",
  author: "James Whitlam",
  date: "12 May 2026",
  read: "6 min read",
};
const ARTICLES: Article[] = [
  { cat: "Selling", title: "Auction or private treaty? How we'd decide for you.", date: "04 May 2026", read: "4 min", author: "Eliza Hart", slug: "auction-or-private-treaty" },
  { cat: "Buying", title: "Inside Noosaville's quiet supply story.", date: "28 Apr 2026", read: "5 min", author: "James Whitlam", slug: "noosaville-supply-story" },
  { cat: "Locations", title: "What we love about Tewantin (and why buyers are catching on).", date: "21 Apr 2026", read: "5 min", author: "Mae Robinson", slug: "tewantin-buyers" },
  { cat: "Design", title: "How a stylist actually pays for themselves on a $2M home.", date: "14 Apr 2026", read: "6 min", author: "Eliza Hart", slug: "stylist-roi" },
  { cat: "Market", title: "Sunshine Coast auction clearance rates — Q1 wrap.", date: "07 Apr 2026", read: "7 min", author: "James Whitlam", slug: "q1-clearance-rates" },
  { cat: "Investors", title: "The case for boring properties in a noisy year.", date: "30 Mar 2026", read: "5 min", author: "Mae Robinson", slug: "boring-properties" },
  { cat: "Selling", title: "Why your photographer matters more than your portal package.", date: "23 Mar 2026", read: "4 min", author: "Eliza Hart", slug: "photographer-vs-portal" },
  { cat: "Buying", title: "What we tell first-home buyers (that no-one else will).", date: "16 Mar 2026", read: "6 min", author: "James Whitlam", slug: "first-home-buyers" },
  { cat: "Locations", title: "Sunshine Beach in winter — a buyer's-eye walkthrough.", date: "09 Mar 2026", read: "5 min", author: "Mae Robinson", slug: "sunshine-beach-winter" },
];

export default async function InsightsPage() {
  const settings = await getSiteSettings();

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
                <div className={s.introMeta}>Updated Mondays · 64 articles</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Featured */}
        <section className={s.featured}>
          <Container>
            <Link href={`/insights/${FEATURED.slug}`} style={{ display: "block" }}>
              <div className={s.featGrid}>
                <div className={s.featMedia}>
                  <span className={s.featBadge}>Editor&rsquo;s pick</span>
                  <ImageSlot ratio="5/4" style={{ borderRadius: 0, position: "absolute", inset: 0 }} />
                </div>
                <div>
                  <div className={`overline ${s.featCat}`}>{FEATURED.category}</div>
                  <h2 className={s.featH2}>
                    The state of the Sunshine Coast market in{" "}
                    <em style={{ fontStyle: "italic", color: "var(--color-action)" }}>May 2026</em>.
                  </h2>
                  <p className={s.featText}>
                    Stock is recovering, buyer enquiry is back at 2024 levels, and the spring
                    auction calendar is filling fast. Here&rsquo;s what we&rsquo;re seeing on the
                    ground — and what we&rsquo;d do if we were you.
                  </p>
                  <div className={s.featByline}>
                    <span className={s.featAvatar} aria-hidden />
                    <div>
                      <span style={{ color: "var(--color-text-strong)" }}>{FEATURED.author}</span> ·{" "}
                      {FEATURED.date} · {FEATURED.read}
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

        {/* Category bar + grid (client filter) */}
        <InsightsBrowser articles={ARTICLES} />

        {/* Newsletter */}
        <InsightsNewsletter />
      </main>
    </>
  );
}
