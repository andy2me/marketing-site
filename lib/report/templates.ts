// Max Property — Appraisal Builder · authoring templates.
// Reusable defaults for the /admin/new-report composer: agency-level content (which doesn't
// change per property), the standard "James Whitlam" agent record, and a blank Report skeleton.

import type {
  Agent,
  Agency,
  ApproachPhase,
  Comp,
  Marketing,
  Report,
} from "./types";

export const JAMES_AGENT: Agent = {
  name: "James Whitlam",
  role: "Principal · Noosaville patch",
  phone: "0408 224 119",
  email: "james@maxproperty.au",
  bio: "James has worked the Noosa River and Noosaville flats for the better part of a decade — first as a buyer's advocate, now as principal at Max. He's known for measured advice and a refusal to over-promise.",
  portraitUrl: null,
  recent: [
    { addr: "3 Headland Drive, Noosa Heads", price: "$3,950,000", days: 24 },
    { addr: "11 River Reach, Noosaville", price: "$1,275,000", days: 18 },
    { addr: "42 Quamby Place, Noosa Heads", price: "$3,400,000", days: 31 },
  ],
};

export const APPROACH_TEMPLATE: ApproachPhase[] = [
  {
    n: "01",
    phase: "Preparing",
    weeks: "Weeks 0–2",
    summary: "Quiet groundwork before a single ad runs.",
    detail:
      "Stylist briefed, photographer booked, copywriter on the page. We pre-warm a tight list of database buyers we already know are looking.",
    items: [
      "Walk-through + price strategy",
      "Stylist + light staging",
      "Photography day (twilight + day + drone)",
      "Database pre-warm to matched buyers",
    ],
    tone: "linen",
  },
  {
    n: "02",
    phase: "Early momentum",
    weeks: "Weeks 2–3",
    summary: "Launch hard, observe the room, qualify.",
    detail:
      "Coordinated drop across portals, social and print. Two opens, two twilights, and direct outreach. By end of week three, we know exactly who is real and who is window-shopping.",
    items: [
      "Premiere on realestate.com.au + Domain",
      "Paid social, geo-targeted",
      "Two opens + two twilight inspections",
      "First written vendor report",
    ],
    tone: "mulberry",
  },
  {
    n: "03",
    phase: "Maximum atmosphere",
    weeks: "Weeks 3–5",
    summary: "Create the room. Negotiate from strength.",
    detail:
      "Auction or best-and-final, run with intent. By this stage every serious buyer has been to the property twice and met the agent in person. We negotiate from a position of certainty, not hope.",
    items: [
      "Buyer-by-buyer negotiation strategy",
      "Auction or boardroom close",
      "Reserve protection",
      "Settlement coordination with your conveyancer",
    ],
    tone: "fern",
  },
];

export const MARKETING_TEMPLATE: Marketing = {
  inclusions: [
    { c: "Photography", v: "Twilight + day, drone, walkthrough video" },
    { c: "Styling", v: "Full home stylist, 4-week stage included" },
    { c: "Copy", v: "Bespoke editorial brochure, not template" },
    { c: "Portals", v: "Premiere on realestate.com.au + Domain" },
    { c: "Social", v: "Paid Meta + organic reels, geo-targeted" },
    { c: "Print", v: "DL flyers, signboard, local press" },
    { c: "Database", v: "Direct outreach to matched buyers" },
    { c: "Opens", v: "Curated, never crowded — appointment-led" },
    { c: "Reporting", v: "Weekly written + verbal vendor reports" },
  ],
  indicativeBudget: "$11,400",
};

export const AGENCY_TEMPLATE: Agency = {
  collective: [
    { n: "$100M+", l: "Sold across the Noosa Shire in 2025" },
    { n: "500+", l: "Properties brought to market" },
    { n: "21", l: "Median days on market" },
    { n: "4.9", l: "Average vendor rating · realestate.com.au" },
  ],
  rating: { score: "4.9", outOf: "5", stars: 5, reviews: "180+ verified vendor reviews" },
  testimonial: {
    quote:
      "From the first appraisal call to the moment we handed over the keys, Max. felt like an extension of our family. They showed up with a strategy, and they delivered every promise.",
    author: "Sarah & Tom Henley",
    detail: "Sold · 18 Hilltop Crescent, Noosaville · $2.65M · 21 days",
    note: "Vendor story · Henley · 2026",
  },
};

export function blankComp(): Comp {
  return { addr: "", suburb: "", price: "", beds: 3, baths: 2, cars: 2, days: 0, sold: "" };
}

export function blankReport(): Report {
  // Deep-clone the template arrays/objects so the form's mutations don't bleed into the module.
  return JSON.parse(
    JSON.stringify({
      slug: "",
      preparedOn: "", // filled on hydrate (deterministic SSR)
      ref: "",
      accent: "ember" as const,
      vendor: { firstName: "", lastName: "", fullName: "" },
      agent: JAMES_AGENT,
      property: {
        street: "",
        suburb: "",
        state: "QLD",
        postcode: "",
        type: "",
        beds: 3,
        baths: 2,
        cars: 2,
        internal: "",
        outdoor: "",
        overture: "",
        blurb: "",
        features: ["", "", "", ""],
      },
      market: {
        suburb: "",
        segment: "",
        median: "",
        medianChange: "",
        medianSeries: [],
        dom: 21,
        domChange: "",
        domSeries: [],
        searchVolume: 0,
        searchChange: "",
        searchSeries: [],
        inventory: 0,
        monthsSupply: 0,
        clearanceRate: 0,
        indicativeRangeLow: "",
        indicativeRangeHigh: "",
      },
      comps: [blankComp(), blankComp(), blankComp(), blankComp()],
      buyer: {
        headline: "",
        sampleNote: "n = 0",
        segments: [
          { pct: 0, label: "", detail: "", tone: "fern" },
          { pct: 0, label: "", detail: "", tone: "mulberry" },
          { pct: 0, label: "", detail: "", tone: "ember" },
          { pct: 0, label: "", detail: "", tone: "clay" },
        ],
        signals: [
          { k: "", v: "" },
          { k: "", v: "" },
          { k: "", v: "" },
        ],
      },
      approach: APPROACH_TEMPLATE,
      marketing: MARKETING_TEMPLATE,
      agency: AGENCY_TEMPLATE,
    }),
  ) as Report;
}
