"use client";

// Thin client island that opens the buyer-interest modal. Server components
// (the hero, the CTA band, the unit side-panel) render this where they would
// otherwise have placed an anchor or button — the rest of the section stays
// server-rendered.

import { type ReactNode } from "react";
import { useBuyerInterest } from "./BuyerInterestProvider";

export function BuyerInterestButton({
  type,
  unitNumber,
  className = "btn btn-primary",
  style,
  children,
}: {
  type: "complex" | "unit";
  unitNumber?: number;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const { open } = useBuyerInterest();
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => open({ type, unitNumber })}
    >
      {children}
    </button>
  );
}
