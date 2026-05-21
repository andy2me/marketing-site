import type { CSSProperties } from "react";
import styles from "./ImageSlot.module.css";

/**
 * Striped linen placeholder for frames where Max Property will supply original
 * photography (design handoff §Fidelity). Dimensions/aspect ratios are final.
 * Real photos swap in via <Image> at the same call sites.
 */
export function ImageSlot({
  label,
  ratio = "3/2",
  className,
  style,
}: {
  label?: string;
  ratio?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={[styles.slot, className].filter(Boolean).join(" ")}
      style={{ aspectRatio: ratio, ...style }}
    >
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
