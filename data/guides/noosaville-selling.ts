// Max Property — Noosaville · Selling pillar.
// Authored from the Noosaville selling cluster brief. Sibling to the buying
// pillar; shares the same Guide schema and renders under /noosaville/selling.

import type { Guide } from "@/lib/guides/types";

export const noosavilleSelling: Guide = {
  variant: "pillar",
  suburb: "noosaville",
  pillar: "selling",
  title: "Selling Your Home in Noosaville | A Practical 2026 Guide — Max. Property",
  metaDescription:
    "How to value, time, present and sell your Noosaville home — written by an agent who works one suburb deliberately. Honest pricing, considered campaigns.",
  hero: {
    overline: "§ Pillar guide · Selling",
    h1Pre: "Selling a home in Noosaville: a ",
    h1Em: "practical",
    h1Post: " guide.",
    dek: "What actually drives value here, when to launch, who should sell it, and how to protect your result — written by an agent who works one suburb deliberately.",
    image: {
      src: "/assets/locations/noosaville.jpg",
      alt: "The Noosa River and Noosaville foreshore on a clear morning.",
      caption: "Noosaville · the patch we work every day",
    },
  },
  intro:
    "oosaville rewards sellers who do the unglamorous work — accurate pricing, careful presentation, the right method for the home — and quietly punishes those who skip it. This is the guide we'd hand a friend who asked us how to sell here without leaving money on the table.",
  toc: [
    { id: "value", label: "Knowing what your home is worth" },
    { id: "timing", label: "When to sell" },
    { id: "agent", label: "Choosing the right agent" },
    { id: "method", label: "Auction vs private treaty" },
    { id: "presentation", label: "Presentation that protects price" },
    { id: "days", label: "Days on market — what to expect" },
    { id: "campaign", label: "Inside a Max. campaign" },
    { id: "next", label: "Your next step" },
  ],
  sections: [
    {
      id: "value",
      heading: "Knowing what your home is worth",
      blocks: [
        {
          kind: "p",
          text: "Value in Noosaville is street-level, not suburb-level. Two homes a few minutes apart can sell at very different numbers depending on position, aspect and presentation. The right starting point isn't an algorithm — it's a considered appraisal that weighs comparable recent sales, current buyer depth, and the specific strengths and limits of your home.",
        },
        {
          kind: "p",
          text: "We've written a longer piece on the levers that matter most here — [[How to Value Your Noosaville Home|/noosaville/selling/value-my-home]] — including why the median doesn't answer the question and how online estimates compare to a real appraisal.",
        },
      ],
    },
    {
      id: "timing",
      heading: "When to sell",
      blocks: [
        {
          kind: "p",
          text: "Noosaville's demand is lifestyle-driven and runs year-round. There's no perfect month — and waiting for one usually costs more than it saves. What matters far more than the calendar is how prepared and accurately priced your home is when it launches.",
        },
        {
          kind: "p",
          text: "If you'd like a straight read on current conditions and whether now suits your situation, [[When Is the Best Time to Sell in Noosaville?|/noosaville/selling/best-time-to-sell]] walks through the signals worth watching.",
        },
      ],
    },
    {
      id: "agent",
      heading: "Choosing the right agent",
      blocks: [
        {
          kind: "quote",
          text: "The agent who quotes the highest figure is almost never the one who delivers the best result.",
        },
        {
          kind: "p",
          text: "Local depth, honest pricing, a clear marketing plan, negotiation discipline and reliable communication — those are the markers that separate agents who get strong results from agents who don't. [[Choosing a Noosaville Real Estate Agent|/noosaville/selling/choosing-an-agent]] covers the questions to ask and the answers that should give you confidence.",
        },
      ],
    },
    {
      id: "method",
      heading: "Auction vs private treaty",
      blocks: [
        {
          kind: "p",
          text: "Both work here. Auction tends to suit broadly appealing or hard-to-price homes; private treaty often suits the considered downsizer pool that makes up much of the market. The right choice follows buyer psychology, not office default.",
        },
        {
          kind: "p",
          text: "[[Auction or Private Sale: What Works Best in Noosaville?|/noosaville/selling/auction-vs-private-sale]] lays out when each suits, and how we'd decide for your home.",
        },
      ],
    },
    {
      id: "presentation",
      heading: "Presentation that protects price",
      blocks: [
        {
          kind: "p",
          text: "Presentation is one of the few levers you fully control — and in a market of discerning buyers, it's one of the most valuable. The goal isn't over-styling; it's helping a buyer feel something the moment they arrive, and quietly removing the small doubts that undermine an offer.",
        },
        {
          kind: "p",
          text: "Start with [[The Max Presentation Checklist for Noosaville Sellers|/noosaville/selling/presentation-checklist]] — a room-by-room walkthrough of what moves the needle and what doesn't.",
        },
      ],
    },
    {
      id: "days",
      heading: "Days on market — what to expect",
      blocks: [
        {
          kind: "p",
          text: "Time on market is mostly a reflection of three decisions you control: price, presentation, and how ready the home is when it launches. Get those right and meaningful enquiry tends to come in the first two weeks — the window that produces competition and a strong result.",
        },
        {
          kind: "p",
          text: "[[Average Days on Market: What Noosaville Sellers Should Expect|/noosaville/selling/days-on-market]] explains why overpricing lengthens the campaign and how to land at the strong end of the range.",
        },
      ],
    },
    {
      id: "campaign",
      heading: "Inside a Max. campaign",
      blocks: [
        {
          kind: "p",
          text: "We work Noosaville deliberately because depth beats breadth in a market this micro-location-driven. That means street-level pricing, honest appraisals, a presentation-led approach, disciplined negotiation, and a single point of contact who is accountable for the result from appraisal to settlement.",
        },
        {
          kind: "cta",
          variant: "ember",
          eyebrow: "When you're ready",
          title: "Request a considered Noosaville appraisal.",
          body: "Evidence-based, no-pressure — grounded in recent comparable sales and current buyer demand.",
          action: "Book an appraisal",
          href: "/sell",
        },
      ],
    },
    {
      id: "next",
      heading: "Your next step",
      blocks: [
        {
          kind: "p",
          text: "Whether you're three months out or just curious about the number, the most useful thing we can do is talk you through where your home genuinely sits — and what would move it. No pressure, just clarity.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How do I find out what my Noosaville home is worth?",
      a: "Value in Noosaville depends on micro-location, proximity to the river, renovation level, overlays and presentation — not the suburb median. A considered appraisal weighs genuinely comparable recent sales and current buyer demand for your specific home.",
    },
    {
      q: "Is now a good time to sell in Noosaville?",
      a: "Because Noosaville demand is lifestyle-driven and underpinned by owner-occupiers, it tends to be resilient across cycles. Well-presented, accurately priced homes perform throughout the year — preparation usually matters more than timing.",
    },
    {
      q: "Should I sell by auction or private treaty?",
      a: "Auction can suit broadly appealing or hard-to-price homes in low-supply conditions; private treaty often suits Noosaville's downsizer and lifestyle stock with a defined, considered buyer pool. The right method follows the home and its likely buyers.",
    },
    {
      q: "How long will it take to sell?",
      a: "Days on market in Noosaville depends mainly on pricing, presentation and competition. Accurately priced, well-presented homes typically attract meaningful enquiry in the first two weeks; overpriced ones tend to sit and reposition lower later.",
    },
  ],
  cluster: [
    {
      title: "How to Value Your Noosaville Home in Today's Market",
      read: "6 min",
      href: "/noosaville/selling/value-my-home",
    },
    {
      title: "Choosing a Noosaville Real Estate Agent: What to Look For",
      read: "6 min",
      href: "/noosaville/selling/choosing-an-agent",
    },
    {
      title: "When Is the Best Time to Sell in Noosaville?",
      read: "5 min",
      href: "/noosaville/selling/best-time-to-sell",
    },
    {
      title: "Auction or Private Sale: What Works Best in Noosaville?",
      read: "5 min",
      href: "/noosaville/selling/auction-vs-private-sale",
    },
    {
      title: "Average Days on Market: What Noosaville Sellers Should Expect",
      read: "5 min",
      href: "/noosaville/selling/days-on-market",
    },
    {
      title: "The Max. Presentation Checklist for Noosaville Sellers",
      read: "7 min",
      href: "/noosaville/selling/presentation-checklist",
    },
  ],
  closing: {
    eyebrow: "§ When you're ready",
    line1: "Sell with someone who",
    em: "works",
    line2: "this one suburb.",
    body: "A short call with Matt Powe will tell you more about your Noosaville result than any portal estimate. Evidence, not flattery. No pressure, no obligation.",
    primaryLabel: "Request an appraisal",
    primaryHref: "/sell",
    secondaryLabel: "Meet Matt",
    secondaryHref: "/team",
  },
  author: {
    name: "Matt Powe",
    role: "Principal · Noosaville specialist",
    suburb: "Noosaville",
  },
  lastUpdated: "June 2026",
  readTime: "9 min read",
  publishedISO: "2026-06-19",
  modifiedISO: "2026-06-19",
};
