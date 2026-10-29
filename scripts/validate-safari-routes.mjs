import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { safariRoutes } from '../src/features/routes/data/safariRoutes.ts'
import { isManagedContent } from '../src/features/content/model/content.ts'

const audit = JSON.parse(readFileSync(new URL('../docs/completion/route-connectivity.json', import.meta.url), 'utf8'))
assert.equal(audit.brochure.pdfPageCount, 36)
assert.equal(audit.brochure.sha256, '757f5095149e5502bdfbd1cb4db44a550618703d80ede0cbef151c8e2cc41468')
assert.equal(new Set(safariRoutes.map((route) => route.id)).size, safariRoutes.length)
assert.equal(new Set(audit.routes.map((route) => route.id)).size, audit.routes.length)
assert.equal(audit.routes.length, safariRoutes.length, 'Every packaged guide needs connection evidence')
for (const route of safariRoutes) {
  assert.ok(isManagedContent(route), `Invalid route: ${route.id}`)
  const evidence = audit.routes.find((item) => item.id === route.id)
  assert.ok(evidence, `Missing brochure review: ${route.id}`)
  assert.equal(evidence.nodes[0], route.start)
  assert.equal(evidence.nodes.at(-1), route.end)
  assert.equal(evidence.roads.length, evidence.nodes.length - 1, 'Each adjacent node pair needs a reviewed road or explicit facility access')
  assert.deepEqual([...new Set(evidence.roads.filter(Boolean))], route.roads, `Road order changed without evidence: ${route.id}`)
  for (const stop of route.stops) assert.ok(evidence.nodes.includes(stop), `Stop is disconnected: ${stop}`)
  assert.ok(evidence.printedPages.every((page) => Number.isInteger(page) && page >= 7 && page <= 16))
  assert.ok(route.sourcePages.includes('PDF'), 'Distinguish printed pages from PDF pages')
}
const tshokwane = audit.routes.find((route) => route.id === 'skukuza-tshokwane-lower-sabie')
const junction = 'H1-2 / H1-3 / H10 junction'
assert.equal(tshokwane.nodes.filter((node) => node === junction).length, 2, 'Tshokwane requires a return to the H10 junction')
assert.equal(tshokwane.roads.filter((road) => road === 'H1-3').length, 2)
assert.ok(safariRoutes.find((route) => route.id === 'lower-sabie-crocodile-bridge').roads.includes('H10'), 'Retain river-bridge connector')
for (const region of ['south', 'central', 'north']) assert.ok(safariRoutes.some((route) => route.region === region && route.published))
console.log(`Safari route checks passed: ${safariRoutes.length} brochure-reviewed guides, connected stop sequences, camp approaches and all three regions. Current access and GPS geometry are not certified.`)
