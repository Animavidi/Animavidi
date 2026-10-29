# Resend account mail — 29 October 2026

Implemented and ready for a real Worker secret. No real Resend key has been created, read, committed or used. Domain/DNS/region status below is supplied by Guido, not independently confirmed through Resend.

- Provider: Resend; sending domain mail.animavidi.com; expected region EU (Ireland).
- Fixed sender: Animavidi <no-reply@mail.animavidi.com>.
- Server-only secret: RESEND_API_KEY. The frontend never receives it.
- Domain verification is still pending. No DNS, subscription or production change was made.

## Transport and security

worker/src/accountMail.ts posts JSON only to https://api.resend.com/emails with a bearer secret, fixed sender, plain text and escaped HTML activation/reset links. There is no configurable public mock endpoint. Local tests inject fetch; the previous EMAIL transport exists only for server-side test compatibility when no Resend key is present. Deployed mail remains disabled when neither transport is configured.

Each message has a SHA-256 idempotency key derived from its complete payload. Transient network/429/5xx errors retry at most three times with an eight-second per-request timeout; permanent errors are not retried. Errors contain no recipient, key, provider response or token. Resend acceptance is not proof of inbox delivery.

Better Auth creates signed activation links valid for one hour and random reset tokens valid for 30 minutes. An activation-token digest is recorded in the existing beta verification table and atomically consumed with DELETE RETURNING before verification. Replays and expired links are rejected. Password reset atomically consumes Better Auth's stored token and revokes previous sessions. No schema migration is needed for this change.

Cloudflare execution context passes mail tasks to waitUntil. Reset responses do not wait for the recipient-specific mail request. Known and unknown addresses receive the same status/body, including when the provider rejects a registered user's email; original rate limits remain in force. The mock suite specifically holds delivery pending and checks that the API already returned. Failed background deliveries log a generic failure, and the visitor can request another link.

## Tests

- Resend fetch mock: endpoint, fixed sender, bearer-secret placement, payload, timeout signal, retry bounds, stable idempotency key and generic errors passed. No external API or email was used.
- Actual Better Auth with mocked Resend: registration, verification, concurrent activation replay rejection, activation expiry, reset expiry, concurrent reset replay rejection and generic unknown-address response passed. Provider failure and deliberately stalled delivery do not reveal account existence in the response.
- Existing backend account/privacy/session/deletion suite passed.
- Existing integrated browser suite passed again: mandatory login, local captured activation/reset links, migration/retry/recovery, photo bytes, mammals/birds, Passport, camps, two devices, conflicts, offline reload/reconnect, export, account switching/logout races and deletion. Viewports: mobile/tablet/desktop.
- Typecheck, ESLint, preview build and diff whitespace check passed. Build still has the previously documented approximately 515 KB main-chunk warning.

Real inbox delivery, Resend domain status and physical iOS/Android installation have not been verified. Prior native Cloudflare D1/R2/offline tests remain documented in Account_Cloud_Status.md; the Resend transport in this checkpoint is mock-tested only until access is provided.

## Guido's next action

1. Wait until Resend marks mail.animavidi.com Verified in the EU (Ireland) configuration.
2. Create an API key with sending access restricted to that domain where supported.
3. Store it only as RESEND_API_KEY on the isolated beta Worker animavidi-beta. Do not paste it into chat, source files, GitHub, frontend variables or a shell command argument.

From this repository directory, use the interactive secret prompt without deploying the shared beta:

```powershell
pnpm.cmd exec wrangler versions secret put RESEND_API_KEY --config worker/wrangler.preview.jsonc
```

This creates a Worker version; it does not promote it. Do not use wrangler secret put or deploy for this handoff. Keep production Worker animavidi-content-admin untouched. Tell the agent only that verification and secret configuration succeeded, plus the created version ID if shown; never send the key.

The agent can then assign the resulting version to the isolated accounts preview alias and test real registration, received activation, login, received reset, token reuse/expiry and session revocation using a confirmed test mailbox. Only after these checks and the remaining installation checks should the shared beta be promoted and its erasure-retry cron activated. Existing local journals must be imported from their original origin or explicitly exported/imported; no local data is deleted automatically.

## References

- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/dashboard/emails/idempotency-keys
- https://better-auth.com/docs/concepts/email


## Secret-version verification — 29 October 2026, 20:12 UTC

Guido reports the Resend domain Verified and supplied Worker version e0cf3b4d-0b1f-43ec-9da0-8e8ddc95e082 after secure local secret entry. Read-only Cloudflare inspection confirms:

- Script ETag matches candidate 14a3a6a7-f8c3-4dba-a764-c41010fc38de exactly (source c288448).
- All existing bindings are present: ASSETS, AUTH_EMAIL_FROM, CONTENT_DB (same beta database), MAMMAL_PHOTOS (same beta bucket), BETTER_AUTH_SECRET and the three administrator secrets. RESEND_API_KEY is an additional secret binding. Secret values were not retrieved and cannot be compared; presence is confirmed only.
- Compatibility date, flags, asset headers, redirects and API/media routing are retained. Cloudflare made assets.html_handling=auto-trailing-slash explicit. Read-only comparisons of /login, /login/, /passport, /passport/ and /index.html show identical status/redirect behaviour.
- All 42 checked HTML/JS/CSS/serviceworker/manifest/icon assets match the local candidate build byte for byte.
- Active shared beta remains 0e2cadf9-f44f-4a26-b3a5-a80758f6beee at 100 percent. Production remains bcd07c8e-f840-47c8-b32f-d8566b50a112. No deployment, alias update, migration, secret write or email request was performed in this check.

Direct isolated preview: https://e0cf3b4d-animavidi-beta.solitary-mountain-8958.workers.dev/

Prepared live test sequence: use only a user-approved test mailbox; register a dedicated test account on this exact origin; confirm actual receipt/from/link origin; open activation link and confirm login/replay rejection; request reset and confirm actual receipt; change the password and verify old-password/session rejection, new login and reset-link reuse rejection. Use a separate browser context without importing an existing personal journal. Retain the test account unless its cleanup is explicitly agreed; never remove existing user data. Do not record credentials, tokens or full mail links in Git or reports. Real token-expiry waiting can be separated from existing passing mocked-expiry tests and must not be claimed complete prematurely.

Pending: Guido must identify the approved test email address. No real mail delivery is claimed yet. Do not activate a deployment or move an alias without his permission; this direct version URL permits the mail tests without either action.


## Live mailbox test started — 29 October 2026

The user approved a specific mailbox for actual activation/reset mail testing on version e0cf3b4d-0b1f-43ec-9da0-8e8ddc95e082 only. A read-only preflight confirmed no existing user for that mailbox before creating a dedicated test account. Registration returned 200 and the new account remains unverified. This does not prove provider acceptance or inbox delivery because mail runs in the background.

The available mail connector belongs to a different mailbox; its tightly scoped search found no forwarded test message. Resend delivery logs are not connected. The user has been asked to confirm actual receipt (including spam) and open the activation link without sharing it. Activation remains pending in D1. Password reset is prepared for the next step after activation; no reset or existing-user changes have been performed. Private test credentials and state are confined to ignored local work files and are not included here.

Both active Worker version sets were rechecked unchanged. No Worker version, alias, binding, migration or production setting was changed. Resume from work/resend-real-mail-state.json and use work/check-real-mail-test.mjs to verify only this test account after the user activates it. Do not rerun registration or replace/delete this account. Live link/replay/expiry tests remain pending and must not be reported as passed.


## Live activation confirmed — 29 October 2026

The user confirmed receipt/opening and supplied a screenshot showing Email verified at the isolated version's login callback. D1 now confirms the dedicated test account is verified. Actual login returned 200 and its private journal API returned 200. Both active Worker version sets remain unchanged.

A single password-reset request for the same test account returned the generic 200 response. Actual reset-mail receipt and opening are awaiting the user's confirmation. The user has been asked to open the reset form without submitting a password or sharing a token/address-bar screenshot. A private local continuation script is prepared to consume only this test account's reset token, reject a second use, check old-session revocation and old-password rejection, and verify new login. No reset submission has yet been made. Natural passage of token lifetime has not been tested live; earlier mocked expiration tests are separate evidence.
