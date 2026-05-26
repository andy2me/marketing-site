import type { Report } from "@/lib/report/types";
import s from "../report.module.css";

// 05 · Marketing — inclusions (list on mobile, 3×3 grid on desktop) + indicative budget.
export function Marketing({ report }: { report: Report }) {
  const { marketing, property } = report;
  return (
    <>
      <div className="overline">What&rsquo;s included</div>
      <h2 className={s.h2}>
        One fee. Everything that <em className={s.emEmber}>matters</em>.
      </h2>
      <p className={s.lede}>
        The marketing budget for {property.street} is costed before launch and approved by you in
        writing. No add-ons after the fact.
      </p>

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
            Built to suit a river-front three-bed at this price point. Final figure agreed before
            launch.
          </p>
        </div>
        <div className={s.num} style={{ fontSize: 26 }}>
          {marketing.indicativeBudget}
        </div>
      </div>
    </>
  );
}
