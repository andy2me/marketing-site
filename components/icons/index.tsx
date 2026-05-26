// Max Property — icon set, ported from the prototype `Icon` object (src/shared.jsx).
// Inline SVGs, 1.5–1.8 stroke, currentColor, 24-grid (arrows on 14). Server-safe.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function svgProps(size: number, props: Omit<IconProps, "size">) {
  const { width, height, ...rest } = props;
  return { width: width ?? size, height: height ?? size, ...rest };
}

export function IconBed({ size = 18, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...svgProps(size, p)}>
      <path d="M3 18V8m0 6h18m0 4v-6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3" />
    </svg>
  );
}
export function IconBath({ size = 18, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...svgProps(size, p)}>
      <path d="M4 11h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" />
      <path d="M6 11V6a2 2 0 0 1 4 0" />
    </svg>
  );
}
export function IconCar({ size = 18, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...svgProps(size, p)}>
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M4 11h16v6H4z" />
      <circle cx="7.5" cy="15.5" r="1" />
      <circle cx="16.5" cy="15.5" r="1" />
    </svg>
  );
}
export function IconLand({ size = 18, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...svgProps(size, p)}>
      <path d="M3 19h18M5 19V8l7-3 7 3v11M9 19v-5h6v5" />
    </svg>
  );
}
export function IconHeart({ size = 18, filled = false, ...p }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} {...svgProps(size, p)}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  );
}
export function IconArrowR({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...svgProps(size, p)}>
      <path d="M5 12h14m-5-6 6 6-6 6" />
    </svg>
  );
}
export function IconArrowUR({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
export function IconChevron({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...svgProps(size, p)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
export function IconSearch({ size = 16, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
export function IconPin({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
export function IconGrid({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
export function IconMap({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14m6-12v14" />
    </svg>
  );
}
export function IconClose({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...svgProps(size, p)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
export function IconPlay({ size = 20, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...svgProps(size, p)}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
export function IconStar({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...svgProps(size, p)}>
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z" />
    </svg>
  );
}
export function IconInstagram({ size = 16, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} {...svgProps(size, p)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
export function IconFacebook({ size = 16, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...svgProps(size, p)}>
      <path d="M13 22V12h3l.5-4H13V5.5c0-1.1.3-1.9 2-1.9h2V0a30 30 0 0 0-3-.1c-3 0-5 1.8-5 5.1V8H6v4h3v10z" />
    </svg>
  );
}
export function IconYouTube({ size = 16, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...svgProps(size, p)}>
      <path d="M23 7.5a3 3 0 0 0-2-2C19 5 12 5 12 5s-7 0-9 .5a3 3 0 0 0-2 2A31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2 2C5 19 12 19 12 19s7 0 9-.5a3 3 0 0 0 2-2c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM10 15V9l5 3-5 3z" />
    </svg>
  );
}

// ── Added for the Appraisal Builder (ported from the prototype ApIcon set) ──────────────
export function IconArrowL({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...svgProps(size, p)}>
      <path d="M19 12H5m6 6-6-6 6-6" />
    </svg>
  );
}
export function IconArea({ size = 16, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...svgProps(size, p)}>
      <path d="M4 4h6M4 4v6M20 20h-6M20 20v-6M4 4l16 16" />
    </svg>
  );
}
export function IconPhone({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
export function IconMail({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
export function IconCalendar({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}
export function IconCheck({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...svgProps(size, p)}>
      <path d="m4 12 5 5L20 6" />
    </svg>
  );
}
export function IconMenu({ size = 18, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...svgProps(size, p)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function IconLock({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
export function IconTrend({ size = 14, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...svgProps(size, p)}>
      <path d="m3 17 6-6 4 4 8-9M14 6h7v7" />
    </svg>
  );
}
export function IconChevronRight({ size = 12, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...svgProps(size, p)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
