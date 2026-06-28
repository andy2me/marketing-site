// Complex profile sections — mirrors components/content/HubParts.tsx.
//
// Server components, composed in app/(marketing)/property/[suburb]/[complex]/page.tsx.
// The Units section (stack / cards / table) lands in M5; the LatestReportBlock
// lands in M6; the buyer-interest modal in M8. This file ships everything else.

import Link from "next/link";
import { IconArrowR, IconPin } from "@/components/icons";
import { BuyerInterestButton } from "@/components/buyer-interest/BuyerInterestButton";
import type { ComplexProfile } from "@/lib/complexes/types";
import {
  Crumbs,
  EventCard,
  MapEmbed,
  MattCommentary,
  SectionHead,
} from "./Atoms";

// ── ComplexBreadcrumb ─────────────────────────────────────────────────────
export function ComplexBreadcrumb({ profile }: { profile: ComplexProfile }) {
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <Crumbs
        items={[
          ["Property", false, "/"],
          [profile.suburbName, false, `/${profile.suburbSlug}`],
          [profile.name, true],
        ]}
      />
    </div>
  );
}

// ── ComplexHero ───────────────────────────────────────────────────────────
// Two-column hero: left copy (overline + H1 + address + intro + CTAs),
// right MapEmbed. The "I'd like to buy in" CTA opens the buyer-interest modal
// (M8); pre-modal it deep-links to a fragment that scrolls to the CTA band.
export function ComplexHero({ profile }: { profile: ComplexProfile }) {
  return (
    <section className="container" style={{ paddingTop: 24, paddingBottom: 8 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          gap: 48,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
            }}
          >
            Property profile · {profile.suburbName}
          </p>
          <h1
            style={{
              marginTop: 16,
              fontSize: "clamp(48px, 5.4vw, 76px)",
              lineHeight: 0.98,
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.02em",
              color: "var(--color-text-strong)",
            }}
          >
            {profile.name}
          </h1>
          <p
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 18,
              color: "var(--color-text-secondary)",
            }}
          >
            <span style={{ color: "var(--color-action)" }}>
              <IconPin />
            </span>
            {profile.street}, {profile.suburbName} {profile.state} {profile.suburbPostcode}
          </p>
          <p
            style={{
              marginTop: 20,
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--color-text-primary)",
              maxWidth: 480,
            }}
          >
            {profile.intro}
          </p>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <BuyerInterestButton type="complex" className="btn btn-primary btn-lg">
              I&rsquo;d like to buy in {profile.name}
              <IconArrowR />
            </BuyerInterestButton>
            <a href="#units" className="btn btn-secondary btn-lg">
              Browse all {profile.stats.totalUnits} units
            </a>
          </div>
        </div>
        <MapEmbed
          label={`${profile.name} · ${profile.street}`}
          height={420}
        />
      </div>
    </section>
  );
}

// ── ComplexStats ──────────────────────────────────────────────────────────
// 5-up band: total units, sales 24mo, median sale, current listings, yield.
export function ComplexStats({ profile }: { profile: ComplexProfile }) {
  const s = profile.stats;
  const items: ReadonlyArray<readonly [string, string | number]> = [
    ["Total units", s.totalUnits],
    ["Sales · 24 mths", s.recentSales],
    ["Median sale", s.medianSale],
    ["Current listings", s.currentListings],
    ["Median yield", s.rentalYield],
  ];
  return (
    <section className="container" style={{ paddingTop: 40, paddingBottom: 8 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 24,
          padding: "28px 0",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {items.map(([label, value]) => (
          <div key={label}>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(32px, 3vw, 44px)",
                lineHeight: 1,
                letterSpacing: "-0.015em",
                color: "var(--color-text-strong)",
              }}
            >
              {value}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 12.5,
                color: "var(--color-text-secondary)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── ComplexCommentary ─────────────────────────────────────────────────────
// "Matt's read on the building" — overline + serif H2 framing, then MattCommentary.
export function ComplexCommentary({ profile }: { profile: ComplexProfile }) {
  const c = profile.commentary;
  return (
    <section className="container" style={{ paddingTop: 80, paddingBottom: 24 }}>
      <div style={{ marginBottom: 36 }}>
        <p
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-text-secondary)",
          }}
        >
          Matt&rsquo;s read on the building
        </p>
        <h2
          style={{
            marginTop: 12,
            fontSize: "clamp(28px, 3vw, 38px)",
            lineHeight: 1.06,
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.015em",
            color: "var(--color-text-strong)",
            maxWidth: 620,
          }}
        >
          What the data can&rsquo;t tell you about {profile.name}.
        </h2>
      </div>
      <MattCommentary
        author={c.author}
        role={c.role}
        updated={c.updated}
        paragraphs={c.body}
      />
    </section>
  );
}

// ── ComplexActivityFeed ───────────────────────────────────────────────────
// 3-column grid of recent events across all units. Each card → unit profile.
// Attribution note below names Matt's brand tag rule + the no-logos rule.
export function ComplexActivityFeed({ profile }: { profile: ComplexProfile }) {
  return (
    <section
      style={{
        background: "var(--color-bg-banding)",
        padding: "80px 0",
        marginTop: 48,
      }}
    >
      <div className="container">
        <SectionHead
          over="Recent activity · last 24 months"
          title="Everything that's moved here."
          sub={`Sales, listings and rentals across all ${profile.stats.totalUnits} units — Matt's own and the rest of the market, on one timeline. Each card opens the unit's profile.`}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {profile.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              unitHref={`/property/${profile.suburbSlug}/${profile.slug}/unit-${event.unit}`}
            />
          ))}
        </div>
        <p
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "var(--color-text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 10,
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
          Max Property events carry our brand tag. Other agencies are credited by
          name only — no logos, photography or links, per listing licence.
        </p>
      </div>
    </section>
  );
}

// ── ComplexBuyerInterestBand ──────────────────────────────────────────────
// Dark CTA band at the bottom of the page. The button opens the modal in M8;
// pre-modal the anchor + a deferred client wrapper handle the "scroll to me"
// behaviour from the hero CTA.
export function ComplexBuyerInterestBand({
  profile,
}: {
  profile: ComplexProfile;
}) {
  return (
    <section
      id="buyer-interest"
      className="container"
      style={{ paddingTop: 48, paddingBottom: 80 }}
    >
      <div
        style={{
          background: "var(--color-bg-inverse)",
          color: "var(--color-text-on-dark)",
          borderRadius: 20,
          padding: "clamp(40px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns: "1.4fr auto",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(244,237,229,.5)",
            }}
          >
            Buyer interest
          </p>
          <h2
            style={{
              marginTop: 16,
              fontSize: "clamp(30px, 3.6vw, 46px)",
              lineHeight: 1.05,
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.015em",
              color: "#F4EDE5",
              maxWidth: 560,
            }}
          >
            Want into the building, but the right unit hasn&rsquo;t come up?
          </h2>
          <p
            style={{
              marginTop: 18,
              fontSize: 17,
              lineHeight: 1.55,
              color: "rgba(244,237,229,.72)",
              maxWidth: 520,
            }}
          >
            Register your interest in {profile.name}. No offer, no obligation —
            just a direct line to Matt the moment something moves. Stock here
            rarely lasts.
          </p>
        </div>
        <BuyerInterestButton
          type="complex"
          className="btn btn-primary btn-lg"
          style={{ whiteSpace: "nowrap" }}
        >
          Register interest <IconArrowR />
        </BuyerInterestButton>
      </div>
    </section>
  );
}

// ── ComplexAboutData ──────────────────────────────────────────────────────
// Provenance paragraph — handoff §"About this data" / acceptance criteria.
export function ComplexAboutData() {
  return (
    <section className="container" style={{ paddingBottom: 96 }}>
      <div
        style={{
          maxWidth: 760,
          paddingTop: 40,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-text-secondary)",
          }}
        >
          About this data
        </p>
        <p
          style={{
            marginTop: 16,
            fontSize: 15,
            lineHeight: 1.65,
            color: "var(--color-text-secondary)",
          }}
        >
          Sale, listing and rental events on this page are compiled from
          licensed property data and public records, refreshed regularly. Each
          event is shown as one moment in this dwelling&rsquo;s permanent
          history — not a standalone listing. Figures are indicative and may
          differ from final settlement records. Matt&rsquo;s commentary is his
          own assessment, offered to help you research, not as financial advice.
          Spotted something off?{" "}
          <Link href="/contact" style={{ color: "var(--color-action)" }}>
            Let us know.
          </Link>
        </p>
      </div>
    </section>
  );
}
