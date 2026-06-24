// Max Property — Insights child template parts (server components).
// Kept colocated with ArticleBody / MiniBarChart so the whole content-kit lives under one path.
// These are reused by the Insights child today; when Suburb-hub / Pillar / Supporting land
// they'll be the shared primitives for the cluster.

import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconArrowR } from "@/components/icons";
import type { Article, ArticleCard, ArticleAuthor } from "@/lib/insights/types";
import s from "./Article.module.css";

// ── Breadcrumb ───────────────────────────────────────────────────────────
export function Breadcrumb({
  trail,
}: {
  trail: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav className={s.crumbs} aria-label="Breadcrumb">
      {trail.map((c, i) => {
        const last = i === trail.length - 1;
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {c.href && !last ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
            {!last ? <span className={s.crumbsSep}>/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}

// ── Byline ───────────────────────────────────────────────────────────────
export function Byline({ author }: { author: ArticleAuthor }) {
  return (
    <div className={s.byline}>
      {author.portraitUrl ? (
        <img
          src={author.portraitUrl}
          alt={`${author.name} portrait`}
          className={s.bylineAvatar}
        />
      ) : (
        <span className={s.bylineAvatar} aria-hidden />
      )}
      <div>
        <div className={s.bylineName}>{author.name}</div>
        <div className={s.bylineRole}>
          {author.role}
          {author.suburb ? ` · ${author.suburb}` : ""}
        </div>
      </div>
    </div>
  );
}

// ── Title with italic-ember emphasis ─────────────────────────────────────
export function HeroTitle({ title, emphasis }: { title: string; emphasis?: string }) {
  if (!emphasis || !title.includes(emphasis)) {
    return <h1 className={s.title}>{title}</h1>;
  }
  const [pre, post] = title.split(emphasis);
  return (
    <h1 className={s.title}>
      {pre}
      <em className={s.titleEm}>{emphasis}</em>
      {post}
    </h1>
  );
}

// ── Linen InlineCTA (end-of-body) ────────────────────────────────────────
export function ContentCTA({
  eyebrow,
  title,
  body,
  action,
  href,
}: {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
  href: string;
}) {
  return (
    <div className={s.ctaWrap}>
      <div className={s.cta}>
        <div className={s.ctaBody}>
          <div className="overline">{eyebrow}</div>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
        <Link href={href} className="btn btn-primary btn-lg">
          {action} <IconArrowR />
        </Link>
      </div>
    </div>
  );
}

// ── Related rail ─────────────────────────────────────────────────────────
export function RelatedRail({
  heading,
  items,
  allHref,
  allLabel = "All insights",
}: {
  heading: string;
  items: ArticleCard[];
  allHref: string;
  allLabel?: string;
}) {
  if (!items.length) return null;
  return (
    <section className={s.related}>
      <div className="container">
        <div className={s.relatedHead}>
          <h2 className={s.relatedH2}>{heading}</h2>
          <Link href={allHref} className="btn btn-tertiary">
            {allLabel} <IconArrowR />
          </Link>
        </div>
        <div className={s.relatedGrid}>
          {items.map((a) => (
            <Link key={a.slug} href={`/insights/${a.slug}`} className={s.relatedCard}>
              <div className={s.relatedMedia}>
                {a.heroSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.heroSrc}
                    alt={a.heroAlt ?? ""}
                    className={s.relatedMediaImg}
                  />
                ) : (
                  <ImageSlot
                    ratio="5/4"
                    style={{ position: "absolute", inset: 0, borderRadius: 0 }}
                  />
                )}
              </div>
              <div className={s.relatedBlock}>
                <div className={`overline ${s.relatedCat}`}>{a.category}</div>
                <h3 className={s.relatedTitle}>{a.title}</h3>
                <div className={s.relatedMeta}>
                  {a.author} · {a.date} · {a.readLabel}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Hero media (16:9) ────────────────────────────────────────────────────
export function HeroMedia({ hero }: { hero: Article["hero"] }) {
  return (
    <section className={s.media}>
      <div className="container">
        <div className={s.mediaFrame}>
          {hero.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.src} alt={hero.alt} />
          ) : (
            <ImageSlot ratio="16/9" label={hero.alt} style={{ borderRadius: 0, position: "absolute", inset: 0 }} />
          )}
        </div>
        <div className={s.mediaCaption}>{hero.caption}</div>
      </div>
    </section>
  );
}
