// Guide-template building blocks (handoff §5 + §6).
// Server components — composed by /app/(marketing)/[suburb]/[pillar]/page.tsx
// (pillar variant) and /app/(marketing)/[suburb]/[pillar]/[slug]/page.tsx
// (supporting variant, coming next pass).

import { Fragment } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { IconArrowR, IconGrid } from "@/components/icons";
import type {
  Guide,
  GuideBodyBlock,
  GuideClusterRef,
  GuideFAQ,
  GuidePillarRef,
  GuideRelatedRef,
  GuideSection,
} from "@/lib/guides/types";
import { FAQAccordion } from "./FAQAccordion";
import { StickyToC, MobileToC } from "./StickyToC";
import { LeadMagnetChecklistCover } from "./LeadMagnetCover";
import { LeadMagnetForm } from "@/components/forms/LeadMagnetForm";
import s from "./Guide.module.css";

// ── Inline-link renderer ────────────────────────────────────────────────
// Source strings use a tiny markup convention:
//   "before [[label|/href]] after"
// Splits into Fragments with `XLink` inline. Pure server — no JS.
function renderInline(text: string) {
  const out: React.ReactNode[] = [];
  const re = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Link key={`x${i++}`} href={m[2]} className={s.xlink}>
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// ── Hero (breadcrumb · overline · H1 · dek · byline + meta) ────────────
// Supporting variant tightens the spacing and adds the deepest breadcrumb crumb.
export function GuideHero({
  guide,
  variant = "pillar",
}: {
  guide: Guide;
  variant?: "pillar" | "supporting";
}) {
  const suburbName = guide.suburb
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  const pillarName = guide.pillar.charAt(0).toUpperCase() + guide.pillar.slice(1);
  const initial = guide.author.name.charAt(0);
  const isSupporting = variant === "supporting";

  return (
    <section className={`${s.hero} ${isSupporting ? s.heroSupporting : ""}`}>
      <Container>
        <nav aria-label="Breadcrumb" className={s.crumbs}>
          <Link href="/">Home</Link>
          <span className={s.crumbsSep}>/</span>
          <Link href={`/${guide.suburb}`}>{suburbName}</Link>
          <span className={s.crumbsSep}>/</span>
          {isSupporting ? (
            <>
              <Link href={`/${guide.suburb}/${guide.pillar}`}>{pillarName}</Link>
              <span className={s.crumbsSep}>/</span>
              <span aria-current="page">
                {(guide.slug ?? "")
                  .split("-")
                  .map((w, i) =>
                    i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w,
                  )
                  .join(" ")}
              </span>
            </>
          ) : (
            <span aria-current="page">{pillarName}</span>
          )}
        </nav>
        <div className={s.heroBody}>
          <div className={`overline ${s.heroOverline}`}>{guide.hero.overline}</div>
          <h1 className={s.heroH1}>
            {guide.hero.h1Pre}
            <em className={s.heroEm}>{guide.hero.h1Em}</em>
            {guide.hero.h1Post}
          </h1>
          <p className={s.heroDek}>{guide.hero.dek}</p>
        </div>
        {guide.hero.image ? (
          <figure className={s.heroImage}>
            <img
              src={guide.hero.image.src}
              alt={guide.hero.image.alt}
              loading="eager"
            />
            {guide.hero.image.caption ? (
              <figcaption className={s.heroImageCaption}>
                {guide.hero.image.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        <div className={s.heroMeta}>
          <div className={s.byline}>
            <div className={s.bylineAvatar} aria-hidden>
              {initial}
            </div>
            <div>
              <div className={s.bylineName}>{guide.author.name}</div>
              <div className={s.bylineRole}>
                {guide.author.role}
                {guide.author.suburb ? ` · ${guide.author.suburb}` : ""}
              </div>
            </div>
          </div>
          <div className={s.metaRight}>
            <span className={s.lastUpdated}>
              <span className={s.lastUpdatedDot} />
              Last updated {guide.lastUpdated}
            </span>
            <span className={s.readTime}>{guide.readTime}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ── Body (sticky-ToC rail + long-form article) ──────────────────────────
export function GuideBody({ guide }: { guide: Guide }) {
  return (
    <section className={s.body}>
      <Container>
        <div className={s.bodyGrid}>
          <aside>
            <StickyToC items={guide.toc} />
          </aside>
          <article className={s.article}>
            <MobileToC items={guide.toc} />
            {guide.intro ? (
              <p className={s.lead}>
                <span className={s.dropCap} aria-hidden>
                  N
                </span>
                {guide.intro}
              </p>
            ) : null}
            {guide.sections.map((section) => (
              <SectionBlock key={section.id} section={section} />
            ))}
          </article>
        </div>
      </Container>
    </section>
  );
}

function SectionBlock({ section }: { section: GuideSection }) {
  return (
    <div className={s.section} data-section={section.id}>
      <h2 id={section.id} className={s.h2}>
        {section.heading}
      </h2>
      {section.blocks.map((b, i) => (
        <BodyBlock key={i} block={b} />
      ))}
    </div>
  );
}

function BodyBlock({ block }: { block: GuideBodyBlock }) {
  switch (block.kind) {
    case "p":
      return <p className={s.p}>{renderInline(block.text)}</p>;
    case "h3":
      return <h3 className={s.h3}>{block.text}</h3>;
    case "quote":
      return <blockquote className={s.quote}>{block.text}</blockquote>;
    case "stats": {
      const cols = block.columns ?? block.items.length;
      return (
        <div className={s.statsWrap}>
          <div
            className={s.statsGrid}
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {block.items.map((it, i) => (
              <div key={i}>
                <div className={s.statK}>
                  {it.k}
                  {it.trend ? (
                    <span
                      className={`${s.statTrend} ${
                        it.up ? s.statTrendUp : s.statTrendDown
                      }`}
                    >
                      {it.up ? "▲" : "▼"} {it.trend}
                    </span>
                  ) : null}
                </div>
                <div className={s.statV}>{it.v}</div>
              </div>
            ))}
          </div>
          {block.provenance ? (
            <div className={s.provenance}>{block.provenance}</div>
          ) : null}
        </div>
      );
    }
    case "cta": {
      const cls =
        block.variant === "fern"
          ? s.ctaFern
          : block.variant === "mulberry"
            ? s.ctaMulberry
            : s.ctaEmber;
      return (
        <aside className={`${s.cta} ${cls}`}>
          <div className={s.ctaBody}>
            <div className={`overline ${s.ctaOverline}`}>{block.eyebrow}</div>
            <div className={s.ctaTitle}>{block.title}</div>
            {block.body ? <p className={s.ctaDek}>{block.body}</p> : null}
          </div>
          <Link href={block.href} className="btn btn-primary btn-lg">
            {block.action} <IconArrowR />
          </Link>
        </aside>
      );
    }
    case "leadmagnet":
      return <LeadMagnet block={block} />;
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

// ── Lead-magnet card (email-gated PDF; supporting articles) ────────────
function slugifyTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
}

function LeadMagnet({
  block,
}: {
  block: Extract<GuideBodyBlock, { kind: "leadmagnet" }>;
}) {
  const assetId = block.assetId ?? slugifyTitle(block.title);
  return (
    <aside className={s.leadMagnet}>
      <LeadMagnetCover cover={block.cover} />
      <div>
        <div className={`overline ${s.leadMagnetEyebrow}`}>
          {block.eyebrow ?? "Free download"}
        </div>
        <h3 className={s.leadMagnetTitle}>{block.title}</h3>
        <p className={s.leadMagnetBody}>{block.body}</p>
        <LeadMagnetForm
          assetId={assetId}
          assetTitle={block.title}
          action={block.action}
          successMessage={block.successMessage}
        />
      </div>
    </aside>
  );
}

function LeadMagnetCover({
  cover,
}: {
  cover: Extract<GuideBodyBlock, { kind: "leadmagnet" }>["cover"];
}) {
  if (cover?.kind === "checklist") return <LeadMagnetChecklistCover />;
  if (cover?.kind === "image") {
    return (
      <div className={s.leadMagnetCover} aria-hidden>
        {/* Plain <img> — these are small decorative covers, not LCP. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover.src} alt={cover.alt} />
      </div>
    );
  }
  // Fallback: striped placeholder.
  return (
    <div className={s.leadMagnetCover} aria-hidden>
      <div className={s.leadMagnetCoverLabel}>
        PDF
        <br />
        cover
      </div>
    </div>
  );
}

// ── FAQ band (banding bg, 5/7 split, accordion) ────────────────────────
export function GuideFAQSection({
  heading,
  eyebrow = "§ Questions, answered",
  items,
}: {
  heading: string;
  eyebrow?: string;
  items: GuideFAQ[];
}) {
  return (
    <section className={s.faq}>
      <Container>
        <div className={s.faqGrid}>
          <div>
            <div className={`overline ${s.faqOverline}`}>{eyebrow}</div>
            <h2 className={s.faqH2}>{heading}</h2>
          </div>
          <div>
            <FAQAccordion items={items} />
          </div>
        </div>
      </Container>
    </section>
  );
}

// ── Supporting body (centered narrow column, no sticky-ToC, ContextBand) ──
export function GuideSupportingBody({ guide }: { guide: Guide }) {
  return (
    <section className={s.bodySupporting}>
      <Container>
        <div className={s.bodySupportingInner}>
          {guide.parentPillar ? (
            <GuideContextBand pillar={guide.parentPillar} />
          ) : null}
          <article style={{ marginTop: guide.parentPillar ? 48 : 0 }}>
            {guide.sections.map((section) =>
              section.heading ? (
                <SectionBlock key={section.id} section={section} />
              ) : (
                // Intro section: no H2, blocks render flat above the first H2.
                <div key={section.id}>
                  {section.blocks.map((b, i) => (
                    <BodyBlock key={i} block={b} />
                  ))}
                </div>
              ),
            )}
          </article>
        </div>
      </Container>
    </section>
  );
}

// ── Context band — "Part of the [pillar] guide" (supporting only) ─────
export function GuideContextBand({ pillar }: { pillar: GuidePillarRef }) {
  return (
    <Link href={pillar.href} className={s.contextBand}>
      <div className={s.contextLeft}>
        <span className={s.contextIcon} aria-hidden>
          <IconGrid />
        </span>
        <div>
          <div className={s.contextLabel}>Part of the guide</div>
          <div className={s.contextTitle}>
            {pillar.label}
            {pillar.note ? (
              <span className={s.contextNote}> · {pillar.note}</span>
            ) : null}
          </div>
        </div>
      </div>
      <span className={s.contextLink}>
        Back to pillar <IconArrowR />
      </span>
    </Link>
  );
}

// ── Related articles rail (supporting only) ────────────────────────────
export function GuideRelated({
  heading,
  items,
  allHref,
  allLabel,
  liveHrefs,
}: {
  heading: string;
  items: GuideRelatedRef[];
  allHref?: string;
  allLabel?: string;
  liveHrefs?: Set<string>;
}) {
  const colClass =
    items.length >= 4 ? s.related4 : items.length === 2 ? s.related2 : s.related3;
  return (
    <section className={s.related}>
      <Container>
        <div className={s.relatedHead}>
          <h2 className={s.relatedH2}>{heading}</h2>
          {allHref ? (
            <Link href={allHref} className="btn btn-tertiary">
              {allLabel ?? "All guides"} <IconArrowR />
            </Link>
          ) : null}
        </div>
        <div className={`${s.relatedGrid} ${colClass}`}>
          {items.map((a) => {
            const live = liveHrefs ? liveHrefs.has(a.href) : true;
            const inner = (
              <>
                <div className={`overline ${s.relatedCat}`}>{a.category}</div>
                <h3 className={s.relatedTitle}>{a.title}</h3>
                <div className={s.relatedMeta}>
                  {live ? (
                    a.read
                  ) : (
                    <span className={s.relatedSoon}>Coming soon</span>
                  )}
                </div>
              </>
            );
            return live ? (
              <Link key={a.href} href={a.href} className={s.relatedCard}>
                {inner}
              </Link>
            ) : (
              <div
                key={a.href}
                className={`${s.relatedCard} ${s.relatedCardDisabled}`}
                aria-disabled="true"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

// ── Cluster index (pillar variant only) ────────────────────────────────
// `liveHrefs` is the set of hrefs that resolve to a registered spoke. Anything
// else renders as a non-clickable row labelled "Coming soon" — same UX shape,
// no dead links. `oppositeLive` likewise controls the opposite-pillar button.
export function GuideClusterIndex({
  guide,
  items,
  liveHrefs,
  oppositeLive = false,
}: {
  guide: Guide;
  items: GuideClusterRef[];
  liveHrefs: Set<string>;
  oppositeLive?: boolean;
}) {
  const suburbName = guide.suburb
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  const pillarName = guide.pillar.charAt(0).toUpperCase() + guide.pillar.slice(1);
  const opposite =
    guide.pillar === "buying"
      ? { label: "Selling", href: `/${guide.suburb}/selling` }
      : guide.pillar === "selling"
        ? { label: "Buying", href: `/${guide.suburb}/buying` }
        : null;

  return (
    <section className={s.cluster}>
      <Container>
        <div className={s.clusterHead}>
          <div className={`overline ${s.clusterOverline}`}>§ The full cluster</div>
          <h2 className={s.clusterH2}>
            Everything under{" "}
            <em className={s.clusterH2Em}>
              {pillarName} in {suburbName}
            </em>
            .
          </h2>
        </div>
        <div className={s.clusterGrid}>
          {items.map((s2, i) => {
            const live = liveHrefs.has(s2.href);
            const rowCls = `${s.clusterRow} ${
              i % 2 === 0 ? s.clusterRowL : s.clusterRowR
            } ${live ? "" : s.clusterRowDisabled}`;
            const inner = (
              <>
                <div className={s.clusterRowMain}>
                  <span className={s.clusterIdx}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={s.clusterTitle}>{s2.title}</span>
                </div>
                <span className={s.clusterRead}>
                  {live ? s2.read : "Coming soon"}
                </span>
              </>
            );
            return live ? (
              <Link key={s2.href} href={s2.href} className={rowCls}>
                {inner}
              </Link>
            ) : (
              <div key={s2.href} className={rowCls} aria-disabled="true">
                {inner}
              </div>
            );
          })}
        </div>
        <div className={s.clusterFoot}>
          {opposite && oppositeLive ? (
            <Link href={opposite.href} className="btn btn-secondary">
              Opposite pillar · {opposite.label} in {suburbName} <IconArrowR />
            </Link>
          ) : null}
          <Link href={`/${guide.suburb}`} className="btn btn-tertiary">
            ↑ Back to the {suburbName} hub
          </Link>
        </div>
      </Container>
    </section>
  );
}

// ── Closing CTA (dark inverse, italic-sunrise emphasis) ────────────────
export function GuideClosing({ guide }: { guide: Guide }) {
  const c = guide.closing;
  return (
    <section className={s.closing}>
      <Container>
        <div className={s.closingGrid}>
          <div>
            <div className={`overline ${s.closingOverline}`}>{c.eyebrow}</div>
            <h2 className={s.closingH2}>
              {c.line1} <em className={s.closingH2Em}>{c.em}</em> {c.line2}
            </h2>
          </div>
          <div>
            <p className={s.closingBody}>{c.body}</p>
            <div className={s.closingBtns}>
              <Link href={c.primaryHref} className="btn btn-primary btn-lg">
                {c.primaryLabel} <IconArrowR />
              </Link>
              <Link href={c.secondaryHref} className="btn btn-ghost-dark btn-lg">
                {c.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Silence unused-import in environments where Fragment isn't ref'd.
export const _GuideFragment = Fragment;
