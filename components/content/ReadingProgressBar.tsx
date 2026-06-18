"use client";

// Fixed 3px ember bar across the top of the viewport. Width tracks how far the
// user has scrolled the document. Tiny `passive` listener with rAF throttle.

import { useEffect, useState } from "react";
import s from "./Guide.module.css";

export function ReadingProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      if (scrollable <= 0) {
        setPct(0);
        return;
      }
      const ratio = Math.min(1, Math.max(0, h.scrollTop / scrollable));
      setPct(ratio * 100);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={s.progress} aria-hidden>
      <div className={s.progressFill} style={{ width: `${pct}%` }} />
    </div>
  );
}
