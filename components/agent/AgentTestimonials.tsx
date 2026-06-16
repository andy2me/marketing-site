"use client";

import { useState } from "react";
import { IconArrowR, IconStar } from "@/components/icons";
import type { Review } from "@/lib/reviews/types";
import s from "./agent.module.css";

export function AgentTestimonials({ reviews }: { reviews: Review[] }) {
  const [i, setI] = useState(0);
  if (reviews.length === 0) return null;
  const review = reviews[i] ?? reviews[0];
  const multiple = reviews.length > 1;

  const prev = () => setI((p) => (p - 1 + reviews.length) % reviews.length);
  const next = () => setI((p) => (p + 1) % reviews.length);

  return (
    <section className={s.section}>
      <div className={s.sectionHead}>
        <div>
          <div className="overline">§ What vendors say</div>
          <h2 className={s.sectionH2}>From the people who&rsquo;ve sold with him.</h2>
        </div>
        {multiple ? (
          <div className={s.testiHeadCtrls}>
            <button
              type="button"
              className={`${s.testiCtrlBtn} ${s.testiCtrlPrev}`}
              onClick={prev}
              aria-label="Previous testimonial"
            >
              <IconArrowR />
            </button>
            <button
              type="button"
              className={s.testiCtrlBtn}
              onClick={next}
              aria-label="Next testimonial"
            >
              <IconArrowR />
            </button>
          </div>
        ) : null}
      </div>

      <article
        className={s.testiCard}
        style={{ marginTop: 28 }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className={s.testiStars} aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: review.rating }).map((_, k) => (
            <IconStar key={k} size={16} />
          ))}
        </div>
        <blockquote className={s.testiQuote}>&ldquo;{review.quote}&rdquo;</blockquote>
        <div className={s.testiFoot}>
          <div>
            <div className={s.testiName}>{review.author}</div>
            {review.detail ? <div className={s.testiDetail}>{review.detail}</div> : null}
          </div>
          {multiple ? (
            <div className={s.testiDots} role="tablist" aria-label="Testimonial position">
              {reviews.map((r, k) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  aria-label={`Show testimonial ${k + 1} of ${reviews.length}`}
                  className={`${s.testiDot} ${k === i ? s.testiDotActive : ""}`}
                  onClick={() => setI(k)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </section>
  );
}
