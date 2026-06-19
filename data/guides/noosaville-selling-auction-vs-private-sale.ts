// Max Property — Noosaville · Selling · Auction or Private Sale (supporting).
// Source: Noosaville selling cluster brief, piece #5.

import type { Guide } from "@/lib/guides/types";

export const noosavilleSellingAuctionVsPrivateSale: Guide = {
  variant: "supporting",
  suburb: "noosaville",
  pillar: "selling",
  slug: "auction-vs-private-sale",
  title: "Auction or Private Sale: What Works Best in Noosaville? — Max. Property",
  metaDescription:
    "Auction or private treaty in Noosaville? When each method suits, how buyer psychology decides it, and how to choose the right approach for your home.",
  hero: {
    overline: "§ Guide · Selling",
    h1Pre: "Auction or private sale: what works best in ",
    h1Em: "Noosaville",
    h1Post: "?",
    dek: "Both methods work here. The right one is the one that matches your home, your likely buyer, and your circumstances.",
    image: {
      src: "/assets/locations/noosaville.jpg",
      alt: "A Noosaville residential street — the home and its buyer decide the method, not the office default.",
      caption: "Noosaville · method follows buyer psychology",
    },
  },
  toc: [
    { id: "auction", label: "When auction tends to suit" },
    { id: "private", label: "When private treaty tends to suit" },
    { id: "psychology", label: "It comes down to buyer psychology" },
    { id: "decide", label: "How I'd decide for your home" },
  ],
  sections: [
    {
      id: "intro",
      heading: "",
      blocks: [
        {
          kind: "p",
          text: "There's no single right method of sale in Noosaville — there's a right method for your home, your buyer and your circumstances. Choosing well is a strategic decision, not a default.",
        },
        {
          kind: "p",
          text: "Both auction and private treaty work here. The question is which one suits the specific property and the kind of buyer it will attract.",
        },
      ],
    },
    {
      id: "auction",
      heading: "When auction tends to suit",
      blocks: [
        {
          kind: "p",
          text: "Auction works through competition and price discovery. It can suit homes with broad appeal that will attract multiple buyers, properties hard to price by comparison (unique homes, standout positions, waterfront, where the market sets the level), low-supply conditions where scarcity sharpens competition, and sellers who want a defined timeline and an unconditional outcome on the day.",
        },
        {
          kind: "p",
          text: "The strength of auction is transparency and momentum: competing buyers, a clear deadline, and an unconditional sale.",
        },
      ],
    },
    {
      id: "private",
      heading: "When private treaty tends to suit",
      blocks: [
        {
          kind: "p",
          text: "Private treaty works through a considered, often quieter process. It can suit homes with a defined, narrower buyer pool (much of Noosaville's downsizer and lifestyle stock fits here), higher price brackets with limited directly comparable sales, sellers who value discretion or a less public campaign, and buyers who prefer to take their time rather than commit under auction pressure.",
        },
        {
          kind: "p",
          text: "Much of Noosaville's market is owner-occupiers making a deliberate decision. For a lot of that stock, a well-managed private treaty meets the buyer where they are.",
        },
      ],
    },
    {
      id: "psychology",
      heading: "It comes down to buyer psychology",
      blocks: [
        {
          kind: "quote",
          text: "Choose the method to match the buyer — not the trend, and not the office default.",
        },
        {
          kind: "p",
          text: "The honest deciding factor is who your buyer is and how they behave. A competitive, broadly appealing home with several likely buyers can thrive at auction. A home that suits a particular downsizer who wants space to think it through may do better with private treaty. Matching the method to buyer psychology is what protects your result.",
        },
      ],
    },
    {
      id: "decide",
      heading: "How I'd decide for your home",
      blocks: [
        {
          kind: "p",
          text: "I'd look at your specific property, the depth and type of likely buyers, current competition, and your own priorities around timeline and discretion. The method follows from that, not the other way around. For pricing context, start with [[How to Value Your Noosaville Home|/noosaville/selling/value-my-home]] and [[Choosing a Noosaville Real Estate Agent|/noosaville/selling/choosing-an-agent]].",
        },
        {
          kind: "cta",
          variant: "ember",
          eyebrow: "Want a clear recommendation?",
          title: "The right method of sale, with the reasoning behind it.",
          body: "A short strategy conversation about your home, your likely buyer pool, and how I'd run the campaign.",
          action: "Arrange a strategy session",
          href: "/sell",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is auction or private sale better in Noosaville?",
      a: "Auction can suit broadly appealing or hard-to-price homes in low-supply conditions, while private treaty often suits Noosaville's downsizer and lifestyle stock with a more defined buyer pool. The right method depends on the property and its likely buyers.",
    },
    {
      q: "What method of sale suits downsizers in Noosaville?",
      a: "Much of Noosaville's downsizer and lifestyle stock has a narrower, considered buyer pool, which often suits a well-managed private treaty campaign rather than the pressure of auction. The decision should follow buyer psychology for the specific home.",
    },
  ],
  faqHeading: "Common questions about method of sale.",
  faqEyebrow: "§ Method questions",
  related: [
    {
      category: "Selling",
      title: "How to value your Noosaville home",
      read: "6 min read",
      href: "/noosaville/selling/value-my-home",
    },
    {
      category: "Selling",
      title: "Choosing a Noosaville real estate agent",
      read: "6 min read",
      href: "/noosaville/selling/choosing-an-agent",
    },
    {
      category: "Selling",
      title: "Average days on market in Noosaville",
      read: "5 min read",
      href: "/noosaville/selling/days-on-market",
    },
  ],
  relatedHeading: "More in Selling in Noosaville",
  parentPillar: {
    label: "Selling in Noosaville",
    href: "/noosaville/selling",
    note: "the cornerstone guide",
  },
  closing: {
    eyebrow: "§ When you're ready",
    line1: "Choose the right",
    em: "method",
    line2: "for your home.",
    body: "A short strategy conversation about your home, your likely buyer pool, and the method that best protects your result.",
    primaryLabel: "Arrange a strategy session",
    primaryHref: "/sell",
    secondaryLabel: "Back to the Selling guide",
    secondaryHref: "/noosaville/selling",
  },
  author: {
    name: "Matt Powe",
    role: "Principal · Noosaville specialist",
    suburb: "Noosaville",
  },
  lastUpdated: "June 2026",
  readTime: "5 min read",
  publishedISO: "2026-06-19",
  modifiedISO: "2026-06-19",
};
