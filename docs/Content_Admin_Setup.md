# Animavidi Content Admin V1 setup

ANI-024 adds a separate, lazy-loaded Content Admin and a Cloudflare Worker for authenticated mammal-photo operations. The public app remains on Vercel; photo overrides are stored in the existing `animavidi-mammal-photos` R2 bucket and served by `https://media.animavidi.com`.

## Architecture

- Frontend: `/admin` routes in the existing React app.
- API: `worker/src/index.ts` using the `MAMMAL_PHOTOS` R2 binding.
- Public manifest: `GET /api/photos` returns one compact map of current R2 overrides.
- Resolution: R2 override, then packaged local photo, then the shared neutral fallback.
- Authentication: one server-validated administrator, PBKDF2 password hash, signed eight-hour HttpOnly cookie.
- No D1, browser credentials, editable animal text persistence or new-species persistence is present.

## Required Worker configuration

The non-secret configuration is in `worker/wrangler.jsonc`:

- R2 binding: `MAMMAL_PHOTOS`
- bucket: `animavidi-mammal-photos`
- `MEDIA_BASE_URL=https://media.animavidi.com`
- `ADMIN_ALLOWED_ORIGINS=https://animavidi.com,https://www.animavidi.com`; wildcard origins are intentionally unsupported with credentialed requests.

Set these Worker secrets interactively; never add their values to `.env`, `.dev.vars` in Git, source files or Vite variables:

```powershell
pnpm admin:hash-password
pnpm exec wrangler secret put ADMIN_USERNAME --config worker/wrangler.jsonc
pnpm exec wrangler secret put ADMIN_PASSWORD_HASH --config worker/wrangler.jsonc
pnpm exec wrangler secret put ADMIN_SESSION_SECRET --config worker/wrangler.jsonc
```

Use a long random session secret. The generated password hash is safe to store as the Worker secret, but the password itself is never stored by the app.

For local development, create an ignored `worker/.dev.vars` containing the three secret names. Do not commit that file.

## Local development

Create `.env.local` from `.env.example`, then run two terminals:

```powershell
pnpm exec wrangler dev --local --port 8787 --config worker/wrangler.jsonc
pnpm dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173/admin/login`. Wrangler uses local R2 state by default; this does not write to the production bucket. Local HTTP uses a same-site HttpOnly cookie; deployed HTTPS uses `Secure; SameSite=None` for the cross-origin Vercel-to-Worker session.

Set `VITE_ADMIN_API_BASE_URL=https://admin-api.animavidi.com` in Vercel. This variable is a public API origin only and must never contain credentials.

## Photo handling

The browser accepts JPEG, PNG and WebP up to 10 MB, preserves aspect ratio, limits the longest side to 1600 px and encodes the prepared upload as WebP. The Worker independently checks the known mammal ID, authenticated session, byte size, declared MIME type and file signature before creating `mammals/<stable-id>/primary.webp`.

The Worker also safely supports correctly signed JPEG and PNG requests and stores those with their honest extension. The admin UI’s normal path produces WebP. No Cloudflare Images service, aggressive crop, hidden conversion or fake optimization claim is used.

Removing a photo deletes only the R2 `primary.*` override. It never deletes packaged assets; the UI immediately resolves back to the packaged image or neutral fallback.

## Validation and deployment boundary

```powershell
pnpm validate:content-admin
pnpm typecheck
pnpm lint
pnpm build
pnpm exec wrangler deploy --dry-run --config worker/wrangler.jsonc
```

The reviewed Worker API is available at `https://admin-api.animavidi.com`. Vercel deployment and source pushes remain separate reviewed actions.
