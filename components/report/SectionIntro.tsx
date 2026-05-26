import type { ReactNode } from "react";
import s from "./report.module.css";

// Responsive section intro. Mobile (sections.jsx): overline + h2 (+ optional lede).
// Desktop (desktop-sections.jsx DIntro): 5/7 grid — "§ N · {overline}" + "Section N of 08"
// on the left, h2 + lede on the right.
export function SectionIntro({
  n,
  overline,
  title,
  lede,
  mobileLede,
  big = false,
}: {
  n: string;
  overline: string;
  title: ReactNode;
  /** Desktop lede (right column). */
  lede?: string;
  /** Mobile lede under the h2 (omit where the mobile artboard shows none). */
  mobileLede?: string;
  /** Larger mobile h2 (Next steps). */
  big?: boolean;
}) {
  return (
    <div className={s.intro}>
      <div className={s.introHead}>
        <div className="overline">
          <span className={s.introNum}>§ {n} · </span>
          {overline}
        </div>
        <div className={s.introMeta}>Section {n} of 08</div>
      </div>
      <div className={s.introMain}>
        <h2 className={big ? s.h2Big : s.h2}>{title}</h2>
        {lede ? <p className={`${s.lede} ${s.dOnly}`}>{lede}</p> : null}
        {mobileLede ? <p className={`${s.lede} ${s.mOnly}`}>{mobileLede}</p> : null}
      </div>
    </div>
  );
}
