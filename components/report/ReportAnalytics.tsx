"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { sectionByRoute, type SectionId } from "@/lib/report/types";
import { track } from "@/lib/report/events";

// Engagement instrumentation (design handoff §Reporting hooks). Each section is its own route,
// so section.view fires on navigation; time + max scroll-depth are accumulated and flushed on
// leaving the section and on page hide. Mounted only once the gate is cleared.
export function ReportAnalytics({ slug, email }: { slug: string; email: string | null }) {
  const params = useParams<{ section?: string }>();
  const sectionId: SectionId = (params.section && sectionByRoute(params.section)?.def.id) || "welcome";

  const enterRef = useRef(0);
  const maxScrollRef = useRef(0);
  const lastScrollEmitRef = useRef(0);

  // Per-section lifecycle: view on enter, time + scroll on leave.
  useEffect(() => {
    enterRef.current = Date.now();
    maxScrollRef.current = 0;
    track({ type: "report.section.view", slug, section: sectionId, email });

    return () => {
      track({
        type: "report.section.time",
        slug,
        section: sectionId,
        ms: Date.now() - enterRef.current,
        email,
      });
      track({
        type: "report.section.scroll",
        slug,
        section: sectionId,
        pctScrolled: maxScrollRef.current,
        email,
      });
    };
  }, [slug, sectionId, email]);

  // Scroll depth — track max, emit a throttled update at most every 2s.
  useEffect(() => {
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const pct = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100;
        if (pct > maxScrollRef.current) {
          maxScrollRef.current = pct;
          const now = Date.now();
          if (now - lastScrollEmitRef.current > 2000) {
            lastScrollEmitRef.current = now;
            track({ type: "report.section.scroll", slug, section: sectionId, pctScrolled: pct, email });
          }
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [slug, sectionId, email]);

  // Flush on page hide (tab close / background) — the unmount cleanup won't run then.
  useEffect(() => {
    function flush() {
      if (document.visibilityState !== "hidden") return;
      track({ type: "report.section.time", slug, section: sectionId, ms: Date.now() - enterRef.current, email });
      track({ type: "report.section.scroll", slug, section: sectionId, pctScrolled: maxScrollRef.current, email });
      enterRef.current = Date.now();
    }
    document.addEventListener("visibilitychange", flush);
    return () => document.removeEventListener("visibilitychange", flush);
  }, [slug, sectionId, email]);

  return null;
}
