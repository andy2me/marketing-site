"use client";

import { useState } from "react";
import { DoorstepForm } from "@/components/forms/DoorstepForm";
import { IconArrowR } from "@/components/icons";
import s from "./insights.module.css";

const INTERESTS = ["Market data", "New listings", "Buying tips", "Selling tips", "Investors"];

/** Quarterly-note signup (fern). Interest tags toggle; rides the Doorstep seam (newsletter). */
export function InsightsNewsletter() {
  const [tags, setTags] = useState<string[]>(["Market data", "New listings"]);
  const toggle = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <section className={s.newsletter}>
      <div className="container">
        <div className={s.nlGrid}>
          <div>
            <div className="overline" style={{ color: "rgba(244,237,229,.5)" }}>
              § Newsletter
            </div>
            <h2 className={s.nlH2}>The quarterly note.</h2>
            <p className={s.nlText}>
              Four times a year, a short letter on the Sunshine Coast market. New listings before
              they hit the portals. No spam, ever.
            </p>
          </div>

          <DoorstepForm formId="newsletter" className={s.nlForm}>
            <div className={s.nlFields}>
              <label>
                <div className={s.nlLabel}>Name</div>
                <input className={s.nlInput} name="name" placeholder="Sarah Henley" />
              </label>
              <label>
                <div className={s.nlLabel}>Email</div>
                <input className={s.nlInput} name="email" type="email" placeholder="you@email.com" />
              </label>
            </div>
            <div className={s.nlTagsWrap}>
              <div className={s.nlLabel}>Interests</div>
              <div className={s.nlTags}>
                {INTERESTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${s.nlTag} ${tags.includes(t) ? s.nlTagActive : ""}`}
                    aria-pressed={tags.includes(t)}
                    onClick={() => toggle(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <input type="hidden" name="interests" value={tags.join(",")} />
            <div className={s.nlFoot}>
              <div className={s.nlFine}>
                Read about how we handle data in our <a href="/privacy">privacy policy</a>.
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                Subscribe <IconArrowR />
              </button>
            </div>
          </DoorstepForm>
        </div>
      </div>
    </section>
  );
}
