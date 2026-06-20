// Max Property — MOCK reviews behind the REA Ratings & Reviews seam.
//
// SWAP PATH: replace these with lib/reviews/client.ts calling the REA Ratings & Reviews API
// once partner access is granted (see docs/REX-SETUP.md — same channel). Call sites
// (getRatingSummary / getReviews) stay identical. Reviews are attributed per agent, so as
// the team grows you can filter by agentId or show an agency-wide rail.

import type { RatingSummary, Review } from "./types";

// Featured client testimonial (Brendan Ford, Google review). Brendan has consented to
// being featured. More reviews will land here once the REA Ratings & Reviews API is wired.
// TODO(avatarUrl): paste the lh3.googleusercontent.com URL for Brendan's Google profile photo.
const REVIEWS: Review[] = [
  {
    id: "ford-google",
    quote:
      "Matt is a brilliant agent, particularly in the high end market. I've known Matt and Kirsty for a number of years and wouldn't hesitate to engage them to sell my home. Couldn't recommend them strongly enough.",
    author: "Brendan Ford",
    avatarUrl: "",
    rating: 5,
    detail: "Google review",
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
