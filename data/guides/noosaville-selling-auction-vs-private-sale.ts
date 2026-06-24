// Max Property — Noosaville · Selling · Auction or Private Sale (supporting).
// Source: Matt Powe brief — "Auction or Private Sale: What Works Best in Noosaville?"

import type { Guide } from "@/lib/guides/types";

export const noosavilleSellingAuctionVsPrivateSale: Guide = {
  variant: "supporting",
  suburb: "noosaville",
  pillar: "selling",
  slug: "auction-vs-private-sale",
  title: "Auction or Private Sale: What Works Best in Noosaville? — Max. Property",
  metaDescription:
    "Auction or private sale in Noosaville? A practical, local comparison — including Queensland's auction price-guide rules — to help you choose the right method for your home.",
  hero: {
    overline: "§ Guide · Selling",
    h1Pre: "Auction or private sale: what works best in ",
    h1Em: "Noosaville",
    h1Post: "?",
    dek: "Neither method is inherently better. The right one depends on your property, your buyers, your circumstances — and Queensland's own rules around how auctions are priced.",
    image: {
      src: "/assets/locations/noosaville.jpg",
      alt: "A Noosaville residential street — the right method follows the property and the likely buyer.",
      caption: "Noosaville · method follows the property and the buyer",
    },
  },
  toc: [
    { id: "queensland", label: "A quick word on Queensland's rules" },
    { id: "private", label: "How private treaty works" },
    { id: "auction", label: "How auction works" },
    { id: "comparison", label: "The honest comparison" },
    { id: "noosaville", label: "Which tends to work in Noosaville?" },
    { id: "decide", label: "How to decide" },
    { id: "final", label: "Final thoughts" },
  ],
  sections: [
    {
      id: "intro",
      heading: "",
      blocks: [
        {
          kind: "p",
          text: "Few selling decisions attract as much opinion as this one.",
        },
        {
          kind: "p",
          text: "Auction is sometimes presented as the modern, competitive choice. Private treaty is sometimes framed as the safer, more controlled path. The truth is less convenient: neither method is inherently better. The right choice depends on your property, your buyers, and your circumstances.",
        },
        {
          kind: "p",
          text: "Noosaville also has its own characteristics — a considered, owner-occupier driven market — and Queensland has specific rules that shape how each method plays out. Both are worth understanding before you decide.",
        },
      ],
    },
    {
      id: "queensland",
      heading: "A quick word on Queensland's rules",
      blocks: [
        {
          kind: "p",
          text: "This is where Noosaville sellers should be careful applying advice written for Sydney or Melbourne.",
        },
        {
          kind: "p",
          text: "In Queensland, under the Property Occupations Act 2014, an agent cannot provide a price guide for a property going to auction. There's no advertised price and no quoted range — buyers are given the auction date and left to form their own view of value. There's even a prescribed disclosure to that effect.",
        },
        {
          kind: "p",
          text: "That single rule changes the dynamics considerably. In states where auction price guides are normal, the guide does a lot of work attracting and filtering buyers. Here, it doesn't exist. So an auction campaign in Noosaville relies more heavily on the quality of marketing and the agent's direct engagement with buyers to build the right competition.",
        },
        {
          kind: "p",
          text: "It's not a reason to avoid auction. It's a reason to go in understanding how it actually works locally.",
        },
      ],
    },
    {
      id: "private",
      heading: "How private treaty works",
      blocks: [
        {
          kind: "p",
          text: "Private treaty is the most common method in this market, and for good reason.",
        },
        {
          kind: "p",
          text: "The property is listed with a price or price range, and buyers make offers, which are then negotiated. It's familiar, flexible, and gives buyers a clear reference point — which suits a considered buyer pool that likes to do its homework.",
        },
        {
          kind: "p",
          text: "Private treaty tends to suit properties with a defined, identifiable buyer pool; homes where comparable sales make pricing relatively clear; higher price brackets with limited directly comparable stock; and sellers who prefer a less public, less time-pressured process.",
        },
        {
          kind: "p",
          text: "The main consideration is pricing. Because the price is visible, getting it right at the outset matters enormously — too high and you stall in the critical early weeks; too low and you may anchor expectations beneath what the market would pay.",
        },
      ],
    },
    {
      id: "auction",
      heading: "How auction works",
      blocks: [
        {
          kind: "p",
          text: "An auction sets a defined campaign with a fixed end date, culminating in public competitive bidding.",
        },
        {
          kind: "p",
          text: "Its strength is price discovery. When genuine competition exists, an auction can establish a price the seller might not have reached through private negotiation — particularly for properties where value is harder to pin down. The fixed date also concentrates buyer attention and creates a clear sense of urgency.",
        },
        {
          kind: "p",
          text: "Auction tends to suit distinctive or hard-to-compare properties where price discovery helps; homes with broad appeal likely to attract multiple buyers; low-supply conditions where competition is more likely; and sellers comfortable with a more public, time-bound process.",
        },
        {
          kind: "p",
          text: "The trade-off is that an auction needs genuine competition to work. Without enough active buyers, the public nature of the process can work against you — and in Noosaville's more measured market, that depth of competition isn't guaranteed for every property.",
        },
      ],
    },
    {
      id: "comparison",
      heading: "The honest comparison",
      blocks: [
        {
          kind: "p",
          text: "Strip away the marketing language and it comes down to a few real differences. Private treaty gives buyers a reference point; auction discovers the price on the day. Auction concentrates competition into one moment; private treaty allows it to build more quietly over time. Auction is fixed in timeframe; private treaty is open-ended. Auction places pressure on buyers; private treaty tends to distribute it more evenly. And private treaty is more discreet; auction is public by design.",
        },
        {
          kind: "p",
          text: "There's no universally correct answer in that list. There's only the answer that fits your specific property and goals.",
        },
      ],
    },
    {
      id: "noosaville",
      heading: "Which tends to work in Noosaville?",
      blocks: [
        {
          kind: "p",
          text: "Noosaville's buyer base is largely downsizers, retirees and interstate relocators — considered buyers who research carefully and rarely act on impulse. That profile often aligns naturally with private treaty, where buyers can take their time and weigh their decision.",
        },
        {
          kind: "p",
          text: "That said, auction has a real place here, particularly for distinctive or tightly held homes where value is genuinely hard to establish from comparable sales, and where broad appeal is likely to draw competing buyers.",
        },
        {
          kind: "p",
          text: "The point isn't that one method always wins. It's that the method should follow the property and the likely buyers — not a trend, and not whichever approach an agent happens to favour.",
        },
        {
          kind: "cta",
          variant: "ember",
          eyebrow: "Want a clear recommendation?",
          title: "Talk through which method suits your property.",
          body: "A short conversation about your home, your likely buyer pool, and the method that best protects your result. No pressure.",
          action: "Arrange a strategy session",
          href: "/sell",
        },
      ],
    },
    {
      id: "decide",
      heading: "How to decide",
      blocks: [
        {
          kind: "p",
          text: "A sensible way through it: look honestly at how comparable your property is — clear comparables favour private treaty; genuine uniqueness can favour auction. Consider the likely depth of competition for your home in current conditions. Factor in your appetite for a public, time-bound campaign versus a more discreet one. And make sure pricing or strategy is grounded in evidence either way.",
        },
        {
          kind: "p",
          text: "If you're weighing this up, our guide on [[valuing your Noosaville home|/noosaville/selling/value-my-home]] explains how that evidence is built, and [[choosing a Noosaville agent|/noosaville/selling/choosing-an-agent]] covers how to assess whether an agent's recommendation is genuinely tailored to you.",
        },
      ],
    },
    {
      id: "final",
      heading: "Final thoughts",
      blocks: [
        {
          kind: "p",
          text: "Auction or private treaty isn't a question of which method is better. It's a question of which suits your property, your buyers and your circumstances.",
        },
        {
          kind: "p",
          text: "In Noosaville — a considered market with its own rules around auction pricing — that decision deserves to be made deliberately rather than by default.",
        },
        {
          kind: "quote",
          text: "No pressure. Just perspective.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is auction or private sale better in Noosaville?",
      a: "Neither is inherently better. Private treaty suits properties with clear comparables and a defined buyer pool, while auction can help with distinctive homes where price discovery and broad competition add value. The right method depends on the property and likely buyers.",
    },
    {
      q: "Can agents give a price guide for an auction in Queensland?",
      a: "No. Under the Property Occupations Act 2014, an agent cannot provide a price guide for a property going to auction in Queensland. Buyers are given the auction date and form their own view of value.",
    },
    {
      q: "Why is private treaty common in Noosaville?",
      a: "Noosaville's buyer base is largely considered owner-occupiers — downsizers, retirees and interstate relocators — who tend to research carefully. Private treaty suits that profile by giving buyers a clear price reference and time to decide.",
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
    body: "A short, honest conversation about your property, your likely buyer pool, and whether auction or private treaty best protects your result.",
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
  readTime: "6 min read",
  publishedISO: "2026-06-19",
  modifiedISO: "2026-06-24",
};
