// Max Property — Insight: "The Sunshine Coast market — May 2026".
// Replaces the live placeholder for /insights/sunshine-coast-market-may-2026 and seeds the
// featured slot on /insights. Copy ported from the content-cluster design handoff (§7).

import type { Article } from "@/lib/insights/types";

export const article: Article = {
  slug: "sunshine-coast-market-may-2026",
  category: "Market",
  badge: "Editor's pick",
  title: "The Sunshine Coast market in May 2026.",
  titleEmphasis: "May 2026",
  dek: "Stock is recovering, buyer enquiry is back at 2024 levels, and the winter auction calendar is filling fast. Here's what we're seeing on the ground — and what we'd do if we were you.",
  date: "12 May 2026",
  isoDate: "2026-05-12",
  readMinutes: 6,
  author: {
    name: "Matt Powe",
    role: "Principal",
    suburb: "Noosaville",
  },
  hero: {
    alt: "The Noosa River mouth at dusk, May 2026.",
    caption: "The Noosa River mouth, May 2026 · Max. Property",
  },
  body: [
    {
      kind: "p",
      text: "If the back half of 2025 felt thin, you weren't imagining it. Listings were scarce, buyers were cautious, and good homes traded quietly off-market. May has been the clearest turn we've seen in eighteen months.",
    },
    { kind: "h2", id: "stock", text: "Stock is finally moving" },
    {
      kind: "p",
      text: "New listings across the Noosa shire were up sharply on the same month last year. Vendors who'd been waiting for “certainty” appear to have decided it isn't coming, and have chosen to act. For buyers, that means genuine choice for the first time in a while.",
    },
    {
      kind: "chart",
      overline: "New listings · Noosa shire",
      caption:
        "New residential listings per month · Q4 2025 – Q2 2026 · Source: realestate.com.au + Max. internals",
      series: [
        { label: "Dec", value: 118, valueLabel: "118" },
        { label: "Jan", value: 104, valueLabel: "104" },
        { label: "Feb", value: 142, valueLabel: "142" },
        { label: "Mar", value: 168, valueLabel: "168" },
        { label: "Apr", value: 191, valueLabel: "191" },
        { label: "May", value: 224, valueLabel: "224" },
      ],
    },
    { kind: "h2", id: "enquiry", text: "Buyer enquiry is back" },
    {
      kind: "p",
      text: "Our own enquiry volumes are tracking at 2024 levels — and crucially, the quality has lifted. More finance-ready buyers, fewer tyre-kickers. Open-home numbers are healthy without the frenzy of the 2021 peak.",
    },
    {
      kind: "blockquote",
      text: "This is a balanced market — and balanced markets reward preparation over speed.",
    },
    { kind: "h2", id: "advice", text: "What we'd do" },
    {
      kind: "p",
      text: "If you're buying, get finance-ready and move on the right home with confidence — the days of lowball offers landing are largely behind us. If you're selling, presentation and pricing matter more than ever now that buyers have alternatives. And if you're watching Noosaville specifically, read our {{link}} before you start.",
      link: { label: "practical buying guide", href: "/insights/noosaville-supply-story" },
    },
  ],
  related: ["auction-or-private-treaty", "q1-clearance-rates", "noosaville-supply-story"],
};
