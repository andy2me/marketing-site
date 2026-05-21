"use client";

import { useState } from "react";
import { IconHeart } from "@/components/icons";
import styles from "./PropertyCard.module.css";

/**
 * Heart save toggle. Controlled when `saved` + `onToggle` are passed (the listings index
 * lifts state so grid and map stay in sync); otherwise uncontrolled local state.
 * TODO: persist to account / local storage and fire a "saved property" event (§13).
 */
export function SaveButton({
  id,
  saved,
  defaultSaved = false,
  onToggle,
}: {
  id: string;
  saved?: boolean;
  defaultSaved?: boolean;
  onToggle?: (id: string, next: boolean) => void;
}) {
  const controlled = saved !== undefined;
  const [internal, setInternal] = useState(defaultSaved);
  const isSaved = controlled ? saved : internal;

  return (
    <button
      type="button"
      className={styles.save}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from saved" : "Save property"}
      data-listing={id}
      style={{ color: isSaved ? "var(--color-action)" : "var(--white-mist-700)" }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = !isSaved;
        if (!controlled) setInternal(next);
        onToggle?.(id, next);
      }}
    >
      <IconHeart filled={isSaved} />
    </button>
  );
}
