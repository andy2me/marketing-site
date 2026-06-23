import "server-only";

// Best-effort, in-memory fixed-window rate limit keyed by client IP. This is a
// marketing site with low submit volume, so an in-process counter is enough to
// blunt scripted floods alongside the honeypot/time-trap. It does NOT share
// state across serverless instances — if abuse becomes a real problem, swap the
// store for Upstash/Redis behind this same interface.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, now = Date.now()): { ok: boolean; retryAfterSec: number } {
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }

  if (existing.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** First IP from x-forwarded-for, falling back to a stable-ish default. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
