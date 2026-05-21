// Max Property — typography (code handoff §5)
//
// SUBSTITUTES, not the final faces. The prototype stood in free Google fonts for the
// licensed brand faces; production must ship the licensed faces:
//   --font-heading → PP Migra (Pangram Pangram), weights Light/Regular
//   --font-body    → PP Neue Montreal (Pangram Pangram), weights Book/Regular/Medium
//   --font-mono    → open item: licence a mono companion, or use PP Neue Montreal Medium
//                    with letter-spacing. Until resolved, Geist Mono stands in.
//
// SWAP PATH: once the Pangram Pangram web-font licence lands, drop the woff2 files into
// public/fonts/ and replace each call below with `next/font/local`, keeping the SAME
// `variable` names. Nothing else in the app changes — components read var(--font-*).
//
// next/font self-hosts these (no requests to Google at runtime) and generates a
// metrics-adjusted fallback automatically to minimise layout shift.

import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";

// PP Migra stand-in
export const fontHeading = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-heading",
});

// PP Neue Montreal stand-in (variable font — no explicit weight)
export const fontBody = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Mono companion stand-in
export const fontMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const fontVariables = `${fontHeading.variable} ${fontBody.variable} ${fontMono.variable}`;
