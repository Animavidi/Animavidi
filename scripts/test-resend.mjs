import assert from 'node:assert/strict'
import {testEnvironment} from './helpers/user-cloud-fixture.mjs'
import {sendAccountMail,tokenDigest} from '../worker/src/accountMail.ts'
import {handleUsers} from '../worker/src/users.ts'
const message={to:'explorer@example.invalid',subject:'Verify',text:'https://example.invalid/token',html:'<p>Verify</p>'},key='re_test_placeholder_not_a_real_key'
const sent=[]
const retry=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');sent.push(options);return sent.length<3?new Response('{}',{status:sent.length===1?429:503}):Response.json({id:'mock-message'})}
await sendAccountMail({RESEND_API_KEY:key},message,retry)
assert.equal(sent.length,3);assert.equal(new Set(sent.map(x=>x.headers['Idempotency-Key'])).size,1);assert.equal(new Set(sent.map(x=>x.body)).size,1);assert.equal(JSON.parse(sent[0].body).from,'Animavidi <no-reply@mail.animavidi.com>');assert.ok(sent[0].signal)
let calls=0;await assert.rejects(sendAccountMail({RESEND_API_KEY:key},message,async()=>{calls++;return new Response('sensitive provider error',{status:403})}),/service rejected/);assert.equal(calls,1)
await assert.rejects(sendAccountMail({RESEND_API_KEY:key},message,async()=>{throw new Error('network with sensitive details')}),error=>!error.message.includes('sensitive')&&/temporarily unavailable/.test(error.message))
await assert.rejects(sendAccountMail({},message),/not configured/)
const {env,sqlite}=testEnvironment();delete env.EMAIL;env.RESEND_API_KEY=key
const originalFetch=globalThis.fetch,mail=[],pending=[];let providerStatus=200,releaseMail,holdMail=false
const context={waitUntil(task){pending.push(task)}}
globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');assert.equal(options.headers.Authorization,'Bearer '+key);if(holdMail)await new Promise(resolve=>{releaseMail=resolve});if(providerStatus!==200)return new Response('{}',{status:providerStatus});mail.push(JSON.parse(options.body));return Response.json({id:'mock-'+mail.length})}
const origin='https://account-test.animavidi.invalid',password='test-password-only-123'
const call=(path,body)=>handleUsers(new Request(origin+path,{method:body===undefined?'GET':'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'127.0.0.2'},...(body===undefined?{}:{body:JSON.stringify(body)})}),env,context)
const drain=async()=>{await Promise.all(pending.splice(0))}
const link=()=>new URL(mail.at(-1).text.match(/https[^\s]+/)[0])
try{
  assert.equal((await call('/api/auth/sign-up/email',{name:'Resend mock',email:message.to,password})).status,200);await drain();const verify=link()
  const results=await Promise.all([call(verify.pathname+verify.search),call(verify.pathname+verify.search)])
  assert.equal(results.filter(x=>[200,302].includes(x.status)).length,1);assert.equal(results.filter(x=>x.status===400).length,1,'Activation link is atomically single-use')
  assert.equal((await call(verify.pathname+verify.search)).status,400)
  assert.equal((await call('/api/auth/sign-in/email',{email:message.to,password})).status,200)
  const known=await call('/api/auth/request-password-reset',{email:message.to,redirectTo:origin+'/account/reset'});await drain();const reset=link(),token=reset.pathname.split('/').at(-1)
  const unknown=await call('/api/auth/request-password-reset',{email:'missing@example.invalid',redirectTo:origin+'/account/reset'});await drain()
  assert.equal(known.status,unknown.status);assert.deepEqual(await known.json(),await unknown.json())
  const expiry=sqlite.prepare('SELECT expiresAt FROM av_verification WHERE identifier=?').get('reset-password:'+token).expiresAt;assert.ok(new Date(expiry).getTime()-Date.now()<=1800000)
  const resets=await Promise.all([call('/api/auth/reset-password',{token,newPassword:'replacement-password-123'}),call('/api/auth/reset-password',{token,newPassword:'second-replacement-password-123'})]);assert.deepEqual(resets.map(x=>x.status).sort(),[200,400],'Concurrent reset token use has exactly one winner')
  assert.equal((await call('/api/auth/reset-password',{token,newPassword:'replay-password-123'})).status,400,'Reset token is consumed once')
  await call('/api/auth/request-password-reset',{email:message.to,redirectTo:origin+'/account/reset'});await drain();const expired=link().pathname.split('/').at(-1);sqlite.prepare('UPDATE av_verification SET expiresAt=? WHERE identifier=?').run(new Date(Date.now()-1000).toISOString(),'reset-password:'+expired)
  assert.equal((await call('/api/auth/reset-password',{token:expired,newPassword:'expired-password-123'})).status,400)
  assert.equal((await call('/api/auth/sign-up/email',{name:'Expired activation',email:'expired@example.invalid',password})).status,200);await drain();const expiredVerify=link(),digest='activation-'+await tokenDigest(expiredVerify.searchParams.get('token'));sqlite.prepare('UPDATE av_verification SET expiresAt=0 WHERE id=?').run(digest)
  assert.equal((await call(expiredVerify.pathname+expiredVerify.search)).status,400)
  holdMail=true
  const backgroundResponse=await Promise.race([call('/api/auth/request-password-reset',{email:message.to,redirectTo:origin+'/account/reset'}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Reset response waited for mail transport')),1000))])
  assert.equal(backgroundResponse.status,200);const started=Date.now();while(!releaseMail){if(Date.now()-started>1000)throw new Error('Background mail did not start');await new Promise(resolve=>setTimeout(resolve,5))}holdMail=false;releaseMail();await drain()
  // Provider latency/failure is handled by waitUntil, never exposed only for existing users.
  providerStatus=403
  const failure=await call('/api/auth/request-password-reset',{email:message.to,redirectTo:origin+'/account/reset'});await drain();assert.equal(failure.status,200);assert.deepEqual(await failure.json(),{status:true,message:'If this email exists in our system, check your email for the reset link'})
  console.log('Resend mock tests passed: fixed sender, server-only key, bounded retries/idempotency, generic failures, background reset privacy, concurrent activation replay denial, activation expiry, reset expiry and reset replay denial. No email or external API request was sent.')
}finally{globalThis.fetch=originalFetch;sqlite.close()}


