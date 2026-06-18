// Max Property — MOCK reviews behind the REA Ratings & Reviews seam.
//
// SWAP PATH: replace these with lib/reviews/client.ts calling the REA Ratings & Reviews API
// once partner access is granted (see docs/REX-SETUP.md — same channel). Call sites
// (getRatingSummary / getReviews) stay identical. Reviews are attributed per agent, so as
// the team grows you can filter by agentId or show an agency-wide rail.

import type { RatingSummary, Review } from "./types";

// One agent today (more to come). Numbers are placeholders until the REA API is wired.
const REVIEWS: Review[] = [
  {
    id: "henley-hilltop",
    quote:
      "From the first appraisal call to the moment we handed over the keys, Max. felt like an extension of our family. They showed up with a strategy, and they delivered every promise.",
    author: "Sarah & Tom Henley",
    rating: 5,
    date: "2026-04-18",
    detail: "Sold · 18 Hilltop Crescent, Noosaville · $2.65M",
    agentId: "matt-powe",
    agentName: "Matt Powe",
  },
  {
    id: "okeefe-banksia",
    quote:
      "Calm, honest and relentlessly prepared. We had three offers in the first week and sold above our reserve — exactly the outcome they mapped out on day one.",
    author: "Daniel O'Keefe",
    rating: 5,
    date: "2026-03-30",
    detail: "Sold · 7 Banksia Avenue, Noosa Heads · $2.8M",
    agentId: "matt-powe",
    agentName: "Matt Powe",
  },
  {
    id: "nguyen-riverreach",
    quote:
      "As first-time sellers we were nervous, but every step was explained and every call returned the same day. We'd recommend the team to anyone in Noosa.",
    author: "Mai Nguyen",
    rating: 5,
    date: "2026-02-11",
    detail: "Sold · 11 River Reach, Noosaville · $1.27M",
    agentId: "matt-powe",
    agentName: "Matt Powe",
  },
];

export async function getRatingSummary(): Promise<RatingSummary> {
  return {
    average: 4.9,
    count: 23,
    source: "realestate.com.au",
    sourceUrl: "https://www.realestate.com.au/",
  };
}

export async function getReviews(limit?: number): Promise<Review[]> {
  return typeof limit === "number" ? REVIEWS.slice(0, limit) : REVIEWS;
}
