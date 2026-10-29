import type { Sighting } from '@/features/sightings/model/sighting'
import type { CloudRecord } from '../model/cloud'
import { currentUserId } from './personalStorage'
export type PendingChange={key:string;kind:'sighting'|'preference';id:string;body:Sighting|string;deleted:boolean;baseRevision:number;mutationId:string;conflict?:CloudRecord;createdAt:string}
export const requestValue=<T,>(request:IDBRequest<T>)=>new Promise<T>((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error ?? new Error("Local database request failed."))})
export const committed=(tx:IDBTransaction)=>new Promise<void>((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error ?? new Error('Local storage transaction aborted.'));tx.onerror=()=>reject(tx.error ?? new Error("Local transaction failed."))})
export function openJournal(userId=currentUserId()):Promise<IDBDatabase>{
  if(!userId)return Promise.reject(new Error('Sign in to open your private journal.'))
  return new Promise((resolve,reject)=>{const request=indexedDB.open(`animavidi-account-${userId}`,1);request.onerror=()=>reject(request.error ?? new Error("Local database request failed."));request.onsuccess=()=>resolve(request.result);request.onupgradeneeded=()=>{
    const db=request.result,store=db.createObjectStore('sightings',{keyPath:'id'});store.createIndex('animalId','animalId');store.createIndex('createdAt','createdAt');db.createObjectStore('queue',{keyPath:'key'});db.createObjectStore('meta',{keyPath:'key'});db.createObjectStore('preserved',{keyPath:'id'})
  }})
}
export async function metadata<T>(key:string,userId=currentUserId()):Promise<T|undefined>{const db=await openJournal(userId);try{const row=await requestValue(db.transaction('meta').objectStore('meta').get(key)) as {value:T}|undefined;return row?.value}finally{db.close()}}
export async function queued(userId=currentUserId()):Promise<PendingChange[]>{const db=await openJournal(userId);try{return await requestValue(db.transaction('queue').objectStore('queue').getAll()) as PendingChange[]}finally{db.close()}}
export function queueChange(tx:IDBTransaction,kind:PendingChange['kind'],id:string,body:PendingChange['body'],deleted=false){
  const key=`${kind}:${id}`,queue=tx.objectStore('queue'),pending=queue.get(key),revision=tx.objectStore('meta').get(`revision:${key}`)
  let old:PendingChange|undefined,base:number|undefined,ready=0
  const finish=()=>{if(++ready<2)return;queue.put({key,kind,id,body,deleted,baseRevision:old?.baseRevision ?? base ?? 0,mutationId:crypto.randomUUID(),createdAt:old?.createdAt ?? new Date().toISOString(),...(old?.conflict?{conflict:old.conflict}:{})} satisfies PendingChange)}
  pending.onsuccess=()=>{old=pending.result as PendingChange|undefined;finish()};revision.onsuccess=()=>{base=(revision.result as {value:number}|undefined)?.value;finish()}
}
export async function queuePreference(key:string,value:string){if(!currentUserId())return;const db=await openJournal();try{const tx=db.transaction(['queue','meta'],'readwrite');const done=committed(tx);queueChange(tx,'preference',key,value);await done;window.dispatchEvent(new Event('animavidi:journal-changed'))}finally{db.close()}}
