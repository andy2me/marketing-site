"use client";

// Single-open accordion. ARIA-correct (aria-expanded + aria-controls + region),
// CSS-grid-rows animation so the open transition runs from natural content height.

import { useState } from "react";
import { IconChevron } from "@/components/icons";
import type { GuideFAQ } from "@/lib/guides/types";
import s from "./Guide.module.css";

export function FAQAccordion({
  items,
  defaultOpen = 0,
}: {
  items: GuideFAQ[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number>(defaultOpen);

  return (
    <div>
      {items.map((f, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        return (
          <div key={i} className={s.faqItem}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={s.faqBtn}
              >
                {f.q}
                <span
                  className={`${s.faqChev} ${isOpen ? s.faqChevOpen : ""}`}
                  aria-hidden
                >
                  <IconChevron />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              className={`${s.faqPanel} ${isOpen ? s.faqPanelOpen : ""}`}
            >
              <div className={s.faqPanelInner}>
                <p className={s.faqA}>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
