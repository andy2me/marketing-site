// Series generators for the composer — turn "latest value + trend" into a plausible numeric
// series for the charts. The brief calls market values illustrative during the manual-input
// phase, so a smooth interpolation with mild deterministic noise is fine.

function lerp(start: number, end: number, n: number, jitterPct = 0.015): number[] {
  if (n <= 0) return [];
  return Array.from({ length: n }, (_, i) => {
    const t = i / Math.max(1, n - 1);
    const base = start + (end - start) * t;
    // deterministic small wave so the line isn't perfectly straight
    const noise = base * jitterPct * Math.sin(i * 1.7 + 0.3);
    return base + noise;
  });
}

/** Median price ($M) — 24 months by default. `yoyPct` is annual; we apply it across the window. */
export function generatePriceSeries(latest: number, yoyPct: number, months = 24): number[] {
  const ratio = 1 + yoyPct / 100;
  // start (months-ago) ≈ latest / ratio ^ (years)
  const years = months / 12;
  const start = latest / Math.pow(ratio, years);
  return lerp(start, latest, months).map((v) => Math.round(v * 100) / 100);
}

/** Days-on-market — 8 quarters, integer. Start is the older end, end is the latest quarter. */
export function generateDomSeries(start: number, end: number, n = 8): number[] {
  return lerp(start, end, n, 0.04).map((v) => Math.max(1, Math.round(v)));
}

/** Monthly enquiries — 12 months, integer. */
export function generateEnquirySeries(latest: number, yoyPct: number, months = 12): number[] {
  const ratio = 1 + yoyPct / 100;
  const start = latest / ratio;
  return lerp(start, latest, months).map((v) => Math.max(0, Math.round(v)));
}
