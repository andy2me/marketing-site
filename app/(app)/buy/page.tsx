import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { PropertiesBrowser } from "@/components/property/PropertiesBrowser";
import { IconArrowR } from "@/components/icons";
import { getActiveListings } from "@/lib/rex";
import { getSiteSettings } from "@/lib/wp/mock";
import s from "@/components/property/properties.module.css";

export const metadata: Metadata = {
  title: "Properties for Sale — Sunshine Coast",
  description:
    "Browse homes for sale across Noosa and the Sunshine Coast. Filter by suburb, price, beds and type, in grid or map view.",
  alternates: { canonical: "/buy" },
};

// ISR (§8): 10–15 min interval + on-demand via the Rex listing-change webhook.
export const revalidate = 900;

export default async function BuyPage() {
  const [listings, settings] = await Promise.all([getActiveListings(), getSiteSettings()]);

  return (
    <>
      <Header current="Buy" nav={settings.nav} />

      <main>
        <section className={s.intro}>
          <Container>
            <div className={s.introRow}>
              <div>
                <div className="overline">Properties for sale · Sunshine Coast</div>
                <h1 className={s.introTitle}>The current market.</h1>
              </div>
              <div className={s.introMeta}>
                <span className={s.live}>
                  <span className={s.liveDot} /> Live · synced with Rex
                </span>
                <span>·</span>
                <span>Updated 2 min ago</span>
              </div>
            </div>
          </Container>
        </section>

        {/* Client filtering/sorting reads URL params → needs a Suspense boundary. */}
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
