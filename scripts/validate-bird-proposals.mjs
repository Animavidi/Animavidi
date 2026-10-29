import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import worker from '../worker/src/index.ts'
const sqlite = new DatabaseSync(':memory:')
for (const file of ['0001_content.sql','0002_bird_proposals.sql']) sqlite.exec(readFileSync(new URL(`../worker/migrations/${file}`,import.meta.url),'utf8'))
const database = { prepare(sql) { const statement = sqlite.prepare(sql); let args = []; return { bind(...values) { args = values; return this },async first() { return statement.get(...args) ?? null },async all() { return { results: statement.all(...args),success: true } } } } }
const password = 'test-only-password', salt = crypto.getRandomValues(new Uint8Array(16)), encode = (value) => Buffer.from(value).toString('base64url')
const key = await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits'])
const hash = await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'},key,256)
const origin = 'http://localhost:5173', env = { CONTENT_DB: database,ADMIN_ALLOWED_ORIGINS:origin,ADMIN_USERNAME:'test-admin',ADMIN_PASSWORD_HASH:`100000:${encode(salt)}:${encode(hash)}`,ADMIN_SESSION_SECRET:'test-only-secret',MEDIA_BASE_URL:'https://media.animavidi.com',MAMMAL_PHOTOS:{ async list(){return {objects:[],truncated:false}} } }
let ip = 0
const call = (path,init={}) => worker.fetch(new Request('http://worker'+path,init),env)
const login = await call('/api/admin/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({username:env.ADMIN_USERNAME,password})})
const cookie = login.headers.get('set-cookie').split(';')[0]
const headers = {Origin:origin,Cookie:cookie,'Content-Type':'application/json'}
const draft = (name) => ({commonName:name,scientificName:'',description:'A test proposal description with enough detail.',sourceUrl:'https://example.org/bird'})
const submit = (body,overrides={}) => call('/api/bird-proposals',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':`test-${++ip}`,...overrides},body:JSON.stringify(body)})
const review = (item,action,body=item.draft) => call(`/api/admin/bird-proposals/${item.id}`,{method:'PUT',headers:{...headers,'If-Match':item.revision},body:JSON.stringify({draft:body,action,reviewNote:'Private moderator note'})})
const pending = async () => (await (await call('/api/admin/bird-proposals',{headers})).json()).items
assert.equal((await submit(draft('African fish eagle'))).status,409)
assert.equal((await submit({...draft('Bad'),sourceUrl:'javascript:alert(1)'})).status,400)
assert.equal((await submit(draft('Untrusted'),{Origin:'https://evil.invalid'})).status,403)
assert.equal((await call('/api/admin/bird-proposals',{headers:{Origin:origin}})).status,401)
assert.equal((await submit({...draft('Too large'),description:'x'.repeat(17000)})).status,413)
assert.equal((await submit(draft('Test bird'))).status,201)
assert.equal((await submit(draft('TEST-BIRD'))).status,409)
assert.equal((await (await call('/api/birds')).json()).birds.length,0,'Pending suggestions must be private')
let [item] = await pending()
const originalId = item.publishedId
assert.equal((await review(item,'save',{...item.draft,commonName:'Reviewed test bird'})).status,200)
assert.equal((await review(item,'approve')).status,412,'Reject stale moderator writes')
;[item] = await pending()
assert.equal((await review(item,'approve')).status,200)
assert.equal((await review(item,'approve')).status,412,'Approval is single-use')
const catalogue = await (await call('/api/birds')).json()
assert.equal(catalogue.birds[0].id,originalId)
assert.equal(catalogue.birds[0].commonName,'Reviewed test bird')
assert.equal('reviewNote' in catalogue.birds[0],false)
assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM bird_proposal_history').get().n,2)
assert.equal((await submit(draft('Reviewed test bird'))).status,409)
assert.equal((await submit(draft('Rejected bird'))).status,201)
;[item] = await pending()
assert.equal((await review(item,'reject')).status,200)
assert.equal((await (await call('/api/birds')).json()).birds.length,1)
// Two names with the same scientific identity cannot both become public.
for (const name of ['First collision bird','Second collision bird']) assert.equal((await submit({...draft(name),scientificName:'Testus species'})).status,201)
const collisions = await pending()
assert.equal((await review(collisions[0],'approve')).status,200)
assert.equal((await review(collisions[1],'approve')).status,409)
assert.equal((await pending()).length,1,'Failed duplicate approval must leave the proposal pending')
for (let index=0;index<6;index++) assert.equal((await submit(draft(`Rate bird ${index}`),{'CF-Connecting-IP':'same-test-ip'})).status,index<5?201:429)
assert.equal((await call('/api/birds?after=-1')).status,400)
assert.equal((await call('/api/admin/bird-proposals?status=unknown',{headers})).status,400)
// Verify publication pagination without needing hundreds of network submissions.
for(let index=0;index<105;index++) {
  const id=crypto.randomUUID(), now=new Date().toISOString(), body=JSON.stringify(draft(`Page bird ${index}`))
  sqlite.prepare('INSERT INTO bird_proposals(id,body,name_key,scientific_key,revision,published_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)').run(id,body,`page bird ${index}`,'',id,`bird-community-${crypto.randomUUID()}`,now,now)
  sqlite.prepare('UPDATE bird_proposals SET status=? WHERE id=?').run('approved',id)
}
const page1 = await (await call('/api/birds')).json(), page2 = await (await call(`/api/birds?after=${page1.nextCursor}`)).json()
assert.equal(page1.birds.length,100); assert.equal(page2.birds.length,7); assert.equal(page2.nextCursor,null)
assert.equal(new Set([...page1.birds,...page2.birds].map((bird)=>bird.id)).size,107)
sqlite.close()
console.log('Bird proposal tests passed: private submission, origin/auth/body/rate restrictions, duplicate detection, edit/reject/atomic approval, stale-write protection, stable IDs, history and pagination.')
