// Max Property — Insight: "What the listing doesn't tell you."
// Standalone journal piece (Selling/Buying advisory). No dated market figures — review
// annually for tone and internal links.

import type { Article } from "@/lib/insights/types";

export const article: Article = {
  slug: "what-the-listing-doesnt-tell-you",
  category: "Selling",
  title: "What the listing doesn't tell you.",
  titleEmphasis: "the listing",
  dek: "A property listing starts the conversation — it doesn't finish it. What online photos can't show you, and what to check in person, whether you're buying or selling.",
  date: "18 Jun 2026",
  isoDate: "2026-06-18",
  readMinutes: 5,
  author: {
    name: "Matt Powe",
    role: "Principal",
    suburb: "Noosaville",
    portraitUrl: "/assets/team/matt-powe.webp",
  },
  hero: {
    alt: "A Sunshine Coast home — what the listing photos can and can't show you.",
    caption: "Listings versus reality · Jun 2026 · Max. Property",
  },
  body: [
    {
      kind: "p",
      text: "Almost every property journey now starts on a screen. You scroll, you filter, you save the ones you like and dismiss the ones you don't — often forming a firm opinion about a home before you've stood anywhere near it.",
    },
    {
      kind: "p",
      text: "The portals are genuinely useful. But after enough years walking through Sunshine Coast homes, I've learned that the gap between how a property reads online and how it feels in person is where most of the real story lives. Some homes are better than their listing. A few are worse. Almost none are exactly what the photos suggested.",
    },
    { kind: "p", text: "This is worth understanding whichever side of the deal you're on." },
    { kind: "h2", id: "what-it-cant-carry", text: "What a listing can't carry" },
    {
      kind: "p",
      text: "A good set of photos and a floorplan will tell you the shape of a place and roughly how it's been kept. What they can't tell you is most of what actually determines whether you'll be happy there.",
    },
    {
      kind: "ul",
      items: [
        {
          lead: "Light, and when it arrives.",
          text: "A room photographed at the perfect hour can be dim by mid-afternoon. Which way the home faces, and how the light moves through it across a day, changes how it feels to live in more than almost anything — and you can't see it in a single frame.",
        },
        {
          lead: "Sound.",
          text: "A listing is silent. The road you didn't notice on the floorplan, the flight path, the busy café strip that's wonderful on Saturday and loud on Sunday morning — none of it shows up until you're standing there.",
        },
        {
          lead: "The street, not just the house.",
          text: "How a street actually lives — the neighbours' frontages, the traffic at school pickup, where everyone parks — sits entirely outside the listing photos, and it's a big part of day-to-day life.",
        },
        {
          lead: "The things underneath.",
          text: "Flood and overlay history, the financial health of a body corporate, what's approved to be built two doors down. These rarely make the marketing, and they matter enormously.",
        },
        {
          lead: "Scale and flow.",
          text: "Wide lenses are kind to small rooms. A floorplan tells you the dimensions but not how the spaces connect, or whether the layout actually works for the way you live.",
        },
      ],
    },
    {
      kind: "p",
      text: "None of this is dishonesty. It's just the limit of the format. A listing is a brochure, not the building.",
    },
    { kind: "h2", id: "for-buyers", text: "If you're buying: go and check the gaps" },
    {
      kind: "p",
      text: "The practical takeaway for buyers is simple — treat the listing as a shortlist tool, then verify the things it can't show you, in person, before you commit.",
    },
    {
      kind: "p",
      text: "Visit at more than one time of day if you can. Stand in the main living space and just listen for a minute. Walk the street, not only the house. Ask directly about flood and overlay history, and about body corporate finances if it's a unit or townhouse — and don't accept a vague answer. Pull the recent comparable sales yourself rather than trusting the feeling the photos gave you.",
    },
    {
      kind: "p",
      text: "The homes that disappoint people are almost always the ones they fell for online and never properly interrogated in person. The ones that genuinely surprise them — for the better — are often the ones whose photos undersold a place that lives beautifully.",
    },
    { kind: "h2", id: "for-sellers", text: "If you're selling: close the gap honestly" },
    {
      kind: "p",
      text: "For sellers, the same truth points the other way. If buyers are forming their first, firm impression from your listing — and increasingly from interstate, sight-unseen until the weekend — then the listing has to do real work, and it has to be honest enough that the in-person visit confirms the promise rather than puncturing it.",
    },
    {
      kind: "p",
      text: "Strong, accurate photography matters, but so does presenting the home so the things a camera can't capture still come through on inspection: the light, the flow, the sense that the place is cared for. The fastest way to lose a motivated buyer is a listing that oversells, followed by a walkthrough that quietly lets them down. Trust, once dented, is hard to recover mid-campaign.",
    },
    {
      kind: "blockquote",
      text: "Present the home as it genuinely is, at its best — and let the inspection do what the screen never could.",
    },
    { kind: "h2", id: "the-point", text: "The point" },
    {
      kind: "p",
      text: "A listing starts the conversation. It was never meant to finish it. The buyers who do well slow down and check what the screen couldn't show them. The sellers who do well make sure there's nothing to hide when those buyers arrive.",
    },
    {
      kind: "p",
      text: "Either way, the decision that matters happens in the home, not on the phone.",
    },
    {
      kind: "p",
      text: "If you'd like a straight read on a property you're considering — or an honest view of how your own home will actually present once buyers walk through it — {{link}}. No pressure. Just clarity.",
      link: { label: "request a private appraisal", href: "/sell#appraisal" },
    },
  ],
  related: [
    "why-queensland-auctions-no-price-guide",
    "whos-moving-to-the-sunshine-coast",
    "sunshine-coast-market-may-2026",
  ],
  seoDescription:
    "A property listing starts the conversation — it doesn't finish it. What online photos can't show you, and what to check in person, whether you're buying or selling.",
};
