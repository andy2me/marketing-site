import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { StatRow } from "@/components/sections/StatRow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/property/PropertyCard";
import { IconArrowR, IconArrowUR } from "@/components/icons";
import type { HomeContent } from "@/lib/wp/types";
import type { ListingCard } from "@/lib/rex/types";
import type { RatingSummary, Review } from "@/lib/reviews/types";
import { TestimonialsCarousel } from "./TestimonialsCarousel";
import s from "./home.module.css";

/** Render a heading string with {braced} words turned into ember-italic <em>s. */
function withEmphasis(text: string): ReactNode[] {
  return text.split(/\{([^}]+)\}/g).map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className={s.emEmber}>
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

// ── 1. Hero ───────────────────────────────────────────────────────────────
export function HomeHero({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <section className={s.hero}>
      {/* TODO(§11): hero video (muted, playsinline) with poster as LCP; this is the poster. */}
      <div className={s.heroPoster} />
      <div className={s.heroOverlay} />

      <Container className={s.heroInner}>
        <div className={`overline ${s.heroOverline}`}>{hero.overline}</div>
        <h1 className={s.heroTitle}>
          {hero.headingLead}
          <em className={s.emSunrise}>{hero.headingEmphasis}</em>
          {hero.headingTail}
        </h1>
        <p className={s.heroBody}>{hero.body}</p>
        <div className={s.heroCtas}>
          <Button href={hero.primaryCta.href} variant="primary" size="lg">
            {hero.primaryCta.label} <IconArrowR />
          </Button>
          <Button href={hero.secondaryCta.href} variant="ghost-dark" size="lg">
            {hero.secondaryCta.label}
          </Button>
        </div>
      </Container>

      <button type="button" className={s.heroPlay} aria-label="Pause video">
        <span className={s.heroPlayBars}>
          <span />
          <span />
        </span>
      </button>

      <div className={s.heroScroll}>
        <span className={s.heroScrollLine} />
        Scroll
      </div>
    </section>
  );
}

// ── 2. Audience split ───────────────────────────────────────────────────────
export function HomeAudienceSplit({ audience }: { audience: HomeContent["audience"] }) {
  return (
    <section className={s.audience}>
      <Container>
        <SectionIntro overline={audience.overline}>
          <h2 className={s.audienceHeading}>{withEmphasis(audience.heading)}</h2>
        </SectionIntro>

        <div className={s.cards}>
          {audience.cards.map((c) => {
            const isBuy = c.kind === "buy";
            return (
              <Link
                key={c.kind}
                href={c.cta.href}
                className={`${s.card} ${isBuy ? s.cardBuyOffset : ""}`}
                style={{ background: isBuy ? "var(--fern)" : "#2C1E15" }}
              >
                <span
                  className={`${s.cardOverlay} ${isBuy ? s.cardOverlayBuy : s.cardOverlaySell}`}
                />
                <div className={s.cardEyebrow}>{c.eyebrow}</div>
                <div className={s.cardContent}>
                  <div className={s.cardTitle}>
                    {c.title}
                    <span style={{ color: c.dotColor }}>.</span>
                  </div>
                  <div className={s.cardBody}>{c.body}</div>
                  <div className={s.cardCta}>
                    {c.cta.label} <IconArrowUR />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

// ── 3. Proof bar ────────────────────────────────────────────────────────────
export function HomeProofBar({ proof }: { proof: HomeContent["proof"] }) {
  return (
    <section className={s.proof}>
      <Container>
        <StatRow stats={proof.stats} />
      </Container>
    </section>
  );
}

// ── 4. Why ────────────────────────────────────────────────────────────────
export function HomeWhy({ why }: { why: HomeContent["why"] }) {
  return (
    <section className={s.why}>
      <Container>
        <SectionIntro overline={why.overline}>
          <h2 className={s.whyHeading}>{why.heading}</h2>
          <p className={s.whyBody}>{why.body}</p>
        </SectionIntro>

        <div className={s.pillars}>
          {why.pillars.map((p) => (
            <article key={p.n} className={s.pillar} style={{ background: p.color }}>
              <div className={s.pillarNum}>{p.n}</div>
              <div className={s.pillarWord}>
                {p.word}
                <span className={s.pillarDot}>.</span>
              </div>
              <p className={s.pillarBody}>{p.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── 5. Featured ─────────────────────────────────────────────────────────────
export function HomeFeatured({
  featured,
  listings,
}: {
  featured: HomeContent["featured"];
  listings: ListingCard[];
}) {
  return (
    <section className={s.featured}>
      <Container>
        <div className={s.sectionHead}>
          <div>
            <div className="overline">{featured.overline}</div>
            <h2 className={s.sectionHeadTitle}>{featured.heading}</h2>
          </div>
          <Button href={featured.cta.href} variant="secondary">
            {featured.cta.label} <IconArrowR />
          </Button>
        </div>
        <div className={s.grid3}>
          {listings.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── 6. Locations ──────────────────────────────────────────────────────────
export function HomeLocations({ locations }: { locations: HomeContent["locations"] }) {
  return (
    <section className={s.locations}>
      <Container>
        <SectionIntro overline={locations.overline} overlineStyle={{ color: "rgba(244,237,229,.6)" }}>
          <h2 className={s.locHeading}>
            {locations.headingLead}
            <em className={s.emSunrise}>{locations.headingEmphasis}</em>.
          </h2>
        </SectionIntro>

        <div className={s.locGrid}>
          {locations.cards.map((l) => (
            <Link key={l.slug} href="/locations" className={s.locCard}>
              <div className={s.locMedia}>
                <Image
                  src={l.image}
                  alt={l.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className={s.locImage}
                />
                <span className={s.locOverlay} />
                <div className={s.locContent}>
                  <div className={s.locName}>{l.name}</div>
                  <div className={s.locCount}>
                    {l.count} listings <IconArrowR />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── 7. Insights ─────────────────────────────────────────────────────────────
export function HomeInsights({ insights }: { insights: HomeContent["insights"] }) {
  return (
    <section className={s.insights}>
      <Container>
        <div className={s.sectionHead}>
          <div>
            <div className="overline">{insights.overline}</div>
            <h2 className={s.sectionHeadTitle}>{insights.heading}</h2>
          </div>
          <Button href={insights.cta.href} variant="tertiary">
            {insights.cta.label} <IconArrowR />
          </Button>
        </div>

        <div className={s.insGrid}>
          {insights.articles.map((a, i) => (
            <Link key={a.slug} href={`/insights/${a.slug}`} className={s.insCard}>
              {a.image ? (
                <div
                  className={s.insMedia}
                  style={{ aspectRatio: i === 0 ? "5 / 4" : "4 / 5" }}
                >
                  <img
                    src={a.image}
                    alt={a.imageAlt ?? a.title}
                    className={s.insMediaImg}
                  />
                </div>
              ) : (
                <ImageSlot
                  ratio={i === 0 ? "5/4" : "4/5"}
                  className={s.insMedia}
                  label="Article image"
                />
              )}
              <div className={s.insBlock}>
                <div className={`overline ${s.insCat}`}>{a.category}</div>
                <h3 className={`${s.insTitle} ${i === 0 ? s.insTitleLead : ""}`}>{a.title}</h3>
                <div className={s.insMeta}>
                  {a.date} · {a.readTime} read
                </div>
                {i === 0 ? (
                  <span className={`btn btn-secondary btn-sm ${s.insCta}`}>
                    Read now <IconArrowR />
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── 8. Testimonials ──────────────────────────────────────────────────────────
export function HomeTestimonials({
  testimonials,
  summary,
  reviews,
}: {
  testimonials: HomeContent["testimonials"];
  summary: RatingSummary;
  reviews: Review[];
}) {
  return (
    <TestimonialsCarousel
      overline={testimonials.overline}
      heading={testimonials.heading}
      summary={summary}
      reviews={reviews}
    />
  );
}

// ── 9. CTA band ──────────────────────────────────────────────────────────────
export function HomeCTABand({ cta }: { cta: HomeContent["cta"] }) {
  return (
    <section className={s.cta}>
      <Container>
        <div className={`overline ${s.ctaOverline}`}>{cta.overline}</div>
        <h2 className={s.ctaHeading}>
          {cta.headingLeadLine}
          <br />
          <em className={s.emSunrise}>{cta.headingEmphasis}</em>
          {cta.headingTail}
        </h2>
        <div className={s.ctaCtas}>
          <Button href={cta.primaryCta.href} variant="primary" size="lg">
            {cta.primaryCta.label} <IconArrowR />
          </Button>
          <Button href={cta.secondaryCta.href} variant="ghost-dark" size="lg">
            {cta.secondaryCta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
