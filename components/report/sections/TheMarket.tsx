import Link from "next/link";
import type { Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconBed, IconBath, IconCar, IconTrend, IconArrowR } from "@/components/icons";
import { MedianPriceChart, DomBarChart, SearchSparkline } from "../Charts";
import { SectionIntro } from "../SectionIntro";
import { InlineCTA } from "../atoms";
import s from "../report.module.css";

// 02 · The market. Mobile = stacked cards; desktop = side-by-side cards, 4-stat demand band,
// 4-up image-top comps, full-width fern range card.
export function TheMarket({ report }: { report: Report }) {
  const { market, comps } = report;
  const teamHref = `/property/report/${report.slug}/your-team`;
  return (
    <>
      <SectionIntro
        n="02"
        overline={`${market.suburb} · ${market.segment}`}
        title={
          <>
            A market moving in <em className={s.emEmber}>your</em> favour.
          </>
        }
        lede="The data below sits behind every appraisal we write. Updated weekly from realestate.com.au, CoreLogic and our own database."
      />

      {/* ── Mobile ───────────────────────────────────────────── */}
      <div className={s.mOnly}>
        <div className={s.card}>
          <div className="overline">Median sale price · 24 months</div>
          <div className={s.numRow}>
            <span className={s.num} style={{ fontSize: 44 }}>{market.median}</span>
            <span className={`${s.chip} ${s.chipUp}`}>
              <IconTrend />
              <span>{market.medianChange}</span>
            </span>
          </div>
          <div className={s.chartWrap}>
            <MedianPriceChart series={market.medianSeries} gradientId="med-m" />
          </div>
        </div>

        <div className={s.card}>
          <div className="overline">Median days on market</div>
          <div className={s.numRow}>
            <span className={s.num} style={{ fontSize: 36 }}>
              {market.dom}
              <span className={s.numUnit} style={{ fontSize: 18 }}> days</span>
            </span>
            <span className={`${s.chip} ${s.chipUp}`}>{market.domChange}</span>
          </div>
          <div className={s.chartWrap}>
            <DomBarChart series={market.domSeries} />
          </div>
        </div>

        <div className={`${s.card} ${s.bandMulberry}`}>
          <div className={`overline ${s.onDarkMuted}`}>Buyer demand · enquiries / month</div>
          <div className={s.numRow}>
            <span className={`${s.num} ${s.onDark}`} style={{ fontSize: 36 }}>
              {market.searchVolume.toLocaleString()}
            </span>
            <span className={s.bandMeta}>{market.searchChange}</span>
          </div>
          <div className={s.chartWrap}>
            <SearchSparkline series={market.searchSeries} accent="var(--sunrise)" gradientId="srch-m" />
          </div>
          <div className={s.bandStats}>
            <div>
              <div className={s.bandStatLabel}>Active listings</div>
              <div className={`${s.num} ${s.onDark}`} style={{ fontSize: 22 }}>{market.inventory}</div>
            </div>
            <div>
              <div className={s.bandStatLabel}>Months of supply</div>
              <div className={`${s.num} ${s.onDark}`} style={{ fontSize: 22 }}>{market.monthsSupply.toFixed(1)}</div>
            </div>
          </div>
        </div>

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
                    <span className={s.compMetaItem}><IconBed size={14} />{c.beds}</span>
                    <span className={s.compMetaItem}><IconBath size={14} />{c.baths}</span>
                    <span className={s.compMetaItem}><IconCar size={14} />{c.cars}</span>
                    <span className={s.compMetaDays}>{c.days}d · {c.sold}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={`${s.card} ${s.bandFern}`}>
          <div className={`overline ${s.onDarkMuted}`}>Indicative appraisal range</div>
          <div className={s.rangeRow}>
            <span className={`${s.num} ${s.onDark}`} style={{ fontSize: 32 }}>{market.indicativeRangeLow}</span>
            <span className={s.rangeDash}>&mdash;</span>
            <span className={`${s.num} ${s.onDark}`} style={{ fontSize: 32 }}>{market.indicativeRangeHigh}</span>
          </div>
          <p className={s.bandProse}>
            A measured guide based on the four comparable sales above, current inventory, and
            Noosaville&rsquo;s recent trajectory. We&rsquo;d refine this together at a walk-through.
          </p>
        </div>

        <div className={s.block}>
          <InlineCTA section="market" kind="ember" sublabel="A natural pause" label="Discuss your property's positioning" />
        </div>
      </div>

      {/* ── Desktop ──────────────────────────────────────────── */}
      <div className={s.dOnly}>
        <div className={s.dTwoCol}>
          <div className={s.dCard}>
            <div className="overline">Median sale price · 24 months</div>
            <div className={s.numRow}>
              <span className={s.num} style={{ fontSize: 56 }}>{market.median}</span>
              <span className={`${s.chip} ${s.chipUp}`}>
                <IconTrend />
                <span>{market.medianChange}</span>
              </span>
            </div>
            <div className={s.chartWrap}>
              <MedianPriceChart series={market.medianSeries} height={180} gradientId="med-d" />
            </div>
          </div>
          <div className={s.dCard}>
            <div className="overline">Median days on market</div>
            <div className={s.numRow}>
              <span className={s.num} style={{ fontSize: 56 }}>
                {market.dom}
                <span className={s.numUnit} style={{ fontSize: 24 }}> days</span>
              </span>
              <span className={`${s.chip} ${s.chipUp}`}>{market.domChange}</span>
            </div>
            <div className={s.chartWrap}>
              <DomBarChart series={market.domSeries} height={180} />
            </div>
          </div>
        </div>

        <div className={s.dDemand}>
          <div className={s.dDemandTop}>
            <div>
              <div className={`overline ${s.onDarkMuted}`}>Enquiries / month</div>
              <div className={`${s.num} ${s.onDark}`} style={{ fontSize: 48, marginTop: 8 }}>
                {market.searchVolume.toLocaleString()}
              </div>
              <div className={s.dDemandYoY}>{market.searchChange}</div>
            </div>
            <div className={s.dDemandSpark}>
              <SearchSparkline series={market.searchSeries} accent="var(--sunrise)" height={96} gradientId="srch-d" />
              <div className={s.dDemandSparkLabels}>
                <span>JUN &rsquo;25</span>
                <span>NOV &rsquo;25</span>
                <span>MAY &rsquo;26</span>
              </div>
            </div>
          </div>
          <div className={s.dDemandStats}>
            <div>
              <div className={`overline ${s.onDarkMuted}`}>Active listings</div>
              <div className={`${s.num} ${s.onDark}`} style={{ fontSize: 28, marginTop: 6 }}>{market.inventory}</div>
            </div>
            <div>
              <div className={`overline ${s.onDarkMuted}`}>Months of supply</div>
              <div className={`${s.num} ${s.onDark}`} style={{ fontSize: 28, marginTop: 6 }}>{market.monthsSupply.toFixed(1)}</div>
            </div>
            <div>
              <div className={`overline ${s.onDarkMuted}`}>Clearance rate</div>
              <div className={`${s.num} ${s.onDark}`} style={{ fontSize: 28, marginTop: 6 }}>
                {market.clearanceRate}
                <span style={{ fontSize: 16 }}>%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={s.dBlock}>
          <div className={s.dCompsHead}>
            <div>
              <div className="overline">Recent comparable sales</div>
              <h3 className={s.dCompsH3}>Four homes against which yours is positioned.</h3>
            </div>
            <p className={s.dCompsNote}>
              We&rsquo;ve selected like-for-like — three-bedroom apartments along the river, sold in
              the last 90 days. Days on market shown is from list to unconditional.
            </p>
          </div>
          <div className={s.dCompGrid}>
            {comps.map((c, i) => (
              <article key={i} className={s.dComp}>
                <ImageSlot label="comp" ratio="4/3" />
                <div className={s.dCompBody}>
                  <div className={s.dCompPrice}>{c.price}</div>
                  <div className={s.dCompAddr}>{c.addr}</div>
                  <div className={s.dCompSuburb}>{c.suburb}</div>
                  <div className={s.dCompMeta}>
                    <span className={s.dCompMetaItems}>
                      <span className={s.dCompMetaItem}><IconBed size={14} />{c.beds}</span>
                      <span className={s.dCompMetaItem}><IconBath size={14} />{c.baths}</span>
                      <span className={s.dCompMetaItem}><IconCar size={14} />{c.cars}</span>
                    </span>
                    <span className={s.dCompDays}>{c.days}d</span>
                  </div>
                  <div className={s.dCompSold}>SOLD · {c.sold}</div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={s.dRange}>
          <div>
            <div className={`overline ${s.onDarkMuted}`}>Indicative appraisal range</div>
            <div className={s.dRangeRow}>
              <span className={`${s.num} ${s.onDark}`} style={{ fontSize: 64 }}>{market.indicativeRangeLow}</span>
              <span className={s.rangeDash} style={{ fontSize: 32 }}>&mdash;</span>
              <span className={`${s.num} ${s.onDark}`} style={{ fontSize: 64 }}>{market.indicativeRangeHigh}</span>
            </div>
            <p className={s.dRangeProse}>
              A measured guide based on the four comparable sales above, current inventory, and
              Noosaville&rsquo;s recent trajectory. We&rsquo;d refine this together at a walk-through.
            </p>
          </div>
          <Link href={teamHref} className={s.dSunriseBtn}>
            Refine at a walk-through <IconArrowR />
          </Link>
        </div>

        <div style={{ marginTop: 32 }}>
          <InlineCTA section="market" kind="ember" sublabel="A natural pause" label="Discuss your property's positioning" />
        </div>
      </div>
    </>
  );
}
