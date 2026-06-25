# Max Property — maxproperty.au

Website reboot for a boutique Sunshine Coast (Noosa) estate agency. Headless
**Next.js (App Router)** front-end. See the project's code handoff (Phase 2) for the full
architecture spec; section references below (e.g. §8) point to it.

## Status — foundation slice

This is the **first build pass**: the stack, design system and shared shell stood up and
proven against one fully-built reference page (**Home**). The other seven templates are
routed stubs. Live integrations (Rex, WordPress, brand fonts) are isolated behind
typed seams with mock data, so wiring them later is a swap, not a rewrite. Forms are
wired live: a first-party `/api/leads` route emails the team and creates a Rex contact.

| Area | State |
|---|---|
| Scaffold, tokens, fonts, shared shell, section primitives | ✅ built |
| Home (`/`) reference page | ✅ built (mock content) |
| Sell · Buy · Locations · Insights · Team · Contact · legal | 🔲 routed stubs |
| `sitemap.ts` · `robots.ts` · `not-found` · `/api/revalidate` | ✅ scaffolded (revalidate is a stub) |
| Rex listings · WordPress content · MapLibre · analytics | ⏳ seams only (mock) |
| Forms → first-party `/api/leads` → Resend email + Rex contact/lead | ✅ built |

## Stack

Next.js 16 (App Router, RSC, Turbopack) · TypeScript strict · CSS Modules + `styles/tokens.css`
· `next/font` · pnpm · Node 20 LTS (Vercel parity; see `.nvmrc`).

> **Next.js 16:** read `AGENTS.md` — bundled version-matched docs live in
> `node_modules/next/dist/docs/`. Consult them before writing Next-specific code.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build (Turbopack)
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint (next lint was removed in v16)
```

## Structure

```
app/
  layout.tsx            # html lang="en-AU", fonts, tokens, base metadata
  (marketing)/          # editorial register — Footer in layout; Header per-page
    page.tsx            #   Home (/)  ← the built reference page
    sell|locations|insights|insights/[slug]|team|contact|privacy|terms
  (app)/                # app-like register — /buy, /properties/[slug]
  sitemap.ts robots.ts not-found.tsx api/revalidate/route.ts
components/  layout/ ui/ property/ forms/ sections/ icons/ home/
lib/         rex/ (listings + contacts) wp/ (content) leads/ (forms→email+CRM) seo/
styles/      tokens.css (ported verbatim) globals.css
```

## Integration seams — swap paths

- **Listings (Rex, §8):** `lib/rex/types.ts` is the app-facing contract. `lib/rex/mock.ts`
  → replace with `client.ts` + `mappers.ts`; call sites (`getActiveListings`,
  `getFeaturedListings`, `getListingBySlug`) stay identical.
- **Content (WordPress, §7):** `lib/wp/types.ts` + `lib/wp/mock.ts` → replace with WPGraphQL
  queries returning the same shapes.
- **Forms (§9):** all forms go through `components/forms/LeadForm.tsx`
  (`formId` / `prefill` / `onSubmit`), which posts FormData to the same-origin
  `app/api/leads/route.ts` — first-party, so ad blockers can't break it. The route
  emails the team (Resend) and writes to Rex via `submitLeadToRex` (`lib/rex/leads.ts`):
  find-or-create contact, then create a lead carrying the listing/property association
  for property-page enquiries. See `docs/FORMS-SETUP.md`.
- **Fonts (§5):** `lib/fonts.ts` wires the prototype substitutes (Instrument Serif / Geist /
  Geist Mono) to `--font-heading` / `--font-body` / `--font-mono`. When the Pangram Pangram
  licence lands, swap to `next/font/local` (PP Migra / PP Neue Montreal) keeping the same
  variable names — nothing else changes.
- **Map (§8):** the Locations/Properties schematic becomes MapLibre GL with real `coords`.

## Blocked on external inputs (code handoff §17)

Rex API access (+ Contacts→Create for lead writes) · Resend key + verified sender ·
PP web-font licence · real photography
· old→new 301 redirect map. `.env.example` lists every variable; none are needed for the
foundation slice (mock data).
