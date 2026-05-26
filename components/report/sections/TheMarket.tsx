import type { Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconBed, IconBath, IconCar, IconTrend } from "@/components/icons";
import { MedianPriceChart, DomBarChart, SearchSparkline } from "../Charts";
import { InlineCTA } from "../atoms";
import s from "../report.module.css";

// 02 · The market — median + chart, DOM bars, buyer-demand band, comps, indicative range, CTA.
export function TheMarket({ report }: { report: Report }) {
  const { market, comps } = report;
  return (
    <>
      <div className="overline">
        {market.suburb} · {market.segment}
      </div>
      <h2 className={s.h2}>
        A market moving in <em className={s.emEmber}>your</em> favour.
      </h2>

      {/* Headline median + 24-month line */}
      <div className={s.card}>
        <div className="overline">Median sale price · 24 months</div>
        <div className={s.numRow}>
          <span className={s.num} style={{ fontSize: 44 }}>
            {market.median}
          </span>
          <span className={`${s.chip} ${s.chipUp}`}>
            <IconTrend />
            <span>{market.medianChange}</span>
          </span>
        </div>
        <div className={s.chartWrap}>
          <MedianPriceChart series={market.medianSeries} />
        </div>
      </div>

      {/* Days on market + bars */}
      <div className={s.card}>
        <div className="overline">Median days on market</div>
        <div className={s.numRow}>
          <span className={s.num} style={{ fontSize: 36 }}>
            {market.dom}
            <span className={s.numUnit}> days</span>
          </span>
          <span className={`${s.chip} ${s.chipUp}`}>{market.domChange}</span>
        </div>
        <div className={s.chartWrap}>
          <DomBarChart series={market.domSeries} />
        </div>
      </div>

      {/* Buyer demand band */}
      <div className={`${s.card} ${s.bandMulberry}`}>
        <div className={`overline ${s.onDarkMuted}`}>Buyer demand · enquiries / month</div>
        <div className={s.numRow}>
          <span className={`${s.num} ${s.onDark}`} style={{ fontSize: 36 }}>
            {market.searchVolume.toLocaleString()}
          </span>
          <span className={s.bandMeta}>{market.searchChange}</span>
        </div>
        <div className={s.chartWrap}>
          <SearchSparkline series={market.searchSeries} accent="var(--sunrise)" />
        </div>
        <div className={s.bandStats}>
          <div>
            <div className={s.bandStatLabel}>Active listings</div>
            <div className={`${s.num} ${s.onDark}`} style={{ fontSize: 22 }}>
              {market.inventory}
            </div>
          </div>
          <div>
            <div className={s.bandStatLabel}>Months of supply</div>
            <div className={`${s.num} ${s.onDark}`} style={{ fontSize: 22 }}>
              {market.monthsSupply.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Comparable sales */}
      <div className={s.block}>
        <div className="overline">Recent comparable sales</div>
        <h3 className={s.h3}>Four homes against which yours is positioned.</h3>
        <div className={s.compList}>
          {comps.map((c, i) => (
            <article key={i} className={s.comp}>
              <ImageSlot label="comp" ratio="1/1" className={s.compImg} />
              <div className={s.compBody}>
                <div className={s.compHead}>
                  <div>
                    <div className={s.compAddr}>{c.addr}</div>
                    <div className={s.compSuburb}>{c.suburb}</div>
                  </div>
                  <div className={s.compPrice}>{c.price}</div>
                </div>
                <div className={s.compMeta}>
                  <span className={s.compMetaItem}>
                    <IconBed size={14} />
                    {c.beds}
                  </span>
                  <span className={s.compMetaItem}>
                    <IconBath size={14} />
                    {c.baths}
                  </span>
                  <span className={s.compMetaItem}>
                    <IconCar size={14} />
                    {c.cars}
                  </span>
                  <span className={s.compMetaDays}>
                    {c.days}d · {c.sold}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Indicative range */}
      <div className={`${s.card} ${s.bandFern}`}>
        <div className={`overline ${s.onDarkMuted}`}>Indicative appraisal range</div>
        <div className={s.rangeRow}>
          <span className={`${s.num} ${s.onDark}`} style={{ fontSize: 32 }}>
            {market.indicativeRangeLow}
          </span>
          <span className={s.rangeDash}>&mdash;</span>
          <span className={`${s.num} ${s.onDark}`} style={{ fontSize: 32 }}>
            {market.indicativeRangeHigh}
          </span>
        </div>
        <p className={s.bandProse}>
          A measured guide based on the four comparable sales above, current inventory, and
          Noosaville&rsquo;s recent trajectory. We&rsquo;d refine this together at a walk-through.
        </p>
      </div>

      <div className={s.block}>
        <InlineCTA
          section="market"
          kind="ember"
          sublabel="A natural pause"
          label="Discuss your property's positioning"
        />
      </div>
    </>
  );
}
