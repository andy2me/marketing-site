// Guide registry (mirrors lib/suburbs/store.ts + lib/insights/store.ts).
// Keyed by "{suburb}/{pillar}" for pillars and "{suburb}/{pillar}/{slug}" for spokes.
// The dynamic routes' generateStaticParams pull from getPillarSlugs() — new guides
// land by adding an entry here and nothing else.

import type { Guide } from "./types";
import { noosavilleSelling } from "@/data/guides/noosaville-selling";
import { noosavilleSellingValueMyHome } from "@/data/guides/noosaville-selling-value-my-home";
import { noosavilleSellingChoosingAnAgent } from "@/data/guides/noosaville-selling-choosing-an-agent";
import { noosavilleSellingBestTimeToSell } from "@/data/guides/noosaville-selling-best-time-to-sell";
import { noosavilleSellingAuctionVsPrivateSale } from "@/data/guides/noosaville-selling-auction-vs-private-sale";
import { noosavilleSellingDaysOnMarket } from "@/data/guides/noosaville-selling-days-on-market";
import { noosavilleSellingPresentationChecklist } from "@/data/guides/noosaville-selling-presentation-checklist";

// ── Noosaville · Buying (pillar) ───────────────────────────────────────────
const noosavilleBuying: Guide = {
  variant: "pillar",
  suburb: "noosaville",
  pillar: "buying",
  title: "Buying in Noosaville | A Practical 2026 Guide — Max. Property",
  metaDescription:
    "Median prices, precincts, the buying timeline and how to make a competitive offer in Noosaville QLD.",
  hero: {
    overline: "§ Pillar guide · Buying",
    h1Pre: "Buying a home in Noosaville: a ",
    h1Em: "practical",
    h1Post: " guide.",
    dek: "What the riverside suburb actually costs, where to look, and how to buy well without overpaying — written by an agent who sells here every week.",
  },
  intro:
    "oosaville is the part of Noosa most locals quietly prefer. It has the river without the Hastings Street crowds, the cafés without the parking battles, and a housing stock that ranges from $800k riverside units to $4M waterfront homes. This guide is the one we'd hand a friend who asked, \"should we buy here — and how?\"",
  toc: [
    { id: "why", label: "Why buyers choose Noosaville" },
    { id: "precincts", label: "The lay of the land" },
    { id: "houses", label: "Houses vs units" },
    { id: "prices", label: "What you'll actually pay" },
    { id: "timeline", label: "The buying timeline" },
    { id: "finance", label: "Finance & pre-approval" },
    { id: "diligence", label: "Inspections & due diligence" },
    { id: "offer", label: "Making a competitive offer" },
    { id: "method", label: "Auction vs private treaty" },
    { id: "costs", label: "Costs beyond the price" },
    { id: "settlement", label: "Settlement & moving in" },
    { id: "help", label: "Getting local help" },
  ],
  sections: [
    {
      id: "why",
      heading: "Why buyers choose Noosaville",
      blocks: [
        {
          kind: "p",
          text: "Three things keep demand steady: the river, the lifestyle, and the relative value. You're a flat walk or paddle from the water, ten minutes from Hastings Street, and paying meaningfully less than equivalent Noosa Heads addresses. For families, downsizers and remote workers alike, that combination is hard to beat on the eastern seaboard.",
        },
        {
          kind: "p",
          text: "It's also a market that doesn't lurch. [[Noosaville's median|/insights/noosaville-supply-story]] has grown steadily rather than spiking, which means fewer nasty surprises for buyers who hold for the medium term.",
        },
      ],
    },
    {
      id: "precincts",
      heading: "The lay of the land",
      blocks: [
        {
          kind: "p",
          text: "Noosaville isn't one place. It helps to think in precincts, because price and feel shift street to street.",
        },
        { kind: "h3", text: "Riverfront & Gympie Terrace" },
        {
          kind: "p",
          text: "The tourist-facing strip — restaurants, kayak hire, the ferry. Units here trade on the view and the walkability. Body corporate matters as much as the floor plan.",
        },
        { kind: "h3", text: 'Thomas Street & the "golden grid"' },
        {
          kind: "p",
          text: "Tightly held free-standing homes a short walk to the river. This is where families compete hardest, and where well-presented stock sells fastest.",
        },
        { kind: "h3", text: "Weyba Road & the hinterland edge" },
        {
          kind: "p",
          text: "Larger blocks, more house for the money, a slightly longer trip to the water. The value play for buyers who want land.",
        },
      ],
    },
    {
      id: "houses",
      heading: "Houses vs units",
      blocks: [
        {
          kind: "p",
          text: "The first real decision. Units give you lock-and-leave convenience, river proximity and a lower entry price, but you're buying into a body corporate and its budget. Houses give you land and control, with the maintenance and the higher price that come with them.",
        },
        {
          kind: "p",
          text: "We've written a full breakdown of the trade-off — see [[Units vs houses in Noosaville: what holds value|/insights/units-vs-houses-river]] — but the short version: if you'll be here less than five years, the unit math often wins; if you're putting down roots, the land usually does.",
        },
      ],
    },
    {
      id: "prices",
      heading: "What you'll actually pay",
      blocks: [
        {
          kind: "p",
          text: "Here's the current picture. These are rolling 12-month medians to Q2 2026 — useful for orientation, not a substitute for street-level advice.",
        },
        {
          kind: "stats",
          columns: 3,
          items: [
            { k: "$1.42M", v: "Median house", trend: "6.1%", up: true },
            { k: "$985K", v: "Median unit", trend: "4.3%", up: true },
            { k: "$2.1M+", v: "Riverfront entry" },
          ],
          provenance: "Q2 2026 · CoreLogic + Max. internals",
        },
        {
          kind: "p",
          text: "Above the medians, waterfront and near-new builds carry a clear premium; below them, original-condition homes on smaller blocks are where renovators find room to add value.",
        },
        {
          kind: "cta",
          variant: "fern",
          eyebrow: "Get ahead of the market",
          title: "See Noosaville stock before it hits the portals.",
          body: "Join the buyer list and we'll match you to new listings as they come in.",
          action: "Join the buyer list",
          href: "/contact?enquiry=buy&suburb=Noosaville",
        },
      ],
    },
    {
      id: "timeline",
      heading: "The buying timeline",
      blocks: [
        {
          kind: "p",
          text: "From \"we're looking\" to keys in hand, a typical Noosaville purchase runs six to twelve weeks. The variable isn't the paperwork — it's how ready you are when the right home appears. Buyers who've done their finance and due-diligence homework move with confidence; those who haven't tend to miss out and then chase the market.",
        },
      ],
    },
    {
      id: "finance",
      heading: "Finance & pre-approval",
      blocks: [
        {
          kind: "p",
          text: "Get pre-approval before you fall in love with anything. In a market where good stock can attract multiple offers in the first week, a conditional buyer is at a real disadvantage against someone finance-ready. Talk to a broker who understands Sunshine Coast valuations specifically.",
        },
      ],
    },
    {
      id: "diligence",
      heading: "Inspections & due diligence",
      blocks: [
        {
          kind: "p",
          text: "Building and pest is non-negotiable on houses. For units, read the body corporate records carefully — sinking fund balance, recent special levies, and any disclosed defects tell you more about the next decade of ownership than the kitchen does.",
        },
      ],
    },
    {
      id: "offer",
      heading: "Making a competitive offer",
      blocks: [
        {
          kind: "quote",
          text: "The strongest offer isn't always the highest — it's the one the vendor can trust will settle.",
        },
        {
          kind: "p",
          text: "Clean terms win. A fair price with a short, certain settlement and minimal conditions will often beat a higher offer riddled with subject-to clauses. Know what the vendor actually needs — sometimes it's the date, not the dollar.",
        },
      ],
    },
    {
      id: "method",
      heading: "Auction vs private treaty",
      blocks: [
        {
          kind: "p",
          text: "Noosaville sells both ways. Auctions suit standout homes with broad appeal; private treaty suits everything else, and gives you more room to negotiate terms. If you're bidding at auction, set your ceiling before the day and don't move it in the heat of the moment.",
        },
      ],
    },
    {
      id: "costs",
      heading: "Costs beyond the price",
      blocks: [
        {
          kind: "p",
          text: "Stamp duty, legal fees, building and pest, loan establishment, and moving — the extras add up to a meaningful share of your budget. We've itemised every one with current Queensland figures in [[The real cost to buy in Noosaville (2026)|/noosaville/buying/cost-to-buy]], so there are no surprises at settlement.",
        },
      ],
    },
    {
      id: "settlement",
      heading: "Settlement & moving in",
      blocks: [
        {
          kind: "p",
          text: "Standard Queensland settlement is 30 to 45 days. Your conveyancer handles the mechanics; your job is the final inspection and lining up utilities, insurance and removalists. Book movers early — Noosaville's peak seasons get tight.",
        },
      ],
    },
    {
      id: "help",
      heading: "Getting local help",
      blocks: [
        {
          kind: "p",
          text: "None of this replaces a conversation with someone who works the streets you're considering. If you'd like a candid read on a specific home, street or price, that's exactly what a buyer strategy call is for.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is Noosaville a good place to buy in 2026?",
      a: "For medium-term buyers, yes — limited supply and steady owner-occupier demand have kept values resilient through the cycle. As always, the specific street and property matter more than the suburb average.",
    },
    {
      q: "What's the entry price for a Noosaville unit?",
      a: "Around $800k for an older two-bedroom away from the water, rising to $2M+ for renovated riverfront. The median sits near $985k as of Q2 2026.",
    },
    {
      q: "Should I buy a house or a unit?",
      a: "If you'll hold less than five years, a well-bought unit often makes more sense; for longer holds, land typically outperforms. Body corporate health is the deciding factor on units.",
    },
    {
      q: "How competitive is the market right now?",
      a: "Well-presented stock can attract multiple offers in the first week. Finance-ready buyers with clean terms consistently win over higher but more conditional offers.",
    },
  ],
  cluster: [
    {
      title: "The real cost to buy in Noosaville (2026)",
      read: "7 min",
      href: "/noosaville/buying/cost-to-buy",
    },
    {
      title: "Units vs houses: what holds value",
      read: "6 min",
      href: "/noosaville/buying/units-vs-houses",
    },
    {
      title: "How to read a body corporate report",
      read: "5 min",
      href: "/noosaville/buying/body-corporate-report",
    },
    {
      title: "First-home buyers: the Noosaville playbook",
      read: "8 min",
      href: "/noosaville/buying/first-home-buyers",
    },
    {
      title: "Building & pest — what we actually look for",
      read: "4 min",
      href: "/noosaville/buying/building-and-pest",
    },
    {
      title: "Bidding at a Noosaville auction",
      read: "5 min",
      href: "/noosaville/buying/auction-bidding",
    },
  ],
  closing: {
    eyebrow: "§ When you're ready",
    line1: "Buy with someone who",
    em: "lives",
    line2: "here.",
    body: "A short call with Matt Powe will tell you more about Noosaville than a month of scrolling. No pressure, no obligation.",
    primaryLabel: "Book a buyer strategy call",
    primaryHref: "/contact?enquiry=buy&suburb=Noosaville",
    secondaryLabel: "Join the buyer list",
    secondaryHref: "/contact?enquiry=buy&suburb=Noosaville",
  },
  author: {
    name: "Matt Powe",
    role: "Principal · Noosaville specialist",
    suburb: "Noosaville",
  },
  lastUpdated: "June 2026",
  readTime: "9 min read",
  publishedISO: "2026-06-01",
  modifiedISO: "2026-06-15",
};

// ── Noosaville · Buying · Cost-to-buy (supporting) ────────────────────────
const noosavilleBuyingCostToBuy: Guide = {
  variant: "supporting",
  suburb: "noosaville",
  pillar: "buying",
  slug: "cost-to-buy",
  title: "The Real Cost to Buy in Noosaville (2026) — Max. Property",
  metaDescription:
    "Beyond the price — stamp duty, conveyancing, building & pest and the smaller line items that catch first-time Noosaville buyers out. With current Queensland figures.",
  hero: {
    overline: "§ Guide · Buying",
    h1Pre: "The real cost to buy in Noosaville ",
    h1Em: "(2026)",
    h1Post: ".",
    dek: "Beyond the purchase price — stamp duty, legals, inspections and the smaller line items that catch first-time buyers out.",
  },
  toc: [
    { id: "duty", label: "Stamp duty" },
    { id: "legal", label: "Conveyancing & legal" },
    { id: "inspections", label: "Building & pest" },
    { id: "finance", label: "Loan & finance costs" },
    { id: "smaller", label: "The smaller line items" },
    { id: "bottom", label: "The bottom line" },
  ],
  sections: [
    {
      id: "intro",
      heading: "",
      blocks: [
        {
          kind: "p",
          text: "Ask most buyers what a home costs and they'll quote the price. But between contract and keys, a stack of smaller costs lands — and on a Noosaville purchase they add up to a meaningful share of your deposit. Here's every one, with current Queensland figures.",
        },
      ],
    },
    {
      id: "duty",
      heading: "Stamp duty (transfer duty)",
      blocks: [
        {
          kind: "p",
          text: "The biggest single extra. Queensland transfer duty is tiered, and concessions apply for first-home buyers and owner-occupiers. On a $1.2M Noosaville home with no concession, budget roughly $50,000–$55,000. First-home buyers under the threshold can pay substantially less — sometimes nothing.",
        },
      ],
    },
    {
      id: "legal",
      heading: "Conveyancing & legal",
      blocks: [
        {
          kind: "p",
          text: "A solicitor or licensed conveyancer to handle contract review, searches and settlement. Expect $1,200–$2,500 depending on complexity. Worth every dollar on a unit, where the body corporate disclosure needs a careful read.",
        },
      ],
    },
    {
      id: "inspections",
      heading: "Building & pest",
      blocks: [
        {
          kind: "p",
          text: "Non-negotiable on a house. A combined building and pest inspection runs $400–$700 on the Sunshine Coast. For units, the equivalent due diligence is the body corporate records search.",
        },
      ],
    },
    {
      id: "finance",
      heading: "Loan & finance costs",
      blocks: [
        {
          kind: "p",
          text: "Lender establishment fees, valuation, and — if your deposit is under 20% — Lenders Mortgage Insurance, which can run into five figures. Mortgage registration and transfer fees are smaller but real.",
        },
        {
          kind: "stats",
          columns: 3,
          items: [
            { k: "~$58K", v: "Typical extras on a $1.2M house" },
            { k: "4.8%", v: "Of purchase price, all-in" },
            { k: "$400+", v: "Building & pest" },
          ],
          provenance:
            "Indicative · QLD 2026 · excludes LMI. Confirm with your conveyancer.",
        },
      ],
    },
    {
      id: "smaller",
      heading: "The smaller line items",
      blocks: [
        {
          kind: "p",
          text: "Council and water rate adjustments at settlement, home and contents insurance from the day you're on the contract, utility connections, and removalists. Individually minor; collectively a few thousand dollars you'll want in reserve.",
        },
        {
          kind: "leadmagnet",
          title: "The Noosaville cost-to-buy checklist",
          body: "A one-page PDF with every line item above and live 2026 Queensland figures — print it, tick it off, budget with confidence.",
          action: "Download the checklist",
        },
      ],
    },
    {
      id: "bottom",
      heading: "The bottom line",
      blocks: [
        {
          kind: "p",
          text: "As a rule of thumb, set aside 4–5% of the purchase price for costs on top of your deposit. Build it into your budget from day one and settlement holds no surprises. For the full buying picture, head back to [[the Noosaville buying guide|/noosaville/buying]] — or talk to us about your specific numbers.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How much is stamp duty in Noosaville?",
      a: "Queensland transfer duty is tiered. On a $1.2M home with no concession, budget roughly $50,000–$55,000. First-home and owner-occupier concessions can reduce this significantly.",
    },
    {
      q: "What are total buying costs as a percentage?",
      a: "Plan for 4–5% of the purchase price on top of your deposit, covering duty, legals, inspections and finance costs — more if Lenders Mortgage Insurance applies.",
    },
    {
      q: "Do I need a building inspection on a unit?",
      a: "Less critical than on a house, but the body corporate records search is essential — it reveals the sinking fund balance, any special levies and disclosed defects.",
    },
  ],
  faqHeading: "Common cost questions.",
  faqEyebrow: "§ Cost questions",
  related: [
    {
      category: "Buying",
      title: "Units vs houses: what holds value",
      read: "6 min read",
      href: "/noosaville/buying/units-vs-houses",
    },
    {
      category: "Buying",
      title: "First-home buyers: the Noosaville playbook",
      read: "8 min read",
      href: "/noosaville/buying/first-home-buyers",
    },
    {
      category: "Buying",
      title: "How to read a body corporate report",
      read: "5 min read",
      href: "/noosaville/buying/body-corporate-report",
    },
  ],
  relatedHeading: "More in Buying in Noosaville",
  parentPillar: {
    label: "Buying in Noosaville",
    href: "/noosaville/buying",
    note: "the cornerstone guide",
  },
  closing: {
    eyebrow: "§ When you're ready",
    line1: "Buy with someone who",
    em: "lives",
    line2: "here.",
    body: "A short call with Matt Powe will tell you more about Noosaville than a month of scrolling. No pressure, no obligation.",
    primaryLabel: "Book a buyer strategy call",
    primaryHref: "/contact?enquiry=buy&suburb=Noosaville",
    secondaryLabel: "Back to the Buying guide",
    secondaryHref: "/noosaville/buying",
  },
  author: {
    name: "Matt Powe",
    role: "Principal · Noosaville specialist",
    suburb: "Noosaville",
  },
  lastUpdated: "June 2026",
  readTime: "7 min read",
  publishedISO: "2026-06-08",
  modifiedISO: "2026-06-15",
};

// Pillar registry: keyed by "{suburb}/{pillar}".
const PILLARS: Record<string, Guide> = {
  "noosaville/buying": noosavilleBuying,
  "noosaville/selling": noosavilleSelling,
};

// Supporting article registry: keyed by "{suburb}/{pillar}/{slug}".
const SPOKES: Record<string, Guide> = {
  "noosaville/buying/cost-to-buy": noosavilleBuyingCostToBuy,
  "noosaville/selling/value-my-home": noosavilleSellingValueMyHome,
  "noosaville/selling/choosing-an-agent": noosavilleSellingChoosingAnAgent,
  "noosaville/selling/best-time-to-sell": noosavilleSellingBestTimeToSell,
  "noosaville/selling/auction-vs-private-sale": noosavilleSellingAuctionVsPrivateSale,
  "noosaville/selling/days-on-market": noosavilleSellingDaysOnMarket,
  "noosaville/selling/presentation-checklist": noosavilleSellingPresentationChecklist,
};

export function getPillar(suburb: string, pillar: string): Guide | null {
  return PILLARS[`${suburb}/${pillar}`] ?? null;
}

export function getSpoke(
  suburb: string,
  pillar: string,
  slug: string,
): Guide | null {
  return SPOKES[`${suburb}/${pillar}/${slug}`] ?? null;
}

export function getPillarSlugs(): { suburb: string; pillar: string }[] {
  return Object.keys(PILLARS).map((key) => {
    const [suburb, pillar] = key.split("/");
    return { suburb, pillar };
  });
}

export function getSpokeSlugs(): {
  suburb: string;
  pillar: string;
  slug: string;
}[] {
  return Object.keys(SPOKES).map((key) => {
    const [suburb, pillar, slug] = key.split("/");
    return { suburb, pillar, slug };
  });
}
