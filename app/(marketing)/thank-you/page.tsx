import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { IconArrowR, IconPhone } from "@/components/icons";
import { getAgent } from "@/lib/agents/store";
import { getSiteSettings } from "@/lib/wp/mock";
import { routeAgent } from "@/lib/leads/route-agent";

import { CoffeeMark } from "./CoffeeMark";
import s from "./thank-you.module.css";

export const metadata: Metadata = {
  title: "Thanks — we'll be in touch",
  description:
    "Your enquiry has landed with the right person. While you wait, the first coffee is on us.",
  // Don't let bots/share-cards index a confirmation URL.
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

// Default agent (matches lib/leads/route-agent.ts) — kept here so the page
// renders even when no params are passed (e.g. direct visit).
const DEFAULT_FORM = "appraisal";

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | null {
  if (Array.isArray(v)) return v[0]?.trim() || null;
  if (typeof v === "string") return v.trim() || null;
  return null;
}

/** Trims a name to a friendly first-name token without leaking surnames. */
function firstName(raw: string | null): string | null {
  if (!raw) return null;
  return raw.split(/\s+/)[0] || null;
}

/** Per-form copy: secondary CTA + "while you wait" cards.
 *  Three flavours; everything else reads from the routed agent. */
function flavourFor(form: string) {
  const APPRAISAL = {
    secondaryCta: { label: "Browse listings while you wait", href: "/buy" },
    cards: [
      {
        href: "/buy",
        img: "/assets/insights/market.svg",
        tag: "Browse",
        title: "See what's selling near you",
        blurb: "Fresh listings across Noosaville, Sunshine Beach & Tewantin.",
        cta: "View listings",
      },
      {
        href: "/insights/sunshine-coast-market-may-2026",
        img: "/assets/insights/migration.svg",
        tag: "Read",
        title: "What your Noosa home is really worth",
        blurb: "Our plain-English guide to how appraisals actually work.",
        cta: "Read the guide",
      },
      {
        href: "/insights/what-the-listing-doesnt-tell-you",
        img: "/assets/insights/listing.svg",
        tag: "Prepare",
        title: "Five things to do before we visit",
        blurb: "Small, no-cost moves that lift your appraisal day.",
        cta: "Get the checklist",
      },
    ],
  };
  const ENQUIRY = {
    secondaryCta: { label: "Browse more listings", href: "/buy" },
    cards: [
      {
        href: "/buy",
        img: "/assets/insights/market.svg",
        tag: "Browse",
        title: "More like this, fresh today",
        blurb: "Latest homes across Noosaville, Sunshine Beach & Tewantin.",
        cta: "View listings",
      },
      {
        href: "/sold",
        img: "/assets/insights/auction.svg",
        tag: "Compare",
        title: "What's recently sold nearby",
        blurb: "Recent sale results — the real signal on local pricing.",
        cta: "See sold results",
      },
      {
        href: "/insights/what-the-listing-doesnt-tell-you",
        img: "/assets/insights/listing.svg",
        tag: "Read",
        title: "What the listing doesn't tell you",
        blurb: "How to read between the lines before you inspect.",
        cta: "Read the guide",
      },
    ],
  };
  const CONTACT = {
    secondaryCta: { label: "Read our latest insights", href: "/insights" },
    cards: [
      {
        href: "/team",
        img: "/assets/insights/migration.svg",
        tag: "Meet",
        title: "Get to know the team",
        blurb: "Who we are, where we work, and how we think about Noosa.",
        cta: "Meet the team",
      },
      {
        href: "/insights",
        img: "/assets/insights/market.svg",
        tag: "Read",
        title: "What's happening on the market",
        blurb: "Plain-English notes from the people working the patch.",
        cta: "Browse insights",
      },
      {
        href: "/buy",
        img: "/assets/insights/listing.svg",
        tag: "Browse",
        title: "Currently for sale",
        blurb: "Fresh homes across Noosaville, Sunshine Beach & Tewantin.",
        cta: "View listings",
      },
    ],
  };

  if (form === "appraisal" || form.startsWith("appraisal-agent-")) return APPRAISAL;
  if (form === "enquiry") return ENQUIRY;
  return CONTACT;
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const form = first(sp.form) ?? DEFAULT_FORM;
  const enquiry = first(sp.enquiry);
  const name = firstName(first(sp.name));
  const address = first(sp.address);
  const voucherCode = first(sp.code);

  const routed = routeAgent(form, enquiry);
  const agent = (await getAgent(routed.slug)) ?? (await getAgent("matt-powe"));
  const settings = await getSiteSettings();
  const flavour = flavourFor(form);

  const agentFirst = agent ? agent.name.split(" ")[0] : "the team";
  const heading = name ? `Thanks, ${name}.` : "Thanks for getting in touch.";

  return (
    <>
      <div className={s.headerBand}>
        <Header current={null} nav={settings.nav} />
      </div>

      <main>
        {/* Hero — the confirmation moment */}
        <section className={s.hero}>
          <Container>
            <div className={s.heroGrid}>
              <div>
                <Overline>§ Request received</Overline>
                <h1 className={s.heroH1}>
                  {heading}
                  <br />
                  You&rsquo;re in <em className={s.heroH1Em}>good hands</em>.
                </h1>
                <p className={s.heroIntro}>
                  {address ? (
                    <>
                      Your enquiry for{" "}
                      <strong className={s.heroIntroStrong}>{address}</strong> just landed on{" "}
                      {agentFirst}&rsquo;s desk. {agentFirst} will be in touch{" "}
                      {routed.responseWindow.toLowerCase()} — and while you wait, the first
                      coffee&rsquo;s on us.
                    </>
                  ) : (
                    <>
                      Your details just landed on {agentFirst}&rsquo;s desk. {agentFirst} will be
                      in touch {routed.responseWindow.toLowerCase()} — and while you wait, the
                      first coffee&rsquo;s on us.
                    </>
                  )}
                </p>
                <div className={s.heroCtas}>
                  <a
                    href="#coffee"
                    className="btn btn-primary btn-lg"
                    style={{ minWidth: 200 }}
                  >
                    Claim your coffee <IconArrowR />
                  </a>
                  <Link href={flavour.secondaryCta.href} className="btn btn-secondary btn-lg">
                    {flavour.secondaryCta.label}
                  </Link>
                </div>
              </div>
              <CoffeeMark />
            </div>
          </Container>
        </section>

        {/* The gift — coffee voucher */}
        <section className={s.voucherSec} id="coffee">
          <Container>
            <div className={s.voucher}>
              <span className={`${s.notch} ${s.notchTop}`} aria-hidden />
              <span className={`${s.notch} ${s.notchBottom}`} aria-hidden />

              <div className={s.voucherMain}>
                <Overline className={s.voucherOverline}>§ A little welcome</Overline>
                <h2 className={s.voucherH2}>
                  The first coffee&rsquo;s<br />on us<span className={s.voucherDot}>.</span>
                </h2>
                <p className={s.voucherBody}>
                  Pop into{" "}
                  <strong className={s.voucherBodyStrong}>Vault Espresso</strong> in Noosaville,
                  show the barista your code, and the next one&rsquo;s our shout. Consider it a
                  proper hello from the team.
                </p>
                <div className={s.voucherMeta}>
                  <div>
                    <Overline className={s.voucherMetaLabel}>Where</Overline>
                    <div className={s.voucherMetaValue}>
                      Vault Espresso<br />Gibson Rd, Noosaville
                    </div>
                  </div>
                  <div>
                    <Overline className={s.voucherMetaLabel}>When</Overline>
                    <div className={s.voucherMetaValue}>
                      Mon–Sun · 6am–2pm<br />Valid 30 days
                    </div>
                  </div>
                </div>
              </div>

              <div className={s.voucherStub}>
                <Overline className={s.voucherMetaLabel}>Show this at the counter</Overline>
                <div className={s.codeChip}>
                  <div className={s.codeChipCode}>{voucherCode ?? "ONE FLAT WHITE"}</div>
                  <div className={s.codeChipSub}>
                    {voucherCode ? "ONE FLAT WHITE" : "Check your email for your code"}
                  </div>
                </div>
                <div className={s.stubFine}>
                  We&rsquo;ve also emailed this to you, so you can find it later.
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* What happens next */}
        <section className={s.nextSec}>
          <Container>
            <div className={s.nextGrid}>
              <div>
                <Overline>§ What happens next</Overline>
                <h2 className={s.nextH2}>
                  Three easy steps, and we do the heavy lifting.
                </h2>
                {agent ? (
                  <div className={s.agentChip}>
                    {agent.headshot ? (
                      <Image
                        src={agent.headshot}
                        alt={agent.name}
                        width={52}
                        height={52}
                        className={s.agentChipAvatar}
                      />
                    ) : null}
                    <div>
                      <div className={s.agentChipName}>{agent.name}</div>
                      <div className={s.agentChipRole}>
                        {agent.role} · your point of contact
                      </div>
                    </div>
                    <a
                      href={agent.phoneHref}
                      className={`btn btn-secondary btn-sm ${s.agentChipCall}`}
                    >
                      <IconPhone /> Call now
                    </a>
                  </div>
                ) : null}
              </div>

              <div>
                {[
                  {
                    k: "01",
                    t: "We review your details",
                    d: "Your details, timeline and notes are already with " + agentFirst + ". No re-typing, no phone tree.",
                    when: "Right now",
                    showAvatar: false,
                  },
                  {
                    k: "02",
                    t: `${agentFirst} gives you a call`,
                    d: "A real conversation — what you're hoping for, what the market's doing, and how we'd approach it.",
                    when: routed.responseWindow,
                    showAvatar: true,
                  },
                  {
                    k: "03",
                    t: "We book your next step",
                    d: "At a time that suits you. You'll have a considered, no-obligation answer in hand soon after.",
                    when: "This week",
                    showAvatar: false,
                  },
                ].map((step, i) => (
                  <div
                    key={step.k}
                    className={`${s.step} ${i === 0 ? s.stepFirst : ""}`}
                  >
                    <div className={s.stepIdx}>{step.k}</div>
                    <div>
                      <h3 className={s.stepTitle}>
                        {step.t}
                        {step.showAvatar && agent?.headshot ? (
                          <Image
                            src={agent.headshot}
                            alt=""
                            width={26}
                            height={26}
                            className={s.stepTitleAvatar}
                          />
                        ) : null}
                      </h3>
                      <p className={s.stepBody}>{step.d}</p>
                    </div>
                    <div className={s.stepWhen}>{step.when}</div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* While you wait */}
        <section className={s.waitSec}>
          <Container>
            <div className={s.waitHead}>
              <div>
                <Overline>§ While you wait</Overline>
                <h2 className={s.waitH2}>A little reading for the queue.</h2>
              </div>
              <Link href="/insights" className="btn btn-tertiary" style={{ fontSize: 15 }}>
                All insights <IconArrowR />
              </Link>
            </div>
            <div className={s.waitGrid}>
              {flavour.cards.map((c) => (
                <Link key={c.href + c.title} href={c.href} className={s.waitCard}>
                  <div className={s.waitCardImg}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt="" />
                  </div>
                  <div className={s.waitCardBody}>
                    <Overline className={s.waitCardTag}>{c.tag}</Overline>
                    <h3 className={s.waitCardTitle}>{c.title}</h3>
                    <p className={s.waitCardBlurb}>{c.blurb}</p>
                    <div className={s.waitCardCta}>
                      {c.cta} <IconArrowR />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
