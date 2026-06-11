"use client";

import { useEffect } from "react";

/** Trigger the browser print dialog shortly after mount so the printable proposal route opens
 *  straight into the print/save-as-PDF flow. Small delay lets images + fonts finish loading. */
export function AutoPrint() {
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.print();
      } catch {
        // ignore — user can still print via menu
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);
  return null;
}
