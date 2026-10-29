import { personalKeys } from '../model/cloud'
import { currentUserId,personalStorage } from '../data/personalStorage'
import { committed,metadata,openJournal,requestValue,queued } from '../data/journalDb'
import { sightingRepository } from '@/features/sightings/data/sightingRepository'
import type { Sighting } from '@/features/sightings/model/sighting'
import {importLocalBackup} from '@/features/passport/services/localBackup'
const ownershipKey='animavidi:legacy-migration-owner'
async function originalRecords():Promise<Sighting[]>{
  if(indexedDB.databases && !(await indexedDB.databases()).some(db=>db.name==='animavidi'))return[]
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('animavidi');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error ?? new Error("Local database request failed."))})
  try{if(!db.objectStoreNames.contains('sightings'))return[];return await requestValue(db.transaction('sightings').objectStore('sightings').getAll()) as Sighting[]}finally{db.close()}
}
export async function legacyStatus(){const owner=localStorage.getItem(ownershipKey),userId=currentUserId();if(owner && owner!==userId)return{count:0,otherAccount:true,complete:false};const rows=await originalRecords();const complete=userId?await metadata<boolean>('legacy-complete',userId):false;return{count:rows.length,otherAccount:false,complete:Boolean(complete)}}
export async function migrateLegacy(){
  const userId=currentUserId();if(!userId)throw new Error('Sign in before importing your journal.')
  const owner=localStorage.getItem(ownershipKey);if(owner && owner!==userId)throw new Error('The existing journal is already reserved for another account on this browser.')
  const rows=await originalRecords(),preferences=Object.fromEntries(personalKeys.map(key=>[key,localStorage.getItem(key)]))
  const db=await openJournal(userId)
  try{
    // Restore point is committed and read back BEFORE any account import begins.
    const tx=db.transaction(['preserved','meta'],'readwrite'),done=committed(tx)
    const existing=tx.objectStore('preserved').get('legacy-original')
    existing.onsuccess=()=>{if(!existing.result)tx.objectStore('preserved').add({id:'legacy-original',createdAt:new Date().toISOString(),sightings:rows,preferences})}
    tx.objectStore('meta').put({key:'legacy-ids',value:rows.map(row=>row.id)});await done
    const backup=await requestValue(db.transaction('preserved').objectStore('preserved').get('legacy-original')) as {sightings:Sighting[]}|undefined
    if(!backup || !Array.isArray(backup.sightings))throw new Error('Recovery copy could not be verified; import stopped.')
    if(currentUserId()!==userId)throw new Error('Account changed; migration stopped. The recovery copy is safe.')
    localStorage.setItem(ownershipKey,userId)
    await sightingRepository.mergeBackup(rows)
    if(currentUserId()!==userId)throw new Error('Account changed; imported rows remain in the original account.')
    for(const [key,value] of Object.entries(preferences))if(value!==null && personalStorage.getItem(key)===null)personalStorage.setItem(key,value)
    window.dispatchEvent(new Event('animavidi:journal-changed'))
    return rows.length
  }finally{db.close()}
}
export async function finishLegacyMigration(){
  const userId=currentUserId();if(!userId)return
  const ids=await metadata<string[]>('legacy-ids',userId);if(!ids)return
  const pending=await queued(userId);if(ids.some(id=>pending.some(item=>item.kind==='sighting'&&item.id===id)))return
  for(const id of ids)if(!await metadata<number>(`revision:sighting:${id}`,userId))return
  const db=await openJournal(userId);try{const tx=db.transaction('meta','readwrite'),done=committed(tx);tx.objectStore('meta').put({key:'legacy-complete',value:true});await done}finally{db.close()}
  // The original DB and the recovery snapshot are deliberately retained.
}
export async function downloadRecoveryCopies(){
  const owner=currentUserId()
  const db=await openJournal();try{const copies=await requestValue(db.transaction('preserved').objectStore('preserved').getAll()) as unknown[]
    const encode=async(value:unknown):Promise<unknown>=>{if(value instanceof Blob){const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>typeof reader.result==='string'?resolve(reader.result):reject(new Error('Cannot export photo.'));reader.onerror=()=>reject(reader.error ?? new Error("Photo export failed."));reader.readAsDataURL(value)});return{type:value.type,data}}if(Array.isArray(value))return Promise.all(value.map(encode));if(value && typeof value==='object')return Object.fromEntries(await Promise.all(Object.entries(value).map(async([key,item])=>[key,await encode(item)])));return value}
    const encoded=await encode(copies);if(currentUserId()!==owner)throw new Error('Account changed; recovery export stopped.');return new Blob([JSON.stringify({format:'animavidi-recovery-archive',version:1,copies:encoded})],{type:'application/json'})
  }finally{db.close()}
}
export async function restoreMigrationRecovery(file:File){
  const owner=currentUserId()
  if(file.size>100*1024*1024)throw new Error('Recovery archive exceeds the 100 MB import limit.')
  const raw:unknown=JSON.parse(await file.text())
  if(!raw||typeof raw!=='object'||!('format' in raw)||raw.format!=='animavidi-recovery-archive'||!('copies' in raw)||!Array.isArray(raw.copies))throw new Error('Choose an Animavidi recovery archive.')
  const copy=raw.copies.find((value:unknown)=>value&&typeof value==='object'&&'id' in value&&value.id==='legacy-original') as {sightings?:unknown[];preferences?:unknown}|undefined
  if(!Array.isArray(copy?.sightings))throw new Error('This archive contains no original migration snapshot.')
  if(currentUserId()!==owner)throw new Error('Account changed; recovery import stopped.')
  const sightings=copy.sightings.map((value:unknown)=>{
    if(!value||typeof value!=='object')throw new Error('Invalid recovery record.')
    const row=value as Record<string,unknown>;if(!Array.isArray(row.photos))throw new Error('Invalid recovery photos.')
    return{...row,photos:row.photos.map((value:unknown)=>{if(!value||typeof value!=='object')throw new Error('Invalid recovery photograph.');const photo=value as Record<string,unknown>;if(!photo.blob||typeof photo.blob!=='object'||!('data' in photo.blob)||typeof photo.blob.data!=='string')throw new Error('Missing recovery photo bytes.');return{id:photo.id,name:photo.name,type:photo.type,data:photo.blob.data}})}
  })
  // Route recovery through the same complete validation and additive import.
  return importLocalBackup(new File([JSON.stringify({format:'animavidi-local-backup',version:1,sightings,preferences:copy.preferences})],'restored-journal.json',{type:'application/json'}))
}
