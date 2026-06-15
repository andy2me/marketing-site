# Rex Properties Import — Mapping & Notes

Generated from the scraped old-site listings, mapped onto Rex's **Properties** import template.

- **Source data:** `data/max-listings.csv` (21 listings — 3 Active, 18 Sold)
- **Filled template:** `data/Properties-Rex-Import-MaxProperty.xlsx` → sheet **ImportData** (Guide + Sample left intact)
- **Template:** `Properties-Rex-Templ_…_20220318050919.xlsx` (Rex Properties import)

## ⚠️ Important: this is a *Properties* import, not *Listings*
Rex separates the **Property** (physical asset + owner + attributes) from the **Listing** (the sale/lease *campaign* that carries **price, sale method, and For Sale / Under Offer / Sold status**). This template has **no price or status column**, so:
- **Status** is carried provisionally in **`tags`** (`Active, Under Offer` / `Active, For Sale` / `Sold`).
- **Price + provenance** are preserved in the **`note`** footer, e.g. `[Migrated from maxproperty.au · Sold · $955,000 · <url>]`.
- To migrate **price + campaign status properly**, request Rex's **Listings / Sales import template** — the price data is ready in `max-listings.csv` to feed it.

## Column mapping (ours → Rex `ImportData`)
| Our field | Rex column | Notes |
|---|---|---|
| slug | `old_id` | reference to old system |
| agent_name | `record_owner_name` | **must match a Rex user exactly** (all = "Matt Powe") |
| — | `property_category` | set to `Residential` for all |
| full_address → split | `adr_unit_number`, `adr_street_number`, `adr_street_name` | parsed `unit/number name` |
| suburb / state / postcode | `adr_suburb_or_town` / `adr_state_or_region` / `adr_postcode` | **must match Rex's valid AU suburb list** |
| beds / baths / cars | `attr_bedrooms` / `attr_bathrooms` / `attr_garages` | cars→garages (see flag) |
| land | `attr_landarea` + `attr_landarea_unit`=`m2` | only where present |
| description | `note` | + migration footer (status/price/source) |
| image_urls[0] | `property_image_url` | single value only (see flag) |
| listing_state + status | `tags` | status surrogate |

## Needs a manual touch before import
1. **Street number missing (4 rows)** — Rex requires `adr_street_number`. Fill from Rex/agent records:
   `keel-court-noosaville`, `warana-street-noosa-heads`, `noosa-springs-drive-noosa-heads`, `hendry-street-tewantin`.
   (Street *name* + suburb derived from the slug; number wasn't on the public page.)
2. **`record_owner_name` = "Matt Powe"** — confirm this exactly matches the Rex user, else records fall to a system user.
3. **Suburb/state validity** — Rex validates `adr_suburb_or_town` against its AU list; all are standard Noosa-shire suburbs but worth a glance (Pomona/Cooroy/Cooran included).
4. **`cars` → `attr_garages`** — the old site had a single "cars" figure; mapped to garages. Reassign to `attr_carports` / `attr_open_spaces` if you know better. 2 rows have no car value.
5. **Images** — only the primary image is in `property_image_url` (Rex's field is single-value); full galleries stay in `max-listings.csv` (`image_urls`). **Flag:** `3/3 Sylvia Street` (the villa) had only 1 structured image and it appears to reference another listing's drone shot — verify before relying on it.
6. **Descriptions** — 12 of 21 were truncated on the old site (`description_truncated=yes`); the `note` still preserves price/provenance, but copy full text from the live page if it matters.

## Suggested next steps
1. Fill the 4 street numbers; confirm the Rex user name + suburb validity.
2. Import this file via Rex (or hand to the Rex onboarding manager named in the Guide sheet).
3. Request Rex's **Listings** import template to migrate price + campaign status (active board + sold history), feeding from `max-listings.csv`.
4. Then point the new site at Rex (per `docs/REX-SETUP.md`) and the listings flow through automatically.
