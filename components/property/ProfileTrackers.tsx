"use client";

// Page-view + scroll-depth trackers for property profiles.
//
// PageViewTracker fires once on mount with the relevant entity payload.
// ScrollDepthTracker watches body scroll position and fires the
// property_scroll_depth event at 25 / 50 / 75 / 100% — each threshold once
// per page-view. Both pushed via lib/horace/track to window.dataLayer, which
// GTM forwards to Horace.

import { useEffect, useRef } from "react";
import { track } from "@/lib/horace/track";

export function ComplexPageView({
  complexId,
  totalUnits,
  recentEventsCount,
}: {
  complexId: string;
  totalUnits: number;
  recentEventsCount: number;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track.complexProfileViewed({ complexId, totalUnits, recentEventsCount });
  }, [complexId, totalUnits, recentEventsCount]);
  return null;
}

export function UnitPageView({
  complexId,
  unitId,
  currentStatus,
  hasCommentary,
}: {
  complexId: string;
  unitId: string;
  currentStatus: string;
  hasCommentary: boolean;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track.unitProfileViewed({ complexId, unitId, currentStatus, hasCommentary });
  }, [complexId, unitId, currentStatus, hasCommentary]);
  return null;
}

const DEPTHS = [25, 50, 75, 100] as const;

export function ScrollDepthTracker() {
  // Top-edge sentinel approach: we measure body scroll progress as
  // (scrollY + viewportHeight) / documentHeight and fire each threshold once.
  // Cheaper than IntersectionObserver per sentinel; the math is exact enough
  // for the spec's quartile fires.
  const fired = useRef<Set<number>>(new Set());
  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const total = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const scrolled = Math.min(100, Math.round((window.scrollY / total) * 100));
      for (const d of DEPTHS) {
        if (scrolled >= d && !fired.current.has(d)) {
          fired.current.add(d);
          track.propertyScrollDepth({ depth: d });
        }
      }
    }
    onScroll(); // capture the initial state if the page is short enough
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
