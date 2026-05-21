import type { CSSProperties, ReactNode } from "react";
import styles from "./Section.module.css";

const BG: Record<string, string> = {
  page: "var(--color-bg-page)",
  banding: "var(--color-bg-banding)",
  inverse: "var(--color-bg-inverse)",
  surface: "var(--color-bg-surface)",
};

/** Banded section wrapper with the standard ~120px vertical rhythm. `bg` accepts a
 *  semantic key (page/banding/inverse/surface) or any raw colour/token. */
export function Section({
  bg = "page",
  id,
  className,
  style,
  children,
}: {
  bg?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={[styles.section, className].filter(Boolean).join(" ")}
      style={{ background: BG[bg] ?? bg, ...style }}
    >
      {children}
    </section>
  );
}
