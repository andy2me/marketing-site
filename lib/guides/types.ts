// Guide template types (handoff §5 + §6 + §9.2).
// Pillar and Supporting share the same data shape with `variant` discriminating.
// Body blocks are typed so the long-form prose can be authored as data — not JSX.

export type GuideVariant = "pillar" | "supporting";

export type GuideTocItem = {
  id: string;        // anchor for the H2 (also used by ToC + scroll-spy)
  label: string;     // sidebar label
};

// ── Body content blocks ─────────────────────────────────────────────────
// Authored as discriminated unions so a CMS port can validate them later.
// Inline `XLink` markers in `p` blocks use a tiny markup convention:
//   "before [[label|/href]] after"  → renders as <XLink href="/href">label</XLink>
// (No HTML in the source; the renderer is the only place that knows the link style.)

export type GuideBodyP = { kind: "p"; text: string };
export type GuideBodyH3 = { kind: "h3"; text: string };
export type GuideBodyQuote = { kind: "quote"; text: string };
export type GuideBodyStats = {
  kind: "stats";
  columns?: number;
  items: { k: string; v: string; trend?: string; up?: boolean }[];
  provenance?: string;
};
export type GuideBodyCTA = {
  kind: "cta";
  variant: "ember" | "fern" | "mulberry";
  eyebrow: string;
  title: string;
  body?: string;
  action: string;
  href: string;
};

// Email-gated PDF download. Renders to the LeadMagnet card.
export type GuideBodyLeadMagnet = {
  kind: "leadmagnet";
  eyebrow?: string;     // defaults to "Free download"
  title: string;
  body: string;
  action: string;       // button label e.g. "Download the checklist"
};

export type GuideBodyBlock =
  | GuideBodyP
  | GuideBodyH3
  | GuideBodyQuote
  | GuideBodyStats
  | GuideBodyCTA
  | GuideBodyLeadMagnet;

export type GuideSection = {
  id: string;        // matches a TocItem.id
  heading: string;   // H2 text
  blocks: GuideBodyBlock[];
};

export type GuideFAQ = {
  q: string;
  a: string;
};

export type GuideClusterRef = {
  title: string;
  read: string;       // "7 min"
  href: string;       // /noosaville/buying/cost-to-buy
};

// Used by supporting articles only — the band linking back to the parent pillar.
export type GuidePillarRef = {
  label: string;     // "Buying in Noosaville"
  href: string;
  note?: string;     // "A practical guide"
};

// Used by supporting articles for the "Continue in this cluster" rail.
export type GuideRelatedRef = {
  category: string;
  title: string;
  read: string;
  href: string;
};

export type GuideAuthor = {
  name: string;
  role: string;
  suburb?: string;
};

export type Guide = {
  variant: GuideVariant;
  suburb: string;             // "noosaville"
  pillar: string;             // "buying" — top-level pillar slug
  slug?: string;              // supporting articles only — third URL segment
  title: string;              // SEO/og title
  metaDescription: string;
  hero: {
    overline: string;         // "§ Pillar guide · Buying"
    h1Pre: string;            // text before the italic emphasis
    h1Em: string;             // italic-ember emphasised word
    h1Post: string;           // text after the italic
    dek: string;              // 680px intro paragraph
    /** Optional banner image rendered under the hero text. */
    image?: { src: string; alt: string; caption?: string };
  };
  intro?: string;             // optional drop-cap paragraph above the first H2
  toc: GuideTocItem[];
  sections: GuideSection[];
  faqs: GuideFAQ[];
  // Pillar pages get a cluster index of supporting articles.
  // Supporting pages get a related-articles rail with its own heading.
  cluster?: GuideClusterRef[];
  related?: GuideRelatedRef[];
  relatedHeading?: string;     // supporting only — e.g. "More in Buying in Noosaville"
  // Supporting only — what the FAQ band's eyebrow + heading should read.
  faqHeading?: string;
  faqEyebrow?: string;
  // Supporting pages reference back to their pillar.
  parentPillar?: GuidePillarRef;
  closing: {
    eyebrow: string;
    line1: string;
    em: string;
    line2: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  author: GuideAuthor;
  lastUpdated: string;        // "June 2026"
  readTime: string;           // "9 min read"
  publishedISO: string;       // "2026-06-01" — for JSON-LD datePublished
  modifiedISO: string;        // "2026-06-15"
};
