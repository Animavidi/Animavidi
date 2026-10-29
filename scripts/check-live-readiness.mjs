import { writeFile } from 'node:fs/promises'
// Read-only production probes; never logs cookies or asks for credentials.
const base = 'https://admin-api.animavidi.com'
const results = []
for (const probe of [
  { path: '/api/photos', expected: 200 },
  { path: '/api/content', expected: 200 },
  { path: '/api/admin/session', expected: 401, origin: 'https://animavidi.com' },
  { path: '/api/admin/content', expected: 401, origin: 'https://animavidi.com' },
  { path: '/api/admin/session', expected: 403, origin: 'https://unapproved.invalid' },
]) {
  try {
    const response = await fetch(base + probe.path, { headers: probe.origin ? { Origin: probe.origin } : {}, signal: AbortSignal.timeout(15000) })
    const body = await response.json()
    results.push({ ...probe, status: response.status, passed: response.status === probe.expected, allowOrigin: response.headers.get('Access-Control-Allow-Origin') })
    if (probe.path === '/api/photos' && response.ok) await writeFile(new URL('../docs/completion/current-photo-manifest.json', import.meta.url), JSON.stringify(body, null, 2) + '\n')
  } catch (error) { results.push({ ...probe, passed: false, error: error.message }) }
}
const report = { checkedAt: new Date().toISOString(), target: base, mode: 'read-only; no login or writes attempted', results, limitations: ['No successful authenticated session tested', 'No production upload or content mutation attempted', 'This checks the current live Worker, not undeployed branch code'] }
await writeFile(new URL('../docs/completion/live-readiness.json', import.meta.url), JSON.stringify(report, null, 2) + '\n')
for (const row of results) console.log(`${row.path} ${row.origin ?? 'public'}: ${row.status ?? row.error} ${row.passed ? 'PASS' : 'BLOCKED'}`)
if (results.some((row) => !row.passed)) process.exitCode = 1
