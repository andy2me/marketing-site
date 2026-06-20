// Max Property — MOCK content behind the WordPress seam (code handoff §7).
// Copy ported from the prototype (src/home.jsx, src/shared.jsx). When the headless WP +
// WPGraphQL layer lands, replace these with typed queries; call sites stay identical.

import type { HomeContent, SiteSettings } from "./types";

export async function getSiteSettings(): Promise<SiteSettings> {
  return {
    nav: [
      { label: "Sell", href: "/sell" },
      { label: "Buy", href: "/buy" },
      { label: "Locations", href: "/locations" },
      { label: "Insights", href: "/insights" },
      { label: "Team", href: "/team" },
      { label: "Contact", href: "/contact" },
    ],
    office: {
      addressLines: ["14 Project Ave", "Noosaville QLD 4566"],
      phone: "0438 116 191",
      hours: "Mon–Fri · 9am–5pm",
    },
    social: {
      instagram: "https://www.instagram.com/maxproperty.au/",
      facebook: "https://www.facebook.com/people/Max-Property/61580649546865/",
      youtube: "https://www.youtube.com/@maxpropertyau",
    },
    footer: {
      tagline:
        "Estate agents on the Sunshine Coast. Personalised service, trusted expertise — your outcome drives our approach.",
      newsletterBlurb: "Quarterly market notes & new listings — no fluff.",
    },
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  return {
    hero: {
      overline: "Estate Agents · Sunshine Coast",
      headingLead: "Your outcome ",
      headingEmphasis: "drives",
      headingTail: " our approach.",
      body: "Personalised service and trusted expertise. Our team handles every detail — so you can sell or buy with confidence and ease.",
      primaryCta: { label: "Request an appraisal", href: "/sell#appraisal" },
      secondaryCta: { label: "Browse properties", href: "/buy" },
    },
    audience: {
      overline: "§ 01 · Two paths",
      heading: "Maximum outcomes whether you're {buying} or {selling} property.",
      cards: [
        {
          kind: "sell",
          eyebrow: "For vendors →",
          title: "Selling",
          dotColor: "var(--ember)",
          body: "Max. by name, maximum by outcome. We leave nothing to chance — our work begins long before we list your home. The highest quality campaigns, every time.",
          cta: { label: "Request an appraisal", href: "/sell" },
        },
        {
          kind: "buy",
          eyebrow: "For buyers →",
          title: "Buying",
          dotColor: "var(--sunrise)",
          body: "Nothing but predictable — the simple things done reliably well. Our agents are passionate about their local patches, bringing the best properties to market.",
          cta: { label: "Browse the market", href: "/buy" },
        },
      ],
    },
    proof: {
      stats: [
        { value: "20+", label: "Years combined experience" },
        { value: "500+", label: "Properties sold" },
        { value: "4.9", label: "Average vendor rating", sub: "from 180+ reviews" },
        { value: "100%", label: "Data-led, human-centred" },
      ],
    },
    why: {
      overline: "§ 02 · Why Max",
      heading: "Bred from 20+ years of sales & marketing experience.",
      body: "We're data-led and human-centred — the way we inform our markets and your decisions.",
      pillars: [
        { n: "01", word: "Knowledge", body: "Providing clarity that builds confidence to act, whether you're selling or buying.", color: "var(--fern)" },
        { n: "02", word: "Strategy", body: "Considered, holistic and outcome-led. You'll feel peace of mind from go to woe.", color: "var(--mulberry)" },
        { n: "03", word: "Service", body: "A team obsessed with customer experience that'll bring upon a smile.", color: "var(--ember)" },
      ],
    },
    featured: {
      overline: "§ 03 · Currently on the market",
      heading: "Featured properties.",
      cta: { label: "View all properties", href: "/buy" },
    },
    locations: {
      overline: "§ 04 · The patches",
      headingLead: "Agents who know their patch — ",
      headingEmphasis: "intimately",
      cards: [
        { name: "Noosaville", count: 14, slug: "noosaville", image: "/assets/locations/noosaville.jpg", imageAlt: "Aerial view of Noosaville along the Noosa River" },
        { name: "Noosa Heads", count: 9, slug: "noosa-heads", image: "/assets/locations/noosa-heads.jpg", imageAlt: "Aerial view of Noosa Heads with lakes and bushland" },
      ],
    },
    insights: {
      overline: "§ 05 · Insights",
      heading: "Data led. Human centred.",
      cta: { label: "All insights", href: "/insights" },
      articles: [
        { category: "Market", title: "The state of the Sunshine Coast market in May 2026", date: "12 May 2026", readTime: "6 min", slug: "sunshine-coast-market-may-2026", image: "/assets/locations/noosa-heads.jpg", imageAlt: "Noosa Heads coastline and bushland from above — the Sunshine Coast region in 2026." },
      ],
    },
    testimonials: {
      overline: "§ 06 · Vendor stories",
      heading: "The proof is in the campaigns.",
    },
    cta: {
      overline: "§ 07 · Start a conversation today",
      headingLeadLine: "When you're ready,",
      headingEmphasis: "we're",
      headingTail: " ready.",
      primaryCta: { label: "I'm selling", href: "/sell" },
      secondaryCta: { label: "I'm buying", href: "/buy" },
    },
  };
}
