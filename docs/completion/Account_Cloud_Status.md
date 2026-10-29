> Current status: the exact Resend candidate e0cf3b4d-0b1f-43ec-9da0-8e8ddc95e082 is active at 100% on the shared beta. See [Final_Beta_Activation.md](Final_Beta_Activation.md) and final-beta-verification.json. Earlier pending-mail/promotion statements below are historical checkpoints.

# Accounts, cloud journal and PWA — 29 October 2026

Status: account/offline implementation tested; Resend integration is now ready for RESEND_API_KEY and live delivery testing. See [Resend_Integration.md](Resend_Integration.md) for the current mail handoff. The earlier Cloudflare Email Sending blocker below is historical; Resend is the selected provider. This document supersedes the account/offline limitations in the earlier guest-beta report. Same feature branch and draft PR #1; no merge or production deployment.

## Built

- [x] Better Auth 1.7.14 email/password authentication, mandatory verification, login/logout, session renewal, reset, rate limits, profile and password-confirmed account deletion. Admin authentication remains separate.
- [x] Account-scoped D1 records and private R2 photos, incremental two-device synchronisation, stable IDs, atomic idempotency receipts and explicit revision conflicts.
- [x] Per-account IndexedDB, durable offline queue and reconnect retry. Queued edits survive reload, expired sessions and reauthentication. Both conflict versions are archived before resolution.
- [x] Existing local journal recovery snapshot committed before explicit import. Repeated/interrupted migration preserves original IDs, photos and the untouched legacy database. Import is only complete after cloud acknowledgements.
- [x] Passport, achievements, camps and personal preferences synchronise; contributions are authenticated and visible privately to their author while awaiting moderation. Account/device exports include original photo bytes.
- [x] Manifest, icons, standalone launch presentation, public app-shell cache, offline reload, installation help and user-controlled updates. Auth/private/admin responses are excluded from the service-worker cache.
- [x] Existing lion homepage, green/gold design and functional catalogue/CMS maintained. Small beta label on Kruger home.

## Verification

| Check | Result |
| --- | --- |
| Typecheck, ESLint and preview build | Passed; main JS chunk warning remains at about 515 KB |
| Actual Better Auth local backend | Registration, captured verification email, unverified denial, privacy, reset/revocation, session renewal and deletion passed |
| Integrated browser, 390/820/1440 px | Registration/verification via injected local mail, mammals/birds/photos, Passport, offline/reload/reconnect, migration retry, recovery restore, second device, conflict resolution, camps, export, logout races and deletion passed |
| Existing browser/CMS regression and functional validators | Passed; legacy frontend tests use an explicitly verified fixture, while dedicated tests exercise actual authentication |
| Native Cloudflare candidate | Secure/HttpOnly/SameSite=Lax login, real D1 writes, private R2 byte integrity, SW offline reload/photo queue/reconnect, second device, cross-user denials, idempotency/conflict, contribution ownership, separate admin login and deletion passed |
| Cleanup | Exact synthetic users, sessions, credentials, sightings, preferences, receipts, changes, erasure jobs and submitted contribution all verified absent in beta D1 |
| Production boundary | main remains 4d2ee0911d810909f604d5b62d1a85393e2778d5; production Worker still bcd07c8e-f840-47c8-b32f-d8566b50a112 |

Cloud verification used privileged, synthetic verified-account fixtures seeded into the isolated beta database. No public verification bypass exists. Those fixtures were deleted through authenticated account deletion. They do not prove real email delivery. Cloud tests found and fixed numeric account-date handling and Cloudflare's redirected /index.html offline fallback; the latter now uses cached / directly.

## Preview and saved source

Account candidate: https://accounts-animavidi-beta.solitary-mountain-8958.workers.dev/

Functionally verified source: e1ee270a97e56327686d02dd8c4f4b43e106066f. Candidate version 7c8df268-983d-4f3f-9ddf-27f7567c0484. Any later commit in this checkpoint changes documentation only; the final candidate upload is tagged with the final repository HEAD.

Shared guest beta remains https://animavidi-beta.solitary-mountain-8958.workers.dev/ on version 0e2cadf9-f44f-4a26-b3a5-a80758f6beee. The account candidate has not replaced it: registration and reset deliberately return 503 while mail is unavailable. Credentials are never committed. The candidate uses the existing isolated beta D1/R2, not production resources.

## Remaining release gates and resume steps

- [ ] Enable an authorised transactional mail service and specify a verified sender. Both current Wrangler and connected Cloudflare Email Sending requests return Unauthorized (2036). Guido has been asked for this necessary access; no DNS changes, purchases or subscriptions were made.
- [ ] If using Cloudflare Email Sending, confirm the sender domain is enabled, add the EMAIL send_email binding and AUTH_EMAIL_FROM to the preview configuration, then upload a new candidate. Use runtime secrets for any alternative provider; never put credentials in Git or chat.
- [ ] Test registration, received activation link, spam-folder/delivery behaviour, reset email, received reset link and session revocation against actual mail. Local captured-mail tests already pass, but are not delivery evidence.
- [ ] Physically test installation and offline reopening on iPhone/iPad Safari and Android Chrome. Browser viewport tests do not establish native-device installation behaviour.
- [ ] After all gates pass, promote only to the beta Worker, verify its version and assets, activate its configured erasure-retry cron and verify triggers. Version uploads do not activate cron schedules. Recheck separate admin access and privacy after promotion.
- [ ] Review and disable superseded candidate version URLs when practical; they share beta resources. Preserve rollback/recovery files privately.

No old browser journal is automatically deleted. Storage quotas or browser data removal can still remove unsynchronised device data; the interface exposes queue state and backup tools. Offline public photographs/content are available after they have been cached; this is not a full first-visit offline catalogue or live GPS service. Legacy data is origin-specific: migrate at the original beta origin after account promotion, or export/import explicitly across origins.

Cloudflare facilities: existing beta Worker, D1 and R2; additive migration 0004 applied only to beta after a private SQL recovery export. Recovery SHA256 DED25C1A78CB53272F8BB01A991B097C31E1D07EB21EEE5237BF7319758FD314. No new subscription was purchased; existing account usage and future mail charges depend on its provider/plan and have not been priced or promised free. Existing photography/profile coverage limitations remain as documented in Beta_Verification.md.
