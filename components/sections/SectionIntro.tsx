import type { CSSProperties, ReactNode } from "react";
import styles from "./SectionIntro.module.css";

/** The recurring 5fr / 7fr "overline + heading" intro pair used by numbered marketing
 *  sections. Overline sits in the left column; heading (and any body) is `children`. */
export function SectionIntro({
  overline,
  overlineStyle,
  className,
  children,
}: {
  overline: ReactNode;
  overlineStyle?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={[styles.intro, className].filter(Boolean).join(" ")}>
      <div className="overline" style={overlineStyle}>
        {overline}
      </div>
      <div>{children}</div>
    </div>
  );
}
