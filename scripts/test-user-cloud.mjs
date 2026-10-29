import {testEnvironment} from './helpers/user-cloud-fixture.mjs'
import assert from 'node:assert/strict'
import {handleUsers} from '../worker/src/users.ts'

const {sqlite,env,mail,objects}=testEnvironment(),origin='http://localhost:5173'
const call=(path,body,cookie)=>handleUsers(new Request(origin+path,{method:body===undefined?'GET':'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'127.0.0.1',...(cookie?{Cookie:cookie}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})}),env)
async function register(email){const response=await call('/api/auth/sign-up/email',{name:'Test explorer',email,password:'test-password-only-123'});assert.equal(response.status,200,await response.clone().text());assert.ok(mail.length);const url=mail.at(-1).text.match(/http[^\s]+/)[0];const verified=await handleUsers(new Request(url),env);assert.ok([200,302].includes(verified.status),await verified.clone().text());const login=await call('/api/auth/sign-in/email',{email,password:'test-password-only-123'});assert.equal(login.status,200,await login.clone().text());return login.headers.get('set-cookie').split(';')[0]}
try{
  const signup=await call('/api/auth/sign-up/email',{name:'Unverified',email:'unverified@example.invalid',password:'test-password-only-123'});assert.equal(signup.status,200,await signup.clone().text())
  assert.equal((await call('/api/auth/sign-in/email',{email:'unverified@example.invalid',password:'test-password-only-123'})).status,403)
  const alice=await register('alice@example.invalid'),bob=await register('bob@example.invalid')
  assert.equal((await call('/api/me/changes')).status,401)
  const user=(await (await call('/api/auth/get-session',undefined,alice)).json()).user
  const previousUpdate=Date.now()-2*86400000,nearExpiry=Date.now()+86400000
  sqlite.prepare('UPDATE av_session SET updatedAt=?,expiresAt=? WHERE userId=?').run(previousUpdate,nearExpiry,user.id)
  assert.equal((await call('/api/me/changes',undefined,alice)).status,200)
  assert.equal(sqlite.prepare('SELECT updatedAt FROM av_session WHERE userId=?').get(user.id).updatedAt,previousUpdate)
  const refreshed=await call('/api/auth/get-session',undefined,alice);assert.equal(refreshed.status,200);assert.ok(refreshed.headers.get('set-cookie'));assert.equal(refreshed.headers.get('cache-control'),'no-store');assert.ok(new Date(sqlite.prepare('SELECT expiresAt FROM av_session WHERE userId=?').get(user.id).expiresAt).getTime()>nearExpiry)
  const id=crypto.randomUUID(),now=new Date().toISOString(),body={id,animalId:'bird-african-fish-eagle',parkId:'kruger',count:1,date:'2026-10-29',time:'09:00',location:'Private fixture',notes:'',composition:'single',behaviour:'resting',photos:[],syncStatus:'local',createdAt:now,updatedAt:now}
  const put=async(cookie,input,path='/api/me/sightings/'+id)=>handleUsers(new Request(origin+path,{method:'PUT',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(input)}),env)
  const mutation={mutationId:crypto.randomUUID(),baseRevision:0,body,deleted:false}
  const first=await put(alice,mutation);assert.equal(first.status,200,await first.clone().text());assert.equal((await first.json()).revision,1)
  assert.equal((await (await put(alice,mutation)).json()).revision,1,'Retry must not duplicate a mutation')
  assert.equal((await (await call('/api/me/changes',undefined,bob)).json()).changes.length,0)
  assert.equal((await put(alice,{...mutation,mutationId:crypto.randomUUID(),body:{...body,notes:'Concurrent edit'}})).status,409)
  assert.equal((await put(alice,{...mutation,baseRevision:1,mutationId:crypto.randomUUID(),body:{...body,notes:'Next revision'}})).status,200)
  const changes=await (await call('/api/me/changes',undefined,alice)).json();assert.equal(changes.changes.at(-1).revision,2)
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=?').get(user.id).n,1)
  const bytes=new Uint8Array([1,2,3]),sha=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(byte=>byte.toString(16).padStart(2,'0')).join(''),photoId=crypto.randomUUID(),photoPath=`/api/me/photos/${photoId}/${sha}`
  const uploaded=await handleUsers(new Request(origin+photoPath,{method:'PUT',headers:{Origin:origin,Cookie:alice,'Content-Type':'image/png'},body:bytes}),env);assert.equal(uploaded.status,200)
  assert.equal((await call(photoPath,undefined,bob)).status,404);assert.equal((await call(photoPath,undefined,alice)).status,200)
  await call('/api/auth/request-password-reset',{email:'alice@example.invalid',redirectTo:origin+'/account/reset'})
  const reset=new URL(mail.at(-1).text.match(/http[^\s]+/)[0]);const redirect=await handleUsers(new Request(reset),env);const token=new URL(redirect.headers.get('location')).searchParams.get('token')
  assert.equal((await call('/api/auth/reset-password',{token,newPassword:'replacement-password-123'})).status,200)
  assert.equal((await call('/api/me/changes',undefined,alice)).status,401,'Password reset revokes prior sessions')
  const relogin=await call('/api/auth/sign-in/email',{email:'alice@example.invalid',password:'replacement-password-123'});assert.equal(relogin.status,200);const renewed=relogin.headers.get('set-cookie').split(';')[0]
  const ownProposal=crypto.randomUUID(),proposalTime=new Date().toISOString()
  sqlite.prepare('INSERT INTO bird_proposals(id,body,name_key,scientific_key,revision,published_id,created_at,updated_at,submitter_user_id) VALUES (?,?,?,?,?,?,?,?,?)').run(ownProposal,JSON.stringify({commonName:'Private fixture',scientificName:'',description:'Temporary private contribution test.',sourceUrl:'',author:'Test owner'}),'private fixture','',crypto.randomUUID(),'bird-community-'+crypto.randomUUID(),proposalTime,proposalTime,user.id)
  await env.MAMMAL_PHOTOS.put('contributions/'+ownProposal+'/photo',new Uint8Array([4,5,6]),{httpMetadata:{contentType:'image/webp'}})
  const removed=await call('/api/auth/delete-user',{password:'replacement-password-123'},renewed);assert.equal(removed.status,200,await removed.clone().text());assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=?').get(user.id).n,0);assert.equal(objects.size,0);assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM bird_proposals WHERE id=?').get(ownProposal).n,0);assert.equal((await call('/api/me/changes',undefined,bob)).status,200)
  console.log('User cloud tests passed: registration/verification, unverified denial, separate users, private photos, idempotency, revision conflicts, changes, reset/session revocation and deletion cleanup.')
}finally{sqlite.close()}
