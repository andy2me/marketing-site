// Suburb Hub building blocks (design handoff §4).
// Server components — composed on app/(marketing)/[suburb]/page.tsx.

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PropertyCard } from "@/components/property/PropertyCard";
import { IconArrowR } from "@/components/icons";
import type { ListingCard } from "@/lib/rex/types";
import type {
  SuburbAgent,
  SuburbHub,
  SuburbInsightRef,
  SuburbPillarCard,
  SuburbStat,
} from "@/lib/suburbs/types";
import s from "./SuburbHub.module.css";

// ── Hero (fern band) ─────────────────────────────────────────────────────
export function HubHero({ hub }: { hub: SuburbHub }) {
  return (
    <section className={s.hero}>
      <Container className={s.heroInner}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={s.crumbsSep}>/</span>
          <Link href="/locations">Locations</Link>
          <span className={s.crumbsSep}>/</span>
          <span aria-current="page">{hub.name}</span>
        </nav>
        <div className={s.heroGrid}>
          <div>
            <div className={`overline ${s.heroOverline}`}>
              § Suburb guide · QLD {hub.postcode}
            </div>
            <h1 className={s.heroH1}>
              {hub.name}
              <span className={s.heroPeriod}>.</span>
            </h1>
            <p className={s.heroIntro}>{hub.hero.intro}</p>
            <div className={s.heroBtns}>
              <Link
                href={`/buy?suburb=${encodeURIComponent(hub.name)}`}
                className="btn btn-primary btn-lg"
              >
                Browse {hub.name} listings <IconArrowR />
              </Link>
              <Link href="/sell#appraisal" className="btn btn-ghost-dark btn-lg">
                Request an appraisal
              </Link>
            </div>
          </div>
          <div>
            {hub.hero.image ? (
              <div className={s.heroMedia} style={{ aspectRatio: "4 / 5", borderRadius: 16, overflow: "hidden" }}>
                <img
                  src={hub.hero.image.src}
                  alt={hub.hero.image.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ) : (
              <ImageSlot
                ratio="4/5"
                label={hub.hero.imageLabel}
                className={s.heroMedia}
                style={{ borderRadius: 16 }}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ── Stats band (5fr / 7fr intro + 4-up StatModule) ───────────────────────
export function HubStats({ hub }: { hub: SuburbHub }) {
  const [pre, post] =
    hub.statsEmphasis && hub.statsHeadline.includes(hub.statsEmphasis)
      ? hub.statsHeadline.split(hub.statsEmphasis)
      : [hub.statsHeadline, ""];
  return (
    <section className={s.section}>
      <Container>
        <div className={s.intro2}>
          <div className="overline">§ 01 · The market, in numbers</div>
          <div>
            <h2 className={s.sectionH2}>
              {pre}
              {hub.statsEmphasis ? (
                <em className={s.sectionH2Em}>{hub.statsEmphasis}</em>
              ) : null}
              {post}
            </h2>
            <p className={s.statsBody}>{hub.statsBody}</p>
            <div className={s.statBlock}>
              <StatGrid stats={hub.stats} />
              <div className={s.provenance}>{hub.provenance}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function StatGrid({ stats }: { stats: SuburbStat[] }) {
  return (
    <div className={s.statGrid}>
      {stats.map((stat, i) => (
        <div key={i}>
          <div className={s.statK}>
            {stat.k}
            {stat.trend ? (
              <span
                className={`${s.statTrend} ${
                  stat.up ? s.statTrendUp : s.statTrendDown
                }`}
              >
                {stat.up ? "▲" : "▼"} {stat.trend}
              </span>
            ) : null}
          </div>
          <div className={s.statV}>{stat.v}</div>
        </div>
      ))}
    </div>
  );
}

// ── Three coloured pillar entry cards ────────────────────────────────────
// `available` is the set of pillar keys that have a registered guide. Cards for
// unregistered pillars render as a non-clickable "Coming soon" tile so the Hub
// doesn't dangle dead links.
export function HubPillars({
  pillars,
  available,
}: {
  pillars: SuburbPillarCard[];
  available: Set<string>;
}) {
  return (
    <section className={s.pillarsBand}>
      <Container>
        <div className={`${s.intro2} ${s.pillarIntro}`}>
          <div className="overline">§ 02 · Start here</div>
          <h2 className={s.sectionH2}>Three ways into the suburb.</h2>
        </div>
        <div className={s.pillarGrid}>
          {pillars.map((p) => {
            const live = available.has(p.key);
            const inner = (
              <>
                <div className={s.pillarTop}>
                  <span className={s.pillarIndex}>{p.index}</span>
                  <span className={s.pillarCount} style={{ color: p.accent }}>
                    {live ? p.count : "Coming soon"}
                  </span>
                </div>
                <div className={s.pillarBottom}>
                  <h3 className={s.pillarTitle}>
                    {p.title}
                    <span className={s.pillarLine} style={{ color: p.accent }}>
                      {p.line}
                    </span>
                  </h3>
                  <p className={s.pillarBody}>{p.body}</p>
                  <span className={s.pillarLink} style={{ color: p.accent }}>
                    {live ? (
                      <>
                        Read the guide <IconArrowR />
                      </>
                    ) : (
                      <>In the works</>
                    )}
                  </span>
                </div>
              </>
            );
            return live ? (
              <Link
                key={p.key}
                href={p.href}
                className={s.pillarCard}
                style={{ background: p.color }}
              >
                {inner}
              </Link>
            ) : (
              <div
                key={p.key}
                className={`${s.pillarCard} ${s.pillarCardDisabled}`}
                style={{ background: p.color }}
                aria-disabled="true"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

// ── Live-listings strip filtered to the suburb ───────────────────────────
export function HubListings({
  heading,
  items,
  joinHref,
}: {
  heading: string;
  items: ListingCard[];
  joinHref: string;
}) {
  return (
    <section className={s.listings}>
      <Container>
        <div className={s.stripHead}>
          <div>
            <div className="overline">§ 03 · On the market</div>
            <h2 className={s.stripH2}>{heading}</h2>
          </div>
          <Link href="/buy" className="btn btn-secondary">
            Browse all listings <IconArrowR />
          </Link>
        </div>
        {items.length === 0 ? (
          <div className={s.listingsEmpty}>
            <p>No current listings in this patch right now.</p>
            <Link href={joinHref} className="btn btn-primary">
              Join the buyer list <IconArrowR />
            </Link>
          </div>
        ) : (
          <div className={s.listingsGrid}>
            {items.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

// ── Journal row (3 insight cards filtered to the suburb) ─────────────────
export function HubInsights({
  suburb,
  items,
}: {
  suburb: string;
  items: SuburbInsightRef[];
}) {
  return (
    <section className={s.insights}>
      <Container>
        <div className={s.stripHead}>
          <div>
            <div className="overline">§ 04 · From the journal</div>
            <h2 className={s.stripH2}>Latest on {suburb}.</h2>
          </div>
          <Link href="/insights" className="btn btn-tertiary">
            All {suburb} insights <IconArrowR />
          </Link>
        </div>
        <div className={s.insightsGrid}>
          {items.map((a) => (
            <Link
              key={a.slug}
              href={`/insights/${a.slug}`}
              className={s.insightCard}
            >
              <ImageSlot
                ratio="5/4"
                className={s.insightMedia}
                style={{ borderRadius: 12 }}
              />
              <div className={s.insightBlock}>
                <div className={`overline ${s.insightCat}`}>{a.category}</div>
                <h3 className={s.insightTitle}>{a.title}</h3>
                <div className={s.insightMeta}>
                  {a.author} · {a.date} · {a.read}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── Mulberry agent band (the §9.3 author-authority block) ────────────────
export function HubAgent({ agent, suburb }: { agent: SuburbAgent; suburb: string }) {
  return (
    <section className={s.agent}>
      <Container>
        <div className={s.agentGrid}>
          <ImageSlot
            ratio="4/5"
            label={`${agent.name} · on Gympie Terrace · 4:5`}
            className={s.agentMedia}
            style={{ borderRadius: 16 }}
          />
          <div>
            <div className={`overline ${s.agentOverline}`}>
              § 05 · Who owns this patch
            </div>
            <h2 className={s.agentH2}>
              {agent.name} knows
              <br />
              every <em className={s.agentH2Em}>street</em>.
            </h2>
            <p className={s.agentBio}>{agent.bio}</p>
            <div className={s.agentStats}>
              {agent.stats.map((stat) => (
                <div key={stat.v}>
                  <div className={s.agentStatK}>{stat.k}</div>
                  <div className={s.agentStatV}>{stat.v}</div>
                </div>
              ))}
            </div>
            <div className={s.agentBtns}>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Talk to {agent.name.split(" ")[0]} <IconArrowR />
              </Link>
              <Link href={agent.href} className="btn btn-ghost-dark btn-lg">
                View profile
              </Link>
            </div>
            <span className="sr-only">{suburb}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ── Closing CTA (dark inverse) ───────────────────────────────────────────
export function HubClosing({ suburb }: { suburb: string }) {
  return (
    <section className={s.closing}>
      <Container>
        <div className={s.closingGrid}>
          <div>
            <div className={`overline ${s.closingOverline}`}>
              § 06 · When you&rsquo;re ready
            </div>
            <h2 className={s.closingH2}>
              Thinking about{" "}
              <em className={s.closingH2Em}>{suburb}</em>?
            </h2>
          </div>
          <div>
            <p className={s.closingBody}>
              Whether you&rsquo;re buying your first riverside unit or selling the family
              Queenslander, start with a conversation. No pressure. Just clarity.
            </p>
            <div className={s.closingBtns}>
              <Link href="/sell#appraisal" className="btn btn-primary btn-lg">
                Request an appraisal <IconArrowR />
              </Link>
              <Link href="/buy" className="btn btn-ghost-dark btn-lg">
                Browse {suburb} listings
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
