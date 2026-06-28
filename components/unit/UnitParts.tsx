// Unit profile sections (handoff §"Individual unit profile").
//
// Composed in app/(marketing)/property/[suburb]/[complex]/[unit]/page.tsx.
// Authored Unit 12 path uses the full UnitDetail (gallery + result + headline
// commentary); every other dwelling renders honestly from the live unit +
// events record, with CommentaryPending above the timeline.

import Link from "next/link";
import { IconArrowR, IconPin } from "@/components/icons";
import { BuyerInterestButton } from "@/components/buyer-interest/BuyerInterestButton";
import {
  EVENT_PREFIX,
  EVENT_VERB,
} from "@/lib/complexes/derive";
import { reportsFor } from "@/lib/complexes/store";
import type {
  ComplexEvent,
  ComplexProfile,
  ComplexUnit,
  EventStatus,
  EventType,
  UnitDetail,
  UnitResult,
} from "@/lib/complexes/types";
import {
  Attribution,
  Crumbs,
  MetaRow,
  StatusBadge,
} from "../complex/Atoms";
import { ReportBacklink } from "../complex/ReportLinks";

// ── UnitBreadcrumb ────────────────────────────────────────────────────────
export function UnitBreadcrumb({
  profile,
  unit,
}: {
  profile: ComplexProfile;
  unit: ComplexUnit;
}) {
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <Crumbs
        items={[
          ["Property", false, "/"],
          [profile.suburbName, false, `/${profile.suburbSlug}`],
          [
            profile.name,
            false,
            `/property/${profile.suburbSlug}/${profile.slug}`,
          ],
          [`Unit ${unit.number}`, true],
        ]}
      />
    </div>
  );
}

// ── UnitHero ──────────────────────────────────────────────────────────────
// Status pill, serif H1, ember-pin + address, plus the right-aligned spec row.
export function UnitHero({
  profile,
  unit,
  status,
}: {
  profile: ComplexProfile;
  unit: ComplexUnit;
  status: EventStatus;
}) {
  return (
    <section className="container" style={{ paddingTop: 24, paddingBottom: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div>
          <StatusBadge status={status} />
          <h1
            style={{
              marginTop: 16,
              fontSize: "clamp(44px, 5vw, 68px)",
              lineHeight: 0.98,
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.02em",
              color: "var(--color-text-strong)",
            }}
          >
            Unit {unit.number}, {profile.name}
          </h1>
          <p
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 17,
              color: "var(--color-text-secondary)",
            }}
          >
            <span style={{ color: "var(--color-action)" }}>
              <IconPin />
            </span>
            {profile.street}, {profile.suburbName} {profile.state}{" "}
            {profile.suburbPostcode}
          </p>
        </div>
        <MetaRow
          beds={unit.beds}
          baths={unit.baths}
          car={unit.car}
          area={unit.area}
          color="var(--color-text-primary)"
          gap={24}
        />
      </div>
    </section>
  );
}

// ── UnitGallery ───────────────────────────────────────────────────────────
// Only renders when the authored UnitDetail has gallery=true (Matt's own
// listing/sale). Competitor events never get photography — see handoff
// §"Imagery rules". The gallery is a styled placeholder until real photography
// is wired into the asset pipeline (CDN keys are an open dep in the plan).
export function UnitGallery({ unit }: { unit: ComplexUnit }) {
  const photoSlot = (heightFraction: string, label: string, extra?: string) => (
    <div
      role="img"
      aria-label={label}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--soft-linen-300)",
        backgroundImage:
          "linear-gradient(135deg, var(--soft-linen-200) 0%, var(--soft-linen-400) 60%, var(--soft-linen-200) 100%)",
        gridRow: heightFraction,
      }}
    >
      {extra && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(26,18,12,.45)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {extra}
        </div>
      )}
    </div>
  );

  return (
    <section className="container" style={{ paddingTop: 16, paddingBottom: 8 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 8,
          height: 460,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            gridRow: "1 / span 2",
            overflow: "hidden",
            background: "var(--soft-linen-300)",
            backgroundImage:
              "linear-gradient(135deg, var(--soft-linen-200) 0%, var(--soft-linen-400) 60%, var(--soft-linen-200) 100%)",
          }}
          role="img"
          aria-label={`Unit ${unit.number} living`}
        >
          <div
            style={{
              position: "absolute",
              left: 16,
              bottom: 16,
              padding: "7px 12px",
              borderRadius: 999,
              background: "rgba(26,18,12,.78)",
              color: "#fff",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 13,
                height: 13,
                borderRadius: 3,
                background: "var(--ember)",
                color: "#fff",
                display: "inline-grid",
                placeItems: "center",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              M
            </span>
            Photography · Max Property sale
          </div>
        </div>
        {photoSlot("auto", "Unit detail")}
        {photoSlot("auto", "Unit interior", "+9 photos")}
      </div>
    </section>
  );
}

// ── CommentaryPending ─────────────────────────────────────────────────────
// Dashed empty state above the timeline for units Matt hasn't written up yet.
export function CommentaryPending({ unitNumber }: { unitNumber: number }) {
  return (
    <div>
      <p
        style={{
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--color-text-secondary)",
        }}
      >
        Matt&rsquo;s read on Unit {unitNumber}
      </p>
      <div
        style={{
          marginTop: 16,
          padding: "24px 28px",
          borderRadius: 16,
          border: "1px dashed var(--color-border-strong)",
          background: "transparent",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 999,
            background: "var(--soft-linen-500)",
            color: "var(--color-action)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <IconPin />
        </div>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            color: "var(--color-text-secondary)",
            maxWidth: 560,
          }}
        >
          Matt hasn&rsquo;t written up Unit {unitNumber} yet — commentary is
          authored where there&rsquo;s something to say (a live listing, a
          recent sale, or registered buyer interest). The record below is live
          regardless.
        </p>
      </div>
    </div>
  );
}

// ── UnitAuthoredCommentary ────────────────────────────────────────────────
// Top of the page when authored: overline + serif H2 framing the lead, then
// the body paragraph. Mirrors MattCommentary but with the per-unit headline
// from the UnitDetail.
export function UnitAuthoredCommentary({
  unitNumber,
  detail,
}: {
  unitNumber: number;
  detail: UnitDetail;
}) {
  if (!detail.commentary) return null;
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-text-secondary)",
          }}
        >
          Matt&rsquo;s read on Unit {unitNumber}
        </p>
        <h2
          style={{
            marginTop: 12,
            fontSize: "clamp(26px, 2.6vw, 34px)",
            lineHeight: 1.08,
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.015em",
            color: "var(--color-text-strong)",
            maxWidth: 560,
          }}
        >
          {detail.headline ?? `What's worth knowing about Unit ${unitNumber}.`}
        </h2>
      </div>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(22px, 2.2vw, 28px)",
          lineHeight: 1.32,
          letterSpacing: "-0.005em",
          color: "var(--color-text-strong)",
          maxWidth: 760,
        }}
      >
        {detail.commentary.body}
      </p>
    </div>
  );
}

// ── ResultPanel ───────────────────────────────────────────────────────────
// "The result" — outcome panel (overline + price + attribution on the left,
// either a 4-up stat grid (authored) or a spec table (fallback) on the right.
export function ResultPanel({
  result,
  unit,
}: {
  result: UnitResult;
  unit: ComplexUnit;
}) {
  return (
    <div style={{ marginTop: 64 }}>
      <p
        style={{
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--color-text-secondary)",
        }}
      >
        {result.over}
      </p>
      <div
        style={{
          marginTop: 16,
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          padding: "28px 30px",
          boxShadow: "var(--shadow-sm)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        <div
          style={{
            borderRight: "1px solid var(--color-border)",
            paddingRight: 24,
          }}
        >
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            {result.label}
          </p>
          <p
            style={{
              marginTop: 8,
              fontFamily: "var(--font-heading)",
              fontSize: result.price.length > 14 ? 30 : 42,
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              color: "var(--color-text-strong)",
            }}
          >
            {result.price}
          </p>
          <div style={{ marginTop: 14 }}>
            <Attribution
              agency={result.agency}
              prefix={EVENT_PREFIX[result.kind]}
            />
          </div>
        </div>
        {result.stats ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              alignContent: "center",
            }}
          >
            {result.stats.map(([v, l]) => (
              <div key={l}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 24,
                    color: "var(--color-text-strong)",
                  }}
                >
                  {v}
                </div>
                <div
                  style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SpecTable unit={unit} />
        )}
      </div>
    </div>
  );
}

// Spec table used both inside ResultPanel (fallback) and the side panel.
function SpecTable({ unit }: { unit: ComplexUnit }) {
  const rows: ReadonlyArray<readonly [string, string]> = [
    ["Configuration", `${unit.beds} bed · ${unit.baths} bath · ${unit.car} car`],
    ["Internal area", unit.area],
    ["Level", unit.levelName],
    ["Aspect", unit.aspect],
  ];
  return (
    <div style={{ display: "grid", gap: 12, alignContent: "center" }}>
      {rows.map(([l, v]) => (
        <div
          key={l}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            fontSize: 14,
          }}
        >
          <span style={{ color: "var(--color-text-secondary)" }}>{l}</span>
          <span
            style={{ color: "var(--color-text-primary)", textAlign: "right" }}
          >
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── EventTimeline ─────────────────────────────────────────────────────────
// Vertical timeline with per-event attribution and ReportBacklink beneath
// any event written up in a Report (driven by event.featuredIn).
//
// Empty state: "Nothing on the public record yet." with the standing-line copy.
export type TimelineEvent = {
  type: EventType;
  price: string;
  date: string;
  agency: ComplexEvent["agency"];
  featuredIn?: ReadonlyArray<string>;
};

export function EventTimeline({
  profile,
  unitNumber,
  history,
}: {
  profile: ComplexProfile;
  unitNumber: number;
  history: ReadonlyArray<TimelineEvent>;
}) {
  return (
    <div style={{ marginTop: 64 }}>
      <p
        style={{
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--color-text-secondary)",
        }}
      >
        Event history
      </p>
      <h3
        style={{
          marginTop: 12,
          fontSize: 26,
          fontFamily: "var(--font-heading)",
          letterSpacing: "-0.01em",
          color: "var(--color-text-strong)",
        }}
      >
        {history.length
          ? "Everything on the record for this unit."
          : "Nothing on the public record yet."}
      </h3>
      {history.length ? (
        <div style={{ marginTop: 24, position: "relative" }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 7,
              top: 8,
              bottom: 8,
              width: 2,
              background: "var(--color-border)",
            }}
          />
          <div style={{ display: "grid", gap: 4 }}>
            {history.map((e, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr",
                  gap: 16,
                  padding: "18px 0",
                  borderBottom:
                    i < history.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      background:
                        e.agency.kind === "self"
                          ? "var(--ember)"
                          : "var(--white-mist-400)",
                      border: "3px solid var(--color-bg-page)",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "var(--color-text-strong)",
                        }}
                      >
                        {EVENT_VERB[e.type]} · {e.price}
                      </p>
                      <div style={{ marginTop: 6 }}>
                        <Attribution
                          agency={e.agency}
                          prefix={EVENT_PREFIX[e.type]}
                        />
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        color: "var(--color-text-secondary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.date}
                    </span>
                  </div>
                  <ReportBacklink reports={reportsFor(profile, e.featuredIn)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p
          style={{
            marginTop: 18,
            fontSize: 16,
            lineHeight: 1.55,
            color: "var(--color-text-secondary)",
            maxWidth: 560,
          }}
        >
          No sale, listing or rental events have been recorded against Unit{" "}
          {unitNumber} in our data window. This profile stays live — the moment
          something happens here, it lands on this page.
        </p>
      )}
    </div>
  );
}

// ── InheritedContext ──────────────────────────────────────────────────────
// Soft-linen card linking back to the complex.
export function InheritedContext({ profile }: { profile: ComplexProfile }) {
  return (
    <Link
      href={`/property/${profile.suburbSlug}/${profile.slug}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        marginTop: 56,
        background: "var(--soft-linen-500)",
        border: "1px solid var(--soft-linen-300)",
        borderRadius: 16,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
      }}
    >
      <div>
        <p
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-action)",
          }}
        >
          In {profile.name}
        </p>
        <p
          style={{
            marginTop: 10,
            fontSize: 16,
            lineHeight: 1.55,
            color: "var(--color-text-primary)",
            maxWidth: 520,
          }}
        >
          {profile.intro}{" "}
          <strong>
            {profile.stats.recentSales} sales in the last 24 months.
          </strong>
        </p>
      </div>
      <span className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap" }}>
        Building profile <IconArrowR />
      </span>
    </Link>
  );
}

// ── ComparableCard / Comparables ──────────────────────────────────────────
export function Comparables({
  profile,
  numbers,
}: {
  profile: ComplexProfile;
  numbers: ReadonlyArray<number>;
}) {
  const units = numbers
    .map((n) => profile.units.find((u) => u.number === n))
    .filter((u): u is ComplexUnit => Boolean(u));
  return (
    <div style={{ marginTop: 64 }}>
      <p
        style={{
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--color-text-secondary)",
        }}
      >
        Comparable units
      </p>
      <h3
        style={{
          marginTop: 12,
          fontSize: 26,
          fontFamily: "var(--font-heading)",
          letterSpacing: "-0.01em",
          color: "var(--color-text-strong)",
        }}
      >
        Three others worth comparing.
      </h3>
      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {units.map((u) => (
          <ComparableCard key={u.id} unit={u} profile={profile} />
        ))}
      </div>
    </div>
  );
}

function ComparableCard({
  unit,
  profile,
}: {
  unit: ComplexUnit;
  profile: ComplexProfile;
}) {
  return (
    <Link
      href={`/property/${profile.suburbSlug}/${profile.slug}/${unit.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 12,
        padding: "18px 20px",
        display: "grid",
        gap: 10,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 22,
            color: "var(--color-text-strong)",
          }}
        >
          Unit {unit.number}
        </span>
        <StatusBadge status={unit.status} size="sm" />
      </div>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
        {unit.levelName} · {unit.aspect}
      </p>
      <MetaRow
        beds={unit.beds}
        baths={unit.baths}
        car={unit.car}
        area={unit.area}
      />
    </Link>
  );
}

// ── UnitSidePanel ─────────────────────────────────────────────────────────
// Sticky right rail: status, recent-events summary, spec table, and the
// "I'd like to buy this unit" CTA. The CTA opens the modal in M8; here it
// anchors to #register-interest as a placeholder.
export function UnitSidePanel({
  unit,
  detail,
  status,
  recent,
}: {
  unit: ComplexUnit;
  detail: UnitDetail | null;
  status: EventStatus;
  recent: ComplexEvent | null;
}) {
  const panelPrice =
    detail?.panel?.price ?? (recent ? recent.price : null);
  const panelCaption =
    detail?.panel?.caption ??
    (recent ? `${EVENT_VERB[recent.type]} ${recent.date}` : "No recent events");

  return (
    <aside style={{ position: "sticky", top: 88 }}>
      <div
        style={{
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            padding: "24px 24px 22px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <StatusBadge status={status} size="sm" />
          {panelPrice ? (
            <>
              <p
                style={{
                  marginTop: 14,
                  fontFamily: "var(--font-heading)",
                  fontSize: panelPrice.length > 14 ? 26 : 34,
                  lineHeight: 1.05,
                  letterSpacing: "-0.015em",
                  color: "var(--color-text-strong)",
                }}
              >
                {panelPrice}
              </p>
              <p
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                }}
              >
                {panelCaption}
              </p>
            </>
          ) : (
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "var(--color-text-secondary)",
              }}
            >
              {panelCaption}
            </p>
          )}
        </div>
        <div
          style={{
            padding: "20px 24px",
            display: "grid",
            gap: 12,
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <SpecTable unit={unit} />
        </div>
        <div style={{ padding: "22px 24px" }}>
          <p
            style={{
              fontSize: 15,
              color: "var(--color-text-strong)",
              fontWeight: 500,
            }}
          >
            Interested in this unit?
          </p>
          <p
            style={{
              marginTop: 6,
              fontSize: 13,
              color: "var(--color-text-secondary)",
              lineHeight: 1.5,
            }}
          >
            {status === "For Sale"
              ? "On the market now. Register and Matt will keep you close to it."
              : "Off market now — but owners move. Tell Matt you want it and he'll call if it changes hands."}
          </p>
          <BuyerInterestButton
            type="unit"
            unitNumber={unit.number}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 16 }}
          >
            I&rsquo;d like to buy this unit <IconArrowR />
          </BuyerInterestButton>
          <p
            style={{
              marginTop: 12,
              fontSize: 11,
              color: "var(--white-mist-500)",
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            Private to Max Property · never shown publicly on this page.
          </p>
        </div>
      </div>
    </aside>
  );
}
