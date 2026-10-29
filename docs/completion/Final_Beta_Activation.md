# Final beta activation — 29 October 2026

## Pre-activation decision: critical gates passed

Authorised target: only animavidi-beta, exact existing candidate e0cf3b4d-0b1f-43ec-9da0-8e8ddc95e082. No new Worker build/upload is required or permitted for this activation. Code matches the previously tested Resend source c288448ce06a108cb6d0c7c4457740f66825dcf6; later commits record tests/documentation only. All 42 checked deployed app-shell files match the local build.

Recorded previous active beta: 0e2cadf9-f44f-4a26-b3a5-a80758f6beee at 100%. Production Worker remains bcd07c8e-f840-47c8-b32f-d8566b50a112; main remains 4d2ee0911d810909f604d5b62d1a85393e2778d5. PR #1 is open, draft and unmerged. The feature checkout and remote matched before test-only changes.

Required secret bindings (presence, not contents): administrator credentials/session, BETTER_AUTH_SECRET and RESEND_API_KEY. Sender no-reply@mail.animavidi.com. D1 CONTENT_DB remains the isolated beta database 590d8dc0-5132-4088-9e43-350f0cf489e1; MAMMAL_PHOTOS remains animavidi-beta-photos. Asset routing, compatibility and security headers are retained.

## Evidence

- Typecheck and ESLint passed. No frontend secret references/values or tracked private working credential files were found; .env.example contains a public endpoint only.
- Actual Better Auth backend tests passed: verification, password reset, atomic single-use/concurrent tokens, expiry, session renewal/revocation, user isolation and deletion. Resend mocks cover stalled/failed delivery with generic reset responses and retry idempotency.
- Real activation and reset mail evidence is from this exact candidate: user received/opened the messages, activation persisted, reset form rendered, reset succeeded, reuse failed, old session/password failed and new login succeeded. No credentials/tokens are published.
- Integrated production-build browser tests passed at 390/820/1440 px: safe legacy migration/recovery/retry, original photos, Passport/achievements/camps/preferences, two devices, conflicts, exports, logout races and deletion.
- Native Cloudflare candidate tests passed using only new synthetic verified fixtures: actual D1/R2 writes, byte-identical private photo retrieval, cross-user/Origin/admin denials, duplicate-retry and revision conflicts, contributions and authenticated account deletion.
- A full normal browser profile saved a bird with photo and a mammal offline, closed completely and reopened offline, retained both records/photo, then reconnected and synchronised to Cloudflare and a second browser. One stable cloud ID per offline observation. Chromium installability reported no errors. Private/auth/admin endpoints were absent from the SW cache.
- A controlled local update fixture using the exact current build verified waiting for explicit Apply update, no forced loss of an open form, and retained queued/photo bytes/settings after activation of a new cache generation.
- Existing public/CMS browser regression passed: 148 mammals, 546 birds, catalogue/detail/sighting/Passport, moderator approval, photo moderation/attribution, history/report, backups, camps and route publishing. Functional species/achievement/route/admin/proposal validators passed.

Harness repairs only: use installed Edge; isolate a normal browser profile outside the long watched Windows checkout; ignore work/ in the Vite test watcher; avoid mistaking the Legendary celebration for a failed sighting. No application source changed to make these tests pass.

## Data preservation and rollback

Private SQL recovery export saved locally before tests, never in Git. SHA256: 6682B705C10457C22FA0CC0B56D23B82ED73F09FB479F9DCF5831ADDE0E13702. A private structured baseline includes existing D1 records and R2 metadata. After test-account deletion, every baseline application/user table is byte-equivalent after canonical ordering; R2 metadata is unchanged. Authentication/submission rate counters are intentionally excluded. Existing user, credential and migration rows are retained. Legacy browser databases are never automatically deleted; migration requires explicit user action and first writes a recovery snapshot.

Rollback code/config, if needed:

```powershell
pnpm.cmd exec wrangler versions deploy 0e2cadf9-f44f-4a26-b3a5-a80758f6beee@100% --name animavidi-beta --config worker/wrangler.preview.jsonc --yes --message "Rollback beta to previous verified guest version"
```

If the prepared erasure cron is activated, restore the privately recorded prior schedules too (work/final-audit/rollback-triggers.jsonc). Rollback does not restore or delete D1/R2 data; do not import SQL over live user data. The previous guest UI cannot read cloud journals, but their records remain intact for a later fix.

## Remaining acceptance limits

Physical iOS/iPadOS/Android installation has not been tested; browser manifest/icons/installability, offline launch, standalone declaration and responsive navigation are tested. Full natural passage of the one-hour activation / thirty-minute reset lifetime was not awaited; local expiry and live one-use invalidation passed. Photo/profile coverage remains the previously agreed beta scope (placeholders allowed); no complete offline first-visit photograph catalogue or GPS route guarantee is claimed.

Activation and post-activation smoke results will be appended after the recorded version is promoted. No production activation or merge is authorised.
