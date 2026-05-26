// Max Property — Appraisal Builder · market charts.
// Ported from the prototype charts.jsx. Small, editorial, hand-rolled SVG (no chart lib).
// Server-safe (pure render). Token colours are applied via `style` so `var(--token)` resolves
// (CSS custom properties don't resolve inside SVG presentation attributes). Each chart carries
// role="img" + an aria-label summarising the data for non-visual users (code handoff §14).

import type { CSSProperties } from "react";

const MONO: CSSProperties = { fontFamily: "var(--font-mono), ui-monospace, monospace" };
const SANS: CSSProperties = { fontFamily: "var(--font-body), system-ui, sans-serif" };

type Pt = [number, number];

function extent(arr: number[]): [number, number] {
  return [Math.min(...arr), Math.max(...arr)];
}

function smooth(points: Pt[]): string {
  // quadratic mid-curve smoothing (cardinal-spline-ish)
  if (points.length < 3) {
    return points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  }
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    d += ` Q${x1},${y1} ${mx},${my}`;
  }
  const last = points[points.length - 1];
  d += ` L${last[0]},${last[1]}`;
  return d;
}

// ── Median price line — 24 months, $M ───────────────────────────────────
export function MedianPriceChart({
  series,
  height = 160,
  accent = "var(--color-action)",
  label,
  gradientId = "med-fill",
}: {
  series: number[];
  height?: number;
  accent?: string;
  label?: string;
  /** Unique per instance — the same chart may render in both the mobile + desktop subtrees. */
  gradientId?: string;
}) {
  const W = 320;
  const H = height;
  const padL = 28;
  const padR = 12;
  const padT = 14;
  const padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const [min, max] = extent(series);
  const range = max - min || 1;
  const dMin = min - range * 0.15;
  const dMax = max + range * 0.05;
  const dRange = dMax - dMin;
  const pts: Pt[] = series.map((v, i) => [
    padL + (i / (series.length - 1)) * innerW,
    padT + (1 - (v - dMin) / dRange) * innerH,
  ]);
  const linePath = smooth(pts);
  const areaPath = `${linePath} L${pts[pts.length - 1][0]},${padT + innerH} L${pts[0][0]},${padT + innerH} Z`;
  const yTicks = 4;
  const tickVals = Array.from({ length: yTicks }, (_, i) => dMin + (dRange / (yTicks - 1)) * i);
  const xLabels = [
    { i: 0, t: "24mo ago", anchor: "start" as const },
    { i: Math.floor(series.length / 2), t: "12mo", anchor: "middle" as const },
    { i: series.length - 1, t: "Today", anchor: "end" as const },
  ];
  const gradId = gradientId;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      style={{ display: "block" }}
      role="img"
      aria-label={label ?? "Median sale price over the last 24 months, trending upward"}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {tickVals.map((tv, i) => {
        const y = padT + (1 - (tv - dMin) / dRange) * innerH;
        return (
          <g key={i}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y}
              y2={y}
              strokeWidth="1"
              strokeDasharray={i === 0 ? undefined : "2 4"}
              style={{ stroke: "var(--color-border)", opacity: i === 0 ? 1 : 0.7 }}
            />
            <text
              x={padL - 6}
              y={y + 3}
              textAnchor="end"
              fontSize="9"
              style={{ ...MONO, fill: "var(--color-text-secondary)" }}
            >
              ${tv.toFixed(2)}M
            </text>
          </g>
        );
      })}
      <path d={areaPath} style={{ fill: `url(#${gradId})` }} />
      <path
        d={linePath}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: accent }}
      />
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="5"
        strokeWidth="2"
        style={{ fill: "#fff", stroke: accent }}
      />
      {xLabels.map((xl, i) => (
        <text
          key={i}
          x={pts[xl.i][0]}
          y={H - 6}
          textAnchor={xl.anchor}
          fontSize="9"
          letterSpacing="0.06em"
          style={{ ...MONO, fill: "var(--color-text-secondary)", textTransform: "uppercase" }}
        >
          {xl.t}
        </text>
      ))}
    </svg>
  );
}

// ── Days-on-market bars — 8 quarters ─────────────────────────────────────
export function DomBarChart({
  series,
  height = 160,
  accent = "var(--fern)",
  label,
}: {
  series: number[];
  height?: number;
  accent?: string;
  label?: string;
}) {
  const W = 320;
  const H = height;
  const padL = 28;
  const padR = 12;
  const padT = 14;
  const innerW = W - padL - padR;
  const innerH = H - padT - 26;
  const max = Math.max(...series) * 1.1;
  const barW = (innerW / series.length) * 0.62;
  const gap = (innerW / series.length) * 0.38;
  const tickVals = [0, max / 2, max];
  const labels = ["Q1·24", "Q2", "Q3", "Q4", "Q1·25", "Q2", "Q3", "Q4"];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      style={{ display: "block" }}
      role="img"
      aria-label={label ?? `Median days on market by quarter, falling to ${series[series.length - 1]} days`}
    >
      {tickVals.map((tv, i) => {
        const y = padT + (1 - tv / max) * innerH;
        return (
          <g key={i}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y}
              y2={y}
              strokeWidth="1"
              strokeDasharray={i === 0 ? undefined : "2 4"}
              style={{ stroke: "var(--color-border)" }}
            />
            <text
              x={padL - 6}
              y={y + 3}
              textAnchor="end"
              fontSize="9"
              style={{ ...MONO, fill: "var(--color-text-secondary)" }}
            >
              {Math.round(tv)}d
            </text>
          </g>
        );
      })}
      {series.map((v, i) => {
        const x = padL + i * (barW + gap) + gap / 2;
        const h = (v / max) * innerH;
        const y = padT + innerH - h;
        const isLast = i === series.length - 1;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx="3"
              style={{ fill: isLast ? accent : "var(--white-mist-400)" }}
            />
            {isLast && (
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="10"
                fontWeight="500"
                style={{ ...SANS, fill: accent }}
              >
                {v}d
              </text>
            )}
            <text
              x={x + barW / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="8"
              style={{ ...MONO, fill: "var(--color-text-secondary)" }}
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Enquiry / search-volume sparkline ────────────────────────────────────
export function SearchSparkline({
  series,
  height = 64,
  accent = "var(--mulberry)",
  label,
  gradientId = "srch-fill",
}: {
  series: number[];
  height?: number;
  accent?: string;
  label?: string;
  /** Unique per instance — the same chart may render in both the mobile + desktop subtrees. */
  gradientId?: string;
}) {
  const W = 320;
  const H = height;
  const padT = 6;
  const innerH = H - padT - 6;
  const [min, max] = extent(series);
  const range = max - min || 1;
  const pts: Pt[] = series.map((v, i) => [
    (i / (series.length - 1)) * W,
    padT + (1 - (v - min) / range) * innerH,
  ]);
  const linePath = smooth(pts);
  const areaPath = `${linePath} L${pts[pts.length - 1][0]},${padT + innerH} L${pts[0][0]},${padT + innerH} Z`;
  const gradId = gradientId;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      style={{ display: "block" }}
      preserveAspectRatio="none"
      role="img"
      aria-label={label ?? "Monthly buyer enquiries, rising steadily over the last 12 months"}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} style={{ fill: `url(#${gradId})` }} />
      <path d={linePath} fill="none" strokeWidth="1.5" strokeLinecap="round" style={{ stroke: accent }} />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" style={{ fill: accent }} />
    </svg>
  );
}

// ── Buyer-segments stacked bar (horizontal) ──────────────────────────────
export function SegmentBar({
  segments,
  height = 18,
}: {
  segments: Array<{ pct: number; tone: string; label: string }>;
  height?: number;
}) {
  return (
    <div
      role="img"
      aria-label={`Buyer mix: ${segments.map((s) => `${s.label} ${s.pct}%`).join(", ")}`}
      style={{
        width: "100%",
        height,
        borderRadius: "var(--radius-pill)",
        overflow: "hidden",
        display: "flex",
        background: "var(--soft-linen-400)",
      }}
    >
      {segments.map((s, i) => (
        <div
          key={i}
          style={{
            width: `${s.pct}%`,
            background: s.tone,
            height: "100%",
            borderRight: i < segments.length - 1 ? "2px solid var(--color-bg-page)" : "none",
          }}
        />
      ))}
    </div>
  );
}
