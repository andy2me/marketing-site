// Profile ↔ Report wayfinding (design handoff §"Profile ↔ Report cross-linking").
//
// Both elements ship as quiet text links — they must not compete with the
// appraisal or buyer-interest CTAs. Both link within maxproperty.au only.
//
// The reports surface itself (/reports/...) is out of scope for v1; these
// records back the *links into it* against a typed seam that returns null /
// empty when no reports exist, so the block and back-links suppress cleanly.

import Link from "next/link";
import { IconArrowR, IconReport, IconReport2 } from "@/components/icons";
import type { Report } from "@/lib/complexes/types";

// ── LatestReportBlock (complex profile) ───────────────────────────────────
// Sits between Matt's commentary and the recent-activity feed. When `report`
// is null the block returns null entirely — no empty placeholder.
export function LatestReportBlock({
  report,
  allReportsHref = "#",
}: {
  report: Report | null;
  allReportsHref?: string;
}) {
  if (!report) return null;
  return (
    <section className="container" style={{ paddingTop: 64 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 28,
          alignItems: "center",
          background: "var(--soft-linen-700)",
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          padding: "26px 30px",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            flexShrink: 0,
            borderRadius: 12,
            background: "var(--soft-linen-500)",
            color: "var(--color-action)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <IconReport />
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
            }}
          >
            Latest report
          </p>
          <div
            style={{
              marginTop: 7,
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 23,
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
                color: "var(--color-text-strong)",
              }}
            >
              {report.title}
            </span>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              {report.date}
            </span>
          </div>
          <p
            style={{
              marginTop: 8,
              fontSize: 15,
              lineHeight: 1.55,
              color: "var(--color-text-secondary)",
              maxWidth: 640,
            }}
          >
            {report.excerpt}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 12,
            whiteSpace: "nowrap",
          }}
        >
          <Link
            href={report.url}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 15,
              fontWeight: 500,
              color: "var(--color-action)",
            }}
          >
            Read the full report <IconArrowR />
          </Link>
          <Link
            href={allReportsHref}
            style={{
              fontSize: 13.5,
              color: "var(--color-text-secondary)",
            }}
          >
            All reports
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── ReportBacklink (unit profile timeline) ────────────────────────────────
// Sits beneath a specific cited event. Renders nothing if `reports` is empty;
// one link normally; stacks when a landmark event was written up in multiple
// reports (Unit 12's headline sale demonstrates this in the mock dataset with
// q1-2026 + annual-2026).
export function ReportBacklink({
  reports,
}: {
  reports: ReadonlyArray<Report>;
}) {
  if (!reports.length) return null;
  return (
    <div
      style={{
        marginTop: 10,
        display: "flex",
        flexWrap: "wrap",
        gap: "4px 16px",
      }}
    >
      {reports.map((r) => (
        <Link
          key={r.id}
          href={r.url}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-action)",
          }}
        >
          <span style={{ display: "inline-flex", opacity: 0.85 }}>
            <IconReport2 />
          </span>
          Featured in {r.backlinkLabel}
        </Link>
      ))}
    </div>
  );
}
