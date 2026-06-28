// Featured-complex link card — appears on the Suburb hub page when the
// suburb has at least one published property profile. Quiet card; not a
// dominant section — the profile is one path out of many on the hub.

import Link from "next/link";
import { IconArrowR, IconPin } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { getComplexSlugs, getComplexBySlug } from "@/lib/complexes/store";
import type { ComplexProfile } from "@/lib/complexes/types";

function complexesForSuburb(suburbSlug: string): ComplexProfile[] {
  return getComplexSlugs()
    .filter((s) => s.suburb === suburbSlug)
    .map((s) => getComplexBySlug(s.suburb, s.complex))
    .filter((c): c is ComplexProfile => Boolean(c));
}

export function FeaturedComplex({ suburbSlug }: { suburbSlug: string }) {
  const complexes = complexesForSuburb(suburbSlug);
  if (!complexes.length) return null;

  return (
    <section style={{ padding: "48px 0", background: "var(--soft-linen-700)" }}>
      <Container>
        <p
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-text-secondary)",
          }}
        >
          Featured property profile
        </p>
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gap: 16,
            gridTemplateColumns: complexes.length > 1 ? "repeat(2, 1fr)" : "1fr",
          }}
        >
          {complexes.map((c) => (
            <Link
              key={c.id}
              href={`/property/${c.suburbSlug}/${c.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 20,
                alignItems: "center",
                padding: "22px 24px",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 16,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: "var(--soft-linen-500)",
                  color: "var(--color-action)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <IconPin />
              </span>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 22,
                    color: "var(--color-text-strong)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {c.name}
                </p>
                <p
                  style={{
                    marginTop: 4,
                    fontSize: 13.5,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {c.street} · {c.stats.totalUnits} dwellings ·{" "}
                  {c.stats.recentSales} sales · last 24 mths
                </p>
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                  color: "var(--color-action)",
                  whiteSpace: "nowrap",
                }}
              >
                Open profile <IconArrowR />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
