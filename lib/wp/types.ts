// Max Property — content types (code handoff §7).
// The app reads THESE types. lib/wp/client.ts (WPGraphQL, to be built) + per-route queries
// will return these shapes from ACF field groups. Components never touch GraphQL directly.

export type NavItem = { label: string; href: string };

export type SiteSettings = {
  nav: NavItem[];
  office: { addressLines: string[]; phone: string; hours: string };
  social: { instagram?: string; facebook?: string; youtube?: string };
  footer: { tagline: string; newsletterBlurb: string };
};

export type CtaLink = { label: string; href: string };

export type HomeContent = {
  hero: {
    overline: string;
    headingLead: string; // text before the emphasised word
    headingEmphasis: string; // italic, --sunrise
    headingTail: string; // text after
    body: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  audience: {
    overline: string;
    heading: string; // may contain {buying}/{selling} markers, rendered by the section
    cards: Array<{
      kind: "sell" | "buy";
      eyebrow: string;
      title: string;
      dotColor: string; // token
      body: string;
      cta: CtaLink;
    }>;
  };
  proof: { stats: Array<{ value: string; label: string; sub?: string }> };
  why: {
    overline: string;
    heading: string;
    body: string;
    pillars: Array<{ n: string; word: string; body: string; color: string }>;
  };
  featured: { overline: string; heading: string; cta: CtaLink };
  locations: {
    overline: string;
    headingLead: string;
    headingEmphasis: string; // italic --sunrise
    cards: Array<{ name: string; count: number; slug: string }>;
  };
  insights: {
    overline: string;
    heading: string;
    cta: CtaLink;
    articles: Array<{
      category: string;
      title: string;
      date: string;
      readTime: string;
      slug: string;
    }>;
  };
  testimonials: {
    overline: string;
    heading: string;
    rating: string;
    ratingMeta: string;
    quote: string;
    authorName: string;
    authorDetail: string;
    total: number;
  };
  cta: {
    overline: string;
    headingLeadLine: string;
    headingEmphasis: string; // italic --sunrise
    headingTail: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
};
