import assert from 'node:assert/strict'
import {createServer} from 'node:http'
import {readFileSync,existsSync,mkdirSync} from 'node:fs'
import {resolve,extname} from 'node:path'
import {pathToFileURL} from 'node:url'
import {pbkdf2Sync,randomBytes} from 'node:crypto'
import preview from '../worker/src/preview.ts'
import {testEnvironment} from './helpers/user-cloud-fixture.mjs'
const {env,sqlite,mail,objects}=testEnvironment(),salt=randomBytes(16),adminPassword='local-admin-test-only'
Object.assign(env,{ADMIN_USERNAME:'test-admin',ADMIN_SESSION_SECRET:'local-admin-session-only',ADMIN_PASSWORD_HASH:`100000:${salt.toString('base64url')}:${pbkdf2Sync(adminPassword,salt,100000,32,'sha256').toString('base64url')}`,ASSETS:{fetch:async()=>new Response('Not found',{status:404})}})
const root=resolve('dist'),base='http://127.0.0.1:4174',output=resolve(process.env.ANIMAVIDI_TEST_OUTPUT_DIR ?? 'test-results/accounts');mkdirSync(output,{recursive:true})
const server=createServer(async(req,res)=>{
  try{const url=new URL(req.url,base)
    if(url.pathname.startsWith('/api/')){const chunks=[];for await(const chunk of req)chunks.push(chunk);const response=await preview.fetch(new Request(url,{method:req.method,headers:{...req.headers,'cf-connecting-ip':'127.0.0.1'},...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})}),env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return}
    let path=resolve(root,'.'+decodeURIComponent(url.pathname));if(!path.startsWith(root))throw new Error('Invalid path');if(!existsSync(path)||url.pathname==='/')path=resolve(root,'index.html')
    const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.wav':'audio/wav'}
    res.writeHead(200,{'Content-Type':types[extname(path)]??'application/octet-stream','Cache-Control':'no-cache'});res.end(readFileSync(path))
  }catch(error){console.error('Local browser fixture failed:',error.message);res.writeHead(500);res.end('Local fixture error')}
})
await new Promise(resolve=>server.listen(4174,'127.0.0.1',resolve))
const modulePath=process.env.PLAYWRIGHT_MODULE_PATH ?? 'playwright'
const {chromium}=await import(/^[A-Za-z]:[\\/]/.test(modulePath)?pathToFileURL(modulePath).href:modulePath),browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? (process.platform==='win32'&&existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)})
const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[]
page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(30000)
const password='local-test-password-123',email='explorer-a@example.invalid';let confirmationCopy=''
const snapshot=name=>page.screenshot({path:resolve(output,name+'.png'),fullPage:false})
async function until(check,label){const deadline=Date.now()+30000;while(Date.now()<deadline){if(await check())return;await new Promise(resolve=>setTimeout(resolve,100))}throw new Error('Timed out: '+label)}
async function login(target,email,password){await target.goto(base+'/login');await target.getByLabel('Email address',{exact:true}).fill(email);await target.getByLabel('Password',{exact:true}).fill(password);await target.getByRole('button',{name:'Sign in',exact:true}).click();await target.waitForURL('**/parks/kruger')}
async function register(target,email){await target.goto(base+'/account/create');await target.getByLabel('Name',{exact:true}).fill('Safari test explorer');await target.getByLabel('Email address',{exact:true}).fill(email);await target.getByLabel('Password',{exact:true}).fill(password);await target.getByRole('button',{name:'Create account',exact:true}).click();await target.getByRole('heading',{name:'Registration received',exact:true}).waitFor();await target.waitForFunction(()=>document.activeElement?.tagName==='H1');assert.equal(await target.getByLabel('Password',{exact:true}).count(),0);confirmationCopy=await target.locator('main').innerText();const message=mail.findLast(item=>item.to===email&&item.subject.includes('Verify'));assert.ok(message);await target.goto(message.text.match(/http[^\s]+/)[0]);await target.getByText('Email verified. You can now sign in.',{exact:true}).waitFor()}
async function add(target,id,bird=false,location='Browser safari fixture',photo){await target.goto(base+`/parks/kruger/${bird?'birds':'mammals'}/${id}/sightings/new`);await target.getByRole('textbox',{name:/^Location/}).fill(location);if(photo)await target.locator('input[type=file]').setInputFiles({name:'private.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')});await target.getByRole('button',{name:'Save sighting',exact:true}).click();if(id==='aardvark'){await target.getByRole('button',{name:'Continue safari',exact:true}).click()}await target.getByRole('heading',{name:'A memory worth keeping'}).waitFor()}
async function edit(target,id,location){await target.goto(base+`/parks/kruger/sightings/${id}/edit`);await target.getByRole('textbox',{name:/^Location/}).fill(location);await target.getByRole('button',{name:'Save changes',exact:true}).click();await target.getByText(new RegExp('^'+location+'$','i')).waitFor()}
try{
  await page.goto(base+'/parks/kruger');await page.getByRole('heading',{name:'Welcome back',exact:true}).waitFor()
  // Original, pre-account data exists before registration. Keep the original DB.
  const legacyId=await page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('animavidi',1);request.onupgradeneeded=()=>{const store=request.result.createObjectStore('sightings',{keyPath:'id'});store.createIndex('animalId','animalId');store.createIndex('createdAt','createdAt')};request.onsuccess=()=>{const db=request.result,tx=db.transaction('sightings','readwrite'),id=crypto.randomUUID(),now=new Date().toISOString();tx.objectStore('sightings').add({id,animalId:'african-elephant',parkId:'kruger',count:1,date:'2026-10-29',time:'08:00',location:'Original legacy fixture',notes:'Never delete this source record',composition:'single',behaviour:'resting',photos:[{id:crypto.randomUUID(),name:'legacy.png',type:'image/png',blob:new Blob([Uint8Array.from(atob((()=>{const canvas=document.createElement('canvas');canvas.width=8;canvas.height=8;canvas.getContext('2d').fillRect(0,0,8,8);return canvas.toDataURL('image/png').split(',')[1]})()),c=>c.charCodeAt(0))],{type:'image/png'})}],syncStatus:'local',createdAt:now,updatedAt:now});tx.oncomplete=()=>{db.close();localStorage.setItem('animavidi:visited-camps','["skukuza"]');resolve(id)};tx.onerror=()=>reject(tx.error)}}))
  await register(page,email)
  // Repeat the reported flow for an already verified account. Signup must not change its password or promise another activation mail.
  const originalCredential=sqlite.prepare("SELECT password FROM av_account WHERE userId=(SELECT id FROM av_user WHERE email=?) AND providerId='credential'").get(email).password,mailBeforeDuplicate=mail.length
  await page.goto(base+'/account/create');await page.getByLabel('Name',{exact:true}).fill('Changed registration name');await page.getByLabel('Email address',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill('different-registration-password-123');await page.getByRole('button',{name:'Create account',exact:true}).click();await page.getByRole('heading',{name:'Registration received',exact:true}).waitFor();await page.waitForFunction(()=>document.activeElement?.tagName==='H1')
  assert.equal(await page.getByLabel('Password',{exact:true}).count(),0);assert.equal(await page.locator('main').innerText(),confirmationCopy,'Same confirmation for new and existing accounts protects privacy');assert.equal(sqlite.prepare("SELECT password FROM av_account WHERE userId=(SELECT id FROM av_user WHERE email=?) AND providerId='credential'").get(email).password,originalCredential);assert.equal(mail.length,mailBeforeDuplicate);await snapshot('registration-confirmation-mobile')
  await page.setViewportSize({width:1440,height:900});await snapshot('registration-confirmation-desktop');await page.setViewportSize({width:390,height:844})
  await page.getByRole('link',{name:'Set or reset password',exact:true}).click();await page.getByRole('heading',{name:'Forgot your password?',exact:true}).waitFor();assert.equal(await page.getByLabel('Email address',{exact:true}).inputValue(),email);assert.equal(new URL(page.url()).search,'','Email prefill must not be placed in the URL');assert.equal(await page.getByLabel('Password',{exact:true}).count(),0)
  await page.getByRole('link',{name:'Sign in',exact:true}).click();assert.equal(await page.getByLabel('Email address',{exact:true}).inputValue(),email);assert.equal(await page.getByLabel('Password',{exact:true}).inputValue(),'');await login(page,email,password)
  const user=sqlite.prepare('SELECT id FROM av_user WHERE email=?').get(email);assert.ok(user)
  await page.goto(base+'/onboarding/location');await page.getByRole('button',{name:'Start your safari',exact:true}).click();await page.waitForURL('**/parks/kruger')
  await page.goto(base+'/my-animavidi');await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await context.setOffline(true);await page.getByRole('button',{name:'Back up and import my existing journal',exact:true}).click();await page.getByText(/existing observations processed/).waitFor();await page.reload();await page.getByRole('button',{name:'Back up and import my existing journal',exact:true}).click();assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=?').get(user.id).n,0);await context.setOffline(false)
  await until(()=>sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=? AND id=?').get(user.id,legacyId).n===1,'legacy cloud migration')
  await page.getByText(/Migration verified:/).waitFor()
  await page.reload();await page.getByText(/Migration verified:/).waitFor()
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=?').get(user.id).n,1)
  const recoveryDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Download recovery archive',exact:true}).click();const recoveryFile=await (await recoveryDownload).path();const recovery=JSON.parse(readFileSync(recoveryFile,'utf8'));assert.equal(recovery.copies.find(row=>row.id==='legacy-original').sightings.length,1);await page.getByLabel('Restore original migration recovery',{exact:true}).setInputFiles(recoveryFile);await page.getByText(/Restored 0 missing observations/).waitFor()
  await snapshot('profile-and-migration-mobile')
  await add(page,'aardvark')
  const png=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=60;canvas.height=40;const ctx=canvas.getContext('2d');ctx.fillStyle='gold';ctx.fillRect(0,0,60,40);return canvas.toDataURL('image/png').split(',')[1]})
  await add(page,'bird-african-fish-eagle',true,'Online bird fixture',png)
  await until(()=>sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=?').get(user.id).n===3,'online mammal and bird sync')
  const birdId=sqlite.prepare("SELECT id FROM av_sightings WHERE user_id=? AND json_extract(body,'$.animalId')='bird-african-fish-eagle'").get(user.id).id
  await page.goto(base+'/passport');await page.getByRole('heading',{name:'African fish eagle',exact:true}).first().waitFor();await snapshot('passport-mobile')
  await page.goto(base+'/parks/kruger/birds/bird-saddle-billed-stork');await page.getByRole('heading',{name:'Saddle-billed stork',exact:true}).first().waitFor();await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await page.evaluate(()=>Promise.all(['/api/content','/api/photos','/api/birds'].map(path=>fetch(path))))
  await context.setOffline(true)
  await add(page,'bird-saddle-billed-stork',true,'Offline bird fixture',png)
  await page.goto(base+'/parks/kruger/sightings');await page.getByText('Offline bird fixture',{exact:true}).waitFor();await page.reload();await page.getByText('Offline bird fixture',{exact:true}).waitFor();assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=?').get(user.id).n,3)
  await snapshot('offline-journal-mobile');await context.setOffline(false)
  await until(()=>sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=?').get(user.id).n===4,'automatic offline resume')
  const second=await browser.newContext({viewport:{width:820,height:1000}}),other=await second.newPage();await login(other,email,password)
  await other.goto(base+'/parks/kruger/sightings');await other.getByText('Offline bird fixture',{exact:true}).waitFor();await other.getByText('Online bird fixture',{exact:true}).waitFor()
  await other.goto(base+'/passport');await other.getByLabel('Special sighting achievements').getByText('Aardvark',{exact:true}).waitFor()
  await other.goto(base+'/my-animavidi');await until(()=>other.getByRole('checkbox',{name:'Skukuza',exact:true}).isChecked(),'camp sync')
  await second.setOffline(true);await edit(other,birdId,'Second device offline edit')
  await edit(page,birdId,'First device saved edit')
  await until(()=>JSON.parse(sqlite.prepare('SELECT body FROM av_sightings WHERE user_id=? AND id=?').get(user.id,birdId).body).location==='First device saved edit','first device update')
  await second.setOffline(false);await other.goto(base+'/my-animavidi');await other.getByRole('button',{name:'Use cloud version',exact:true}).waitFor();await other.getByRole('button',{name:'Use cloud version',exact:true}).click();await other.getByRole('button',{name:'Use cloud version',exact:true}).waitFor({state:'detached'});await other.goto(base+`/parks/kruger/sightings/${birdId}`);await other.getByText(/^First device saved edit$/i).waitFor()
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=?').get(user.id).n,4,'Conflicts do not create duplicate sightings')
  const third=await browser.newContext({viewport:{width:1440,height:900}}),outsider=await third.newPage();await register(outsider,'explorer-b@example.invalid');await login(outsider,'explorer-b@example.invalid',password);await outsider.goto(base+'/passport');await outsider.getByText('No species discovered yet',{exact:true}).waitFor()
  const rows=await (await outsider.request.get(base+'/api/me/changes')).json();assert.equal(rows.changes.filter(row=>row.kind==='sighting').length,0)
  const photo=JSON.parse(sqlite.prepare('SELECT body FROM av_sightings WHERE user_id=? AND id=?').get(user.id,birdId).body).photos[0]
  assert.equal((await outsider.request.get(base+`/api/me/photos/${photo.id}/${photo.sha256}`)).status(),404);assert.equal((await outsider.request.get(base+'/api/admin/session',{headers:{Origin:base}})).status(),401)
  await second.setOffline(true);await add(other,'bird-lilac-breasted-roller',true,'Pending before password reset',png)
  await page.goto(base+'/account/forgot');await page.getByLabel('Email address',{exact:true}).fill(email);await page.getByRole('button',{name:'Send reset link',exact:true}).click();await page.getByText(/If this account exists/).waitFor();await page.goto(mail.findLast(item=>item.to===email&&item.subject.includes('Reset')).text.match(/http[^\s]+/)[0]);await page.getByLabel('New password',{exact:true}).fill('changed-local-password-123');await page.getByRole('button',{name:'Save new password',exact:true}).click();await page.getByText(/Password updated/).waitFor()
  await login(page,email,'changed-local-password-123');await second.setOffline(false);await other.goto(base+'/parks/kruger/sightings');await other.getByRole('heading',{name:'Welcome back',exact:true}).waitFor();await login(other,email,'changed-local-password-123');await until(()=>sqlite.prepare('SELECT COUNT(*) n FROM av_sightings WHERE user_id=?').get(user.id).n===5,'reauthentication preserves the offline queue')
  await page.goto(base+'/my-animavidi');await page.getByRole('button',{name:'Synchronise now',exact:true}).click();await until(async()=>!await page.getByRole('button',{name:'Synchronise now',exact:true}).isDisabled(),'sync idle')
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download device backup',exact:true}).click();const backup=JSON.parse(readFileSync(await (await download).path(),'utf8'));assert.equal(backup.sightings.length,5);assert.ok(backup.sightings.some(row=>row.photos.length))
  await until(async()=>!await page.getByRole('button',{name:'Export account data',exact:true}).isDisabled(),'account export ready');const accountDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Export account data',exact:true}).click();const accountData=JSON.parse(readFileSync(await (await accountDownload).path(),'utf8'));assert.equal(accountData.account.email,email);assert.equal(accountData.sightings.length,5);assert.ok(accountData.recovery.copies.some(copy=>copy.id==='legacy-original'))
  const cached=await page.evaluate(async()=>{const urls=[];for(const key of await caches.keys())for(const request of await (await caches.open(key)).keys())urls.push(request.url);return urls});assert.equal(cached.some(url=>url.includes('/api/me/')||url.includes('/api/auth/')),false)
  const manifest=await (await page.request.get(base+'/manifest.webmanifest')).json();assert.equal(manifest.display,'standalone');assert.equal(manifest.icons.length,2)
  const staleAccount=await outsider.request.get(base+'/api/me/changes',{headers:{'X-Animavidi-Account':user.id}});assert.equal(staleAccount.status(),403)
  await page.setViewportSize({width:1440,height:900});await snapshot('account-desktop');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false)
  // A delayed successful session response must never undo sign-out.
  const sessionSnapshot=await (await page.request.get(base+'/api/auth/get-session')).json()
  let capturedResolve,releaseResolve,held=false
  const captured=new Promise(resolve=>{capturedResolve=resolve}),release=new Promise(resolve=>{releaseResolve=resolve})
  await context.route(base+'/api/auth/get-session',async(route)=>{if(!held){held=true;capturedResolve();await release;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(sessionSnapshot)})}else await route.continue()})
  const extraTab=await context.newPage();await extraTab.goto(base+'/parks/kruger');await captured
  await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('heading',{name:'Welcome back',exact:true}).waitFor();releaseResolve();await extraTab.getByRole('heading',{name:'Welcome back',exact:true}).waitFor()
  await context.unroute(base+'/api/auth/get-session')
  await login(page,'explorer-b@example.invalid',password);await page.goto(base+'/parks/kruger/sightings');await page.getByRole('heading',{name:'Your journal is ready',exact:true}).waitFor()
  await page.goto(base+'/my-animavidi');await page.getByRole('button',{name:'Sign out',exact:true}).click();await login(page,email,'changed-local-password-123');await page.goto(base+'/my-animavidi');await extraTab.close()
  await page.getByLabel('Confirm your password',{exact:true}).fill('changed-local-password-123');await page.getByRole('checkbox',{name:/I understand that deleting/}).check();await page.getByRole('button',{name:'Delete my account and private data',exact:true}).click();await page.getByRole('heading',{name:'Welcome back',exact:true}).waitFor();assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM av_user WHERE id=?').get(user.id).n,0);assert.equal([...objects.keys()].some(key=>key.startsWith('private/'+user.id+'/')),false)
  assert.deepEqual(errors,[]);await second.close();await third.close()
  console.log('Account browser tests passed: required login, register/verify, legacy backup/import/retry, mammals/birds/photos/Passport, SW offline reload/save/resume, second device, private-user isolation, revision conflict resolution, reset/session revocation, export and account deletion. Mobile/tablet/desktop checked.')
  console.log('Browser evidence: '+output)
}catch(error){console.error({url:page.url(),text:(await page.locator('body').innerText()).slice(0,2500),errors});await snapshot('failure');throw error}
finally{await browser.close();await new Promise(resolve=>server.close(resolve));sqlite.close()}
