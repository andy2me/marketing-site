# Forms & lead handling (§9)

How website form submissions are captured, delivered, and pushed to the CRM. This
replaces the earlier Doorstep/Horace seam, which was dropped.

## Why first-party

Every form is a native, responsive `<form>` that submits to a **same-origin**
route (`/api/leads`) via `fetch`. There is no third-party script, iframe, or embed,
so ad blockers and browser tracking-protection have nothing to match against and
can't break submission. The forms also render and lay out at every breakpoint
because they're our own design-system components, not an embedded widget.

## Flow

```
LeadForm (client)                app/api/leads/route.ts (server)
  native <form>          POST       ├─ rate-limit (per IP)
  + hidden context  ───────────▶    ├─ honeypot + fill-time trap
  + honeypot + _ts                  ├─ normalise → Lead
                                    ├─ Resend email to the team   (primary)
                                    └─ Rex Contacts/create        (best-effort)
```

- **`components/forms/LeadForm.tsx`** — the single client seam. Stable props
  `formId` / `prefill` / `onSubmit`. `prefill` is rendered as hidden inputs so
  context we already know (listing address, enquiry type, agent) is **never
  re-asked**. It also injects the honeypot + timestamp fields.
- **`app/api/leads/route.ts`** — the intake. Validates, de-spams, normalises, and
  fans out to the two channels.
- **`lib/leads/`** — `types.ts` (normalisation), `email.ts` (Resend), `rate-limit.ts`.
- **`lib/rex/contacts.ts`** — lead → Rex contact, reusing the listings auth/token.

Email is the **primary, guaranteed** channel; Rex is **best-effort** — a CRM
failure is logged but never loses a lead the inbox already has. If neither channel
is configured (local dev without keys), the route logs the lead and returns `ok`.

## "Don't ask twice"

The contact form already swaps its fields by enquiry type. Beyond that, any context
the page knows is passed via `prefill` and travels as hidden fields:

- property pages → `listing` (street address)
- agent cards → `agentId` / `agentName`
- contact page → `enquiry` type

These appear in the notification email and the Rex contact note, and the visitor is
never asked for them.

## Spam protection (no blockable third-party JS)

1. **Honeypot** — a hidden `_company` field; submissions that fill it are silently dropped.
2. **Fill-time trap** — a render timestamp (`_ts`); sub-1.5s submissions are dropped.
3. **Rate limit** — in-memory, 5 submissions / 10 min per IP (`lib/leads/rate-limit.ts`).

All three are enforced server-side. The rate limiter is per-instance; if abuse ever
warrants it, swap its store for Upstash/Redis behind the same interface.

## Configuration

Server-only env vars (never `NEXT_PUBLIC_*`). See `.env.example`.

| Var | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key (transactional email) |
| `LEADS_EMAIL_TO` | Recipient(s), comma-separated |
| `LEADS_EMAIL_FROM` | Verified sender, e.g. `Max Property <leads@maxproperty.au>` |
| `REX_USERNAME` / `REX_PASSWORD` | Reused from the listings integration |

### Resend
1. Create a Resend account and **verify the sending domain** (DNS records) so
   `LEADS_EMAIL_FROM` is authorised — otherwise mail won't deliver reliably.
2. Add the key + addresses to Vercel (Production **and** Preview) and `.env.local`.
3. Volume here is one notification per submission — comfortably inside Resend's
   free tier.

### Rex
The lead → contact write reuses the listings credentials, but the Rex API user is
provisioned read-only with **Contacts = None**. Bump it to **Contacts → Create**
(see `docs/REX-ADMIN-SETUP.md`). Until then, email still works and the Rex push
just logs an error.

> The exact Wings payload for `Contacts/create` should be confirmed against
> <https://api-docs.rexsoftware.com>. The mapping is isolated in
> `lib/rex/contacts.ts → toRexContact()` so any field-name change is a
> one-function edit.

## Adding or changing a form

- New form field → just add the input; it flows through to the email and Rex note
  automatically (non-core fields are passed through verbatim).
- New form → render `<LeadForm formId="…">` with your fields. Add the `formId` to
  `kindFromFormId()` in `lib/leads/types.ts` if it needs its own label.
