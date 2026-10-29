# Accounts, cloud journal and PWA - implementation checkpoint

Baseline 1e78537, same feature branch and PR #1. Production is excluded.

Implemented so far: Better Auth 1.7.14 with verified email/password sessions and reset, separate admin authentication, additive D1 account/journal schema, account-scoped private R2 photos, idempotent change receipts, atomic revision conflicts, incremental changes, per-account local journals and an offline outbox. Legacy journals are preserved; recovery snapshots precede explicit account imports. PWA shell/cache/install/update code is prepared.

Passing local backend tests: actual Better Auth signup and verification, denial before verification, two-user isolation, private photo access, duplicate retry, version conflict, incremental changes, password reset with session revocation, and account/private-photo deletion.

Open: complete integrated browser/offline/migration tests, publish updated preview, and verify real mail delivery. Existing Cloudflare CLI and connector both return Unauthorized for Email Sending. The user has been asked for necessary sender/service access; no DNS or production changes were attempted. Test email transport is injected only in local tests, never exposed as a deployed verification bypass.


## Integrated checkpoint

The integrated browser suite passed signup/verification with an injected local mail transport, mandatory login, original-journal snapshot and repeatable offline migration, original photo preservation, mammals and birds, Passport/achievements, SW-controlled offline reload/save, reconnect/retry, second-device data/camps, conflict preservation/resolution, password reset, queued edits after reauthentication, private export and account deletion. Mobile/tablet/desktop were exercised. A separate race test covers stale session responses and switching accounts across tabs. Existing catalogue/CMS visual regressions and functional validators pass; their old anonymous browser fixture is now explicitly a verified-user fixture, while actual auth is exercised in the dedicated account suite.

The additive beta D1 migration 0004 was applied after a local SQL recovery export; production D1/R2/Worker remain untouched. The exported SQL is ignored by Git. No legacy browser database has been deleted. The new candidate is not yet promoted to the shared beta URL because real transactional email remains unconfigured.
