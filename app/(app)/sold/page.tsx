import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { LiveIndicator } from "@/components/property/LiveIndicator";
import { PropertiesBrowser } from "@/components/property/PropertiesBrowser";
import { IconArrowR } from "@/components/icons";
import { getSoldListings } from "@/lib/rex";
import { getSiteSettings } from "@/lib/wp/mock";
import s from "@/components/property/properties.module.css";

export const metadata: Metadata = {
  title: "Recently Sold — Sunshine Coast",
  description:
    "Recently sold properties across Noosa and the Sunshine Coast. Real outcomes from the Max Property team — searchable by suburb, price, beds and type.",
  alternates: { canonical: "/sold" },
};

export const revalidate = 900;

export default async function SoldPage() {
  const [listings, settings] = await Promise.all([getSoldListings(), getSiteSettings()]);

  return (
    <>
      <Header current="Buy" nav={settings.nav} />

      <main>
        <section className={s.intro}>
          <Container>
            <div className={s.introRow}>
              <div>
                <div className="overline">Recently sold · Sunshine Coast</div>
                <h1 className={s.introTitle}>Real outcomes.</h1>
              </div>
              <div className={s.introMeta}>
                <LiveIndicator updatedAt={Date.now()} />
              </div>
            </div>
          </Container>
        </section>

        <Suspense fallback={null}>
          <PropertiesBrowser listings={listings} />
        </Suspense>

        <section className={s.cta}>
          <Container className={s.ctaInner}>
            <div>
              <div className="overline" style={{ color: "rgba(255,255,255,.7)" }}>
                Thinking of selling?
              </div>
              <h2 className={s.ctaHeading}>We&rsquo;ll bring the strategy. You bring the keys.</h2>
            </div>
            <Link href="/sell#appraisal" className={`btn btn-lg ${s.ctaBtn}`}>
              Request an appraisal <IconArrowR />
            </Link>
          </Container>
        </section>
      </main>
    </>
  );
}
