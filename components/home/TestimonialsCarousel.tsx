"use client";

import Image from "next/image";
import { useState } from "react";
import { IconStar } from "@/components/icons";
import type { RatingSummary, Review } from "@/lib/reviews/types";
import s from "./home.module.css";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const pad = (n: number) => String(n).padStart(2, "0");

/** Vendor-stories carousel — rating + reviews fed from the REA reviews seam. */
export function TestimonialsCarousel({
  overline,
  heading,
  summary,
  reviews,
}: {
  overline: string;
  heading: string;
  summary: RatingSummary;
  reviews: Review[];
}) {
  const [i, setI] = useState(0);
  const total = reviews.length;
  const r = reviews[i];
  const go = (d: number) => setI((p) => (p + d + total) % total);

  return (
    <section className={s.testi}>
      <div className="container">
        <div className={s.testiGrid}>
          <div>
            <div className="overline">{overline}</div>
            <h2 className={s.testiHeading}>{heading}</h2>
            <div className={s.rating}>
              {[0, 1, 2, 3, 4].map((n) => (
                <IconStar key={n} />
              ))}
              <span className={s.ratingText}>
                <strong>{summary.average}</strong> ·{" "}
                <span className={s.ratingMeta}>
                  {summary.count} reviews on {summary.source}
                </span>
              </span>
            </div>
          </div>

          <div>
            {r ? (
              <>
                <blockquote className={s.quote} aria-live="polite">
                  <span className={s.quoteMark}>“</span>
                  {r.quote}
                  <span className={s.quoteMark}>”</span>
                </blockquote>
                <div className={s.author}>
                  <span className={s.authorAvatar} aria-hidden>
                    {r.avatarUrl ? (
                      <Image
                        src={r.avatarUrl}
                        alt=""
                        fill
                        sizes="48px"
                        className={s.authorAvatarImg}
                      />
                    ) : (
                      <span className={s.authorAvatarInitials}>{initials(r.author)}</span>
                    )}
                  </span>
                  <div>
                    <div className={s.authorName}>{r.author}</div>
                    {r.detail ? <div className={s.authorDetail}>{r.detail}</div> : null}
                  </div>
                </div>
              </>
            ) : null}
            <div className={s.controls}>
              <button
                type="button"
                className={s.ctrlBtn}
                aria-label="Previous review"
                onClick={() => go(-1)}
                disabled={total < 2}
              >
                ←
              </button>
              <button
                type="button"
                className={s.ctrlBtn}
                aria-label="Next review"
                onClick={() => go(1)}
                disabled={total < 2}
              >
                →
              </button>
              <div className={s.counter}>
                {pad(i + 1)} / {pad(total)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
