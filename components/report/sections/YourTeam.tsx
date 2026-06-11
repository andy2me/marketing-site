import type { Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconPhone, IconMail, IconCalendar } from "@/components/icons";
import { SectionIntro } from "../SectionIntro";
import { ContactRow } from "../atoms";
import s from "../report.module.css";

// 06 · Your team — agent portrait + bio + contact rows (3/5 split on desktop), recent campaigns.
export function YourTeam({ report }: { report: Report }) {
  const { agent } = report;
  const tel = `tel:${agent.phone.replace(/\s+/g, "")}`;
  const mailto = `mailto:${agent.email}`;
  const bookHref = `${mailto}?subject=${encodeURIComponent("Appraisal walk-through — " + report.property.street)}`;
  const first = agent.name.split(" ")[0];

  const contacts = (diaryValue: string) => (
    <div className={s.contactRows}>
      <ContactRow channel="call" icon={<IconPhone />} label="Direct" value={agent.phone} actionLabel="Call" href={tel} />
      <ContactRow channel="email" icon={<IconMail />} label="Email" value={agent.email} actionLabel="Email" href={mailto} />
      <ContactRow channel="book" icon={<IconCalendar />} label="Diary" value={diaryValue} actionLabel="Book" href={bookHref} />
    </div>
  );

  return (
    <>
      <SectionIntro
        n="06"
        overline="Your assigned agent"
        title={
          <>
            One principal, start to <em className={s.emEmber}>settlement</em>.
          </>
        }
        lede="No handoffs to juniors mid-campaign. Your agent is your point of contact from appraisal through to the handover of keys."
      />

      {/* ── Mobile ───────────────────────────────────────────── */}
      <div className={s.mOnly}>
        <div className={s.teamGrid}>
          <ImageSlot label={`portrait · ${agent.name.toLowerCase()} · 4:5`} ratio="4/5" className={s.teamPortrait} />
          <div className={s.teamBodyTop}>
            <h3 className={s.teamName}>
              {agent.name}
              <span className={s.dot}>.</span>
            </h3>
            <div className={s.teamRole}>{agent.role}</div>
            <p className={s.teamBio}>{agent.bio}</p>
            {contacts("Mon–Fri · 8am–6pm")}
          </div>
        </div>

        {agent.recent.length > 0 ? (
          <div className={s.block}>
            <div className="overline">{first}&rsquo;s recent campaigns</div>
            <div className={s.recentList}>
              {agent.recent.map((r, i) => (
                <div key={i} className={s.recent}>
                  <div>
                    <div className={s.recentAddr}>{r.addr}</div>
                    <div className={s.recentMeta}>SOLD · {r.days} DAYS</div>
                  </div>
                  <div className={s.recentPrice}>{r.price}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Desktop ──────────────────────────────────────────── */}
      <div className={s.dOnly}>
        <div className={s.dTeamSplit}>
          <ImageSlot label={`portrait · ${agent.name.toLowerCase()} · 4/5`} ratio="4/5" className={s.teamPortrait} />
          <div>
            <h3 className={s.dTeamName}>
              {agent.name}
              <span className={s.dot}>.</span>
            </h3>
            <div className={s.dTeamRole}>{agent.role}</div>
            <p className={s.dTeamBio}>{agent.bio}</p>
            {contacts("Mon–Fri · 8am–6pm · open weekends by arrangement")}
          </div>
        </div>

        {agent.recent.length > 0 ? (
          <div className={s.dBlock}>
            <div className="overline">{first}&rsquo;s recent campaigns</div>
            <div className={s.dRecentGrid}>
              {agent.recent.map((r, i) => (
                <div key={i} className={s.dRecentCard}>
                  <div className={s.dRecentPrice}>{r.price}</div>
                  <div className={s.dRecentAddr}>{r.addr}</div>
                  <div className={s.dRecentFoot}>
                    <span>SOLD</span>
                    <span>{r.days} days</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
