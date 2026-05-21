"use client";

import { useState } from "react";
import { IconHeart } from "@/components/icons";
import styles from "./PropertyCard.module.css";

/**
 * Heart save toggle. Local state for now; TODO: persist to account / local storage
 * (design handoff §PropertyCard) and fire a "saved property" analytics event (§13).
 */
export function SaveButton({ id, initial = false }: { id: string; initial?: boolean }) {
  const [saved, setSaved] = useState(initial);
  return (
    <button
      type="button"
      className={styles.save}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save property"}
      data-listing={id}
      style={{ color: saved ? "var(--color-action)" : "var(--white-mist-700)" }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved((s) => !s);
      }}
    >
      <IconHeart filled={saved} />
    </button>
  );
}
