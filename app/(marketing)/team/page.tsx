import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconArrowUR } from "@/components/icons";
import { getSiteSettings } from "@/lib/wp/mock";
import s from "./team.module.css";

export const metadata: Metadata = {
  title: "Team — Agents & Leadership",
  description:
    "Eight people, four agents, four operators. Meet the Max Property team — deliberately small, so every campaign is owned by a person you can reach.",
  alternates: { canonical: "/team" },
};

const MANIFESTO = [
  { k: "01", w: "No juniors learning on your campaign.", body: "Every listing is led end-to-end by a principal or senior agent. Always." },
  { k: "02", w: "No handoffs after the appraisal.", body: "The agent you meet is the one who answers the phone at 9pm on settlement eve." },
  { k: "03", w: "No fee creep, no surprise add-ons.", body: "Every dollar is costed upfront and approved by you before we spend it." },
];
const LEADERS = [
  { name: "James Whitlam", role: "Principal · Founder", patches: ["Noosa Heads", "Sunshine Beach"], years: "14", sales: "$284M", quote: "You can't shortcut trust. So we don't try.", color: "var(--mulberry)" },
  { name: "Eliza Hart", role: "Director · Sales", patches: ["Noosaville", "Doonan"], years: "11", sales: "$176M", quote: "The best campaigns feel inevitable in hindsight.", color: "var(--fern)" },
  { name: "Mae Robinson", role: "Senior Agent", patches: ["Tewantin", "Peregian Beach"], years: "8", sales: "$94M", quote: "Most homes only sell once. I take that personally.", color: "var(--ember)" },
];
const SUPPORT = [
  { name: "Tom Reilly", role: "Operations Manager", init: "TR", color: "var(--clay)" },
  { name: "Iris Bennett", role: "Campaign Director", init: "IB", color: "var(--mulberry)" },
  { name: "Daniel Chen", role: "Marketing Lead", init: "DC", color: "var(--fern)" },
  { name: "Olive Maddox", role: "Vendor Liaison", init: "OM", color: "var(--ember)" },
];
const CULTURE_STATS = [
  { k: "Avg tenure", v: "6.4 yrs" },
  { k: "Glassdoor", v: "4.8" },
  { k: "Local hires", v: "100%" },
];
const ROLES = [
  { title: "Sales Associate", patch: "Noosaville · Tewantin", type: "Full-time" },
  { title: "Campaign Coordinator", patch: "Office · Noosa Heads", type: "Full-time" },
  { title: "Stylist (contract)", patch: "All patches", type: "Part-time" },
];

export default async function TeamPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header current="Team" nav={settings.nav} />

      <main>
        {/* Hero */}
        <section className={s.hero}>
          <Container>
            <div className={`${s.split} ${s.heroGrid}`}>
              <div>
                <div className="overline">§ The people</div>
                <h1 className={s.heroH1}>
                  Small team,
                  <br />
                  <em style={{ fontStyle: "italic", color: "var(--color-action)" }}>big</em> patches.
                </h1>
              </div>
              <p className={s.heroIntro}>
                Eight people. Four agents, four operators. We&rsquo;re deliberately small so every
                campaign is owned by a person who can be reached on a Sunday — and so the same
                person who pitches you also signs the contract.
              </p>
            </div>
          </Container>
        </section>

        {/* Manifesto */}
        <section className={s.manifesto}>
          <Container>
            <div className={s.manList}>
              {MANIFESTO.map((it) => (
                <div key={it.k} className={s.manRow}>
                  <div className={s.manLabel}>Promise {it.k}</div>
                  <h3 className={s.manStatement}>{it.w}</h3>
                  <p className={s.manBody}>{it.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Leadership */}
        <section className={s.leadership}>
          <Container>
            <div className={s.leadHead}>
              <h2 className={s.leadTitle}>Senior agents.</h2>
              <div className={s.leadMeta}>3 principals · 1 senior agent</div>
            </div>
            <div className={s.leadGrid}>
              {LEADERS.map((p) => (
                <article key={p.name} className={s.leadCard}>
                  <div className={s.leadPortrait} style={{ background: p.color }}>
                    <blockquote className={s.leadQuote}>“{p.quote}”</blockquote>
                  </div>
                  <div className={s.leadBody}>
                    <div className={s.leadName}>{p.name}</div>
                    <div className={s.leadRole}>{p.role}</div>
                    <div className={s.leadStats}>
                      <div>
                        <div className={s.statK}>Years</div>
                        <div className={s.statV}>{p.years}</div>
                      </div>
                      <div>
                        <div className={s.statK}>Sold (lifetime)</div>
                        <div className={s.statV}>{p.sales}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <div className="overline" style={{ fontSize: 11 }}>
                        Patches
                      </div>
                      <div className={s.patches}>
                        {p.patches.map((x) => (
                          <span key={x} className={s.patch}>
                            {x}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={s.leadBtns}>
                      <Button href="/team" variant="secondary" size="sm">
                        Profile
                      </Button>
                      <Button href="/contact?enquiry=general" variant="primary" size="sm">
                        Get in touch
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* Support */}
        <section className={s.support}>
          <Container>
            <div className={s.split} style={{ marginBottom: 48 }}>
              <div>
                <div className="overline">§ Behind the scenes</div>
                <h2 className={s.leadTitle} style={{ marginTop: 24 }}>
                  The operators.
                </h2>
              </div>
              <p className={s.heroIntro} style={{ alignSelf: "end" }}>
                Behind every campaign there&rsquo;s a marketing lead, a stylist&rsquo;s brief, a
                coordinator booking the photographer at golden hour, and someone calling you back
                inside 30 minutes. These are them.
              </p>
            </div>
            <div className={s.supportGrid}>
              {SUPPORT.map((t) => (
                <div key={t.name} className={s.supportCard}>
                  <div className={s.avatar} style={{ background: t.color }}>
                    {t.init}
                  </div>
                  <div className={s.supName}>{t.name}</div>
                  <div className={s.supRole}>{t.role}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Culture */}
        <section className={s.culture}>
          <Container>
            <div className={s.cultureGrid}>
              <div>
                <div className="overline" style={{ color: "rgba(244,237,229,.5)" }}>
                  § Culture
                </div>
                <blockquote className={s.cultureQuote}>
                  We hire for <em style={{ fontStyle: "italic", color: "var(--sunrise)" }}>character</em>{" "}
                  first, sales record second. The first is harder to teach.
                </blockquote>
                <div className={s.cultureStats}>
                  {CULTURE_STATS.map((x) => (
                    <div key={x.k}>
                      <div className={s.cStatK}>{x.k}</div>
                      <div className={s.cStatV}>{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <ImageSlot ratio="4/5" label="team portrait · 4:5" className={s.cultureImg} />
            </div>
          </Container>
        </section>

        {/* Careers */}
        <section className={s.careers}>
          <Container>
            <div className={s.split}>
              <div>
                <div className="overline">§ Open roles</div>
                <h2 className={s.careersH2}>
                  Want a desk by
                  <br />
                  the river?
                </h2>
                <p className={s.careersIntro}>
                  We hire infrequently and carefully. If something below is yours, send a note —
                  even if you don&rsquo;t tick every box.
                </p>
              </div>
              <div>
                {ROLES.map((r) => (
                  <a key={r.title} href="/contact?enquiry=careers" className={s.roleRow}>
                    <div>
                      <h3 className={s.roleTitle}>{r.title}</h3>
                      <div className={s.roleMeta}>
                        <span>{r.patch}</span>
                        <span>·</span>
                        <span>{r.type}</span>
                      </div>
                    </div>
                    <span className={s.roleArrow}>
                      <IconArrowUR />
                    </span>
                  </a>
                ))}
                <div className={s.careersNote}>
                  Nothing fits? <a href="/contact?enquiry=careers">Send a speculative note</a> — we
                  keep them on file.
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
