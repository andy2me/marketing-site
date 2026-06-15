# Rex — reply email requesting API details

> **Superseded — kept for record only.** Rex replied (June 2026) with the API details we needed. The pull path is now in **`docs/REX-SETUP.md`**, and the admin walkthrough for Max is in **`docs/REX-ADMIN-SETUP.md`**.

Context: Rex support offered two ways to get data out — (1) REA Standard XML via FTP, or
(2) their API to pull data directly. **We chose the API** (it fits the Vercel/ISR pull model;
no FTP server to stand up). This is the reply we sent.

---

**Subject:** Re: (Rex support thread)

Hi [name],

Thanks, that's really helpful. Let's go with the **API integration** — the new site is a custom build that pulls listings directly, so an API fits us better than the FTP/REAXML feed.

Could you send through the API details? When you do, it'd be great to also confirm:

- **Authentication** method, and whether you can set up a **dedicated read-only API user** for the website (rather than a personal login).
- The **endpoints** to retrieve **all current listings** and **a single listing** (incl. pagination / rate limits).
- Whether listing data includes **geo-coordinates (lat/long)**.
- Whether a **listing change can trigger a webhook**, so the site refreshes promptly.
- A **sample listing response**, so our developer can map the fields.

Our agency / account: **[Max Property — account name / Agency ID]**.

Thanks again,
Andy
onefivethree

---

## What to do with the reply
Forward Rex's API details to dev. They unblock:
- `REX_API_BASE` / auth creds → env vars (server-only; ideally the read-only service user)
- `lib/rex/client.ts` (auth + token caching/refresh) and `lib/rex/mappers.ts` (Rex → `Listing`)
- the `/api/revalidate` webhook (if supported) or a timed ISR fallback
