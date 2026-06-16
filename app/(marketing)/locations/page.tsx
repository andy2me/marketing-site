import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PropertyCard } from "@/components/property/PropertyCard";
import { IconArrowR } from "@/components/icons";
import { getSiteSettings } from "@/lib/wp/mock";
import { getActiveListings } from "@/lib/rex";
import s from "./locations.module.css";

export const metadata: Metadata = {
  title: "Locations — Our Patches",
  description:
    "The Sunshine Coast isn't one market; it's a dozen. Explore the patches Max Property covers — medians, growth and the agent who calls each one home.",
  alternates: { canonical: "/locations" },
};

const PINS = [
  { x: 32, y: 40, name: "Noosaville", active: true },
  { x: 48, y: 30, name: "Noosa Heads" },
  { x: 60, y: 50, name: "Sunshine Beach" },
  { x: 22, y: 58, name: "Tewantin" },
  { x: 36, y: 62, name: "Doonan" },
  { x: 50, y: 72, name: "Peregian Beach" },
  { x: 64, y: 80, name: "Coolum" },
  { x: 18, y: 78, name: "Cooroy" },
];
const PATCHES = [
  { name: "Noosaville", median: "$1.85M", growth: "+8.4%", dom: 24, listings: 14, lead: "Eliza Hart", note: "River-side rhythm; cafés, kayaks, classic Queenslanders." },
  { name: "Noosa Heads", median: "$3.95M", growth: "+11.2%", dom: 31, listings: 9, lead: "James Whitlam", note: "Hastings Street energy; the postcard you came for." },
  { name: "Sunshine Beach", median: "$3.10M", growth: "+9.6%", dom: 26, listings: 6, lead: "James Whitlam", note: "Beachy hush; a village that votes early and walks barefoot." },
  { name: "Tewantin", median: "$1.32M", growth: "+5.8%", dom: 35, listings: 8, lead: "Mae Robinson", note: "Local-first, value-rich; an honest day's work, an honest sale." },
  { name: "Doonan", median: "$2.45M", growth: "+6.1%", dom: 48, listings: 5, lead: "Eliza Hart", note: "Acreage country; horses, hinterland and big skies." },
  { name: "Peregian Beach", median: "$2.05M", growth: "+10.2%", dom: 22, listings: 7, lead: "Mae Robinson", note: "Pine forest meets surf; the quiet sibling of Sunny Beach." },
];
const CHIPS = ["Noosaville", "Noosa Heads", "Sunshine Beach", "Tewantin", "Doonan"];

export default async function LocationsPage() {
  const [settings, listings] = await Promise.all([getSiteSettings(), getActiveListings()]);
  const noosaville = listings.filter((l) => l.suburb.includes("Noosaville")).slice(0, 3);

  return (
    <>
      <Header current="Locations" nav={settings.nav} />

      <main>
        {/* Intro */}
        <section className={s.intro}>
          <Container>
            <div className={`${s.split} ${s.introGrid}`}>
              <div>
                <div className="overline">§ The patches</div>
                <h1 className={s.introH1}>
                  We know our
                  <br />
                  <em style={{ fontStyle: "italic", color: "var(--color-action)" }}>patches</em>.
                </h1>
              </div>
              <div>
                <p className={s.introText}>
                  Each agent on the team owns a small handful of suburbs — by choice. It&rsquo;s how
                  we keep our intel sharp and our advice honest. The Sunshine Coast isn&rsquo;t one
                  market; it&rsquo;s a dozen, each with its own rhythm.
                </p>
                <div className={s.introStats}>
                  {[
                    { n: "12", l: "Suburbs covered" },
                    { n: "4", l: "Senior agents" },
                    { n: "180+", l: "Sold in 24 months" },
                  ].map((x) => (
                    <div key={x.l}>
                      <div className={s.statN}>{x.n}</div>
                      <div className={s.statL}>{x.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Schematic map — TODO(§8): MapLibre with real coords + custom markers */}
        <section className={s.mapSec}>
          <Container>
            <div className={s.mapBox}>
              <svg className={s.mapSvg} viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <pattern id="loc-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="7" cy="7" r="0.8" fill="#C6C0BC" opacity="0.6" />
                  </pattern>
                </defs>
                <rect width="1000" height="500" fill="url(#loc-dots)" />
                <path d="M 720,0 L 1000,0 L 1000,500 L 700,500 Q 760,300 720,0 Z" fill="#1A120C" opacity="0.04" />
                <path d="M 720,0 Q 700,140 770,260 Q 820,360 700,500" stroke="#564C44" strokeWidth="1.5" fill="none" opacity="0.5" strokeDasharray="2 4" />
                <path d="M 0,360 Q 220,330 360,290 Q 480,260 620,280 Q 700,300 740,320" stroke="#502B34" strokeWidth="2" fill="none" opacity="0.45" />
                <g transform="translate(56,56)">
                  <circle r="22" fill="none" stroke="#564C44" strokeWidth="1" opacity="0.5" />
                  <path d="M 0,-22 L 4,0 L 0,22 L -4,0 Z" fill="#564C44" opacity="0.6" />
                </g>
              </svg>
              {PINS.map((p) => (
                <div key={p.name} className={s.pin} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                  <div className={`${s.pinLabel} ${p.active ? s.pinLabelActive : ""}`}>{p.name}</div>
                  <div className={`${s.pinDot} ${p.active ? s.pinDotActive : ""}`} />
                </div>
              ))}
              <div className={s.legend}>Schematic · not to scale</div>
            </div>
          </Container>
        </section>

        {/* Patches grid */}
        <section className={s.patches}>
          <Container>
            <div className={s.patchesHead}>
              <h2 className={s.patchesTitle}>Every patch, with someone who calls it home.</h2>
              <div className={s.patchesMeta}>Q2 2026 data · CoreLogic + Max. internals</div>
            </div>
            <div className={s.patchGrid}>
              {PATCHES.map((p) => (
                <a
                  key={p.name}
                  href={`/buy?suburb=${encodeURIComponent(p.name)}`}
                  className={s.patchCard}
                >
                  <div className={s.patchMedia}>
                    <ImageSlot ratio="5/4" style={{ borderRadius: 0, position: "absolute", inset: 0 }} />
                    <div className={s.patchOverlay} />
                    <div className={s.patchHead}>
                      <div className={s.patchName}>{p.name}</div>
                      <div className={s.patchCount}>{p.listings} listings</div>
                    </div>
                  </div>
                  <div className={s.patchBody}>
                    <p className={s.patchNote}>{p.note}</p>
                    <div className={s.patchStats}>
                      <div>
                        <div className={s.miniK}>Median</div>
                        <div className={s.miniV}>{p.median}</div>
                      </div>
                      <div>
                        <div className={s.miniK}>YoY</div>
                        <div className={`${s.miniV} ${s.miniVAccent}`}>{p.growth}</div>
                      </div>
                      <div>
                        <div className={s.miniK}>Days on market</div>
                        <div className={s.miniV}>{p.dom}d</div>
                      </div>
                    </div>
                    <div className={s.patchLead}>
                      <span className={s.patchAvatar} aria-hidden />
                      <span className={s.patchLeadName}>
                        Led by <span style={{ color: "var(--color-text-strong)" }}>{p.lead}</span>
                      </span>
                      <span className={s.patchExplore}>
                        Explore <IconArrowR />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* Featured by area */}
        <section className={s.featured}>
          <Container>
            <div className={s.featuredHead}>
              <div>
                <div className="overline">§ Currently in Noosaville</div>
                <h2 className={s.featuredTitle}>Pick a patch, see the market.</h2>
              </div>
              <div className={s.chips}>
                {CHIPS.map((c, i) => (
                  <span key={c} className={`btn btn-sm ${i === 0 ? s.chipActive : s.chip}`}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className={s.grid3}>
              {noosaville.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className={s.cta}>
          <Container>
            <div className={s.ctaGrid}>
              <h2 className={s.ctaH2}>
                Not sure which patch is
                <br />
                <em style={{ fontStyle: "italic", color: "var(--sunrise)" }}>yours</em> yet?
              </h2>
              <div>
                <p className={s.ctaText}>
                  Tell us what you&rsquo;re chasing — schools, water, hinterland, hush — and
                  we&rsquo;ll match you to a suburb and a person.
                </p>
                <div className={s.ctaBtns}>
                  <Button href="/contact?enquiry=buy" variant="primary" size="lg">
                    Talk to a local <IconArrowR />
                  </Button>
                  <Button href="/insights" variant="ghost-dark" size="lg">
                    Subscribe to alerts
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
