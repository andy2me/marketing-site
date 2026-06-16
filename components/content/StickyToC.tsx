"use client";

// Sticky-rail table of contents with scroll-spy.
// IntersectionObserver watches each H2 (matched by `items[*].id`) and marks the
// most-visible section as active. The fill line grows to the active item.

import { useEffect, useRef, useState } from "react";
import type { GuideTocItem } from "@/lib/guides/types";
import s from "./Guide.module.css";

export function StickyToC({ items }: { items: GuideTocItem[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const targets: { id: string; el: HTMLElement }[] = [];
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el) targets.push({ id: it.id, el });
    }
    if (targets.length === 0) return;

    // Track each section's most recent intersection ratio.
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target.id, e.intersectionRatio);
        }
        // Active = section closest to the top of the viewport that's still on screen.
        // If multiple are visible, prefer the one furthest down (last passed).
        let nextIdx = activeIdx;
        let bestY = -Infinity;
        targets.forEach(({ id }, i) => {
          const r = ratios.get(id) ?? 0;
          if (r > 0) {
            const rect = document.getElementById(id)?.getBoundingClientRect();
            if (rect && rect.top <= 140 && rect.top > bestY) {
              bestY = rect.top;
              nextIdx = i;
            }
          }
        });
        setActiveIdx(nextIdx);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    targets.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, activeIdx]);

  const progress = items.length > 1 ? activeIdx / (items.length - 1) : 0;

  return (
    <nav aria-label="On this page" className={s.toc}>
      <div className={`overline ${s.tocLabel}`}>On this page</div>
      <div className={s.tocInner}>
        <div className={s.tocTrack} />
        <div
          className={s.tocFill}
          style={{ height: `calc(${progress} * (100% - 8px))` }}
        />
        <ul ref={listRef} className={s.tocList}>
          {items.map((it, i) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`${s.tocLink} ${
                  i === activeIdx ? s.tocActive : ""
                }`}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function MobileToC({ items }: { items: GuideTocItem[] }) {
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      if (scrollable <= 0) return;
      setPct(Math.min(100, Math.max(0, (h.scrollTop / scrollable) * 100)));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`${s.mobileToc} ${open ? s.mobileTocOpen : ""}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={s.mobileTocBtn}
      >
        On this page
        <span className={s.mobileTocChev} aria-hidden>
          ▾
        </span>
      </button>
      <div className={s.mobileTocProgress}>
        <div className={s.mobileTocProgressFill} style={{ width: `${pct}%` }} />
      </div>
      {open && (
        <ul className={s.mobileTocList}>
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} onClick={() => setOpen(false)}>
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
