# Rex Integration — Setup Checklist

Connecting live property listings from Rex (code handoff §8).

- **Status:** code seam is built (`lib/rex/`) and revalidate route is wired. **Blocked only on credentials** from Max's Rex admin.
- **Principle:** the site is **read-only** — it consumes listings, never writes back. Agents keep managing listings in Rex.
- **Owners:** **Max** holds the Rex account · **Andy/onefivethree** coordinates · **Dev** wires it up.

## Chosen path: Rex CRM API (Wings) ✅
Picked the API over REAXML/FTP — fits Vercel ISR with no FTP server to maintain. Wings is Rex's full REST surface (the same one their JS SDKs use).

---

## Phase A — Gather from Rex  _(owner: Max + Andy)_  · **done**

| Item | Answer |
|---|---|
| Base URL | `https://api.rexsoftware.com` |
| Auth | `Authentication::login` → returns session token → `Authorization: Bearer <token>` on every call. Default lifetime 1h; we request the max (1 week). |
| Endpoint (collection) | `POST /v1/rex/PublishedListings/search` with `criteria: [{name: "listing.publish_to_external", value: true}]` and `result_format: "website_overrides_applied"` |
| Endpoint (single) | `POST /v1/rex/PublishedListings/read` `{id}` |
| Status vocabulary | `system_listing_state`: `current` / `sold` / `leased` / `withdrawn`. Combine with `under_contract` (truthy → "Under Offer") and presence of an auction event for "Auction". |
| Coordinates | `address.latitude` / `address.longitude` (strings) — yes, included. |
| Rate limit | 3,600 requests/hour per account. (Our ISR caching keeps us in low double digits/hour.) |
| Webhooks | Yes — `AdminWebhooks::create` with `v1_context_only` format. Subscribe to `listings.created/updated/deleted`. |
| Sandbox | None offered — we test against live with the read-only user. |

The unknown that remains: **the credentials themselves**. See **`docs/REX-ADMIN-SETUP.md`** — the walkthrough Max's admin follows to create the read-only user.

## Phase B — Wire it up  _(owner: Andy → Dev)_

- [x] _(Dev)_ Build `lib/rex/client.ts` — server-only Wings client with session-token cache, 401-retry, and tagged ISR fetch.
- [x] _(Dev)_ Build `lib/rex/mappers.ts` — Rex `PublishedListing` → `Listing`.
- [x] _(Dev)_ Swap mock getters → client at all call sites. `lib/rex/index.ts` env-gates: falls back to mock when `REX_USERNAME`/`REX_PASSWORD` are unset.
- [x] _(Dev)_ Wire `/api/revalidate` — Rex webhook → `revalidateTag('listings', {expire:0})` + per-listing tags.
- [ ] _(Max admin)_ Create the read-only Rex user per `docs/REX-ADMIN-SETUP.md`.
- [ ] _(Andy)_ Drop credentials into Vercel env (Production + Preview): `REX_USERNAME`, `REX_PASSWORD`, optional `REX_ACCOUNT_ID`, `REX_WEBHOOK_SECRET`. Mirror into local `.env.local`.
- [ ] _(Max admin)_ Subscribe the production webhook in Rex once `REX_WEBHOOK_SECRET` is set (see `REX-ADMIN-SETUP.md` § Step B).
- [ ] _(Dev)_ QA against live: `/buy` filters / sort, `/properties/[slug]`, sitemap, webhook end-to-end.

---

## Locked decisions

- **URL scheme:** ID-suffixed (`/properties/24-hilltop-crescent-noosaville-<rexId>`). Stable across address edits; unique even if two streets repeat.
- **Status mapping:** see Phase A table above — implemented in `lib/rex/mappers.ts`.
- **Caching:** Next 16 ISR via `fetch` tags + webhook-driven `revalidateTag(..., {expire:0})`. 10-minute revalidate window as a fallback when the webhook isn't subscribed yet.

---

## Notes

- Rex docs (live): `https://api-docs.rexsoftware.com`
- Rex contact: _<add Rex account manager / support contact>_
- Max Rex admin: _<add name>_
- Target go-live: _<add date>_
