# Registration confirmation and existing accounts — 29 October 2026

The user reported that submitting Create account cleared the password and appeared to do nothing. The supplied screenshot contained the existing small confirmation paragraph below the button. The entered mailbox was already the verified test account created with prior user approval. Better Auth deliberately returns a generic successful signup response for existing verified addresses; it does not replace their password or send another activation email. That privacy behaviour is retained.

The registration UI now replaces the form with a prominent Registration received screen, focuses/scrolls to its heading and displays separate instructions for a new registration and an existing account. Sign in and Set or reset password are explicit actions. Resend/change-email actions remain available. No existing/new-address distinction is disclosed by the public confirmation. The form cannot be repeatedly submitted from this completion screen, and a synchronous submission guard prevents duplicate in-flight actions.

An entered email can be passed to login/recovery using local router state, never URL parameters. Form state resets on route changes. Passwords are cleared after accepted registration and are never retained or displayed on the confirmation screen. Reset remains a separate emailed-token flow chosen by the user; no automatic real-user credential change or mail was initiated for this fix.

Typecheck, ESLint and preview build passed. The complete account/migration/offline/conflict/export/privacy/deletion browser suite passed, with added regression checks for the exact reported duplicate-registration scenario: same generic confirmation for new/existing accounts, password form gone, focused heading, verified existing credential unchanged, no extra activation mail for an existing verified account, and a prefilled password-reset route without an email in the URL. Mobile and desktop confirmation screenshots were inspected. PWA update retention and the registration-limiter suite also passed.

Backend authentication, rate limiting, account/journal schemas and production configuration are unchanged. Native candidate verification and beta deployment outcomes will be appended after validation. Existing accounts, photos and journals must remain intact.


## Published and verified

UI source 75fd6b3bbbea0dd88698d9d687e18f3fe76af740 was uploaded as cb1d3e3d-59a2-42c9-9372-ac50226d8b51 and promoted only to animavidi-beta at 100%. The backend script ETag is identical to the prior rate-limit repair; secret/D1/R2/asset bindings and compatibility settings are retained. Production remains unchanged.

Native candidate checks at 390/820/1440 pixels and a post-activation mobile smoke passed using only fresh synthetic verified accounts: duplicate signup returns the prominent, focused confirmation; the password form disappears; recovery is prefilled through router state with no email in the URL; login still requires and accepts the original password. The original fixture credential and account name were unchanged. Both synthetic accounts and their sessions were deleted afterward through authenticated account deletion. No actual user's account/password was changed and no real reset/activation email was requested by these native checks.

For the reported already verified account, the user should choose password recovery to set a personal password. Re-entering a new password under Create account does not do that. The UI now states this explicitly, while keeping the same generic public confirmation for registered and unregistered addresses. See registration-confirmation-verification.json for sanitised verification evidence.
