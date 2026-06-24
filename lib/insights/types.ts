// Max Property — Insights / journal content shapes (design handoff §7, content cluster).
//
// `Article` is the canonical type for an entry under /insights/{slug}. The hero meta plus a
// list of structured `Block`s for the body, plus a small set of slugs for related cards.
//
// SWAP PATH: this shape mirrors the appraisal-report seam (lib/report/store.ts). When the
// headless CMS layer lands, the call sites (getArticle / getArticleSlugs / listArticles) stay
// identical and only the in-memory registry under data/insights/ moves to a fetcher.

export type ArticleCategory =
  | "Market"
  | "Selling"
  | "Buying"
  | "Locations"
  | "Design"
  | "Investors";

export type ArticleAuthor = {
  name: string;
  role: string;
  /** Patch / suburb the author works (shown next to the byline). */
  suburb?: string;
  /** Optional portrait image — falls back to a plain coloured avatar. */
  portraitUrl?: string;
};

/** A single bar in the inline data card. */
export type ChartBar = { label: string; value: number; valueLabel?: string };

export type ChartBlock = {
  kind: "chart";
  /** Overline above the chart. */
  overline: string;
  /** Footnote below the chart — source line. */
  caption: string;
  /** Bar series. Last bar is highlighted with `accent`. */
  series: ChartBar[];
  /** CSS var or hex. Defaults to var(--ember). */
  accent?: string;
};

export type BlockquoteBlock = {
  kind: "blockquote";
  text: string;
};

/** A paragraph. The first paragraph in `body` is auto-rendered with the editorial drop-cap. */
export type ParagraphBlock = {
  kind: "p";
  text: string;
  /** Optional inline link rendered at the position of `linkLabel`. */
  link?: { label: string; href: string };
};

export type HeadingBlock = {
  kind: "h2";
  /** Used for the scroll anchor + ID. */
  id: string;
  text: string;
};

/** Bulleted list item — `lead` renders as a bold prefix before `text`. */
export type ListItem = { lead?: string; text: string };

export type ListBlock = {
  kind: "ul";
  items: ListItem[];
};

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | BlockquoteBlock
  | ChartBlock
  | ListBlock;

export type RelatedRef = {
  slug: string;
};

export type Article = {
  slug: string;
  category: ArticleCategory;
  /** Optional badge alongside the category pill (e.g. "Editor's pick"). */
  badge?: string;
  /** Page title. May embed an italic `<em>` accent via the `titleEmphasis` field. */
  title: string;
  /** Italicised + ember-tinted slice of the title (must be a contiguous substring). */
  titleEmphasis?: string;
  /** Lede sentence under the H1 — kept short, max ~280 chars. */
  dek: string;
  /** Displayed publish date, e.g. "12 May 2026". */
  date: string;
  /** Machine ISO date, e.g. "2026-05-12". Used in JSON-LD + <time>. */
  isoDate: string;
  readMinutes: number;
  author: ArticleAuthor;
  hero: {
    /** Optional path — falls back to ImageSlot placeholder when omitted. */
    src?: string;
    alt: string;
    /** Mono caption shown under the hero. */
    caption: string;
  };
  body: Block[];
  /** Up to 3 slugs surfaced in the "More from the journal" rail. */
  related: string[];
  /** SEO description. Defaults to `dek` when omitted. */
  seoDescription?: string;
};

/** The index-card shape — what the /insights browser + related rail need. */
export type ArticleCard = {
  slug: string;
  category: ArticleCategory;
  title: string;
  date: string;
  readLabel: string;
  author: string;
};
