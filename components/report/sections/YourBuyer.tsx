import type { Report } from "@/lib/report/types";
import { toneVar } from "@/lib/report/types";
import { SegmentBar } from "../Charts";
import { SectionIntro } from "../SectionIntro";
import s from "../report.module.css";

// 03 · Your buyer — stacked segment bar, segment cards (2×2 on desktop), dark database band.
export function YourBuyer({ report }: { report: Report }) {
  const { buyer } = report;
  const segments = buyer.segments.map((seg) => ({
    pct: seg.pct,
    tone: toneVar(seg.tone),
    label: seg.label,
  }));
  return (
    <>
      <SectionIntro
        n="03"
        overline="Buyer intelligence"
        title={
          <>
            Your most likely buyer is <em className={s.emEmber}>not</em> a stranger.
          </>
        }
        lede={buyer.headline}
        mobileLede={buyer.headline}
      />

      <div className={s.block}>
        <SegmentBar segments={segments} height={22} />
        <div className={s.segCaption}>
          <span>BUYER MIX · LAST 12 MONTHS</span>
          <span>{buyer.sampleNote}</span>
        </div>
      </div>

      <div className={s.segCards}>
        {buyer.segments.map((seg, i) => (
          <article key={i} className={s.segCard}>
            <div className={s.segPct} style={{ background: toneVar(seg.tone) }}>
              <span className={`${s.num} ${s.onDark} ${s.segNum}`}>
                {seg.pct}
                <span className={s.segNumUnit}>%</span>
              </span>
            </div>
            <div>
              <div className={s.segLabel}>{seg.label}</div>
              <p className={s.segDetail}>{seg.detail}</p>
            </div>
          </article>
        ))}
      </div>

      <div className={`${s.card} ${s.bandInk}`}>
        <div className={`overline ${s.onDarkMuted}`}>Inside our database, right now</div>
        <div className={s.signals}>
          {buyer.signals.map((sig, i) => (
            <div key={i} className={s.signal}>
              <span className={`${s.num} ${s.signalNum} ${s.signalNumSize}`}>{sig.k}</span>
              <span className={s.signalText}>{sig.v}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
