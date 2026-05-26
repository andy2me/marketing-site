// Max Property — Appraisal Builder · engagement sink (THE SWAP POINT).
//
// Open question #2: which existing tool should engagement data feed into? Until that's
// confirmed, events go nowhere in production and to the console in development. When the
// destination lands, implement it here (e.g. POST to /api/report/events, or a direct
// client SDK) — events.ts and every call site stay untouched.

import type { ReportEvent } from "./events";

export function sendToSink(event: ReportEvent): void {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[report]", event.type, event);
  }
  // TODO(open-q#2): forward to the agency's reporting tool once confirmed.
  // e.g. navigator.sendBeacon("/api/report/events", JSON.stringify(event));
}
