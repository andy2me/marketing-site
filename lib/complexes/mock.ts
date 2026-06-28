// The Islander — pilot dataset (mock).
//
// 187 Gympie Terrace, Noosaville · riverside apartment complex.
//
// Lifted from the prototype's `src/data.jsx` and typed. Every figure here is a
// placeholder — production replaces this module with the licensed feed
// (Cotality / Domain / Titles) plus agent-authored commentary stored separately.
//
// Editing rules (until the live feed lands):
//   • Add or change a unit → put it in OVERRIDES below; the rest stays in sync
//     because the stack plan, cards, table and detail pages all read the same
//     ComplexProfile record.
//   • Add an event → append to EVENTS in newest-first order. applyEventsToUnits
//     (called in store.ts) takes care of stamping the live status on each unit.
//   • Add a report → append to REPORTS and update LATEST_REPORT_ID.

import {
  applyEventsToUnits,
  LEVEL_NAMES,
} from "./derive";
import type {
  AttributionAgency,
  ComplexEvent,
  ComplexProfile,
  ComplexUnit,
  Report,
  UnitDetail,
} from "./types";

const MAX: AttributionAgency = { kind: "self", name: "Max Property" };
const COMPETITORS: AttributionAgency[] = [
  { kind: "competitor", name: "Coastline Realty" },
  { kind: "competitor", name: "Rivermouth Property" },
  { kind: "competitor", name: "Hinterland & Co" },
];

const LEVELS = ["G", "1", "2", "3", "4", "5"] as const;

// 48 units, 8 per level. Even numbers = river-facing (north-east). Bigger homes
// higher up; penthouses on level 5. Overrides (below) authoritatively set the
// configs for any unit that carries an event or appears on its own detail page,
// so the stack plan, cards, table, event sub-lines and unit page all agree.
function buildUnits(): ComplexUnit[] {
  const out: ComplexUnit[] = [];
  let n = 1;
  for (let li = 0; li < LEVELS.length; li++) {
    const lvl = LEVELS[li];
    for (let i = 0; i < 8; i++) {
      const river = n % 2 === 0;
      const top   = lvl === "5";
      const beds  = top ? 3 : n % 5 === 0 ? 3 : n % 3 === 0 ? 1 : 2;
      const baths = beds >= 3 ? 2 : beds === 1 ? 1 : 2;
      const car   = beds >= 3 ? 2 : 1;
      const area  = (top ? 158 : 92 + beds * 14 + (river ? 10 : 0)) + li * 2;
      out.push({
        id: `unit-${n}`,
        number: n,
        level: lvl,
        levelName: LEVEL_NAMES[lvl] ?? lvl,
        beds,
        baths,
        car,
        area: `${area}m²`,
        aspect: river ? "North-east · river" : "South-west · garden",
        river,
        status: "Off Market",
        lastEvent: null,
      });
      n++;
    }
  }
  return out;
}

type Override = Partial<Pick<ComplexUnit, "beds" | "baths" | "car" | "area">>;

// Explicit configs for units that carry events / appear in detail.
const OVERRIDES: Record<number, Override> = {
  4:  { beds: 2, baths: 2, car: 1, area: "104m²" },
  7:  { beds: 3, baths: 2, car: 2, area: "142m²" },
  9:  { beds: 1, baths: 1, car: 1, area: "72m²"  },
  12: { beds: 2, baths: 2, car: 1, area: "112m²" },
  14: { beds: 2, baths: 2, car: 1, area: "114m²" },
  18: { beds: 2, baths: 1, car: 1, area: "94m²"  },
  20: { beds: 2, baths: 2, car: 1, area: "116m²" },
  23: { beds: 2, baths: 2, car: 1, area: "108m²" },
  28: { beds: 2, baths: 2, car: 1, area: "118m²" },
  31: { beds: 2, baths: 1, car: 1, area: "96m²"  },
  36: { beds: 2, baths: 2, car: 1, area: "110m²" },
  41: { beds: 3, baths: 2, car: 2, area: "168m²" },
  45: { beds: 3, baths: 2, car: 2, area: "166m²" },
};

const UNITS: ComplexUnit[] = buildUnits().map((u) => {
  const o = OVERRIDES[u.number];
  return o ? { ...u, ...o } : u;
});

// Events feed — newest-first. `agency.kind === "self"` ⇒ Matt's own (small
// ember tag, photography permitted). `featuredIn` ties the event to one or
// more Reports for the unit-timeline back-link (M6).
const EVENTS: ComplexEvent[] = [
  { id: "e1",  unit: 12, type: "sold",   status: "Recently Sold", price: "$1,485,000",            sub: "2 bed · 2 bath · 1 car",          date: "14 Mar 2026", agency: MAX,             hero: true },
  { id: "e2",  unit: 7,  type: "listed", status: "For Sale",      price: "Offers over $1,650,000", sub: "3 bed · 2 bath · 2 car",          date: "2 Feb 2026",  agency: MAX,             featuredIn: ["q1-2026"] },
  { id: "e3",  unit: 41, type: "sold",   status: "Recently Sold", price: "$2,100,000",            sub: "3 bed · 2 bath · 2 car · penthouse", date: "20 Jan 2026", agency: COMPETITORS[0] },
  { id: "e4",  unit: 23, type: "rented", status: "For Rent",      price: "$980 / week",           sub: "2 bed · 2 bath · 1 car",          date: "12 Dec 2025", agency: COMPETITORS[1] },
  { id: "e5",  unit: 31, type: "sold",   status: "Recently Sold", price: "$1,290,000",            sub: "2 bed · 1 bath · 1 car",          date: "8 Nov 2025",  agency: MAX,             featuredIn: ["q4-2025"] },
  { id: "e6",  unit: 4,  type: "listed", status: "For Rent",      price: "$1,150 / week",         sub: "2 bed · 2 bath · 1 car",          date: "30 Oct 2025", agency: COMPETITORS[2] },
  { id: "e7",  unit: 36, type: "sold",   status: "Recently Sold", price: "$1,560,000",            sub: "2 bed · 2 bath · 1 car",          date: "15 Aug 2025", agency: MAX },
  { id: "e8",  unit: 18, type: "sold",   status: "Recently Sold", price: "$1,180,000",            sub: "2 bed · 1 bath · 1 car",          date: "3 Jun 2025",  agency: COMPETITORS[0] },
  { id: "e9",  unit: 9,  type: "rented", status: "For Rent",      price: "$890 / week",           sub: "1 bed · 1 bath · 1 car",          date: "21 Apr 2025", agency: MAX },
  { id: "e10", unit: 45, type: "sold",   status: "Recently Sold", price: "$1,975,000",            sub: "3 bed · 2 bath · 2 car",          date: "12 Feb 2025", agency: COMPETITORS[1] },
];

applyEventsToUnits(UNITS, EVENTS);

// Reports — quarterly + annual market reports on the complex. v1 ships only the
// wayfinding *links* into the (unbuilt) report surface — `url` is "#" until that
// surface lands. `LATEST_REPORT_ID` powers the complex-page LatestReportBlock;
// set it to null to preview the suppressed empty state.
const REPORTS: Report[] = [
  {
    id: "q1-2026",
    title: "The Islander — Q1 2026",
    backlinkLabel: "Q1 2026 report",
    date: "Published 28 Mar 2026",
    url: "#",
    excerpt:
      "Two river-facing sales reset the benchmark for two-bedders this quarter, " +
      "and the gap to the garden side widened again.",
  },
  {
    id: "annual-2026",
    title: "The Islander — 2026 Annual Review",
    backlinkLabel: "2026 annual review",
    date: "Published 10 Apr 2026",
    url: "#",
    excerpt:
      "A landmark year on the bend: record two-bedder result, tightening stock, " +
      "and a widening premium for the north-east stacks.",
  },
  {
    id: "q4-2025",
    title: "The Islander — Q4 2025",
    backlinkLabel: "Q4 2025 report",
    date: "Published 18 Dec 2025",
    url: "#",
    excerpt:
      "A quiet close to the year on the river bend, with two leasings firming " +
      "up rental expectations across the garden stacks.",
  },
];

const LATEST_REPORT_ID = "q1-2026";

// Authored deep detail. Unit 12 is the hero of the pilot (Matt's own recent
// sale → rich commentary + result panel + gallery). Every other unit renders
// honestly from its ComplexUnit + events, with the CommentaryPending empty
// state above the timeline.
const UNIT_DETAILS: Record<number, UnitDetail> = {
  12: {
    number: 12,
    statusBadge: "Recently Sold",
    headline: "The river stack on Level 1 — and why it ran hot.",
    gallery: true,
    result: {
      kind: "sold",
      over: "The result",
      label: "Sold · 14 March 2026",
      price: "$1,485,000",
      agency: MAX,
      stats: [
        ["4",      "Registered bidders"],
        ["6 days", "On market"],
        ["+10%",   "Above guide"],
        ["1st",    "Weekend offer"],
      ],
    },
    panel: { price: "$1,485,000", caption: "Sold 14 Mar 2026" },
    commentary: {
      kind: "post-event",
      body:
        "Sold above expectations — four registered bidders and multiple offers " +
        "across the first weekend. The north-east aspect did the work: this is " +
        "the river stack on Level 1, high enough for the reach across to the " +
        "ferry, low enough to keep the lift optional. The owners had held twelve " +
        "years and maintained it beautifully. It set a new benchmark for " +
        "two-bedders in the building.",
    },
    history: [
      { type: "sold",   label: "Sold",   price: "$1,485,000",            date: "14 Mar 2026", agency: MAX,             featuredIn: ["q1-2026", "annual-2026"] },
      { type: "listed", label: "Listed", price: "Offers over $1,350,000", date: "18 Feb 2026", agency: MAX },
      { type: "sold",   label: "Sold",   price: "$880,000",              date: "6 May 2019",  agency: COMPETITORS[0] },
      { type: "rented", label: "Rented", price: "$620 / week",           date: "2 Mar 2014",  agency: COMPETITORS[2] },
    ],
    comparables: [14, 20, 28],
  },
};

export const THE_ISLANDER: ComplexProfile = {
  id: "the-islander",
  slug: "the-islander",
  suburbSlug: "noosaville",
  suburbName: "Noosaville",
  suburbPostcode: "4566",
  state: "QLD",
  name: "The Islander",
  street: "187 Gympie Terrace",
  levels: LEVELS,
  // Indicative — confirm exact lat/lng before launch (M10 schema needs it). The
  // hero MapEmbed uses these too.
  geo: { lat: -26.3940, lng: 153.0838 },
  intro:
    "A 48-property riverfront complex on the Gympie Terrace bend. Every " +
    "dwelling, every event, in one permanent record — with Matt's read on the " +
    "building layered over the data.",
  stats: {
    totalUnits: 48,
    recentSales: 14,
    medianSale: "$1.46M",
    currentListings: 3,
    rentalYield: "4.1%",
  },
  commentary: {
    author: "Matt Powe",
    role: "Principal · Max Property",
    updated: "Updated Mar 2026",
    body: [
      "The Islander is one of the few Gympie Terrace buildings that actually " +
      "earns its riverfront address. It sits on the bend opposite the ferry, " +
      "so the north-east units get the wide reach of the river — not the " +
      "glimpse-between-roofs you're sold elsewhere on the strip. Three storeys " +
      "of the original 1980s block, lifted by a considered 2016 refurbishment " +
      "that the body corporate funded properly rather than patching.",
      "Who lives here? A genuine mix. Long-hold owner-occupiers who bought in " +
      "the nineties and won't leave, a layer of Brisbane weekenders in the " +
      "river-facing stacks, and a small pool of permanent rentals down the " +
      "garden side. That blend keeps the building calm — it's not a holiday-let " +
      "tower, and the body corp has been deliberate about keeping short-stay " +
      "numbers down. Levies are reasonable for the position, and the sinking " +
      "fund is healthy after the lift and roof works.",
      "Buyers come for the same three things, in order: the walk to Noosa " +
      "Marina and the boardwalk, the secure single-level living once you're up " +
      "the lift, and the fact that stock rarely comes up. Most years you'll see " +
      "a handful of genuine sales here, which is exactly why the ones that do " +
      "trade move quickly and well.",
      "The split that matters: river-facing (even unit numbers, north-east) " +
      "versus garden-side (odd numbers, quieter but darker). The premium " +
      "between them is real and widening. If you're researching value here, " +
      "that aspect line is the first thing to get right.",
    ],
  },
  units: UNITS,
  events: EVENTS,
  unitDetails: UNIT_DETAILS,
  reports: REPORTS,
  latestReportId: LATEST_REPORT_ID,
};
