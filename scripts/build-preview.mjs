import { spawnSync } from 'node:child_process'
import { readFileSync,writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const root=fileURLToPath(new URL('../',import.meta.url))
const result=spawnSync(process.platform==='win32' ? 'pnpm.cmd build' : 'pnpm',process.platform==='win32'?[]:['build'],{cwd:root,stdio:'inherit',shell:process.platform==='win32',env:{...process.env,VITE_ADMIN_API_BASE_URL:'same-origin'}})
if(result.status!==0)process.exit(result.status ?? 1)
// Wrangler parses _redirects even when excluded from the uploaded assets.
// Override only the generated file. public/_redirects stays intact for Vercel.
writeFileSync(new URL('../dist/_redirects',import.meta.url),'# Workers preview uses assets.not_found_handling for SPA routing.\n')
writeFileSync(new URL('../dist/_headers',import.meta.url),readFileSync(new URL('../public/_headers',import.meta.url),'utf8')+`\n/*\n  X-Robots-Tag: noindex, nofollow\n  Content-Security-Policy: frame-ancestors 'none'; object-src 'none'; base-uri 'self'\n`)
