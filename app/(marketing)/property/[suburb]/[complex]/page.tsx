// Complex profile — /property/{suburb}/{complex}/.
//
// M2 scaffolding: routing + breadcrumb + H1 only. Hero, stats, commentary,
// recent-activity, units section, latest-report block and the buyer-interest
// CTA land in M3-M6.
//
// `dynamicParams: false` so unknown suburb/complex slugs hard-404 rather than
// re-rendering on every miss.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/lib/wp/mock";
import { getComplexBySlug, getComplexSlugs } from "@/lib/complexes/store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

export const dynamicParams = false;
export const revalidate = 1800;

export async function generateStaticParams() {
  return getComplexSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string; complex: string }>;
}): Promise<Metadata> {
  const { suburb, complex } = await params;
  const profile = getComplexBySlug(suburb, complex);
  if (!profile) return { title: "Property not found" };
  const canonical = `/property/${profile.suburbSlug}/${profile.slug}`;
  return {
    title: `${profile.name}, ${profile.suburbName} — Property Profile`,
    description: profile.intro,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${profile.name}, ${profile.suburbName}`,
      description: profile.intro,
      url: `${SITE_URL}${canonical}`,
    },
  };
}

export default async function ComplexProfilePage({
  params,
}: {
  params: Promise<{ suburb: string; complex: string }>;
}) {
  const { suburb, complex } = await params;
  const profile = getComplexBySlug(suburb, complex);
  if (!profile) notFound();

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
            <span style={{ color: "var(--color-text-primary)" }}>
              {profile.name}
            </span>
          </nav>

          <section style={{ padding: "48px 0 24px" }}>
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
                fontSize: 18,
                color: "var(--color-text-secondary)",
              }}
            >
              {profile.street}, {profile.suburbName} {profile.state}{" "}
              {profile.suburbPostcode}
            </p>
            <p
              style={{
                marginTop: 20,
                fontSize: 17,
                maxWidth: 540,
                lineHeight: 1.55,
              }}
            >
              {profile.intro}
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
            M2 scaffolding · hero map, stats, commentary, recent activity,
            units section, latest-report block and the buyer-interest CTA land
            in M3–M6.
          </p>
        </div>
      </main>
    </>
  );
}
