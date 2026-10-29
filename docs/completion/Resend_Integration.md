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
