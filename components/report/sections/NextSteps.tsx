import type { Report } from "@/lib/report/types";
import { NextStepsActions, SecondaryActions } from "../atoms";
import s from "../report.module.css";

// 08 · Next steps — primary CTA on dark inverse, secondary actions, sign-off line.
export function NextSteps({ report }: { report: Report }) {
  const { agent, vendor, preparedOn, slug } = report;
  const names = vendor.fullName.split(" & ");
  return (
    <>
      <div className="overline">Where to from here</div>
      <h2 className={s.nextH2}>
        When you&rsquo;re ready, <em className={s.emEmber}>we&rsquo;re</em> ready.
      </h2>
      <p className={s.lede}>
        No pressure. Just perspective. When the time feels right — a call, a coffee, or a
        walk-through. Whatever suits.
      </p>

      <div className={s.nextCta}>
        <div className={`overline ${s.onDarkMuted}`}>The next step</div>
        <h3 className={s.nextCtaTitle}>Arrange a considered appraisal walk-through.</h3>
        <p className={s.nextCtaProse}>
          A 45-minute visit at your home with {agent.name}. We&rsquo;ll review what you&rsquo;ve
          read, walk the property together, and finalise the appraisal range in writing.
        </p>
        <NextStepsActions />
      </div>

      <SecondaryActions />

      <div className={s.signoff}>
        <div className={s.signoffFor}>For {names.join(" & ")}</div>
        <div className={s.signoffRef}>
          Max. · {preparedOn} · {slug}
        </div>
      </div>
    </>
  );
}
