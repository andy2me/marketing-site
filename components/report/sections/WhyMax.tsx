import type { Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconStar } from "@/components/icons";
import { SectionIntro } from "../SectionIntro";
import s from "../report.module.css";

// 07 · Why Max. — collective stats (4-up on desktop), rating card + vendor testimonial.
export function WhyMax({ report }: { report: Report }) {
  const { agency } = report;
  return (
    <>
      <SectionIntro
        n="07"
        overline="Why Max."
        title={
          <>
            The proof is in the <em className={s.emEmber}>campaigns</em>.
          </>
        }
        lede="A small, considered team. Twenty-plus years of combined sales and marketing experience, focused on the Noosa Shire and its patches."
      />

      <div className={s.statList}>
        {agency.collective.map((stat, i) => (
          <div key={i} className={s.stat}>
            <div className={`${s.num} ${s.statNum}`}>{stat.n}</div>
            <div className={s.statLabel}>{stat.l}</div>
          </div>
        ))}
      </div>

      <div className={s.whyLower}>
        <div className={s.ratingCard}>
          <div>
            <div className={`overline ${s.dOnly}`}>Vendor reviews</div>
            <div className={`${s.num} ${s.ratingScore}`} style={{ color: "var(--white-mist-900)" }}>
              {agency.rating.score}
              <span className={s.ratingScoreUnit}>/{agency.rating.outOf}</span>
            </div>
            <div className={s.ratingSub}>Across {agency.rating.reviews}</div>
          </div>
          <div className={s.ratingStars} aria-hidden>
            {Array.from({ length: agency.rating.stars }, (_, i) => (
              <IconStar key={i} size={14} />
            ))}
          </div>
        </div>

        <div className={s.testimonial}>
          <div className={`overline ${s.onDarkMuted}`}>{agency.testimonial.note}</div>
          <blockquote className={s.testimonialQuote}>
            <span className={s.quoteMark}>&ldquo;</span>
            {agency.testimonial.quote}
            <span className={s.quoteMark}>&rdquo;</span>
          </blockquote>
          <div className={s.testimonialBy}>
            <ImageSlot label="" ratio="1/1" className={s.testimonialAvatar} />
            <div>
              <div className={s.testimonialAuthor}>{agency.testimonial.author}</div>
              <div className={s.testimonialDetail}>{agency.testimonial.detail}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
