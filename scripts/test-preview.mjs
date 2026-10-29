import assert from 'node:assert/strict'
import { readFileSync,writeFileSync,existsSync,mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const base=process.argv[2], phase=process.argv[3] ?? 'full'
if(!base || !/^https:\/\/animavidi-beta\.[a-z0-9-]+\.workers\.dev$/.test(base))throw new Error('Use only the isolated animavidi-beta workers.dev preview.')
const stateFile=resolve('work/preview-test-state.json')
const previous=existsSync(stateFile) ? JSON.parse(readFileSync(stateFile,'utf8')) : null
const state=previous && !previous.cleaned ? previous : {run:crypto.randomUUID(),proposals:[]}
if(phase==='after-deploy' && !state.full?.passed)throw new Error('Run the full preview test before the after-deploy phase.')
const save=()=>writeFileSync(stateFile,JSON.stringify(state,null,2))
const credentials=JSON.parse(readFileSync('work/preview-login.json','utf8'))
const modulePath=process.env.PLAYWRIGHT_MODULE_PATH
const {chromium}=await import(modulePath ? pathToFileURL(modulePath).href : 'playwright')
const context=await chromium.launchPersistentContext(resolve('work/preview-test-browser-'+state.run),{headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,viewport:{width:390,height:844}})
const page=await context.newPage();page.setDefaultTimeout(30000)
const errors=[];page.on('pageerror',(error)=>errors.push(error.message))
const output=resolve('../../outputs/preview-review');mkdirSync(output,{recursive:true})
const api=(path,options={})=>context.request.fetch(base+path,{...options,headers:{Origin:base,...options.headers}})
const screenshot=(name)=>page.screenshot({path:resolve(output,name+'.png'),fullPage:false})
async function rows(){const response=await api('/api/admin/bird-proposals?status=pending');assert.equal(response.status(),200);return (await response.json()).items}
async function approve(item){const response=await api('/api/admin/bird-proposals/'+item.id,{method:'PUT',headers:{'If-Match':item.revision},data:{draft:item.draft,action:'approve',reviewNote:'Isolated beta verification fixture; remove only this test record after checks.'}});assert.equal(response.status(),200);return response.json()}
try {
  if(phase==='after-deploy') {
    await page.goto(base+'/passport');await page.getByRole('heading',{name:'African fish eagle',exact:true}).first().waitFor()
    const stored=await page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('animavidi',1);request.onsuccess=()=>{const db=request.result;const rows=db.transaction('sightings').objectStore('sightings').getAll();rows.onsuccess=async()=>{resolve({count:rows.result.length,id:rows.result[0].id,photoBytes:rows.result[0].photos[0]?.blob.size});db.close()};rows.onerror=()=>reject(rows.error)}}))
    assert.equal(stored.count,1);assert.equal(stored.id,state.sightingId);assert.equal(stored.photoBytes,state.photoBytes)
    await page.goto(base+'/my-animavidi');assert.equal(await page.getByLabel('Explorer name').inputValue(),'Beta verification explorer');assert.equal(await page.getByRole('checkbox',{name:'Skukuza',exact:true}).isChecked(),true)
    const logout=await api('/api/admin/logout',{method:'POST'});assert.equal(logout.status(),200)
    assert.equal((await api('/api/admin/content')).status(),401)
    const login=await api('/api/admin/login',{method:'POST',data:credentials});assert.equal(login.status(),200)
    await page.goto(base+'/passport');await page.getByRole('heading',{name:'African fish eagle',exact:true}).first().waitFor()
    await screenshot('passport-after-deploy')
    // Real editorial writes use only the test community species and a draft route.
    await page.goto(base+'/admin/content/animals/'+state.communityId)
    await page.getByRole('textbox',{name:/^Introduction/}).fill('Isolated beta profile verification. This is not a species description.')
    await page.getByRole('textbox',{name:'Source URL',exact:true}).fill('https://www.sanparks.org/parks/kruger/explore/fauna-flora/birds/checklist')
    const saving=page.waitForResponse((response)=>response.url()===base+'/api/admin/content/animal/'+state.communityId && response.request().method()==='PUT')
    await page.getByRole('button',{name:'Save profile',exact:true}).click();assert.equal((await saving).status(),200)
    await page.reload();await page.getByRole('textbox',{name:/^Introduction/}).waitFor();assert.match(await page.getByRole('textbox',{name:/^Introduction/}).inputValue(),/Isolated beta profile verification/)
    state.routeId='beta-verification-'+state.run.slice(0,8);save()
    const route={kind:'route',id:state.routeId,title:'Isolated draft verification',region:'south',start:'Verification only',end:'Verification only',roads:['H1-1'],stops:[],description:'Not a driving guide. Isolated integration fixture.',sourceUrl:'',sourcePages:'Test fixture, not brochure content',reviewedAt:'2026-10-29',published:false}
    const existing=await (await api('/api/admin/content')).json(),revision=existing['route/'+state.routeId]?.revision ?? 'new'
    const saved=await api('/api/admin/content/route/'+state.routeId,{method:'PUT',headers:{'If-Match':revision},data:route});assert.equal(saved.status(),200)
    const next=(await saved.json()).revision
    assert.equal((await api('/api/admin/content/route/'+state.routeId,{method:'PUT',headers:{'If-Match':revision},data:route})).status(),412)
    assert.equal((await api('/api/admin/content/route/'+state.routeId,{method:'PUT',headers:{'If-Match':next},data:{...route,title:'Updated isolated draft'}})).status(),200)
    const publicContent=await (await context.request.get(base+'/api/content')).json();assert.equal(publicContent['route/'+state.routeId].content.title,'Unpublished route')
    const history=await (await api('/api/admin/content/route/'+state.routeId+'/history')).json();assert.ok(history.items.length>=1)
    // Achievement transitions use a new private browser context, never server data.
    const achievements=await context.browser().newContext();const journal=await achievements.newPage()
    await journal.goto(base+'/parks/kruger')
    await journal.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('animavidi',1);request.onupgradeneeded=()=>{const store=request.result.createObjectStore('sightings',{keyPath:'id'});store.createIndex('animalId','animalId');store.createIndex('createdAt','createdAt')};request.onsuccess=()=>{const db=request.result,transaction=db.transaction('sightings','readwrite');for(const animalId of ['white-rhinoceros','african-elephant','african-buffalo','leopard']){const now=new Date().toISOString();transaction.objectStore('sightings').add({id:crypto.randomUUID(),animalId,parkId:'kruger',date:'2026-10-29',time:'09:00',count:1,behaviour:'resting',composition:'single',location:'Isolated private fixture',notes:'',photos:[],syncStatus:'local',createdAt:now,updatedAt:now})}transaction.oncomplete=()=>{db.close();resolve()};transaction.onerror=()=>reject(transaction.error)}}))
    for(const [id,tier] of [['african-lion','big-five'],['honey-badger','rare'],['aardvark','legendary']]) {
      await journal.goto(base+'/parks/kruger/mammals/'+id+'/sightings/new');await journal.getByRole('textbox',{name:/^Location/}).fill('Isolated achievement fixture');await journal.getByRole('button',{name:'Save sighting',exact:true}).click()
      if(tier==='big-five'){await journal.getByRole('heading',{name:'Big Five Complete',exact:true}).waitFor();await journal.getByRole('button',{name:'Continue your safari',exact:true}).click()}
      else {await journal.getByRole('dialog').waitFor();await journal.getByText(tier==='rare' ? 'Rare sighting' : 'Legendary sighting',{exact:true}).waitFor();await journal.getByRole('button',{name:'Continue safari',exact:true}).click()}
    }
    await journal.goto(base+'/passport');await journal.getByRole('heading',{name:'Aardvark',exact:true}).first().waitFor();await achievements.close()
    assert.match((await context.request.get(base+'/passport')).headers()['x-robots-tag'],/noindex/)
    state.afterDeploy={passed:true,at:new Date().toISOString()};save();console.log('Live persistence passed: browser reopen, second deployment, photo bytes, profile/camps, admin logout/login and private journal retention.');
  } else {
    const anonymous=await context.request.get(base+'/api/admin/content',{headers:{Origin:base}})
    if(!state.started)assert.equal(anonymous.status(),401)
    state.started=true;save()
    assert.equal((await context.request.post(base+'/api/admin/login',{headers:{Origin:'https://untrusted.invalid'},data:credentials})).status(),403)
    assert.equal((await api('/api/admin/login',{method:'POST',data:{username:'wrong',password:'wrong'}})).status(),401)
    await page.goto(base+'/admin')
    await page.getByRole('heading',{name:/^(Administrator sign in|Good morning)$/}).waitFor()
    if(page.url().includes('/login')){await page.getByLabel('Username',{exact:true}).fill(credentials.username);await page.getByLabel('Password',{exact:true}).fill(credentials.password);await page.getByRole('button',{name:'Sign in',exact:true}).click()}
    await page.getByRole('heading',{name:'Good morning',exact:true}).waitFor()
    await screenshot('admin-mobile')
    // Submit through the public UI, resize/re-encode a genuine browser image,
    // inspect the authenticated private R2 image and verify approval publication.
    if(!state.photoProposal) {
      await page.goto(base+'/parks/kruger/birds/propose?target=bird-african-fish-eagle')
      await page.getByLabel('Contribution type').selectOption('photo')
      await page.getByLabel('Existing bird',{exact:true}).selectOption('bird-african-fish-eagle')
      await page.getByLabel('Your public contributor name').fill('Isolated beta verification')
      await page.getByLabel('Description',{exact:true}).fill('Generated test image for isolated beta verification; not a species photograph. Remove this test contribution after verification.')
      const png=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=80;canvas.height=60;const ctx=canvas.getContext('2d');ctx.fillStyle='#465e37';ctx.fillRect(0,0,80,60);return canvas.toDataURL('image/png').split(',')[1]})
      state.png=png;save()
      await page.locator('input[type=file]').setInputFiles({name:'verification-fixture.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')})
      await page.getByRole('checkbox').check()
      const submitted=page.waitForResponse((response)=>response.url()===base+'/api/bird-proposals' && response.request().method()==='POST')
      await page.getByRole('button',{name:'Submit for approval',exact:true}).click()
      const response=await submitted;assert.equal(response.status(),201);state.photoProposal=(await response.json()).id;state.proposals.push(state.photoProposal);save()
      await page.getByRole('heading',{name:'Submitted for approval',exact:true}).waitFor()
    }
    let pending=await rows(), photo=pending.find((item)=>item.id===state.photoProposal)
    if(photo) {
      assert.equal((await context.request.get(base+'/api/bird-contributions/'+photo.id+'/photo')).status(),404)
      await page.goto(base+'/admin/bird-proposals')
      // section has an accessible name and exposes the private image to Guido.
      await page.waitForFunction(()=>[...document.querySelectorAll('figure img')].some((image)=>image.complete && image.naturalWidth===80))
      await screenshot('private-photo-review')
      await approve(photo)
    }
    const publicPhoto=await context.request.get(base+'/api/bird-contributions/'+state.photoProposal+'/photo')
    assert.equal(publicPhoto.status(),200);assert.equal(publicPhoto.headers()['content-type'],'image/webp')
    // New-species publication is independently exercised against real D1.
    if(!state.birdProposal) {
      const response=await api('/api/bird-proposals',{method:'POST',data:{commonName:'Beta verification '+state.run.slice(0,8),scientificName:'',description:'Temporary isolated verification entry, not a real species. Remove after checks.',sourceUrl:'',author:'Isolated beta verification'}})
      assert.equal(response.status(),201);state.birdProposal=(await response.json()).id;state.proposals.push(state.birdProposal);save()
    }
    pending=await rows();const bird=pending.find((item)=>item.id===state.birdProposal)
    if(bird){state.communityId=bird.publishedId;save();await approve(bird)}
    const catalogue=await (await context.request.get(base+'/api/birds')).json();assert.ok(catalogue.birds.some((item)=>item.id===state.communityId))
    // Primary media CRUD uses the real R2 binding, then removes only this override.
    await page.goto(base+'/admin/content/animals/bird-african-fish-eagle')
    await page.getByRole('heading',{name:'African fish eagle',exact:true}).waitFor()
    await page.locator('input[type=file]').setInputFiles({name:'verification-primary.png',mimeType:'image/png',buffer:Buffer.from(state.png,'base64')})
    await page.getByText(/^Photo (added|replaced) successfully\.$/).waitFor()
    const manifest=await (await context.request.get(base+'/api/photos')).json();assert.ok(manifest.photos['bird-african-fish-eagle'].url.startsWith(base+'/media/'))
    assert.equal((await context.request.get(manifest.photos['bird-african-fish-eagle'].url)).status(),200)
    const deleted=await api('/api/admin/mammals/bird-african-fish-eagle/photo',{method:'DELETE'});assert.equal(deleted.status(),200)
    // Personal records and optional photographs never use a public upload endpoint.
    if(!state.sightingId) {
      await page.goto(base+'/parks/kruger/birds/bird-african-fish-eagle/sightings/new')
      await page.getByRole('textbox',{name:/^Location/}).fill('Isolated private beta verification')
      await page.locator('input[type=file]').setInputFiles({name:'private-verification.png',mimeType:'image/png',buffer:Buffer.from(state.png,'base64')})
      await page.getByRole('button',{name:'Save sighting',exact:true}).click();await page.getByRole('heading',{name:'A memory worth keeping'}).waitFor()
      await page.getByRole('link',{name:'View sighting',exact:true}).click();state.sightingId=page.url().split('/').at(-1);state.photoBytes=Buffer.from(state.png,'base64').length;save()
      await page.getByRole('link',{name:'Edit sighting',exact:true}).click();await page.getByRole('textbox',{name:/^Location/}).fill('Edited isolated beta verification');await page.getByRole('button',{name:'Save changes',exact:true}).click();await page.getByText('Edited isolated beta verification',{exact:true}).waitFor()
    }
    await page.goto(base+'/my-animavidi');await page.getByLabel('Explorer name').fill('Beta verification explorer');await page.getByRole('button',{name:'Save profile',exact:true}).click();await page.getByRole('checkbox',{name:'Skukuza',exact:true}).check()
    const downloading=page.waitForEvent('download');await page.getByRole('button',{name:'Download personal backup',exact:true}).click();const file=await (await downloading).path();const backup=JSON.parse(readFileSync(file,'utf8'));assert.equal(backup.sightings[0].photos.length,1)
    await page.getByLabel('Import an Animavidi backup').setInputFiles(file);await page.getByText(/Imported 0 sightings/).waitFor()
    const checks=[['/','welcome'],['/onboarding/location','onboarding'],['/parks/kruger','home'],['/parks/kruger/mammals','mammals'],['/parks/kruger/birds?view=all','birds'],['/parks/kruger/map','map'],['/parks/kruger/information','information'],['/parks/kruger/routes','routes'],['/parks/kruger/sightings','sightings'],['/passport','passport'],['/my-camps','my-camps'],['/admin/reports','reports']]
    for(const width of [390,820,1440]){await page.setViewportSize({width,height:900});for(const [path,name] of checks){await page.goto(base+path);await page.locator('h1').first().waitFor();assert.ok((await page.locator('h1').first().textContent()).trim());const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);if(overflow)throw new Error(`Horizontal overflow: ${name} at ${width}`);if(width===390 || name==='passport')await screenshot(name+'-'+width)}}
    const other=await context.browser().newContext();const visitor=await other.newPage();await visitor.goto(base+'/passport');await visitor.getByText('No species discovered yet',{exact:true}).waitFor();assert.equal((await other.request.get(base+'/api/admin/content',{headers:{Origin:base}})).status(),401);await other.close()
    assert.deepEqual(errors,[]);state.full={passed:true,at:new Date().toISOString()};save();console.log('Live preview passed: real D1 and R2, auth/origin rejection, private photo/approval/public bytes, new bird publication, primary photo upload/delete, private sighting create/edit, backup, separate-browser privacy, 12 screens at mobile/tablet/desktop.');
  }
} catch(error) { console.error(JSON.stringify({page:page.url(),text:(await page.locator('body').innerText()).slice(0,3500),errors}));await screenshot('failure');throw error } finally {await context.close()}
