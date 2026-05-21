"use client";

import { useState } from "react";
import { IconChevron } from "@/components/icons";
import s from "./FaqAccordion.module.css";

/** Expandable FAQ rows (chevron rotates 180° on open). Used by Sell + Contact. */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={s.row}>
            <button
              type="button"
              className={s.head}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className={s.q}>{f.q}</span>
              <span className={`${s.chev} ${isOpen ? s.chevOpen : ""}`} aria-hidden>
                <IconChevron />
              </span>
            </button>
            {isOpen && <p className={s.a}>{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
