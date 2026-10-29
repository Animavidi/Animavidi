import { readFile,writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { krugerBirdChecklist } from '../src/features/birds/data/krugerBirdChecklist.ts'
const sourceUrl = 'https://birda.org/kruger-national-park-birding-checklist/'
const input = process.argv.find((arg)=>arg.startsWith('--html='))?.slice(7)
const html = input ? await readFile(input,'utf8') : await (async()=>{const response=await fetch(sourceUrl,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`Source HTTP ${response.status}`);return response.text()})()
const text = (value) => value.replace(/<[^>]+>/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([a-f\d]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replaceAll('&amp;','&').replaceAll('&nbsp;',' ').replaceAll('&rsquo;',"'").trim().replace(/\s+/g,' ')
const key = (value) => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'')
const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((match)=>[...match[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell)=>text(cell[1]))).filter((cells)=>cells.length===3 && /^[\d,]+$/.test(cells[2])).map((cells)=>({sourceName:cells[1],observations:Number(cells[2].replaceAll(',',''))}))
if(rows.length<400)throw Error(`Unexpected source table: ${rows.length} rows`)
const birds = new Map(krugerBirdChecklist.map((bird)=>[key(bird.commonName),bird]))
// These spelling/common-name equivalents have matching scientific names in
// the companion PDF and the retained checklist. Do not infer taxonomic splits.
const aliases = { capestarling:'bird-cape-glossy-starling',hadadaibis:'bird-hadeda-ibis',striatedheron:'bird-green-backed-heron' }
const mapped = rows.map((row)=>({...row,bird:birds.get(key(row.sourceName)) ?? krugerBirdChecklist.find((bird)=>bird.id===aliases[key(row.sourceName)])})).sort((a,b)=>b.observations-a.observations || a.sourceName.localeCompare(b.sourceName))
const unresolved = mapped.filter((row)=>!row.bird)
if(mapped.filter((row)=>row.bird).length<100){throw Error('Insufficient confidently matched source rows')}
else {
  const selected = mapped.filter((row)=>row.bird).slice(0,100).map((row,index)=>({rank:index+1,id:row.bird.id,commonName:row.bird.commonName,sourceName:row.sourceName,scientificName:row.bird.scientificName,historicalObservations:row.observations}))
  if(new Set(selected.map((bird)=>bird.id)).size!==100)throw Error('Duplicate source/checklist mapping')
  const published = html.match(/"datePublished":"([^"]+)"/)?.[1] ?? html.match(/itemprop="datePublished"[^>]*content="([^"]+)"/)?.[1] ?? null
  const output = { schemaVersion:1,sourceUrl,sourceTableSha256:createHash('sha256').update(JSON.stringify(rows)).digest('hex'),sourcePublishedAt:published,checkedAt:'2026-10-29',method:'Highest 100 confidently name-matched Kruger SABAP2 observation counts in the published Birda table. Unresolved names are excluded rather than guessed. Count order is editorial priority, not current abundance.',limitations:'Historical published snapshot; observation period and sampling effort are not supplied per row. Seasonal/region/observer bias applies. This is not a current 2026 top-100 estimate. High-count Northern Red-billed Hornbill, White-browed Coucal and Eurasian Hoopoe require taxonomy reconciliation before their counts can be assigned to retained Kruger records.',unmatchedSourceRows:unresolved.map(({sourceName,observations})=>({sourceName,observations})),birds:selected }
  await writeFile(new URL('../src/features/birds/data/starterBirds.json',import.meta.url),JSON.stringify(output,null,2)+'\n')
  console.log(`Selected ${selected.length} existing stable bird IDs from ${rows.length} source rows. Content and image review remain separate.`)
}
