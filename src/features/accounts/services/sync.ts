import {finishLegacyMigration} from './legacyMigration'
import { committed,metadata,openJournal,queued,queuePreference,type PendingChange } from '../data/journalDb'
import { currentUserId,personalStorage } from '../data/personalStorage'
import { personalKeys,type CloudChange,type CloudPhoto,type CloudRecord,type CloudSighting } from '../model/cloud'
import type { Sighting } from '@/features/sightings/model/sighting'
let state={running:false,pending:0,conflicts:0,message:'Checking synchronisation…',revision:0,lastSuccess:0}
const listeners=new Set<()=>void>()
export const subscribeSync=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener)}}
export const syncSnapshot=()=>state
const update=(next:Partial<typeof state>)=>{state={...state,...next};for(const listener of listeners)listener()}
export const resetSyncStatus=()=>update({running:false,pending:0,conflicts:0,message:'Opening your account journal…',lastSuccess:0})
const digest=async(blob:Blob)=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))].map(byte=>byte.toString(16).padStart(2,'0')).join('')
async function cloud(path:string,init?:RequestInit,owner=currentUserId()){if(!owner||currentUserId()!==owner)throw new Error('Account changed; the previous account queue remains safe.');const response=await fetch(path,{...init,headers:{...init?.headers,'X-Animavidi-Account':owner},credentials:'include',cache:'no-store'});if(response.status===401){window.dispatchEvent(new Event('animavidi:session-expired'));throw new Error('Sign in again to synchronise. Your unsent changes remain on this device.')}return response}
async function readRecord(body:CloudSighting,owner:string):Promise<Sighting>{
  const photos=await Promise.all(body.photos.map(async(photo)=>{const response=await cloud(`/api/me/photos/${photo.id}/${photo.sha256}`,undefined,owner);if(!response.ok)throw new Error('A cloud photograph could not be downloaded. Retrying safely.');const blob=await response.blob();if(blob.size!==photo.size || await digest(blob)!==photo.sha256)throw new Error('Photo integrity check failed; local records were retained.');return{id:photo.id,name:photo.name,type:photo.type,blob}}))
  return{...body,photos,syncStatus:'local'}
}
async function wire(item:PendingChange,owner:string):Promise<CloudSighting|string>{
  if(typeof item.body==='string')return item.body
  const photos:CloudPhoto[]=[]
  for(const photo of item.body.photos){const sha256=await digest(photo.blob);if(!item.deleted){const response=await cloud(`/api/me/photos/${photo.id}/${sha256}`,{method:'PUT',headers:{'Content-Type':photo.type},body:photo.blob},owner);if(!response.ok)throw new Error('Photo upload did not finish. The original remains on this device.')}photos.push({id:photo.id,name:photo.name,type:photo.type,sha256,size:photo.blob.size})}
  return{...item.body,photos}
}
async function push(item:PendingChange,userId:string){
  const body=await wire(item,userId)
  const response=await cloud(`/api/me/${item.kind==='sighting'?'sightings':'preferences'}/${encodeURIComponent(item.id)}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({mutationId:item.mutationId,baseRevision:item.baseRevision,body,deleted:item.deleted})},userId)
  const result=await response.json() as CloudRecord & {current?:CloudRecord;error?:string}
  const db=await openJournal(userId)
  try{
    const tx=db.transaction(['queue','meta'],'readwrite'),done=committed(tx),request=tx.objectStore('queue').get(item.key)
    request.onsuccess=()=>{
      const current=request.result as PendingChange|undefined;if(!current)return
      if(response.ok){tx.objectStore('meta').put({key:`revision:${item.key}`,value:result.revision});if(item.kind==='preference')tx.objectStore('meta').put({key:`value:${item.id}`,value:item.body});if(current.mutationId===item.mutationId)tx.objectStore('queue').delete(item.key);else tx.objectStore('queue').put({...current,baseRevision:result.revision})}
      else if(response.status===409 && result.current)tx.objectStore('queue').put({...current,conflict:result.current})
    };await done
  }finally{db.close()}
  if(!response.ok && response.status!==409)throw new Error(result.error ?? 'Synchronisation will retry. Local changes are safe.')
  if(response.status===409 && !result.current)throw new Error(result.error ?? 'Synchronisation could not finish. Local changes are safe.')
}
async function receive(change:CloudChange,userId:string){
  const db=await openJournal(userId)
  try{
    const pending=await queued(userId),revision=await metadata<number>(`revision:${change.kind}:${change.id}`,userId)
    if(pending.some(item=>item.key===`${change.kind}:${change.id}`) || (revision ?? 0)>=change.revision)return
    const record=change.kind==='sighting' && !change.deleted ? await readRecord(change.body as CloudSighting,userId):undefined
    const tx=db.transaction(['sightings','meta','queue'],'readwrite'),done=committed(tx),check=tx.objectStore('queue').get(`${change.kind}:${change.id}`)
    let applied=false
    check.onsuccess=()=>{
      if(check.result)return
      if(change.kind==='sighting'){if(change.deleted)tx.objectStore('sightings').delete(change.id);else tx.objectStore('sightings').put(record)}
      else {personalStorage.apply(change.id,change.body as string,userId);tx.objectStore('meta').put({key:`value:${change.id}`,value:change.body})}
      tx.objectStore('meta').put({key:`revision:${change.kind}:${change.id}`,value:change.revision});applied=true
    }
    await done
    if(applied){update({revision:state.revision+1});window.dispatchEvent(new Event('animavidi:synced'))}

  }finally{db.close()}
}
let inFlight=false
export async function synchronise():Promise<void>{
  const userId=currentUserId();if(!userId || inFlight)return
  inFlight=true;update({running:true})
  try{
    // Recover preference writes interrupted between localStorage and IndexedDB.
    for(const key of personalKeys){const value=personalStorage.getItem(key);if(value!==null && value!==await metadata<string>(`value:${key}`,userId) && !(await queued(userId)).some(item=>item.key===`preference:${key}`))await queuePreference(key,value)}
    if(!navigator.onLine){update({message:'Offline · changes and photos are saved on this device.'});return}
    const pending=await queued(userId);update({pending:pending.length,conflicts:pending.filter(item=>item.conflict).length})
    for(const item of pending){if(currentUserId()!==userId)return;if(!item.conflict)await push(item,userId)}
    let cursor=await metadata<number>('cursor',userId) ?? 0,more=true
    while(more && currentUserId()===userId){
      const response=await cloud(`/api/me/changes?after=${cursor}`,undefined,userId);if(!response.ok)throw new Error('Cloud unavailable. Your journal remains saved on this device.')
      const page=await response.json() as {changes:CloudChange[];cursor:number;more:boolean}
      if(!Array.isArray(page.changes)||!Number.isSafeInteger(page.cursor)||page.cursor<cursor)throw new Error('Invalid synchronisation response.')
      for(const change of page.changes){if(currentUserId()!==userId)return;await receive(change,userId)}
      const db=await openJournal(userId);try{const tx=db.transaction('meta','readwrite'),done=committed(tx);tx.objectStore('meta').put({key:'cursor',value:page.cursor});await done}finally{db.close()}
      cursor=page.cursor;more=page.more
    }
    await finishLegacyMigration()
    update({message:'Synchronised with your account.',lastSuccess:Date.now()})
  }catch(reason){update({message:reason instanceof Error?reason.message:'Synchronisation paused; changes are saved locally.'})}
  finally{try{if(currentUserId()===userId){const items=await queued(userId);update({running:false,pending:items.length,conflicts:items.filter(item=>item.conflict).length})}}catch{update({running:false,message:'Local storage is unavailable. Reopen the app when storage is available.'})}finally{inFlight=false}}
}
export async function resolveConflict(key:string,choice:'device'|'cloud'){
  const userId=currentUserId();if(!userId)return
  const item=(await queued(userId)).find(item=>item.key===key);if(!item?.conflict)return
  let remote=item.conflict
  if(choice==='cloud'){
    const response=await cloud(`/api/me/${item.kind==='sighting'?'sightings':'preferences'}/${encodeURIComponent(item.id)}`,undefined,userId)
    if(!response.ok)throw new Error('Could not retrieve the latest cloud revision. Both versions remain safe.')
    remote=await response.json() as CloudRecord
  }
  const record=choice==='cloud' && item.kind==='sighting' && !remote.deleted?await readRecord(remote.body as CloudSighting,userId):undefined
  const db=await openJournal(userId)
  try{const tx=db.transaction(['queue','meta','sightings','preserved'],'readwrite'),done=committed(tx),check=tx.objectStore('queue').get(key)
    check.onsuccess=()=>{
      const current=check.result as PendingChange|undefined
      if(!current||current.mutationId!==item.mutationId){tx.abort();return}
      tx.objectStore('preserved').put({id:crypto.randomUUID(),at:new Date().toISOString(),local:current,cloud:remote})
      if(choice==='device')tx.objectStore('queue').put({...current,conflict:undefined,baseRevision:remote.revision,mutationId:crypto.randomUUID()})
      else{tx.objectStore('queue').delete(key);tx.objectStore('meta').put({key:`revision:${key}`,value:remote.revision});tx.objectStore('meta').put({key:'cursor',value:0});if(item.kind==='sighting'){if(remote.deleted)tx.objectStore('sightings').delete(item.id);else tx.objectStore('sightings').put(record)}else{personalStorage.apply(item.id,remote.body as string,userId);tx.objectStore('meta').put({key:`value:${item.id}`,value:remote.body})}}
    }
    await done
  }finally{db.close()}
  window.dispatchEvent(new Event('animavidi:synced'));await synchronise()
}
export function startSynchronisation(){
  const run=()=>{void synchronise()},preference=(event:Event)=>{const detail=(event as CustomEvent<{key:string;value:string;userId:string}>).detail;if(detail.userId===currentUserId())void queuePreference(detail.key,detail.value).then(run).catch(()=>update({message:'Preferences are retained locally; the sync queue will retry when storage is available.'}))}
  window.addEventListener('online',run);window.addEventListener('focus',run);window.addEventListener('animavidi:journal-changed',run);window.addEventListener('animavidi:preference',preference);const timer=window.setInterval(run,15000);run()
  return()=>{window.clearInterval(timer);window.removeEventListener('online',run);window.removeEventListener('focus',run);window.removeEventListener('animavidi:journal-changed',run);window.removeEventListener('animavidi:preference',preference)}
}
