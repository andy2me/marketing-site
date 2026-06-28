// Unit profile — /property/{suburb}/{complex}/unit-{n}/.
//
// M2 scaffolding: routing + breadcrumb + H1 + status badge. UnitHero, gallery
// (Matt's only), CommentaryPending, ResultPanel, EventTimeline (with
// ReportBacklink), InheritedContext, ComparableCard and the sticky side panel
// land in M3-M7.
//
// The `[unit]` segment captures the full slug (`unit-12`, `unit-12a`). Parsing
// lives in lib/complexes/derive.unitNumberFromSlug; unknown shapes 404.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/lib/wp/mock";
import {
  getComplexBySlug,
  getUnitBySlug,
  getUnitSlugs,
} from "@/lib/complexes/store";

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

  const settings = await getSiteSettings();

  return (
    <>
      <Header current="Locations" nav={settings.nav} />

      <main className="mp">
        <div className="container" style={{ paddingTop: 24 }}>
          <nav
            aria-label="Breadcrumb"
            style={{ fontSize: 13, color: "var(--color-text-secondary)" }}
          >
            <Link href="/">Property</Link>
            {" › "}
            <Link href={`/${profile.suburbSlug}`}>{profile.suburbName}</Link>
            {" › "}
            <Link href={`/property/${profile.suburbSlug}/${profile.slug}`}>
              {profile.name}
            </Link>
            {" › "}
            <span style={{ color: "var(--color-text-primary)" }}>
              Unit {dwelling.number}
            </span>
          </nav>

          <section style={{ padding: "32px 0 24px" }}>
            <span
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                background: "var(--soft-linen-500)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-secondary)",
              }}
            >
              {dwelling.status}
            </span>
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
              Unit {dwelling.number}, {profile.name}
            </h1>
            <p
              style={{
                marginTop: 14,
                fontSize: 17,
                color: "var(--color-text-secondary)",
              }}
            >
              {profile.street}, {profile.suburbName} {profile.state}{" "}
              {profile.suburbPostcode}
            </p>
            <p
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "var(--color-text-primary)",
              }}
            >
              {dwelling.beds} bed · {dwelling.baths} bath · {dwelling.car} car ·{" "}
              {dwelling.area} · {dwelling.aspect}
            </p>
          </section>

          <p
            style={{
              padding: "12px 16px",
              marginBottom: 48,
              borderRadius: 8,
              background: "var(--soft-linen-500)",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-secondary)",
            }}
          >
            M2 scaffolding · Matt&rsquo;s read (or commentary-pending),
            result panel, event timeline with report back-links, comparables
            and the sticky side panel land in M3–M7.
          </p>
        </div>
      </main>
    </>
  );
}
