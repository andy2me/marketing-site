// Unit profile — /property/{suburb}/{complex}/unit-{n}/.
//
// Recipe:
//   ProfileNav → Breadcrumb → UnitHero → [UnitGallery — own only] →
//   { UnitAuthoredCommentary | CommentaryPending } → [ResultPanel — if event] →
//   EventTimeline (with ReportBacklink beneath cited rows) →
//   InheritedContext → Comparables.  Right rail: UnitSidePanel (sticky).
//
// Authored Unit 12 path uses the full UnitDetail; every other unit renders
// honestly from its ComplexUnit + events feed.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/lib/wp/mock";
import {
  comparablesFor,
  eventsForUnit,
  getComplexBySlug,
  getUnitBySlug,
  getUnitDetail,
  getUnitSlugs,
} from "@/lib/complexes/store";
import { EVENT_VERB } from "@/lib/complexes/derive";
import type {
  EventStatus,
  EventType,
  UnitResult,
} from "@/lib/complexes/types";
import {
  Comparables,
  CommentaryPending,
  EventTimeline,
  type TimelineEvent,
  InheritedContext,
  ResultPanel,
  UnitAuthoredCommentary,
  UnitBreadcrumb,
  UnitGallery,
  UnitHero,
  UnitSidePanel,
} from "@/components/unit/UnitParts";
import { BuyerInterestProvider } from "@/components/buyer-interest/BuyerInterestProvider";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

export const dynamicParams = false;
export const revalidate = 1800;

export async function generateStaticParams() {
  return getUnitSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string; complex: string; unit: string }>;
}): Promise<Metadata> {
  const { suburb, complex, unit } = await params;
  const profile = getComplexBySlug(suburb, complex);
  if (!profile) return { title: "Property not found" };
  const dwelling = getUnitBySlug(profile, unit);
  if (!dwelling) return { title: "Unit not found" };
  const canonical = `/property/${profile.suburbSlug}/${profile.slug}/${dwelling.id}`;
  return {
    title: `Unit ${dwelling.number}, ${profile.name} — Property Profile`,
    description: `Unit ${dwelling.number} at ${profile.name}, ${profile.street}, ${profile.suburbName}. ${dwelling.beds} bed · ${dwelling.baths} bath · ${dwelling.car} car.`,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `Unit ${dwelling.number}, ${profile.name}`,
      description: `Unit ${dwelling.number}, ${profile.street}, ${profile.suburbName}.`,
      url: `${SITE_URL}${canonical}`,
    },
  };
}

// Build the "result" panel from the live event when no authored result exists.
function deriveResult(
  recent: ReturnType<typeof eventsForUnit>[number] | undefined,
): UnitResult | null {
  if (!recent) return null;
  const over =
    recent.type === "sold"
      ? "The result"
      : recent.type === "rented"
        ? "Current lease"
        : "Current listing";
  return {
    kind: recent.type as EventType,
    over,
    label: `${EVENT_VERB[recent.type as EventType]} · ${recent.date}`,
    price: recent.price,
    agency: recent.agency,
    stats: null,
  };
}

export default async function UnitProfilePage({
  params,
}: {
  params: Promise<{ suburb: string; complex: string; unit: string }>;
}) {
  const { suburb, complex, unit } = await params;
  const profile = getComplexBySlug(suburb, complex);
  if (!profile) notFound();
  const dwelling = getUnitBySlug(profile, unit);
  if (!dwelling) notFound();

  const detail = getUnitDetail(profile, dwelling.number);
  const events = eventsForUnit(profile, dwelling.number);
  const recent = events[0] ?? null;
  const status: EventStatus = detail?.statusBadge ?? dwelling.status;
  const result = detail?.result ?? deriveResult(events[0]);
  const comparables =
    detail?.comparables ?? comparablesFor(profile, dwelling.number);

  // Combined history: prefer the authored history (Unit 12), otherwise the
  // derived event feed. Both shapes flatten to `TimelineEvent`.
  const history: TimelineEvent[] = detail?.history
    ? detail.history.map((e) => ({
        type: e.type,
        price: e.price,
        date: e.date,
        agency: e.agency,
        featuredIn: e.featuredIn,
      }))
    : events.map((e) => ({
        type: e.type,
        price: e.price,
        date: e.date,
        agency: e.agency,
        featuredIn: e.featuredIn,
      }));

  const settings = await getSiteSettings();

  return (
    <>
      <Header current="Locations" nav={settings.nav} />

      <BuyerInterestProvider
        entity={{
          complexSlug: profile.slug,
          complexName: profile.name,
          unitNumber: dwelling.number,
        }}
      >
        <main style={{ background: "var(--color-bg-page)", minHeight: "100vh" }}>
          <UnitBreadcrumb profile={profile} unit={dwelling} />
          <UnitHero profile={profile} unit={dwelling} status={status} />
          {detail?.gallery && <UnitGallery unit={dwelling} />}

          <section
            className="container"
            style={{ paddingTop: 56, paddingBottom: 96 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 380px",
                gap: 72,
                alignItems: "start",
              }}
            >
              <div style={{ minWidth: 0 }}>
                {detail?.commentary ? (
                  <UnitAuthoredCommentary
                    unitNumber={dwelling.number}
                    detail={detail}
                  />
                ) : (
                  <CommentaryPending unitNumber={dwelling.number} />
                )}
                {result && <ResultPanel result={result} unit={dwelling} />}
                <EventTimeline
                  profile={profile}
                  unitNumber={dwelling.number}
                  history={history}
                />
                <InheritedContext profile={profile} />
                <Comparables profile={profile} numbers={comparables} />
              </div>
              <UnitSidePanel
                unit={dwelling}
                detail={detail}
                status={status}
                recent={recent}
              />
            </div>
          </section>
        </main>
      </BuyerInterestProvider>
    </>
  );
}
