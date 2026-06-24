import s from "./thank-you.module.css";

/** The 280px circle with a line-art coffee cup, three animated steam wisps,
 *  and the "On the house" stamp. Pure presentational — no client JS needed
 *  (the animation lives in thank-you.module.css and honours
 *  prefers-reduced-motion via @media). */
export function CoffeeMark() {
  return (
    <div className={s.markWrap}>
      <div className={s.mark}>
        <div className={s.markBg} />
        <div className={s.markRing} />
        <svg
          viewBox="0 0 120 120"
          width="200"
          height="200"
          fill="none"
          stroke="var(--white-mist-800)"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={s.markSvg}
          aria-hidden
        >
          <g stroke="var(--color-action)" strokeWidth={2} opacity={0.9}>
            <path className={s.steamPath} style={{ animationDelay: "0s" }} d="M46 34c-4-5 4-9 0-14" />
            <path className={s.steamPath} style={{ animationDelay: "0.5s" }} d="M60 32c-4-6 4-10 0-16" />
            <path className={s.steamPath} style={{ animationDelay: "1s" }} d="M74 34c-4-5 4-9 0-14" />
          </g>
          <path d="M30 50h54v18a27 27 0 0 1-27 27h0a27 27 0 0 1-27-27V50z" fill="var(--soft-linen-700)" />
          <path d="M84 56h7a11 11 0 0 1 0 22h-5" />
          <path d="M26 50h62" />
          <path d="M34 104h46" stroke="var(--color-action)" />
        </svg>
        <div className={s.stamp} aria-hidden>
          On the<br />house
        </div>
      </div>
    </div>
  );
}
