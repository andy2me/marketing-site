// Max Property — Appraisal Builder · gate persistence (design handoff "State management").
// The email gate is remembered per visitor, keyed to the report slug, so returning vendors
// aren't re-prompted. localStorage is the client mirror; the canonical store is the reporting
// backend (open question #2) once wired.

const key = (slug: string) => `mx.report.${slug}.email`;

export function getStoredEmail(slug: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key(slug));
  } catch {
    return null;
  }
}

export function storeEmail(slug: string, email: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(slug), email);
  } catch {
    // private mode / quota — gate still clears for this session via in-memory state
  }
}

/** Simple format check per the handoff (no verification email — open question #5). */
export function isValidEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
