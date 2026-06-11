// Max Property — Appraisal Builder · 5 Arinya Street, Wurtulla QLD 4575.
// Source: PropTrack property report (REA Group / realestate.com.au) prepared 11 Jun 2026,
// reconciled against agent walk-through. Market series read off PropTrack PDF charts —
// approximate, but trend + shape are accurate. Replace with CSV export if exact values needed.
//
// Important corrections vs the PDF source baked in here:
//   • 4 / 2 / 0 beds/baths/cars (garage converted — PDF still says 3/2/2; stale)
//   • Land 635m² (not 607)
//   • Internal m² omitted — REA does not supply it; do not invent
//   • Market data is segmented to 3-bed houses (subject is 4-bed); flagged on-page
//   • Buyer mix re-weighted toward renovators / value-add (home needs significant repair)
//
// Open items flagged for Matt/Andy:
//   • Matt's bio is a brand-voice placeholder — swap with Matt's preferred version.
//   • Agency template (collective stats, rating, testimonial) reused from the agency standard.

import type { Report } from "@/lib/report/types";

export const report: Report = {
  slug: "5-arinya-street-wurtulla",
  preparedOn: "10 June 2026",
  ref: "MX-AP-0610",
  accent: "ember",

  vendor: {
    firstName: "Tommy",
    lastName: "",
    fullName: "Tommy, Sean, Leslie & Brooke",
  },

  agent: {
    name: "Matt Powe",
    role: "Principal · Sunshine Coast patch",
    phone: "0438 116 191",
    email: "matt@maxproperty.au",
    bio: "Matt heads Max. Property Collective on the Sunshine Coast — measured advice, the patience to find the right buyer, and a habit of being straight with vendors about timing and price.",
    portraitUrl: null,
    recent: [],
  },

  property: {
    street: "5 Arinya Street",
    suburb: "Wurtulla",
    state: "QLD",
    postcode: "4575",
    type: "House",
    beds: 4,
    baths: 2,
    cars: 0,
    // No internal m² supplied; outdoor swapped for a bespoke facts strip below.
    facts: [
      { icon: "bed", v: 4, l: "Bedrooms" },
      { icon: "bath", v: 2, l: "Bathrooms" },
      { icon: "car", v: "None", l: "Garage" },
      { icon: "area", v: "635m²", l: "Land" },
    ],
    overture:
      "Walking distance to the surf, 5 Arinya Street is the perfect platform for someone with a vision set on a generous 635m² block.",
    blurb:
      "An elevated four-bedroom brick home on a settled, walk-to-beach street between Currimundi Lake and the Pangali Canal. With a large concrete pool, covered entertaining deck and two floors of renovation opportunity, it's built for family life and weekend gatherings — the kind of home Wurtulla rarely lets go of.",
    features: [
      "Large concrete pool",
      "Covered entertaining deck",
      "Two floors of renovation opportunity",
      "Elevated brick home, garage converted (no car accommodation)",
      "Walk-to-beach position between Currimundi Lake and the Pangali Canal",
      "Needs significant repair — value-add upside",
    ],
    heroUrl: null,
    galleryUrls: [],
  },

  market: {
    suburb: "Wurtulla",
    segment: "Houses · 3 bed · 12mo to Jun 2026",
    median: "$1.30M",
    medianChange: "+26.7% YoY",
    // Quarterly anchor values read off the PropTrack PDF trend chart, Nov 2023 → May 2026,
    // in $M. Chart x-axis labels read "24mo ago / 12mo / Today" — span is approximate.
    medianSeries: [
      0.88, 0.95, 1.02, 1.05, 1.10, 1.04, 1.00, 1.06, 1.20, 1.22, 1.30,
    ],
    dom: 26,
    domChange: "−35% YoY",
    // Last 8 quarterly values from the PropTrack DOM trend (Aug-24 → May-26).
    domSeries: [30, 34, 32, 33, 31, 30, 28, 26],
    searchVolume: 216,
    // ⚠ Week-on-week (not YoY) per PropTrack — labelled accordingly so the vendor isn't misled.
    searchChange: "+22.7% WoW",
    // 12 monthly values, Jun 2025 → May 2026.
    searchSeries: [480, 300, 900, 960, 640, 520, 600, 950, 720, 520, 1080, 620],
    inventory: 5,
    monthsSupply: 1.4,
    // No clearance figure supplied by PropTrack for this segment.
    clearanceRate: 0,
    // Range reflects the home's CURRENT (unrenovated) condition. Comps sit higher because
    // they're better-presented — see the comp set + the "needs significant repair" feature.
    indicativeRangeLow: "$1.0M",
    indicativeRangeHigh: "$1.1M",
  },

  comps: [
    {
      addr: "1 Alloota Street",
      suburb: "Wurtulla",
      price: "$1,100,000",
      beds: 3,
      baths: 2,
      cars: 4,
      sold: "Dec 2025",
      // days on market not supplied for this sale
    },
    {
      addr: "40 Naroon Crescent",
      suburb: "Wurtulla",
      price: "$1,100,000",
      beds: 3,
      baths: 1,
      cars: 2,
      days: 9,
      sold: "Apr 2026",
    },
    {
      addr: "100 Piringa Street",
      suburb: "Wurtulla",
      price: "$1,172,000",
      beds: 3,
      baths: 2,
      cars: 3,
      days: 49,
      sold: "Sep 2025",
    },
    {
      // Larger 4-bed — closest by configuration; top-end anchor, not like-for-like.
      addr: "4 Royal Close",
      suburb: "Wurtulla",
      price: "$1,550,000",
      beds: 4,
      baths: 2,
      cars: 2,
      days: 10,
      sold: "Feb 2026",
    },
  ],

  buyer: {
    headline:
      "The buyer for 5 Arinya Street sees past its current condition to the block, the address and the upside — the task is putting it in front of them.",
    sampleNote: "n = 216 active",
    segments: [
      {
        pct: 35,
        label: "Renovator families",
        detail:
          "Want the walk-to-beach address and are ready to renovate to their own taste and add value.",
        tone: "fern",
      },
      {
        pct: 28,
        label: "Builders & value-add investors",
        detail:
          "Trade and investor buyers targeting a cosmetic-to-structural uplift on a generous block for resale or rental return.",
        tone: "ember",
      },
      {
        pct: 22,
        label: "Land-led rebuilders",
        detail:
          "Focused on the 635m² block and location — weighing a full renovation or knock-down rebuild in a tightly held pocket.",
        tone: "mulberry",
      },
      {
        pct: 15,
        label: "Interstate value-seekers",
        detail:
          "Cash-strong relocators chasing Sunshine Coast lifestyle and relative value, comfortable taking on a project.",
        tone: "clay",
      },
    ],
    signals: [
      { k: "216", v: "Potential buyers currently active on Wurtulla listings (↑22.7% week on week)." },
      { k: "5", v: "Comparable homes for sale — roughly 1.4 months of stock." },
      { k: "43", v: "Houses sold in the past year (↑19.4%), at a median 26 days on market." },
    ],
  },

  // Approach phases — agency template, unchanged.
  approach: [
    {
      n: "01",
      phase: "Preparing",
      weeks: "Weeks 0–2",
      summary: "Quiet groundwork before a single ad runs.",
      detail:
        "Stylist briefed, photographer booked, copywriter on the page. We pre-warm a tight list of database buyers we already know are looking for a walk-to-beach block with renovation potential.",
      items: [
        "Walk-through + price strategy",
        "Stylist + light staging",
        "Photography day (twilight + day + drone)",
        "Database pre-warm to matched renovator and builder buyers",
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
        "Auction or best-and-final, run with intent. By this stage every serious buyer has been to the property twice and met Matt in person. We negotiate from a position of certainty, not hope.",
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
      { c: "Database", v: "Direct outreach to matched buyers" },
      { c: "Opens", v: "Curated, never crowded — appointment-led" },
      { c: "Reporting", v: "Weekly written + verbal vendor reports" },
    ],
    indicativeBudget: "$4,990",
  },

  agency: {
    collective: [
      { n: "$100M+", l: "Sold across the Sunshine Coast in 2025" },
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
