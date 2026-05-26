import type { Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconStar } from "@/components/icons";
import s from "../report.module.css";

// 07 · Why Max. — collective stats, rating card, vendor-story testimonial.
export function WhyMax({ report }: { report: Report }) {
  const { agency } = report;
  return (
    <>
      <div className="overline">Why Max.</div>
      <h2 className={s.h2}>
        The proof is in the <em className={s.emEmber}>campaigns</em>.
      </h2>

      <div className={s.statList}>
        {agency.collective.map((stat, i) => (
          <div key={i} className={s.stat}>
            <div className={s.num} style={{ fontSize: 40 }}>
              {stat.n}
            </div>
            <div className={s.statLabel}>{stat.l}</div>
          </div>
        ))}
      </div>

      <div className={s.ratingCard}>
        <div>
          <div className={s.num} style={{ fontSize: 28, color: "var(--white-mist-900)" }}>
            {agency.rating.score} / {agency.rating.outOf}
          </div>
          <div className={s.ratingSub}>Across {agency.rating.reviews}</div>
        </div>
        <div className={s.ratingStars} aria-hidden>
          {Array.from({ length: agency.rating.stars }, (_, i) => (
            <IconStar key={i} size={14} />
          ))}
        </div>
      </div>

      <div className={`${s.card} ${s.testimonial}`}>
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
    </>
  );
}
