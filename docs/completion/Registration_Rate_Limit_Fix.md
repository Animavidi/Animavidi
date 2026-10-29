# Registration limiter incident — 29 October 2026

## Evidence before changes

Affected beta version e0cf3b4d-0b1f-43ec-9da0-8e8ddc95e082; production unchanged. The reported wording matches the custom outer limiter, not Better Auth's different default message.

Two independent signup limiters were both five requests/hour. The outer counter used the full CF-Connecting-IP without hostname separation. Better Auth grouped IPv6 by /64 and also omitted hostname. Candidate/test and shared-beta requests used the same D1 counters. A pre-final-test snapshot contained one signup request on exactly the same inner network key; it later reached five. A newer outer bucket reached six attempts and denied requests. Therefore previous real registration testing contributed to the shared quota, but the evidence does not attribute every subsequent request to an individual device.

The inner signup key contains a valid IPv6 network; it is neither no-trusted-ip nor Cloudflare's cross-zone Worker placeholder. No evidence indicates missing-IP global fallback caused this incident. The outer full-IP bucket did not exist in the earlier snapshot, while the normalised network bucket did, illustrating the two different scopes. The default inner wait could continue until one hour after its last allowed request, even after the outer clock-hour boundary reset. No IPs, mailbox addresses, passwords or tokens are copied into this report. Historical per-request logs are unavailable because persistent Workers Logs were not enabled; diagnosis uses stored counter snapshots and source, with a live privacy-filtered monitor for the fix.

## Repair

- Replace the duplicated IP policies with one atomic D1-backed Better Auth custom store, still enabled for all auth routes. HMAC keys include origin, so preview/test traffic cannot consume the shared-beta network quota. Raw IPs and token-bearing paths are no longer stored as rate keys.
- Signup network rule: 30 requests per 15-minute bounded inactivity window. Separate canonical-email quota: 5 per 15 minutes, shared across hosts/IPs to protect the target inbox. Different legitimate addresses behind one network do not consume each other's email quota.
- Login: 60/network per five minutes and 10/address per five minutes. Reset/resend: 30/network per 15 minutes and 5/address per 15 minutes. Other auth endpoints retain their 60/minute limit.
- Atomic counters cap rejected counts and do not extend the waiting period on denials. Standard Retry-After plus a clear minute-based message replaces the indefinite error.
- Only CF-Connecting-IP is trusted for sensitive requests; invalid/missing values return a temporary service error rather than joining a global local bucket. Arbitrary X-Forwarded-For is not trusted.
- Logs contain only limiter scope/action/retry seconds and Cloudflare source metadata, never actual addresses, credentials, tokens or identities.
- No account/journal schema migration, deletion, credential change or bulk counter wipe. The versioned counter namespace introduces the corrected policy without reusing the broken quota.

## Tests before publishing

Typecheck, ESLint, preview build, actual Better Auth/Resend-mock tests and full account/offline/migration/conflict/export/deletion browser suite passed. PWA update preservation passed. Dedicated rate tests verify atomic simultaneous requests, bounded retry/expiry, thirty different addresses behind one IPv6 /64, isolated preview/beta network quotas, canonical email limits across IPs/hosts, independent addresses, missing/spoofed-header handling and non-sensitive logging. No test email was sent by these synthetic checks.

A private current SQL backup and D1/R2 baseline were saved before changes. Existing accounts and data are excluded from destructive tests. Native candidate tests and beta deployment/mail verification outcomes will be appended after execution. The user supplied a fresh approved test mailbox; its value is retained privately, not committed.
