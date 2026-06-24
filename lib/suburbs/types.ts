// Suburb cluster types (handoff §9.1).
// The Suburb Hub is the parent of a topic cluster: hub → pillars → spokes.
// Pillar/Supporting models will be added when those templates land.

export type SuburbPillarKey = "buying" | "selling" | "living";

export type SuburbStat = {
  k: string;          // headline value e.g. "$1.42M"
  v: string;          // caption e.g. "Median house price"
  trend?: string;     // delta e.g. "6.1%"
  up?: boolean;       // true → green ▲; false → ember ▼
};

export type SuburbPillarCard = {
  key: SuburbPillarKey;
  index: string;      // "01"
  title: string;      // "Buying"
  line: string;       // second line e.g. "in Noosaville"
  body: string;
  count: string;      // "6 guides"
  // Visual treatment per handoff §4 HubPillars:
  // buying → fern/lime · selling → mulberry/sunrise · living → clay/linen
  color: string;      // var name e.g. "var(--fern)"
  accent: string;     // var name e.g. "var(--lime)"
  href: string;       // /noosaville/buying etc.
};

export type SuburbAgent = {
  name: string;
  role: string;
  bio: string;
  stats: { k: string; v: string }[];   // 3-stat strip
  href: string;       // profile link target
  photo?: { src: string; alt: string };
};

export type SuburbHub = {
  slug: string;       // "noosaville"
  name: string;       // "Noosaville"
  postcode: string;   // "4566"
  hero: {
    intro: string;
    imageLabel: string;   // alt/label for ImageSlot fallback
    image?: { src: string; alt: string };
  };
  stats: SuburbStat[];
  statsHeadline: string;        // h2, with emphasis already split out
  statsEmphasis?: string;       // italic-ember word
  statsBody: string;
  provenance: string;
  pillars: SuburbPillarCard[];
  agent: SuburbAgent;
};
