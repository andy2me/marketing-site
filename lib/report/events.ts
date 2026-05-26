// Max Property — Appraisal Builder · engagement events (reporting hooks, design handoff
// "Reporting hooks"). Per-section tracking attributed to the captured vendor email.
//
// This is the typed event contract + a single thin dispatcher. Where the events ultimately
// land — "the agency's existing reporting tool" — is open question #2, so the destination is
// isolated in sink.ts. Swap the sink when the tool is confirmed; call sites never change.

import { sendToSink } from "./sink";

export type ReportEvent =
  | { type: "report.gate.view"; slug: string; agentId: string }
  | { type: "report.gate.submit"; slug: string; agentId: string; email: string }
  | { type: "report.section.view"; slug: string; section: string; email: string | null }
  | { type: "report.section.time"; slug: string; section: string; ms: number; email: string | null }
  | { type: "report.section.scroll"; slug: string; section: string; pctScrolled: number; email: string | null }
  | { type: "report.cta.click"; slug: string; section: string; label: string; email: string | null }
  | { type: "report.contact.click"; slug: string; agentId: string; channel: "call" | "email" | "book"; email: string | null };

/** Fire-and-forget. Never throws into the UI — reporting must not break the proposal. */
export function track(event: ReportEvent): void {
  try {
    sendToSink(event);
  } catch {
    // swallow — engagement tracking is best-effort
  }
}
