// Suburb hub accessor (mirrors lib/insights/store.ts).
// One entry today: noosaville. New suburbs land by adding to HUBS + the dynamic
// route's generateStaticParams picks them up.

import type { SuburbHub } from "./types";

const noosaville: SuburbHub = {
  slug: "noosaville",
  name: "Noosaville",
  postcode: "4566",
  hero: {
    intro:
      "River-side rhythm — cafés, kayaks and classic Queenslanders. The Noosa River's quieter, more liveable shoulder, and one of the Coast's most resilient markets.",
    imageLabel: "Noosa River foreshore · Gympie Tce · 4:5",
    image: {
      src: "/assets/locations/noosaville-hero.jpg",
      alt: "Golden-hour aerial of Noosaville — yachts moored on the Noosa River, the foreshore at Gympie Terrace, and the hinterland on the horizon.",
    },
  },
  statsHeadline: "A market that holds its nerve.",
  statsEmphasis: "nerve",
  statsBody:
    "Noosaville rarely runs hot or cold. Tightly held streets, limited new supply and steady owner-occupier demand keep values stable through the cycle.",
  stats: [
    { k: "$1.42M", v: "Median house price", trend: "6.1%", up: true },
    { k: "$985K", v: "Median unit price", trend: "4.3%", up: true },
    { k: "34 days", v: "Median days on market" },
    { k: "2.9%", v: "Gross rental yield" },
  ],
  provenance:
    "Q2 2026 · CoreLogic + Max. internals · rolling 12-month median",
  pillars: [
    {
      key: "buying",
      index: "01",
      title: "Buying",
      line: "in Noosaville",
      body:
        "What you'll pay, where to look, and how to compete without overpaying. The cornerstone guide for first-timers and upgraders alike.",
      count: "5 guides",
      color: "var(--fern)",
      accent: "var(--lime)",
      href: "/noosaville/buying",
    },
    {
      key: "selling",
      index: "02",
      title: "Selling",
      line: "in Noosaville",
      body:
        "Timing, method and presentation for a Noosaville campaign — and what the local buyer pool actually responds to.",
      count: "6 guides",
      color: "var(--mulberry)",
      accent: "var(--sunrise)",
      href: "/noosaville/selling",
    },
    {
      key: "living",
      index: "03",
      title: "Living",
      line: "in Noosaville",
      body:
        "Schools, cafés, the river, the commute. The everyday texture of the suburb, for people deciding whether it's home.",
      count: "4 guides",
      color: "var(--clay)",
      accent: "var(--soft-linen-500)",
      href: "/noosaville/living",
    },
  ],
  agent: {
    name: "Matt Powe",
    role: "Principal · Noosaville specialist",
    bio:
      "Matt has sold across Noosaville for over a decade — from the riverside units on Gympie Terrace to the hinterland-edge family homes. If you want a read on a street, a price, or whether now is the moment, he's the call.",
    stats: [
      { k: "140+", v: "Noosaville sales" },
      { k: "12 yrs", v: "In the suburb" },
      { k: "4.9★", v: "Vendor rating" },
    ],
    href: "/team",
    photo: {
      src: "/assets/team/matt-powe-large.jpg",
      alt: "Matt Powe, Principal and Founder of Max Property.",
    },
  },
};

const HUBS: Record<string, SuburbHub> = {
  noosaville,
};

export function getHub(slug: string): SuburbHub | null {
  return HUBS[slug] ?? null;
}

export function getHubSlugs(): string[] {
  return Object.keys(HUBS);
}
