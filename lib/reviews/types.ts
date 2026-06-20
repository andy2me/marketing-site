// Max Property — reviews types (REA Ratings & Reviews seam).
// The app reads THESE types. lib/reviews/client.ts (to be built once REA API access is
// granted) replaces the mock. Per-agent fields are included so it scales as the team grows.

export type RatingSummary = {
  /** Average star rating, e.g. 4.9 */
  average: number;
  /** Total number of reviews */
  count: number;
  /** Display label for the source, e.g. "realestate.com.au" */
  source: string;
  /** Optional link to the public reviews profile */
  sourceUrl?: string;
};

export type Review = {
  id: string;
  quote: string;
  /** Reviewer name (the vendor/buyer) */
  author: string;
  /** Optional avatar (e.g. Google profile photo URL). When absent, render initials fallback. */
  avatarUrl?: string;
  /** Star rating for this review (1–5) */
  rating: number;
  date?: string;
  /** Context line, e.g. "Sold · 18 Hilltop Crescent, Noosaville · $2.65M" */
  detail?: string;
  /** Which team member the review is for (for per-agent display as the team grows) */
  agentId?: string;
  agentName?: string;
};
