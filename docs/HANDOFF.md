# Max Property — Session Handoff

**Date:** 2026-05-22 · **For:** picking up in a fresh Claude Code session.

---

## TL;DR
The full 8-page site is built on mock data behind swappable seams, deployed live to Vercel (personal Hobby), repo on a personal GitHub account. Lots of state is parked. The main open question is **CRM choice** (Max's director is open to moving off Rex). Migration artifacts (listings CSV + Rex-import xlsx + 193 photos) are local and ready. Everything plugs into the same seam — so the CRM decision doesn't change the site architecture.

---

## Live / Repo / Local
- **Live preview:** Vercel personal scope (Hobby), production deployment auto-built from the active branch. Stale `vercel.com/max-property` team-scope status on old commits is the failed Hobby gate from before the personal-repo move — ignore it.
- **Repo:** [https://github.com/andy2me/marketing-site](https://github.com/andy2me/marketing-site) (private personal).
- **Branches (remote):** `main`, `feat/foundation-slice`, **`feat/appraisal-builder`** — all currently pointed at the same tip (`2729e92` at the time of this handoff) **plus my new commit `5c46211` (REA reviews seam) on `feat/appraisal-builder`**. Default branch on GitHub: `feat/foundation-slice` (could flip to `main` now that it exists). **The active dev branch is `feat/appraisal-builder`** — that's what Andy's been committing to (portraits, comparable sales, marketing copy, the Wurtulla feature, etc.).
- **Parallel work going on:** Andy has been building an **Appraisal Builder** product in this same repo (recent commits: agent portraits incl. Matt Powe, hero photos, comparable-sales links to source listings, Wurtulla feature). My website work touches the marketing pages + seams; the appraisal-builder work touches related areas — coordinate before sweeping edits next session.
- **Project root:** `/Volumes/AT/Max Property/max-property`
- **Local dev:** `pnpm dev` → http://localhost:3000 (preview launch port lately: **3100**; port 3000 sometimes in use).
- **`AGENTS.md` reminder:** Next.js 16 has breaking changes — **read `node_modules/next/dist/docs/`** before writing any Next-specific code.

---

## What's built (foundation)
8 in-scope templates from the design package:
`/` Home · `/sell` · `/buy` · `/properties/[slug]` · `/locations` · `/insights` · `/team` · `/contact` (+ `/insights/[slug]` stub — design TBC; `/privacy`+`/terms` stubs).

**Seams** (typed contracts + mock now; swap to live later — pages/URLs/filtering unchanged):
- `lib/rex/` — listings (CRM)
- `lib/wp/` — editorial content (WordPress headless)
- `lib/reviews/` — **REA Ratings & Reviews** (NEW this session)
- `components/forms/DoorstepForm` — forms (Doorstep TBC)

**Last session's evolution:** the testimonials section ("Vendor stories") now reads from the REA reviews seam — functional carousel, `4.9 · realestate.com.au`, ready to swap to the REA Ratings & Reviews API when access lands. Per-agent fields baked in for when the team grows.

---

## Open decisions (in priority order)
1. **CRM** — Max's director is open to moving off Rex (frustration with Rex's UX + average support). A sourced shortlist sits in chat: **LockedOn** (ease of use) and **VaultRE / MRI Vault** (best API) are the standouts; **AgentBox / Reapit Sales** is the heavier all-rounder. Demos to be booked. *From the site's POV any of them is fine — all three support REAXML feed + API.*
2. **Property URL scheme** — recommend ID-suffixed (`/properties/<street>-<suburb>-<id>`) for uniqueness/stability. Feeds the mapper once the CRM API lands.
3. **`main` / PR topology** — **`main` now exists on the remote** (all three branches point at the same tip). Outstanding: decide whether to switch GitHub's default branch to `main` and adopt feature → PR → main as the flow, instead of pushing direct to the feature branch.
4. **Vercel Pro + org move at launch** — currently personal Hobby (non-commercial). At launch: upgrade Vercel **to Pro/Team**, transfer the GitHub repo back into a **Max-owned org**, reconnect the Vercel project to that org repo — **in that order**.

---

## Open external threads
- **Rex API enquiry submitted** via Rex's CRM API form. Awaiting response. The reply email + form-input answers are saved in `docs/REX-API-EMAIL.md`.
- **`REVIEW.md`** (repo root) — awaiting Andy's per-page frontend notes; once populated, I'll work through them page by page.
- **Properties-Rex-Import-MaxProperty.xlsx** — awaiting 4 street numbers + confirming "Matt Powe" matches the Rex user, before Rex's onboarding manager runs the import. Detailed notes in `docs/REX-IMPORT-NOTES.md`.

---

## Files generated this session (all **local / untracked** per your preference)
- `REVIEW.md` (page-by-page frontend review template)
- `docs/REX-SETUP.md` (Rex integration setup checklist; updated this session with "Chosen path: API")
- `docs/REX-API-EMAIL.md` (reply email + form answers for Rex)
- `docs/REX-IMPORT-NOTES.md` (mapping notes for the Rex Properties import)
- `docs/HANDOFF.md` ← this file
- `data/max-listings.csv` — **21 listings** (3 active, 18 sold), unified file with `listing_state` + granular `status`
- `data/Properties-Rex-Import-MaxProperty.xlsx` — Rex template, ImportData filled
- `data/listing-images/<slug>/…` — **193 photos / 50 MB** (gitignored)
- `scripts/scrape-listings.py` — combined scraper (active + sold), reusable
- `scripts/download-images.py` — image downloader, idempotent

---

## Recommended entry points next session
- **Frontend review** — when `REVIEW.md` is populated, I'll work through it page by page. Best lever toward launch and needs nothing from Rex.
- **CRM choice** — book LockedOn + VaultRE demos; I can join on integration questions; once decided, I wire the chosen CRM's API.
- **Article template** (`/insights/[slug]`) — design TBC; can stub a basic layout if you want progress here.
- **Mobile responsive review** + **accessibility audit** — both §17 deliverables, can run anytime.
- **Old WP → new URL redirect map** — script a crawl + build the 301 map for SEO continuity.

---

## Architecture quick refresher
- **Stack:** Next.js 16 (App Router, RSC, Turbopack) · TS strict · CSS Modules + `styles/tokens.css` · pnpm · Node 20 (`.nvmrc`).
- **Route groups:** `(marketing)` (editorial) and `(app)` (interaction-rich); each its own layout + Footer; Headers per-page (transparency varies).
- **Rendering:** static / ISR by default; `/buy` filtering is client-side over the ISR-cached set; `/properties/[slug]` is SSG via `generateStaticParams`.
- **Seam pattern:** `lib/<integration>/{types.ts, mock.ts}` → replace with `client.ts` + `mappers.ts` once access is sorted. Call sites don't change.
- **Env vars contract** in `.env.example`; `.env*` gitignored (except `.env.example`).

---

## Critical reminders (don't lose these)
- **`main` exists now** but the safety classifier may still gate direct pushes to it; pushes happen on `feat/appraisal-builder` (the active branch). Open PRs to `main` for substantive merges.
- **Vercel Hobby is non-commercial** — fine for previews; **must upgrade to Pro before going live commercially.**
- The project lives on `/Volumes/AT/…`, a non-native volume that sprays `._*` files everywhere — gitignored, but watch for them. `find -delete` chained with `&&` short-circuits; use `;`.
- **Always read `node_modules/next/dist/docs/`** before writing Next-specific code (Next 16 has breaking changes: async params, `next lint` removed, Turbopack by default, etc.).
- The **dev `pnpm dev` / build `pnpm build`** can't run concurrently in Next 16 (lockfile) — stop one before the other.
- **macOS `.md` files** open as plain text by default — read inline if Finder won't open them.

---

## How to bring a fresh session up to speed
Point Claude at this file (`docs/HANDOFF.md`) and `REVIEW.md` (if populated) and the relevant `docs/REX-*.md`. The session will:
1. See the working tree state via `git status` and the project structure.
2. Read this handoff for context.
3. Pick up from any "next session entry point" above.

The committed branch state is current as of this handoff; uncommitted artifacts (docs/data/scripts above) live locally on the volume.
