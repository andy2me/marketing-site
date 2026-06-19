// Max Property — Noosaville · Selling · Days on Market (supporting).
// Source: Noosaville selling cluster brief, piece #6.

import type { Guide } from "@/lib/guides/types";

export const noosavilleSellingDaysOnMarket: Guide = {
  variant: "supporting",
  suburb: "noosaville",
  pillar: "selling",
  slug: "days-on-market",
  title: "Average Days on Market: What Noosaville Sellers Should Expect — Max. Property",
  metaDescription:
    "How long does it take to sell in Noosaville? Why days on market comes down to pricing, presentation and the crucial first two weeks of any campaign.",
  hero: {
    overline: "§ Guide · Selling",
    h1Pre: "Average days on market: what Noosaville sellers should ",
    h1Em: "expect",
    h1Post: ".",
    dek: "Time on market is less a fixed number than a reflection of three decisions you mostly control — price, presentation and readiness.",
    image: {
      src: "/assets/locations/noosaville.jpg",
      alt: "Noosaville rooflines — well-priced, well-presented homes sell in the first two weeks.",
      caption: "Noosaville · the first two weeks decide most campaigns",
    },
  },
  toc: [
    { id: "what", label: "What days on market tells you" },
    { id: "window", label: "The first two weeks matter most" },
    { id: "over", label: "Why overpricing lengthens the campaign" },
    { id: "control", label: "What you can control" },
  ],
  sections: [
    {
      id: "intro",
      heading: "",
      blocks: [
        {
          kind: "p",
          text: "\"How long will it take to sell?\" is one of the first questions vendors ask. The honest answer is that days on market is less a fixed number and more a reflection of three decisions you mostly control.",
        },
        {
          kind: "p",
          text: "Days on market — how long a home takes to sell from listing to contract — varies with pricing, presentation and competition. Get those right and a Noosaville home tends to attract meaningful enquiry early. Get them wrong, particularly pricing, and the clock works against you.",
        },
      ],
    },
    {
      id: "what",
      heading: "What days on market actually tells you",
      blocks: [
        {
          kind: "p",
          text: "A low number usually signals a home that was priced accurately and presented well, launched into genuine demand. A high number usually signals the opposite — most often a price that was ambitious at launch.",
        },
        {
          kind: "p",
          text: "For the current Noosaville average, the latest [[Sunshine Coast market update|/insights/sunshine-coast-market-may-2026]] is the right reference, since it moves with conditions. But the average matters less than understanding what would put your home at the better end of it.",
        },
      ],
    },
    {
      id: "window",
      heading: "The first two weeks matter most",
      blocks: [
        {
          kind: "quote",
          text: "Buyer attention is at its peak when a home first hits the market. Spend that window wisely.",
        },
        {
          kind: "p",
          text: "The active buyers — the ones who've been watching, who are ready — see your home immediately and form a view quickly. That early window is your best chance at competition and a strong result. Spend it on an accurately priced, well-presented home and you capture that attention. Spend it on an ambitious price and you waste it, because the buyers who matter most are looking right then.",
        },
      ],
    },
    {
      id: "over",
      heading: "Why overpricing lengthens the campaign",
      blocks: [
        {
          kind: "p",
          text: "It's the most common reason Noosaville homes sit. An ambitious launch price means the right buyers look, hesitate, and move on. As the days accumulate, the listing loses its \"new\" status, and buyers start to assume something's wrong. The eventual sale — after a price adjustment — usually lands below what an accurate launch would have achieved, and takes longer to get there.",
        },
        {
          kind: "p",
          text: "Accurate pricing isn't about selling cheaply. It's about protecting the momentum that produces a strong, timely result. We unpack this in [[How to Value Your Noosaville Home|/noosaville/selling/value-my-home]].",
        },
      ],
    },
    {
      id: "control",
      heading: "What you can control",
      blocks: [
        {
          kind: "p",
          text: "You can't control the broader market, but you can control the three things that most determine your days on market: price it to the evidence, present it well, and launch it genuinely ready. Do that, and time on market tends to look after itself. The [[presentation checklist|/noosaville/selling/presentation-checklist]] covers the readiness side.",
        },
        {
          kind: "cta",
          variant: "ember",
          eyebrow: "Want a realistic view?",
          title: "How your home is likely to perform — and what would lift it.",
          body: "A considered appraisal grounded in evidence. No pressure. Just clarity.",
          action: "Request an appraisal",
          href: "/sell",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How long does it take to sell a home in Noosaville?",
      a: "Days on market in Noosaville depends mainly on pricing, presentation and competition. Accurately priced, well-presented homes typically attract meaningful enquiry within the first weeks; overpriced ones tend to sit. See the latest market update for the current average.",
    },
    {
      q: "Does overpricing make a home take longer to sell?",
      a: "Yes. An ambitious launch price wastes the peak-attention first two weeks, the listing loses momentum, and the eventual sale after a price adjustment usually lands lower and takes longer than an accurate launch would have.",
    },
  ],
  faqHeading: "Common questions about days on market.",
  faqEyebrow: "§ Days on market",
  related: [
    {
      category: "Selling",
      title: "How to value your Noosaville home",
      read: "6 min read",
      href: "/noosaville/selling/value-my-home",
    },
    {
      category: "Selling",
      title: "When is the best time to sell?",
      read: "5 min read",
      href: "/noosaville/selling/best-time-to-sell",
    },
    {
      category: "Selling",
      title: "The Max presentation checklist",
      read: "7 min read",
      href: "/noosaville/selling/presentation-checklist",
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
    line1: "Land at the",
    em: "stronger",
    line2: "end of the range.",
    body: "A considered appraisal grounded in evidence — and a clear view of what would put your Noosaville home at the better end of the days-on-market range.",
    primaryLabel: "Request an appraisal",
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
