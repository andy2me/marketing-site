import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { IconArrowR } from "@/components/icons";
import { getSiteSettings } from "@/lib/wp/mock";
import { AppraisalForm } from "./AppraisalForm";
import s from "./sell.module.css";

export const metadata: Metadata = {
  title: "Sell — Request an Appraisal",
  description:
    "Sell with Max Property on the Sunshine Coast. The highest-quality campaign, every time — process, results and a no-obligation appraisal.",
  alternates: { canonical: "/sell" },
};

// Content → WordPress ACF (§7).
const PROMISE_STATS = [
  { n: "7.4%", l: "Average above-reserve premium" },
  { n: "28 days", l: "Median days on market" },
  { n: "96%", l: "Campaigns that sell in first cycle" },
];
const PROCESS = [
  { n: "01", w: "Appraisal", body: "A genuine walk-through, a clear-eyed view of comparable evidence, and a written price guidance you can trust.", time: "Week 0" },
  { n: "02", w: "Strategy", body: "Auction or private treaty. Campaign length, channel mix, and pricing approach — set deliberately, not by default.", time: "Week 1" },
  { n: "03", w: "Stylise", body: "Stylist briefed, photographer booked, copy drafted. We shoot for hero shots, not stock — every campaign is bespoke.", time: "Week 1–2" },
  { n: "04", w: "Launch", body: "Coordinated drop across our database, portals, social and print. Open homes scheduled with intent.", time: "Week 2" },
  { n: "05", w: "Negotiate", body: "Weekly vendor reports, buyer-by-buyer commentary, and a negotiation strategy that protects your reserve.", time: "Weeks 3–5" },
  { n: "06", w: "Settle", body: "From accepted offer to handover of keys — coordinated with your conveyancer, no surprises.", time: "Week 6+" },
];
const SOLD = [
  { addr: "18 Hilltop Crescent", suburb: "Noosaville", price: "$2,650,000", guide: "$2.3–2.5M", days: 21 },
  { addr: "5 Saltwater Court", suburb: "Sunshine Beach", price: "$2,800,000", guide: "Auction", days: 18 },
  { addr: "22 Pandanus Way", suburb: "Tewantin", price: "$1,720,000", guide: "$1.55M+", days: 14 },
  { addr: "3 Banksia Avenue", suburb: "Noosa Heads", price: "$4,250,000", guide: "$3.8M+", days: 32 },
];
const INCLUDED = [
  { c: "Photography", v: "Twilight + day, drone, walkthrough video" },
  { c: "Styling", v: "Full home stylist, 4-week stage included" },
  { c: "Copy", v: "Bespoke editorial brochure, not template" },
  { c: "Portals", v: "Premiere listing on realestate.com.au & Domain" },
  { c: "Social", v: "Paid Meta + organic reels, geo-targeted" },
  { c: "Print", v: "DL flyers, signboard, local press if relevant" },
  { c: "Database", v: "Direct outreach to 1,800+ qualified buyers" },
  { c: "Open homes", v: "Curated, never crowded — appointment-led" },
  { c: "Reporting", v: "Weekly written + verbal vendor reports" },
];
const FAQS = [
  { q: "How do you decide between auction and private treaty?", a: "It's situational — buyer depth, property type, and your tolerance for timing risk. We'll walk you through the trade-offs at the appraisal and recommend one path with reasons." },
  { q: "What does it cost to sell with Max.?", a: "Commission is negotiated against each campaign. Marketing is costed and approved before launch — no add-ons after the fact." },
  { q: "How long is a typical campaign?", a: "Four weeks of active marketing for an auction; 4–6 weeks for private treaty. Most homes sell inside the first cycle." },
  { q: "Do you work outside the Noosa shire?", a: "Selectively. If you're south of Twin Waters or up at Rainbow Beach, we'll have a candid conversation about whether we're the right team." },
];
const dimOverline = { color: "rgba(244,237,229,.6)" };

export default async function SellPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header transparent current="Sell" nav={settings.nav} />

      <main>
        {/* Hero */}
        <section className={s.hero}>
          <Container className={s.heroInner}>
            <div className={s.heroGrid}>
              <div>
                <div className="overline" style={dimOverline}>
                  § For vendors
                </div>
                <h1 className={s.heroH1}>
                  The highest
                  <br />
                  quality campaign<span style={{ color: "var(--sunrise)" }}>,</span>
                  <br />
                  <em style={{ fontStyle: "italic", color: "var(--sunrise)" }}>every</em> time.
                </h1>
                <p className={s.heroBody}>
                  Max. by name, maximum by outcome. We leave nothing to chance — the work begins
                  long before your home is listed.
                </p>
                <div className={s.heroCtas}>
                  <Button href="#appraisal" variant="primary" size="lg">
                    Request an appraisal <IconArrowR />
                  </Button>
                  <Button href="#process" variant="ghost-dark" size="lg">
                    How we work
                  </Button>
                </div>
              </div>
              <ImageSlot
                ratio="4/5"
                label="vendor portrait · 4:5"
                className={s.heroImg}
              />
            </div>
          </Container>
        </section>

        {/* Promise */}
        <section className={s.sec}>
          <Container>
            <SectionIntro overline="§ 01 · The promise">
              <h2 className={s.h2}>
                Most homes only sell{" "}
                <em style={{ fontStyle: "italic", color: "var(--color-action)" }}>once</em>. We
                take that very seriously.
              </h2>
              <p className={s.lead}>
                We&rsquo;re a small, considered team — by design. Every campaign is led by a
                principal agent who carries it from appraisal through to settlement. No handoffs,
                no juniors learning on your dime.
              </p>
              <div className={s.promiseStats}>
                {PROMISE_STATS.map((x) => (
                  <div key={x.n}>
                    <div className={s.statNum}>{x.n}</div>
                    <div className={s.statLabel}>{x.l}</div>
                  </div>
                ))}
              </div>
            </SectionIntro>
          </Container>
        </section>

        {/* Process */}
        <section id="process" className={`${s.sec} ${s.banding}`}>
          <Container>
            <SectionIntro overline="§ 02 · How we work">
              <h2 className={s.h2}>Six steps, zero shortcuts.</h2>
            </SectionIntro>
            <div className={s.processList}>
              {PROCESS.map((step) => (
                <div key={step.n} className={s.procRow}>
                  <div className={s.procNum}>{step.n}</div>
                  <div className={s.procWord}>
                    {step.w}
                    <span style={{ color: "var(--color-action)" }}>.</span>
                  </div>
                  <p className={s.procBody}>{step.body}</p>
                  <div className={s.procTime}>{step.time}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Results */}
        <section className={s.sec}>
          <Container>
            <div className={s.resultsHead}>
              <div>
                <div className="overline">§ 03 · Recent campaigns</div>
                <h2 className={s.headTitle}>Sold above expectation.</h2>
              </div>
              <Button href="/buy" variant="tertiary">
                All sold properties <IconArrowR />
              </Button>
            </div>
            <div className={s.soldGrid}>
              {SOLD.map((x) => (
                <article key={x.addr} className={s.soldCard}>
                  <div className={s.soldMedia}>
                    <ImageSlot ratio="4/3" />
                    <span className={s.soldTag}>Sold</span>
                  </div>
                  <div className={s.soldBody}>
                    <div className={s.soldPrice}>{x.price}</div>
                    <div className={s.soldAddr}>{x.addr}</div>
                    <div className={s.soldSuburb}>{x.suburb}</div>
                    <div className={s.soldMeta}>
                      <span>Guide · {x.guide}</span>
                      <span>{x.days} days</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* Included */}
        <section className={`${s.sec} ${s.included}`}>
          <Container>
            <SectionIntro overline="§ 04 · What's included" overlineStyle={dimOverline}>
              <h2 className={s.h2} style={{ color: "#F4EDE5" }}>
                One fee. Everything that matters.
              </h2>
            </SectionIntro>
            <div className={s.includedGrid}>
              {INCLUDED.map((it) => (
                <div key={it.c} className={s.includedItem}>
                  <div className={`overline ${s.includedLabel}`}>{it.c}</div>
                  <div className={s.includedValue}>{it.v}</div>
                </div>
              ))}
            </div>
            <p className={s.includedNote}>
              Marketing budget varies with property and channel mix — every campaign is costed
              before launch, with no hidden fees and no add-ons after the fact.
            </p>
          </Container>
        </section>

        {/* Advocate */}
        <section className={s.sec}>
          <Container>
            <div className={s.advGrid}>
              <ImageSlot ratio="4/5" label="principal portrait · 4:5" style={{ borderRadius: 16 }} />
              <div>
                <div className="overline">§ 05 · A word from the principal</div>
                <blockquote className={s.advQuote}>
                  <span className={s.quoteMark}>“</span>If we wouldn&rsquo;t list it that way for
                  our own family, we won&rsquo;t list it that way for yours.
                  <span className={s.quoteMark}>”</span>
                </blockquote>
                <div className={s.advAuthor}>
                  <span className={s.advAvatar} aria-hidden />
                  <div>
                    <div className={s.advName}>James Whitlam</div>
                    <div className={s.advRole}>Principal · Founder</div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className={`${s.sec} ${s.banding}`}>
          <Container>
            <div className={s.split}>
              <div>
                <div className="overline">§ 06 · Questions, answered</div>
                <h2 className={s.headTitle}>You&rsquo;re entitled to clear answers.</h2>
              </div>
              <FaqAccordion items={FAQS} />
            </div>
          </Container>
        </section>

        {/* Appraisal */}
        <section id="appraisal" className={s.appraisal}>
          <Container>
            <div className={s.apprGrid}>
              <div>
                <div className="overline" style={{ color: "rgba(244,237,229,.5)" }}>
                  § 07 · Get a no-obligation appraisal
                </div>
                <h2 className={s.apprH2}>
                  When you&rsquo;re
                  <br />
                  ready, <em style={{ fontStyle: "italic", color: "var(--sunrise)" }}>we&rsquo;re</em>
                  <br />
                  ready.
                </h2>
                <p className={s.apprBody}>
                  Tell us a bit about your home. A principal agent will be in touch within one
                  business day.
                </p>
              </div>
              <AppraisalForm />
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
