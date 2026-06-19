// Max Property — Insight: "The Sunshine Coast market — May 2026" (re-sourced).
// Every figure is tied to a dated public source per the editorial brief; the
// monthly listings chart and the "filling auction calendar" line were dropped
// because they couldn't be publicly verified at shire granularity.

import type { Article } from "@/lib/insights/types";

export const article: Article = {
  slug: "sunshine-coast-market-may-2026",
  category: "Market",
  badge: "Editor's pick",
  title: "The Sunshine Coast market in May 2026.",
  titleEmphasis: "May 2026",
  dek: "Tight, still rising, but with enough breathing room that buyers can compare, plan and negotiate rather than chase. Here's what the data shows — and what we'd do if we were you.",
  date: "12 May 2026",
  isoDate: "2026-05-12",
  readMinutes: 6,
  author: {
    name: "Matt Powe",
    role: "Principal",
    suburb: "Noosaville",
  },
  hero: {
    src: "/assets/locations/noosa-heads.jpg",
    alt: "Noosa Heads coastline and bushland from above — the Sunshine Coast region in 2026.",
    caption: "The Sunshine Coast · May 2026 · Max. Property",
  },
  body: [
    {
      kind: "p",
      text: "If the back half of 2025 felt thin, you weren't imagining it — listings were scarce and good homes traded quietly. 2026 has settled into something steadier: still tight, still rising, but with enough breathing room that buyers can compare, plan and negotiate rather than chase.",
    },
    { kind: "h2", id: "numbers", text: "The numbers that matter (Noosaville)" },
    {
      kind: "p",
      text: "Over the 12 months to early 2026, Noosaville's median house price sits around $2.0 million, up roughly 10.8% on the year, off about 144–148 sales. Houses are taking a median of ~57–65 days to sell. Units sit near $980k, selling faster at ~46 days.",
    },
    {
      kind: "p",
      text: "Source: Cotality / CoreLogic via propertyvalue.com.au and Your Investment Property, data to late 2025 – early 2026.",
    },
    {
      kind: "p",
      text: "What those medians don't show is how micro-location-driven Noosaville is — a riverfront home and a home two streets back belong to different markets. The averages orient you; they don't price your home.",
    },
    { kind: "h2", id: "supply", text: "Supply is tight, not flooded" },
    {
      kind: "p",
      text: "The Noosa shire is running at roughly 1.3 months of inventory — genuinely tight. The wider Sunshine Coast is more balanced at about 3 months, with regional days-on-market around 31 days.",
    },
    {
      kind: "p",
      text: "Source: HtAG Analytics (Cotality-derived), Noosa Shire and Sunshine Coast Regional dashboards, April–May 2026.",
    },
    {
      kind: "p",
      text: "Supply is the structural story here: tight planning rules, high build costs, and a Noosa market where most vendors sell by choice rather than necessity. When quality stock lists, it still draws competition.",
    },
    { kind: "h2", id: "tailwind", text: "A balanced market — with a strong tailwind" },
    {
      kind: "p",
      text: "For 2026, SQM Research forecasts regional price growth of 10–15%, well above the 6–10% pencilled in for the capital-city average — though more conservative local analysts put the Coast nearer 3–6%, with prime Noosa at 6–8%. Either way the direction is up. Cotality figures show 90 of 95 Sunshine Coast towns now carry a median house price above $1 million, up from fewer than 20 five years ago.",
    },
    {
      kind: "p",
      text: "Source: SQM Research and Cotality, reported via Sunshine Coast News / Home Scouts, Feb–Mar 2026.",
    },
    {
      kind: "blockquote",
      text: "This is a balanced market — and balanced markets reward preparation over speed.",
    },
    {
      kind: "p",
      text: "The drivers haven't changed: limited supply, steady interstate migration (the Sunshine Coast draws the single largest share of capital-to-regional movers in the country), and the Brisbane \"ripple\" ahead of 2032.",
    },
    { kind: "h2", id: "advice", text: "What we'd do" },
    {
      kind: "p",
      text: "If you're buying, get finance-ready and move decisively on the right home — the window for lowball offers has largely closed. If you're selling, presentation and pricing matter more than ever now that buyers have alternatives and the time to be choosy. And if Noosaville is your focus, our {{link}} walks through the precincts, the costs and how to buy well.",
      link: { label: "practical buying guide", href: "/noosaville/buying" },
    },
    {
      kind: "p",
      text: "Market figures are general commentary drawn from third-party data providers at the date of publication and may vary between sources; they aren't financial advice.",
    },
  ],
  related: [],
};
