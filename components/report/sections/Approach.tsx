import type { Report, ApproachPhase } from "@/lib/report/types";
import { IconCheck } from "@/components/icons";
import { InlineCTA } from "../atoms";
import s from "../report.module.css";

function phaseBg(tone: ApproachPhase["tone"]): string {
  return tone === "linen" ? "var(--soft-linen-300)" : `var(--${tone})`;
}

// 04 · Approach to market — three phase cards (Preparing → Early momentum → Maximum atmosphere).
export function Approach({ report }: { report: Report }) {
  const { approach } = report;
  return (
    <>
      <div className="overline">How we&rsquo;d run the campaign</div>
      <h2 className={s.h2}>
        Three phases. One <em className={s.emEmber}>considered</em> arc.
      </h2>
      <p className={s.lede}>
        We don&rsquo;t list and hope. Every campaign is paced deliberately — preparing, building,
        and then closing — so the market meets your home at its strongest possible moment.
      </p>

      <div className={s.phaseList}>
        {approach.map((p) => {
          const onDark = p.tone !== "linen";
          return (
            <article
              key={p.n}
              className={`${s.phaseCard} ${onDark ? s.phaseDark : s.phaseLight}`}
              style={{ background: phaseBg(p.tone) }}
            >
              <div className={s.phaseMeta}>
                <span>Phase {p.n}</span>
                <span>{p.weeks}</span>
              </div>
              <div className={s.phaseName}>
                {p.phase}
                <span className={s.phaseDot}>.</span>
              </div>
              <p className={s.phaseSummary}>{p.summary}</p>
              <p className={s.phaseDetail}>{p.detail}</p>
              <ul className={s.phaseItems}>
                {p.items.map((it, j) => (
                  <li key={j} className={s.phaseItem}>
                    <span className={s.phaseCheck} aria-hidden>
                      <IconCheck />
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className={s.block}>
        <InlineCTA
          section="approach"
          kind="ember"
          sublabel="Bring this to life"
          label={`Walk through the approach with ${report.agent.name.split(" ")[0]}`}
        />
      </div>
    </>
  );
}
