import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { IconArrowUR } from "@/components/icons";
import { getSiteSettings } from "@/lib/wp/mock";
import { ContactForm } from "./ContactForm";
import s from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Max Property. Tell us what you're chasing and a real person will be back to you inside one business day.",
  alternates: { canonical: "/contact" },
};

const FAQS = [
  { q: "How quickly do you reply to enquiries?", a: "Inside one business day, and usually a lot sooner. Appraisal requests are routed straight to a principal." },
  { q: "Do you take after-hours calls?", a: "Yes — once we're working with you. The number on your campaign reaches your agent directly, 7am–9pm, every day." },
  { q: "Can I drop in without an appointment?", a: "Of course. The office is on Hastings Street and we keep the kettle on. For appraisals we'd still ask you to book — so the right agent is in." },
  { q: "Do you sell outside the Noosa shire?", a: "Selectively. We'd rather refer you to someone better-placed than overpromise — ask us, we'll be honest." },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header current="Contact" nav={settings.nav} />

      <main>
        {/* Top */}
        <section className={s.top}>
          <Container>
            <div className={`${s.split} ${s.topGrid}`}>
              <div>
                <div className="overline">§ Contact</div>
                <h1 className={s.topH1}>
                  Start a
                  <br />
                  <em style={{ fontStyle: "italic", color: "var(--color-action)" }}>conversation</em>.
                </h1>
              </div>
              <div>
                <p className={s.topIntro}>
                  Tell us what you&rsquo;re chasing and a real person will be back to you inside one
                  business day. For anything urgent, the office phone is the fastest path.
                </p>
                <div className={s.topContacts}>
                  <a href="tel:0754471000" className={s.topPhone}>
                    <strong>07 5447 1000</strong>
                    <span>· Mon–Fri 9–5</span>
                  </a>
                  <a href="mailto:hello@maxproperty.au" className={s.topEmail}>
                    hello@maxproperty.au
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Conditional form — reads ?enquiry= */}
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>

        {/* Office + schematic map */}
        <section className={s.officeSec}>
          <Container>
            <div className={s.officeGrid}>
              <div className={s.officeCard}>
                <div>
                  <div className="overline" style={{ color: "rgba(244,237,229,.5)" }}>
                    § Office
                  </div>
                  <h2 className={s.officeH2}>
                    Hastings Street<span style={{ color: "var(--sunrise)" }}>.</span>
                  </h2>
                  <div className={s.officeAddr}>
                    123 Hastings Street
                    <br />
                    Noosa Heads QLD 4567
                    <br />
                    Australia
                  </div>
                </div>
                <div className={s.officeStats}>
                  <div>
                    <div className={s.officeStatLabel}>Phone</div>
                    <div className={s.officeStatValue}>07 5447 1000</div>
                  </div>
                  <div>
                    <div className={s.officeStatLabel}>Email</div>
                    <div className={s.officeStatValue} style={{ color: "var(--sunrise)" }}>
                      hello@maxproperty.au
                    </div>
                  </div>
                  <div>
                    <div className={s.officeStatLabel}>Hours</div>
                    <div className={s.officeStatValue}>Mon–Fri · 9–5</div>
                  </div>
                  <div>
                    <div className={s.officeStatLabel}>Parking</div>
                    <div className={s.officeStatValue}>2-hour street out front</div>
                  </div>
                </div>
              </div>

              {/* TODO(§8): MapLibre with the office coords. Editorial schematic for now. */}
              <div className={s.mapWrap}>
                <svg className={s.mapSvg} viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" aria-hidden>
                  <defs>
                    <pattern id="ct-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                      <circle cx="7" cy="7" r="0.8" fill="#C6C0BC" opacity="0.55" />
                    </pattern>
                  </defs>
                  <rect width="600" height="420" fill="url(#ct-dots)" />
                  <path d="M 420,0 L 600,0 L 600,420 L 420,420 Z" fill="#1A120C" opacity="0.045" />
                  <path d="M 420,0 Q 410,140 470,220 Q 510,310 420,420" stroke="#564C44" strokeWidth="1.5" fill="none" opacity="0.5" strokeDasharray="2 4" />
                  <path d="M 0,200 L 600,180" stroke="#564C44" strokeWidth="2" opacity="0.35" />
                  <path d="M 0,260 L 600,250" stroke="#564C44" strokeWidth="1.5" opacity="0.25" />
                  <path d="M 200,0 L 220,420" stroke="#564C44" strokeWidth="1.5" opacity="0.25" />
                  <path d="M 340,0 L 360,420" stroke="#564C44" strokeWidth="1.5" opacity="0.25" />
                </svg>
                <div className={s.mapPin}>
                  <div className={s.mapPinCard}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Max. Property</div>
                    <div className={s.mapPinSub}>123 Hastings St</div>
                  </div>
                  <div className={s.mapPinDot} />
                </div>
                <div className={s.mapBtns}>
                  <a
                    href="https://maps.google.com/?q=123+Hastings+Street+Noosa+Heads"
                    className="btn btn-sm"
                    style={{
                      background: "var(--color-bg-surface)",
                      border: "1px solid var(--color-border-strong)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    Open in Maps <IconArrowUR />
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className={s.faqSec}>
          <Container>
            <div className={s.split}>
              <div>
                <div className="overline">§ Before you write</div>
                <h2 style={{ marginTop: 24, fontSize: "clamp(36px, 3.6vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.015em", color: "var(--color-text-strong)" }}>
                  Quick answers to common questions.
                </h2>
              </div>
              <FaqAccordion items={FAQS} />
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
