// Max Property — Insights/journal MiniBarChart.
// Small editorial SVG, in line with the report Charts (no chart lib). Last bar accented;
// y-axis tick labels mono, x-axis bar labels mono. role="img" + aria-label for non-visual users.

import type { CSSProperties } from "react";
import type { ChartBar } from "@/lib/insights/types";

const MONO: CSSProperties = { fontFamily: "var(--font-mono), ui-monospace, monospace" };
const SANS: CSSProperties = { fontFamily: "var(--font-body), system-ui, sans-serif" };

export function MiniBarChart({
  series,
  height = 220,
  accent = "var(--ember)",
  label,
}: {
  series: ChartBar[];
  height?: number;
  accent?: string;
  label?: string;
}) {
  const W = 640;
  const H = height;
  const padL = 36;
  const padR = 12;
  const padT = 20;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(...series.map((b) => b.value)) * 1.15;
  const barW = (innerW / series.length) * 0.62;
  const gap = (innerW / series.length) * 0.38;
  const tickVals = [0, max / 2, max];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      style={{ display: "block" }}
      role="img"
      aria-label={
        label ??
        `Bar chart: ${series.map((b) => `${b.label} ${b.valueLabel ?? b.value}`).join(", ")}`
      }
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
              x={padL - 8}
              y={y + 3}
              textAnchor="end"
              fontSize="10"
              style={{ ...MONO, fill: "var(--color-text-secondary)" }}
            >
              {Math.round(tv)}
            </text>
          </g>
        );
      })}
      {series.map((bar, i) => {
        const x = padL + i * (barW + gap) + gap / 2;
        const h = (bar.value / max) * innerH;
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
                y={y - 8}
                textAnchor="middle"
                fontSize="12"
                fontWeight="500"
                style={{ ...SANS, fill: accent }}
              >
                {bar.valueLabel ?? bar.value}
              </text>
            )}
            <text
              x={x + barW / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              style={{ ...MONO, fill: "var(--color-text-secondary)" }}
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
