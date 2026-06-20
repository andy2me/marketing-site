# Rex admin handoff — enable website lead capture (Contacts → Create)

**For:** Max Property's Rex administrator
**From:** onefivethree (website team)
**Time required:** ~5 minutes
**Related:** `docs/REX-ADMIN-SETUP.md` (full read-only user setup), `docs/FORMS-SETUP.md`

---

## Why this is needed

The new website's enquiry forms (appraisal requests, property enquiries, contact,
newsletter) now create a **contact** in Rex automatically, so leads land in the CRM
instead of just an inbox. To do that, the website's Rex API user needs permission to
**create contacts**.

This is the **only** thing the website ever writes to Rex. Everything else — listings —
stays strictly read-only. No existing contacts, listings, or other records are ever
edited or deleted.

---

## What to change

The website logs in to Rex as a dedicated API user (created per
`docs/REX-ADMIN-SETUP.md`). That user is currently provisioned **read-only**, with
**Contacts = None**. Change just that one permission group:

> **Contacts → enable _Create_** (keep Read; leave **Edit**, **Delete**, **Export**,
> **Import**, **Bulk actions** unticked).

Pick the scenario that applies:

### Scenario A — the API user already exists
1. Rex → your name (top right) → **Settings** → **Users & security**.
2. Open the website API user (e.g. *API — Max Property Website*).
3. Go to the **Permissions** tab (or "Security profile").
4. Find the **Contacts** group and tick **Create** (and **Read** if not already on).
   Leave Edit / Delete / Export / Import / Bulk unticked.
5. **Save.**

### Scenario B — the API user has not been created yet
Follow `docs/REX-ADMIN-SETUP.md` to create the read-only user, but in **Step 2** set
the **Contacts** row to **Create** (read + create) instead of None. Everything else in
that walkthrough is unchanged. Then send the credentials back as described there.

---

## What to send back

- If you changed an existing user (Scenario A): just confirm **"Contacts → Create is enabled"** — no credentials needed.
- If you created the user (Scenario B): send the **username (email)** and **password**
  (and `account_id` if you have multiple Rex accounts) via an encrypted channel
  (1Password share / Signal) — **not** plain email or Slack DM.

Send to: **andy@onefivethree.co**

---

## How to verify (optional)

You don't need to test — the website team will confirm end to end by submitting a test
form and checking the contact appears in Rex. If you want to sanity-check from your side,
after the change is live ask the website team to submit a test enquiry; a new contact
named from the test (or "Website lead") should appear in **Contacts** within a minute.

---

## Permissions summary (after this change)

| Group | Access |
|-------|--------|
| Listings | Read |
| Properties | Read |
| **Contacts** | **Read + Create** ← the change |
| Images & media | Read |
| Agents / Users (public profile) | Read |
| Everything else | None |

---

## Rolling it back

To stop the website writing leads to Rex: open the API user → **Permissions** →
untick **Contacts → Create**. The website keeps working (listings unaffected); form
submissions still reach the team by email, and the Rex write simply logs a permission
error until re-enabled. To disconnect the site from Rex entirely, **Disable** the user.
