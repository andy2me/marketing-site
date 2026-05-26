import type { Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconPhone, IconMail, IconCalendar } from "@/components/icons";
import { ContactRow } from "../atoms";
import s from "../report.module.css";

// 06 · Your team — agent portrait, bio, contact rows (call/email/book), recent campaigns.
export function YourTeam({ report }: { report: Report }) {
  const { agent } = report;
  const tel = `tel:${agent.phone.replace(/\s+/g, "")}`;
  const mailto = `mailto:${agent.email}`;
  const first = agent.name.split(" ")[0];
  return (
    <>
      <div className="overline">Your assigned agent</div>
      <h2 className={s.h2}>
        One principal, start to <em className={s.emEmber}>settlement</em>.
      </h2>

      <div className={s.teamGrid}>
        <ImageSlot
          label={`portrait · ${agent.name.toLowerCase()} · 4:5`}
          ratio="4/5"
          className={s.teamPortrait}
        />
        <div className={s.teamBody}>
          <h3 className={s.teamName}>
            {agent.name}
            <span className={s.dot}>.</span>
          </h3>
          <div className={s.teamRole}>{agent.role}</div>
          <p className={s.teamBio}>{agent.bio}</p>

          <div className={s.contactRows}>
            <ContactRow channel="call" icon={<IconPhone />} label="Direct" value={agent.phone} actionLabel="Call" href={tel} />
            <ContactRow channel="email" icon={<IconMail />} label="Email" value={agent.email} actionLabel="Email" href={mailto} />
            <ContactRow
              channel="book"
              icon={<IconCalendar />}
              label="Diary"
              value="Mon–Fri · 8am–6pm"
              actionLabel="Book"
              href={`${mailto}?subject=${encodeURIComponent("Appraisal walk-through — " + report.property.street)}`}
            />
          </div>
        </div>
      </div>

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
    </>
  );
}
