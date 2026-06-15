import "server-only";

import type { RexPublishedListing } from "./mappers";

const BASE = process.env.REX_API_BASE ?? "https://api.rexsoftware.com";
const USER = process.env.REX_USERNAME;
const PASS = process.env.REX_PASSWORD;
const ACCOUNT_ID = process.env.REX_ACCOUNT_ID;
const TOKEN_LIFETIME_SECONDS = 604800;

let cachedToken: string | null = null;
let tokenPromise: Promise<string> | null = null;

async function login(): Promise<string> {
  if (!USER || !PASS) {
    throw new Error("Rex client not configured: set REX_USERNAME and REX_PASSWORD");
  }
  const res = await fetch(`${BASE}/v1/rex/Authentication/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: USER,
      password: PASS,
      ...(ACCOUNT_ID ? { account_id: Number(ACCOUNT_ID) } : {}),
      token_lifetime: TOKEN_LIFETIME_SECONDS,
    }),
    cache: "no-store",
  });
  const data = (await res.json()) as { result?: unknown; error?: { message?: string } | null };
  if (!res.ok || data.error || typeof data.result !== "string") {
    const detail = data.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`Rex login failed: ${detail}`);
  }
  return data.result;
}

async function getToken(force = false): Promise<string> {
  if (!force && cachedToken) return cachedToken;
  if (!tokenPromise) {
    tokenPromise = login().finally(() => {
      tokenPromise = null;
    });
  }
  cachedToken = await tokenPromise;
  return cachedToken;
}

type RexEnvelope<T> = { result: T | null; error: { message: string } | null };

type FetchOpts = { tags?: string[]; revalidate?: number };

async function call<T>(method: string, args: Record<string, unknown>, opts: FetchOpts = {}): Promise<T> {
  const url = `${BASE}/v1/rex/${method}`;
  const body = JSON.stringify(args);
  const buildInit = (token: string): RequestInit => ({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
    ...(opts.tags || opts.revalidate !== undefined
      ? { next: { tags: opts.tags, revalidate: opts.revalidate } }
      : { cache: "no-store" }),
  });

  let token = await getToken();
  let res = await fetch(url, buildInit(token));
  if (res.status === 401) {
    cachedToken = null;
    token = await getToken(true);
    res = await fetch(url, buildInit(token));
  }
  const data = (await res.json()) as RexEnvelope<T>;
  if (!res.ok || data.error || data.result == null) {
    const detail = data.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`Rex ${method} failed: ${detail}`);
  }
  return data.result;
}

export type RexCriterion =
  | { name: string; value: string | number | boolean }
  | { name: string; value: Array<string | number>; type: "in" };

const DEFAULT_EXTRA_FIELDS = [
  "subcategories",
  "advert_internet",
  "images",
  "floorplans",
  "links",
  "events",
  "features",
  "tags",
  "meta",
] as const;

const PUBLIC_LISTING_CRITERIA: RexCriterion[] = [
  { name: "listing.publish_to_external", value: true },
];

export async function searchPublishedListings(
  args: {
    criteria?: RexCriterion[];
    extraFields?: readonly string[];
    resultFormat?: string;
    offset?: number;
    limit?: number;
  } = {},
  opts: FetchOpts = { tags: ["listings"], revalidate: 600 },
): Promise<RexPublishedListing[]> {
  return call<RexPublishedListing[]>("PublishedListings/search", {
    criteria: [...PUBLIC_LISTING_CRITERIA, ...(args.criteria ?? [])],
    result_format: args.resultFormat ?? "website_overrides_applied",
    limit: args.limit ?? 100,
    offset: args.offset ?? 0,
    extra_options: { extra_fields: args.extraFields ?? DEFAULT_EXTRA_FIELDS },
  }, opts);
}

export async function readPublishedListing(
  id: string,
  opts: FetchOpts = { tags: ["listings", `listing:${id}`], revalidate: 600 },
): Promise<RexPublishedListing | null> {
  try {
    return await call<RexPublishedListing>("PublishedListings/read", {
      id,
      result_format: "website_overrides_applied",
      extra_fields: DEFAULT_EXTRA_FIELDS,
    }, opts);
  } catch (err) {
    if (err instanceof Error && /not found|no record/i.test(err.message)) return null;
    throw err;
  }
}

export function isRexConfigured(): boolean {
  return Boolean(USER && PASS);
}
