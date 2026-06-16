// Max Property — Agent profile types.
// One canonical type for a registered agent. Listing/review attribution still flows
// through ListingAgent.id and Review.agentId; this type owns the rich profile content
// (bio, stats, video, socials) that powers /team/[slug].

export type AgentStat = {
  label: string;
  value: string;
  /** Suffix rendered at smaller size next to the value, e.g. "%". */
  suffix?: string;
};

export type AgentReel = {
  id: string;
  /** 9:13 thumbnail (poster). */
  thumbnail: string;
  label: string;
  /** Display duration, e.g. "0:48". */
  duration: string;
};

export type AgentFeaturedVideo = {
  /** 16:9 thumbnail (poster). */
  thumbnail: string;
  title: string;
  /** Mono kicker line, e.g. "Featured · 2:40". */
  kicker: string;
};

export type Agent = {
  /** Matches ListingAgent.id + Review.agentId so listings/reviews can be filtered by agent. */
  id: string;
  /** Route param, e.g. "matt-powe". */
  slug: string;
  name: string;
  /** Role line shown in hero + contact card, e.g. "Sales Agent · Noosaville & Tewantin". */
  role: string;
  agency: string;
  phone: string;
  phoneHref: string;
  email: string;
  /** 4:5 portrait URL. null → fall back to a mulberry tile with the agent's initials. */
  headshot: string | null;
  /** Suburb chips. Names — slugified to link to /[suburb] when a hub exists. */
  patches: string[];
  /** Short suburb line under the name in the contact card, e.g. "Noosaville & Tewantin". */
  patchLine: string;
  /** One-line positioning paragraph under the role in the hero. */
  positioning: string;
  /** Bio H2, e.g. "Born on the river. Still selling on it." */
  bioHeading: string;
  /** First paragraph — always visible. May contain inline <strong>. */
  bioLead: string;
  /** Remaining paragraphs — gated behind Read more. */
  bioMore: string[];
  /** 3–4 numeric stats shown under the hero. */
  stats: AgentStat[];
  featuredVideo: AgentFeaturedVideo | null;
  /** 0 reels + null featured → hide the whole video section. */
  reels: AgentReel[];
  socials: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
};
