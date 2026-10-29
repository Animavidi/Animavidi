import assert from 'node:assert/strict'
import {testEnvironment} from './helpers/user-cloud-fixture.mjs'
import {consumeAuthLimit,trustedClientIp} from '../worker/src/authRateLimit.ts'
import {handleUsers} from '../worker/src/users.ts'
const databases=[];function fresh(){const f=testEnvironment();databases.push(f.sqlite);return f}
const logs=[],warn=console.warn,error=console.error;console.warn=(...x)=>logs.push(x.join(' '));console.error=(...x)=>logs.push(x.join(' '))
function call(env,origin,email,ip='2001:db8:100::1',extra={}){return handleUsers(new Request(origin+'/api/auth/sign-up/email',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(ip?{'CF-Connecting-IP':ip}:{}),...extra},body:JSON.stringify({name:'Rate policy fixture',email,password:'short'})}),env)}
try{
  const {env,sqlite}=fresh(),rule={window:900,max:5};const burst=await Promise.all(Array.from({length:16},()=>consumeAuthLimit(env,'fixture','private-identity',rule,1000)));assert.equal(burst.filter(x=>x.allowed).length,5);assert.equal((await consumeAuthLimit(env,'fixture','private-identity',rule,1100)).retryAfter,800);assert.equal((await consumeAuthLimit(env,'fixture','private-identity',rule,1850)).retryAfter,50);assert.equal((await consumeAuthLimit(env,'fixture','private-identity',rule,1900)).allowed,true)
  assert.ok(sqlite.prepare('SELECT client_key FROM bird_submission_limits').all().every(r=>/^auth-v2:[a-f0-9]{64}$/.test(r.client_key)))
  const shared=fresh(),origin='https://beta.animavidi.invalid';for(let i=0;i<30;i++){const r=await call(shared.env,origin,'different-'+i+'@example.invalid','2001:db8:100::'+(i+1).toString(16));assert.equal(r.status,400,'Independent email addresses on one IPv6 /64 have their own quota')}
  const denied=await call(shared.env,origin,'network-overflow@example.invalid');assert.equal(denied.status,429);assert.ok(Number(denied.headers.get('Retry-After'))>0);assert.equal((await denied.json()).code,'RATE_LIMITED')
  assert.equal((await call(shared.env,'https://preview.animavidi.invalid','new-preview-user@example.invalid')).status,400,'Preview network bucket must be separate from beta')
  assert.equal(shared.mail.length,0,'Invalid requests must never send test mail')
  const perAddress=fresh();for(let i=0;i<5;i++)assert.equal((await call(perAddress.env,origin,i%2?' SAME@EXAMPLE.INVALID ':'same@example.invalid','192.0.2.'+(i+1))).status,400)
  const addressDenied=await call(perAddress.env,'https://another-preview.animavidi.invalid','same@example.invalid','198.51.100.1');assert.equal(addressDenied.status,429,'Changing network/host cannot spam one inbox');assert.equal((await call(perAddress.env,origin,'independent@example.invalid','198.51.100.1')).status,400,'Other addresses remain independent')
  const missing=fresh();assert.equal((await call(missing.env,origin,'missing-ip@example.invalid',null,{'X-Forwarded-For':'192.0.2.90'})).status,503);assert.equal(missing.sqlite.prepare('SELECT COUNT(*) n FROM bird_submission_limits').get().n,0,'Do not put missing IPs in a global bucket')
  assert.equal(trustedClientIp(new Request(origin,{headers:{'CF-Connecting-IP':'not-an-ip'}})),null)
  assert.equal(trustedClientIp(new Request(origin,{headers:{'CF-Connecting-IP':'192.0.2.1,198.51.100.1'}})),null)
  assert.ok(logs.every(line=>!line.includes('@example.invalid')&&!line.includes('192.0.2.')&&!line.includes('2001:db8:')&&!line.includes('password:')))
  console.log('Auth rate tests passed: atomic concurrent limits, bounded wait, expiry reset, 30 different users on one IPv6 network, scoped preview/beta network counters, per-address case-folding/cross-IP protection, Retry-After and no global missing-IP fallback. No mail sent.')
}finally{console.warn=warn;console.error=error;for(const db of databases)db.close()}
