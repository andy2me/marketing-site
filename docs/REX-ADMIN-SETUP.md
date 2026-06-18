# Rex — read-only API user setup

A walkthrough for **Max's Rex admin** to provision the user that the new website will log in as. Takes ~10 minutes.

> **Why a dedicated user?** Rex's own integration guide:
>
> > "It is imperative that authorization tokens are not exposed to the frontend JavaScript at all. This represents a major security risk for the agency... Any integrations which expose bearer tokens publicly will be disabled without notice."
>
> The website logs in as this user and holds the session token **server-side only**. If we ever needed to revoke access (developer leaves, suspected leak, swapping vendors), disabling this one user kills the integration cleanly — no shared personal accounts, no scope creep.

---

## What you need before starting

- Your Rex login (must have **admin** rights — i.e. you can see *Settings → Users & security*).
- A working email address for the new user. A team alias is ideal (e.g. `dev@maxproperty.au` or an "info+website@" alias). It does **not** need to receive mail — Rex sends a password setup link once.
- 10 minutes.

---

## Step 1 — Create the user

1. In Rex, click your name (top right) → **Settings**.
2. Open **Users & security** in the left sidebar.
3. Click **+ New user** (top right of the user list).
4. Fill in:
   - **First name:** `API`
   - **Last name:** `Max Property Website`
   - **Email:** the alias from above
   - **Role / Title:** *(leave blank — this user is never on a listing)*
5. **Important:** uncheck "Send welcome email" if shown, **or** intercept the email — we'll set the password manually so it doesn't expire.
6. Save.

The user appears in the list with status *Pending invitation* or similar.

## Step 2 — Set the permissions to read-only

Open the user you just created → **Permissions** tab (or "Security profile" depending on your Rex version).

Set every permission group below to **Read** only. Untick **Create**, **Edit**, **Delete**, **Export**, **Import**, **Bulk actions** wherever they appear.

| Group | Required access |
|-------|-----------------|
| **Listings** | Read |
| **Properties** | Read |
| **Contacts** | None (untick everything) |
| **Accounts / Companies** | None |
| **Tasks / Activity** | None |
| **Reports** | None |
| **Settings / Admin** | None |
| **Users & security** | None |
| **Trust / Financial** | None |
| **Images & media** | Read *(listing photos and floorplans)* |
| **Agents / Users (public profile)** | Read *(so we can show agent name + photo on listings)* |

If your Rex tier has additional modules (Property Management, Knock, etc.), set them all to **None** unless they're listing-adjacent.

If there's an "API access" or "Allow API authentication" toggle on this user, **enable it**. (On some Rex tiers this is implicit and the toggle won't appear.)

Save.

## Step 3 — Set a password and capture it

1. Still on the user, click **Set password** / **Reset password** / **Send password setup link** (the wording varies).
2. Either:
   - **Set it yourself** to a strong random string — at least 24 characters, mixed case + digits + symbols. A password manager generator is fine. Capture it; you won't be able to read it back.
   - **Or** click the setup link Rex emails to the alias and choose the password there.
3. Send Andy (`andy@onefivethree.co`) the **username (email)** and **password** via 1Password share, Signal, or another encrypted channel. **Not** plain email, **not** Slack DM.

## Step 4 — (If asked) tell us your Rex account ID

Some Rex installs have multiple accounts under one login. If so, the login response will require an `account_id`. Find yours:

1. Rex top-right menu → **Switch account** (only appears if you have more than one).
2. If only one account, you can ignore this step — leave `REX_ACCOUNT_ID` blank.
3. If multiple, note the numeric ID shown next to the account name and send it along with the credentials.

## Step 5 — Confirm it works (optional sanity check)

You don't have to test from your side — Andy/Dev will. But if you want to confirm the user can log in, just try logging into Rex in an incognito window with the new credentials. You should see Rex's normal UI, but most menus will be greyed out or empty. That's correct.

---

## What happens next

- Andy adds the credentials to the website's server-side environment variables. They're **never** sent to a browser.
- The site starts pulling **published** listings only (`listing.publish_to_external = true`) — anything you mark internal/off-market stays invisible.
- Listing edits in Rex flow to the live site within ~10 minutes by default, or **immediately** once we wire the webhook (Step B below).

## Step B (optional, later) — webhook for instant updates

When you're ready, in Rex go to **Settings → Webhooks** → **+ New webhook**:

- **URL:** `https://maxproperty.au/api/revalidate?secret=<REX_WEBHOOK_SECRET>` *(Andy will provide the secret)*
- **Events:** `listings.created`, `listings.updated`, `listings.deleted`
- **Format:** `v1_context_only`
- Save.

Without this, the site refreshes on a 10-minute timer. With it, edits appear within seconds.

---

## Revoking access

To disconnect the website from Rex at any time: open the user → **Disable** (or **Delete**). The site falls back to its last cached listings and stops updating. Andy will see the failed logins in Vercel logs.
