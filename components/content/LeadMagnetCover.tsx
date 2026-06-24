// Small decorative cover graphics for lead-magnet cards. SVG only — no JS,
// no external asset — so they ship server-rendered and theme-aware.

import s from "./Guide.module.css";

/** Stylised checklist-document cover (sized 96×120 by the card). */
export function LeadMagnetChecklistCover() {
  return (
    <div className={s.leadMagnetCover} aria-hidden>
      <svg
        viewBox="0 0 96 120"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        focusable="false"
      >
        {/* paper */}
        <rect x="6" y="4" width="84" height="112" rx="6" fill="#ffffff" />
        <rect
          x="6"
          y="4"
          width="84"
          height="112"
          rx="6"
          fill="none"
          stroke="#e5dace"
          strokeWidth="1"
        />
        {/* top accent band */}
        <rect x="6" y="4" width="84" height="14" rx="6" fill="#9d4d2a" />
        <rect x="6" y="12" width="84" height="6" fill="#9d4d2a" />
        {/* title rules */}
        <rect x="14" y="26" width="48" height="5" rx="1.5" fill="#2c1e15" />
        <rect x="14" y="35" width="34" height="3" rx="1" fill="#c6c0bc" />
        {/* checklist rows */}
        {[48, 62, 76, 90].map((y) => (
          <g key={y}>
            <circle cx="17" cy={y} r="3.4" fill="none" stroke="#9d4d2a" strokeWidth="1.2" />
            <path
              d={`M15.3 ${y} l1.5 1.5 l3 -3`}
              fill="none"
              stroke="#9d4d2a"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="24" y={y - 2} width="56" height="4" rx="1" fill="#ece9e7" />
          </g>
        ))}
        {/* footer rule */}
        <rect x="14" y="104" width="22" height="3" rx="1" fill="#d5d0cc" />
      </svg>
    </div>
  );
}
