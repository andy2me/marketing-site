import type { Report, ApproachPhase } from "@/lib/report/types";
import { IconCheck } from "@/components/icons";
import { SectionIntro } from "../SectionIntro";
import { InlineCTA } from "../atoms";
import s from "../report.module.css";

function phaseBg(tone: ApproachPhase["tone"]): string {
  return tone === "linen" ? "var(--soft-linen-300)" : `var(--${tone})`;
}

const LEDE =
  "We don't list and hope. Every campaign is paced deliberately — preparing, building, and then closing — so the market meets your home at its strongest possible moment.";

// 04 · Approach — three phase cards (stacked on mobile, three-up on desktop).
export function Approach({ report }: { report: Report }) {
  const { approach } = report;
  return (
    <>
      <SectionIntro
        n="04"
        overline="How we'd run the campaign"
        title={
          <>
            Three phases. One <em className={s.emEmber}>considered</em> arc.
          </>
        }
        lede={LEDE}
        mobileLede={LEDE}
      />

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
