"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconPlay, IconHeart, IconClose, IconArrowR } from "@/components/icons";
import s from "./detail.module.css";

/**
 * Property gallery: a 5-cell grid (hero + 4 thumbs) opening a fullscreen lightbox.
 * Keyboard ←/→/Esc + focus trap (§14). Real photos swap into `images`; until then the
 * grid and lightbox show striped placeholders at the final aspect ratios.
 */
export function PropertyGallery({ images, alt }: { images: string[]; alt: string }) {
  const hasPhotos = images.length > 0;
  const frames = hasPhotos ? images.length : 6;
  const totalLabel = hasPhotos ? images.length : 22;

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + frames) % frames), [frames]);
  const next = useCallback(() => setIndex((i) => (i + 1) % frames), [frames]);

  // Keyboard control + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab") {
        // Simple focus trap: keep focus inside the dialog.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  const cell = (i: number, extra?: React.ReactNode) => (
    <button type="button" className={s.galleryCell} onClick={() => openAt(i)} aria-label={`Open photo ${i + 1}`}>
      {hasPhotos ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={images[i]} alt={`${alt} — photo ${i + 1}`} className={s.galleryImg} />
      ) : (
        <ImageSlot ratio="auto" className={s.gallerySlot} />
      )}
      {extra}
    </button>
  );

  return (
    <section className={`container ${s.gallerySection}`}>
      <div className={s.galleryGrid}>
        <div className={s.galleryHero}>{cell(0)}</div>
        {cell(1)}
        {cell(2)}
        {cell(3)}
        {cell(
          4,
          <span className={s.galleryMore}>+{totalLabel - 4} photos</span>,
        )}

        <div className={s.galleryTopLeft}>
          <span className={s.pill}>
            <IconPlay size={16} /> Video tour
          </span>
          <span className={s.pill}>3D walkthrough</span>
          <span className={s.pill}>Floorplan</span>
        </div>
        <div className={s.galleryTopRight}>
          <span className={s.pill}>
            <IconHeart size={16} /> Save
          </span>
          <span className={s.pill}>Share</span>
        </div>
        <button type="button" className={s.galleryViewAll} onClick={() => openAt(0)}>
          View all {totalLabel} photos
        </button>
      </div>

      {open && (
        <div
          ref={dialogRef}
          className={s.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} gallery`}
          tabIndex={-1}
        >
          <div className={s.lightboxBar}>
            <span className={s.lightboxCount}>
              {index + 1} / {frames}
            </span>
            <button type="button" className={s.lightboxClose} onClick={close} aria-label="Close gallery">
              <IconClose size={18} />
            </button>
          </div>
          <div className={s.lightboxStage}>
            <button type="button" className={s.lightboxNav} onClick={prev} aria-label="Previous photo">
              <IconArrowR size={20} style={{ transform: "rotate(180deg)" }} />
            </button>
            <div className={s.lightboxImageWrap}>
              {hasPhotos ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[index]} alt={`${alt} — photo ${index + 1}`} className={s.lightboxImage} />
              ) : (
                <ImageSlot ratio="3/2" label={`Photo ${index + 1} of ${frames}`} className={s.lightboxImage} />
              )}
            </div>
            <button type="button" className={s.lightboxNav} onClick={next} aria-label="Next photo">
              <IconArrowR size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
