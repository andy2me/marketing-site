import type { Metadata } from "next";
import Image from "next/image";
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
  { x: 16, y: 34, name: "Tewantin" },
  { x: 40, y: 38, name: "Noosaville", active: true },
  { x: 62, y: 35, name: "Noosa Heads" },
  { x: 83, y: 56, name: "Sunshine Beach" },
  { x: 78, y: 80, name: "Peregian Beach" },
  { x: 71, y: 95, name: "Coolum" },
  { x: 29, y: 78, name: "Doonan" },
  { x: 7, y: 64, name: "Cooroy" },
];
const PATCHES = [
  { name: "Noosaville", median: "$1.85M", growth: "+8.4%", dom: 24, listings: 14, lead: "Matt Powe", leadPhoto: "/assets/team/matt-powe.webp", note: "River-side rhythm; cafés, kayaks, classic Queenslanders.", image: "/assets/locations/noosaville.jpg", imageAlt: "Aerial view of Noosaville along the Noosa River" },
  { name: "Noosa Heads", median: "$3.95M", growth: "+11.2%", dom: 31, listings: 9, lead: "Matt Powe", leadPhoto: "/assets/team/matt-powe.webp", note: "Hastings Street energy; the postcard you came for.", image: "/assets/locations/noosa-heads.jpg", imageAlt: "Aerial view of Noosa Heads with lakes and bushland" },
];
const CHIPS = ["Noosaville", "Noosa Heads"];

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
                    { n: "2", l: "Suburbs covered" },
                    { n: "2", l: "Senior agents" },
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

        {/* Stylised Noosa-region map — design handoff: design_handoff_locations_map */}
        <section className={s.mapSec}>
          <Container>
            <div className={s.mapBox}>
              <svg className={s.mapSvg} viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <pattern id="loc-dots" width="15" height="15" patternUnits="userSpaceOnUse">
                    <circle cx="7.5" cy="7.5" r="0.8" fill="#C6BFB7" opacity="0.55" />
                  </pattern>
                  <linearGradient id="loc-ocean" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#A6BFBD" />
                    <stop offset="1" stopColor="#90AEAC" />
                  </linearGradient>
                </defs>

                {/* Land texture */}
                <rect width="1000" height="560" fill="url(#loc-dots)" />

                {/* National Park / conservation greens */}
                <path d="M 0,0 L 130,0 C 112,130 150,250 96,360 C 64,420 30,500 0,560 Z" fill="#C9D1B6" opacity="0.65" />
                <path d="M 470,560 L 700,560 C 690,510 640,478 600,452 C 560,478 520,512 470,560 Z" fill="#C9D1B6" opacity="0.6" />

                {/* Ocean — east coast */}
                <path d="M 740,0 C 760,46 730,92 740,150 C 760,228 870,258 820,330 C 772,398 832,470 802,560 L 1000,560 L 1000,0 Z" fill="url(#loc-ocean)" />

                {/* Noosa River estuary + river mouth */}
                <path d="M 372,0 C 410,98 520,150 612,150 C 686,150 720,86 700,0 Z" fill="#B4C8C6" />
                <path d="M 612,148 C 668,128 712,118 742,96 C 752,140 720,168 672,170 C 640,170 620,162 612,148 Z" fill="#B4C8C6" />

                {/* West river arm — past Tewantin */}
                <path d="M 372,18 C 286,46 206,74 124,118 C 96,133 96,165 126,158 C 206,138 300,108 396,86 C 426,79 404,28 372,18 Z" fill="#B4C8C6" />

                {/* Lake Doonella */}
                <path d="M 318,182 C 380,170 432,186 426,216 C 420,248 358,252 322,236 C 292,222 288,192 318,182 Z" fill="#B4C8C6" />

                {/* Main river reach — Tewantin → Noosaville → river mouth */}
                <path d="M 150,140 C 290,188 392,206 472,198 C 546,190 600,172 612,150 C 626,164 634,184 620,200 C 600,214 542,216 470,224 C 382,232 282,216 150,166 Z" fill="#B4C8C6" />

                {/* Noosa Sound canals */}
                <g fill="#B4C8C6" opacity="0.92">
                  <path d="M 470,238 C 510,234 540,250 556,278 C 540,282 520,272 506,256 C 494,244 480,244 470,238 Z" />
                  <path d="M 452,286 C 492,284 524,298 540,322 C 522,328 500,318 488,304 C 476,292 462,292 452,286 Z" />
                </g>

                {/* Lake Weyba (south) */}
                <path d="M 516,372 C 608,356 690,400 684,470 C 678,536 588,542 538,506 C 492,472 466,392 516,372 Z" fill="#B4C8C6" />

                {/* Shoreline outline */}
                <path d="M 740,0 C 760,46 730,92 740,150 C 760,228 870,258 820,330 C 772,398 832,470 802,560" stroke="#6E8B89" strokeWidth="1.4" fill="none" opacity="0.5" />

                {/* Roads — main arterials, faint */}
                <path d="M 70,300 C 230,272 360,292 504,252 C 612,222 700,256 786,232" stroke="#BCB4AC" strokeWidth="2.4" fill="none" opacity="0.7" />
                <path d="M 808,540 C 846,430 792,366 832,304 C 868,250 802,224 792,150" stroke="#BCB4AC" strokeWidth="2.2" fill="none" opacity="0.6" />
                <path d="M 372,560 C 360,460 300,400 300,320" stroke="#BCB4AC" strokeWidth="1.8" fill="none" opacity="0.5" />

                {/* Water place labels */}
                <text x="900" y="120" textAnchor="middle" fontSize="13" letterSpacing="2" fill="#5C7B79" opacity="0.75" style={{ fontFamily: "var(--font-mono), monospace" }}>LAGUNA BAY</text>
                <text x="430" y="64" textAnchor="middle" fontSize="11" letterSpacing="1.5" fill="#5C7B79" opacity="0.7" style={{ fontFamily: "var(--font-mono), monospace" }}>NOOSA RIVER</text>
                <text x="600" y="448" textAnchor="middle" fontSize="11" letterSpacing="1.5" fill="#5C7B79" opacity="0.7" style={{ fontFamily: "var(--font-mono), monospace" }}>LAKE WEYBA</text>

                {/* Compass */}
                <g transform="translate(56,500)">
                  <circle r="22" fill="none" stroke="#564C44" strokeWidth="1" opacity="0.5" />
                  <path d="M 0,-22 L 4,0 L 0,22 L -4,0 Z" fill="#564C44" opacity="0.6" />
                  <text x="0" y="-30" textAnchor="middle" fontSize="10" fill="#564C44" opacity="0.65" style={{ fontFamily: "var(--font-mono), monospace" }}>N</text>
                </g>
              </svg>
              {PINS.map((p) => (
                <div key={p.name} className={s.pin} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                  <div className={`${s.pinLabel} ${p.active ? s.pinLabelActive : ""}`}>{p.name}</div>
                  <div className={`${s.pinDot} ${p.active ? s.pinDotActive : ""}`} />
                </div>
              ))}
              <div className={s.legend}>Noosa region · indicative</div>
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
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <ImageSlot ratio="5/4" style={{ borderRadius: 0, position: "absolute", inset: 0 }} />
                    )}
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
                      <span className={s.patchAvatar} aria-hidden>
                        {p.leadPhoto ? (
                          <Image
                            src={p.leadPhoto}
                            alt=""
                            fill
                            sizes="28px"
                            style={{ objectFit: "cover", borderRadius: "inherit" }}
                          />
                        ) : null}
                      </span>
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
