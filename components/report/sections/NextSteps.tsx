import type { Report } from "@/lib/report/types";
import { SectionIntro } from "../SectionIntro";
import { NextStepsActions, SecondaryActions } from "../atoms";
import s from "../report.module.css";

const LEDE =
  "No pressure. Just perspective. When the time feels right — a call, a coffee, or a walk-through. Whatever suits.";

// 08 · Next steps — primary CTA on dark inverse, secondary actions, sign-off line.
export function NextSteps({ report }: { report: Report }) {
  const { agent, vendor, preparedOn, slug } = report;
  const names = vendor.fullName.split(" & ");
  return (
    <>
      <SectionIntro
        n="08"
        overline="Where to from here"
        title={
          <>
            When you&rsquo;re ready, <em className={s.emEmber}>we&rsquo;re</em> ready.
          </>
        }
        lede={LEDE}
        mobileLede={LEDE}
        big
      />

      <div className={s.nextCta}>
        <div>
          <div className={`overline ${s.onDarkMuted}`}>The next step</div>
          <h3 className={s.nextCtaTitle}>
            Arrange a considered appraisal walk-through.
          </h3>
          <p className={s.nextCtaProse}>
            A 45-minute visit at your home with {agent.name}. We&rsquo;ll review what you&rsquo;ve
            read, walk the property together, and finalise the appraisal range in writing.
          </p>
        </div>
        <div className={s.nextCtaActions}>
          <NextStepsActions />
        </div>
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
