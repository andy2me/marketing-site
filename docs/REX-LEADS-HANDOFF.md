# Rex admin handoff — enable website Lead capture (Leads → Create)

**For:** Max Property's Rex administrator
**From:** onefivethree (website team)
**Time required:** ~5 minutes
**Related:** [`docs/REX-ADMIN-SETUP.md`](./REX-ADMIN-SETUP.md) (initial read-only user setup),
[`docs/REX-CONTACTS-HANDOFF.md`](./REX-CONTACTS-HANDOFF.md) (previous Contacts → Create step),
[`docs/FORMS-SETUP.md`](./FORMS-SETUP.md).

---

## Why this is needed

The website's enquiry forms (appraisals, property enquiries, contact, newsletter,
lead-magnet downloads) used to create only a **contact** in Rex. Contacts don't
appear in the **Leads** log, don't get auto-assigned to an agent, and don't carry
an association back to the listing the enquiry was about.

The forms now create a **lead** as well — and that lead is what populates the
Leads stream, gets assigned to Matt, and (for property-page enquiries) shows up
on the listing's stream alongside the campaign.

For the website's Rex API user to do this, it needs **Leads → Create** in
addition to the Contacts permission it already has.

This remains the **only** category of write the website makes to Rex. Listings
are read-only; nothing existing is edited or deleted.

---

## What to change

The website logs in to Rex as a dedicated API user (created per
[`docs/REX-ADMIN-SETUP.md`](./REX-ADMIN-SETUP.md)). Tick **Create** on the
**Leads** permission group for that user — keep Read; leave Edit / Delete /
Export / Import / Bulk actions unticked.

### Step-by-step
1. Rex → your name (top right) → **Settings** → **Users & security**.
2. Open the website API user (e.g. *API — Max Property Website*).
3. Go to the **Permissions** tab (or "Security profile").
4. Find the **Leads** group and tick **Read** + **Create**.
5. **Save.**

If you didn't enable Contacts → Create in the earlier round, tick that too while
you're here (see [`docs/REX-CONTACTS-HANDOFF.md`](./REX-CONTACTS-HANDOFF.md)).

---

## Lookup — three values for Andy

Once permissions are saved, Andy needs three tenant-scoped ids from Rex so the
website routes leads correctly. Two are picked from existing dropdowns; one is
the user id Matt's account uses.

| Value | Where to find it |
|---|---|
| **Lead source: "Website"** | Settings → **Lead sources**. If a "Website" entry exists, send Andy its **id**. If not, please **add one** (label: "Website"; active: yes) and send the new id. |
| **Lead types** | Settings → **Lead types**. Send Andy the full list (id + label) so we can map each form to the right type — at minimum confirm the slugs for "Appraisal request", "Buyer enquiry" and "General enquiry". If those names don't exist, tell us what you call them. |
| **Assignee (Matt)** | Matt's user id in **Settings → Users & security** (the URL when you open his profile contains it, or it's visible on the user list). All website leads default to assigning to Matt unless we agree otherwise. |

Andy can also pull these automatically by running `pnpm rex:lookup` once
permissions are in place — that emits a Markdown report of every lead type,
lead source, and admin user the tenant has. So if it's easier, just save the
permission change above and Andy will pull the rest.

Send the values (or "I added a Website lead source — re-run the lookup") to
**andy@onefivethree.co**.

---

## How to verify (optional)

You don't need to test from your side — Andy/Matt will. When the lead-config is
populated and deployed, submitting any website form (e.g. the appraisal form on
`/sell`) should produce a row in the Rex **Leads** stream within a minute,
assigned to Matt, tagged `website` and `website-<form>`. A property-page enquiry
will additionally show on that listing's stream.

If something looks wrong (no lead, wrong assignee, missing association), shout
and we can re-check the mapping.

---

## Permissions summary (after this change)

| Group | Access |
|-------|--------|
| Listings | Read |
| Properties | Read |
| Contacts | Read + Create |
| **Leads** | **Read + Create** ← the change |
| Images & media | Read |
| Agents / Users (public profile) | Read |
| Everything else | None |

---

## Rolling it back

To stop the website writing leads: open the API user → **Permissions** → untick
**Leads → Create**. Listings and the email channel keep working; the Rex write
degrades to contact-only with a logged error until re-enabled. To disconnect
the site from Rex entirely, **Disable** the user.
