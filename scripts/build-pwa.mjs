import {readdirSync,readFileSync,writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const directory=new URL('../dist/',import.meta.url)
const assets=readdirSync(new URL('assets/',directory)).filter(name=>/\.(js|css)$/.test(name)||name.startsWith('lion-sunset-hero-')||name.endsWith('.svg')).map(name=>'/assets/'+name)
const files=['/','/index.html','/manifest.webmanifest','/icons/animavidi-192.png','/icons/animavidi-512.png',...assets]
const checksum=createHash('sha256');for(const file of files){checksum.update(file);if(file!=='/')checksum.update(readFileSync(new URL(file.slice(1),directory)))}
const version=checksum.digest('hex').slice(0,16)
const worker=`const CACHE='animavidi-public-${version}';const CORE=${JSON.stringify(files)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
self.addEventListener('message',event=>{if(event.data==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.pathname.startsWith('/api/auth/')||url.pathname.startsWith('/api/me/')||url.pathname.startsWith('/api/admin/')||url.pathname.startsWith('/api/bird-contributions/'))return;
 const publicApi=['/api/content','/api/birds','/api/photos'].includes(url.pathname);
 if(url.pathname.startsWith('/api/')&&!publicApi)return;
 if(request.mode==='navigate'){event.respondWith(fetch(request).then(async response=>response.ok?response:await caches.match('/')||response).catch(()=>caches.match('/')));return;}
 if(publicApi){event.respondWith(fetch(request).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone());return response}return await caches.match(request)||response}).catch(async()=>await caches.match(request)||new Response(JSON.stringify({error:'Public content unavailable offline.'}),{status:503,headers:{'Content-Type':'application/json'}})));return;}
 if(url.pathname.startsWith('/assets/')||url.pathname.startsWith('/icons/')||url.pathname==='/manifest.webmanifest'){event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone())}return response})));}
});`
writeFileSync(new URL('sw.js',directory),worker)
console.log(`PWA ${version}: ${files.length} public shell assets; private account responses are never cached.`)
