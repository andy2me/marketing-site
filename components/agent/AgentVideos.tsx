"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IconClose, IconPlay } from "@/components/icons";
import type { AgentFeaturedVideo, AgentReel } from "@/lib/agents/types";
import s from "./agent.module.css";

type ActiveVideo = { thumbnail: string; title: string } | null;

export function AgentVideos({
  featured,
  reels,
}: {
  featured: AgentFeaturedVideo | null;
  reels: AgentReel[];
}) {
  const [active, setActive] = useState<ActiveVideo>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  if (!featured && reels.length === 0) return null;

  return (
    <section className={s.section}>
      <div className="overline">§ See Matt in motion</div>
      <h2 className={s.sectionH2}>Video, in his own words.</h2>

      {featured ? (
        <button
          type="button"
          className={s.videoFeatured}
          onClick={() => setActive({ thumbnail: featured.thumbnail, title: featured.title })}
          aria-label={`Play featured video: ${featured.title}`}
        >
          <div className={s.videoFeaturedInner}>
            {/* eslint-disable-next-line @next/next/no-img-element -- remote host not in remotePatterns; matches project pattern. */}
            <img src={featured.thumbnail} alt="" />
            <div className={s.videoScrim} aria-hidden />
            <div className={s.videoFeaturedBottom}>
              <div>
                <div className={s.videoFeaturedKicker}>{featured.kicker}</div>
                <div className={s.videoFeaturedTitle}>{featured.title}</div>
              </div>
              <span className={s.videoPlayLg} aria-hidden>
                <IconPlay size={28} />
              </span>
            </div>
          </div>
        </button>
      ) : null}

      {reels.length > 0 ? (
        <div className={s.reelsRow}>
          {reels.map((reel) => (
            <button
              key={reel.id}
              type="button"
              className={s.reel}
              onClick={() => setActive({ thumbnail: reel.thumbnail, title: reel.label })}
              aria-label={`Play reel: ${reel.label}`}
            >
              <div className={s.reelInner}>
                {/* eslint-disable-next-line @next/next/no-img-element -- remote host not in remotePatterns; matches project pattern. */}
                <img src={reel.thumbnail} alt="" />
                <span className={s.reelDuration}>{reel.duration}</span>
                <span className={s.reelPlay} aria-hidden>
                  <IconPlay size={20} />
                </span>
                <span className={s.reelLabel}>{reel.label}</span>
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {active && typeof document !== "undefined"
        ? createPortal(<Lightbox video={active} onClose={() => setActive(null)} />, document.body)
        : null}
    </section>
  );
}

function Lightbox({
  video,
  onClose,
}: {
  video: { thumbnail: string; title: string };
  onClose: () => void;
}) {
  return (
    <div
      className={s.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
    >
      <div className={s.lightboxInner} onClick={(e) => e.stopPropagation()}>
        <div className={s.lightboxStage}>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote host not in remotePatterns; matches project pattern. */}
          <img src={video.thumbnail} alt="" />
          <div className={s.lightboxPlay}>
            <button
              type="button"
              className={s.lightboxPlayBtn}
              aria-label="Play (TODO — wire video source)"
            >
              <IconPlay size={36} />
            </button>
          </div>
        </div>
        <div className={s.lightboxFoot}>
          <div className={s.lightboxTitle}>{video.title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: "rgba(244,237,229,0.12)",
              color: "var(--soft-linen-600)",
              border: "none",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <IconClose size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
