import type { Report } from "@/lib/report/types";
import { SectionIntro } from "../SectionIntro";
import s from "../report.module.css";

// 05 · Marketing — inclusions (list on mobile, 3×3 grid on desktop) + indicative budget band.
export function Marketing({ report }: { report: Report }) {
  const { marketing, property } = report;
  const lede = `The marketing budget for ${property.street} is costed before launch and approved by you in writing. No add-ons after the fact.`;
  return (
    <>
      <SectionIntro
        n="05"
        overline="What's included"
        title={
          <>
            One fee. Everything that <em className={s.emEmber}>matters</em>.
          </>
        }
        lede={lede}
        mobileLede={lede}
      />

      <div className={s.inclusions}>
        {marketing.inclusions.map((it, i) => (
          <div key={i} className={s.inclusion}>
            <div className={`overline ${s.inclusionCat}`}>{it.c}</div>
            <div className={s.inclusionVal}>{it.v}</div>
          </div>
        ))}
      </div>

      <div className={s.budgetBand}>
        <div>
          <div className="overline">Indicative marketing investment</div>
          <p className={s.budgetNote}>
            Built to suit a property of this description. Final figure agreed before launch — no
            add-ons after the fact.
          </p>
        </div>
        <div className={`${s.num} ${s.budgetNum}`}>{marketing.indicativeBudget}</div>
      </div>
    </>
  );
}
