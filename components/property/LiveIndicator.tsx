"use client";

import { useEffect, useState } from "react";
import s from "./properties.module.css";

function formatRelative(deltaMs: number): string {
  const seconds = Math.max(0, Math.floor(deltaMs / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// `updatedAt` is captured server-side at page render. Initial state matches
// the server output ("just now") so hydration is clean; the post-mount effect
// then reads the real client clock and ticks every 30s for stale renders.
export function LiveIndicator({ updatedAt }: { updatedAt: number }) {
  const [relative, setRelative] = useState("just now");

  useEffect(() => {
    const tick = () => setRelative(formatRelative(Date.now() - updatedAt));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [updatedAt]);

  return (
    <>
      <span className={s.live}>
        <span className={s.liveDot} /> Live
      </span>
      <span>·</span>
      <span>Updated {relative}</span>
    </>
  );
}
