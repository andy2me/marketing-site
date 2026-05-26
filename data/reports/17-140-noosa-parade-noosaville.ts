// Max Property — Appraisal Builder · reference property
// 17/140 Noosa Parade, Noosaville. Ported from the design prototype's data.jsx into the
// typed Report contract (lib/report/types.ts). Values are illustrative per the handoff —
// real per-property data is supplied by the Cowork → Claude Code generation prompt.

import type { Report } from "@/lib/report/types";

export const report: Report = {
  slug: "17-140-noosa-parade-noosaville",
  preparedOn: "26 May 2026",
  ref: "MX-AP-0517",
  accent: "ember",

  vendor: {
    firstName: "Catherine",
    lastName: "Hoffmann",
    fullName: "Catherine & David Hoffmann",
  },

  agent: {
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
  },

  property: {
    street: "17/140 Noosa Parade",
    suburb: "Noosaville",
    state: "QLD",
    postcode: "4566",
    type: "Apartment · river-front",
    beds: 3,
    baths: 2,
    cars: 2,
    internal: "162m²",
    outdoor: "38m²",
    overture: "A quiet position on the river, a confident place in the market.",
    blurb:
      "A north-facing three-bedroom apartment on the quiet southern stretch of Noosa Parade, with deep verandahs over the river and a single common wall.",
    features: [
      "North-facing 38m² river-side terrace",
      "Carrara stone kitchen, Miele appliances",
      "Master with walk-in robe, river-view ensuite",
      "Secure double-car basement parking",
      "Lift access, 12-apartment boutique block",
      "Direct walk to Noosa Marina + River Boardwalk",
    ],
    heroUrl: null,
    galleryUrls: [],
  },

  market: {
    suburb: "Noosaville",
    segment: "Apartments · 3 bed",
    median: "$1.65M",
    medianChange: "+8.2% YoY",
    medianSeries: [
      1.21, 1.24, 1.26, 1.28, 1.31, 1.33, 1.35, 1.38, 1.42, 1.44, 1.46, 1.49, 1.51, 1.52, 1.54,
      1.56, 1.58, 1.6, 1.61, 1.63, 1.64, 1.65, 1.66, 1.65,
    ],
    dom: 21,
    domChange: "−9 days vs metro",
    domSeries: [38, 34, 32, 29, 27, 25, 23, 21],
    searchVolume: 4280,
    searchChange: "+38% YoY",
    searchSeries: [3100, 3220, 3380, 3470, 3550, 3680, 3820, 3940, 4050, 4140, 4220, 4280],
    inventory: 14,
    monthsSupply: 1.6,
    clearanceRate: 82,
    indicativeRangeLow: "$1.78M",
    indicativeRangeHigh: "$1.92M",
  },

  comps: [
    { addr: "8/156 Noosa Parade", suburb: "Noosaville", price: "$1,720,000", beds: 3, baths: 2, cars: 2, days: 18, sold: "Apr 2026" },
    { addr: "4/22 Mossman Court", suburb: "Noosaville", price: "$1,580,000", beds: 3, baths: 2, cars: 1, days: 24, sold: "Mar 2026" },
    { addr: "12/118 Noosa Parade", suburb: "Noosaville", price: "$1,840,000", beds: 3, baths: 2, cars: 2, days: 14, sold: "Feb 2026" },
    { addr: "2/65 Quamby Place", suburb: "Noosa Heads", price: "$1,910,000", beds: 3, baths: 2, cars: 2, days: 21, sold: "Feb 2026" },
  ],

  buyer: {
    headline:
      "Your most likely buyer is downsizing locally, paying cash, and acting inside 60 days.",
    sampleNote: "n = 286",
    segments: [
      {
        pct: 48,
        label: "Local downsizers",
        detail:
          "Couples 58–72 selling the family home in Doonan, Cooroy or the Noosa hinterland. Cash-strong, low-fuss, river is non-negotiable.",
        tone: "fern",
      },
      {
        pct: 31,
        label: "Interstate weekenders",
        detail:
          "Melbourne and Sydney professionals buying a second residence with future-relocate intent. Sensitive to lift access and lock-and-leave.",
        tone: "mulberry",
      },
      {
        pct: 14,
        label: "Investors · long-let",
        detail:
          "Self-managed super fund buyers. Yield-focused but will pay a premium for a boutique block.",
        tone: "ember",
      },
      {
        pct: 7,
        label: "Other / family",
        detail: "Local families consolidating from a larger home, intergenerational buyers.",
        tone: "clay",
      },
    ],
    signals: [
      { k: "1,840", v: "Active matched buyers in our database" },
      { k: "37", v: "Have asked us about Noosa Parade in the last 90 days" },
      { k: "62%", v: "Of comparable buyers paid cash or part-cash" },
    ],
  },

  approach: [
    {
      n: "01",
      phase: "Preparing",
      weeks: "Weeks 0–2",
      summary: "Quiet groundwork before a single ad runs.",
      detail:
        "Stylist briefed, photographer booked, copywriter on the page. We pre-warm a tight list of database buyers we already know are looking for a river-front three-bed.",
      items: [
        "Walk-through + price strategy",
        "Stylist + light staging",
        "Photography day (twilight + day + drone)",
        "Database pre-warm to 1,840 matched buyers",
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
        "Auction or best-and-final, run with intent. By this stage every serious buyer has been to the property twice and met James in person. We negotiate from a position of certainty, not hope.",
      items: [
        "Buyer-by-buyer negotiation strategy",
        "Auction or boardroom close",
        "Reserve protection",
        "Settlement coordination with your conveyancer",
      ],
      tone: "fern",
    },
  ],

  marketing: {
    inclusions: [
      { c: "Photography", v: "Twilight + day, drone, walkthrough video" },
      { c: "Styling", v: "Full home stylist, 4-week stage included" },
      { c: "Copy", v: "Bespoke editorial brochure, not template" },
      { c: "Portals", v: "Premiere on realestate.com.au + Domain" },
      { c: "Social", v: "Paid Meta + organic reels, geo-targeted" },
      { c: "Print", v: "DL flyers, signboard, local press" },
      { c: "Database", v: "Direct outreach to 1,840 matched buyers" },
      { c: "Opens", v: "Curated, never crowded — appointment-led" },
      { c: "Reporting", v: "Weekly written + verbal vendor reports" },
    ],
    indicativeBudget: "$11,400",
  },

  agency: {
    collective: [
      { n: "$100M+", l: "Sold across the Noosa Shire in 2025" },
      { n: "500+", l: "Properties brought to market" },
      { n: "21", l: "Median days on market" },
      { n: "4.9", l: "Average vendor rating · RateMyAgent" },
    ],
    rating: { score: "4.9", outOf: "5", stars: 5, reviews: "180+ verified vendor reviews" },
    testimonial: {
      quote:
        "From the first appraisal call to the moment we handed over the keys, Max. felt like an extension of our family. They showed up with a strategy, and they delivered every promise.",
      author: "Sarah & Tom Henley",
      detail: "Sold · 18 Hilltop Crescent, Noosaville · $2.65M · 21 days",
      note: "Vendor story · Henley · 2026",
    },
  },
};

export default report;
