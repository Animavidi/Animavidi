import type {ExplorerUser} from '../components/AccountProvider'
import {currentUserId} from '../data/personalStorage'
import {synchronise,syncSnapshot} from './sync'
import {exportLocalBackup} from '@/features/passport/services/localBackup'
import {downloadRecoveryCopies} from './legacyMigration'
const dataUrl=(blob:Blob)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>typeof reader.result==='string'?resolve(reader.result):reject(new Error('Photo export failed.'));reader.onerror=()=>reject(reader.error ?? new Error('Photo export failed.'));reader.readAsDataURL(blob)})
export async function exportAccount(user:ExplorerUser):Promise<Blob>{
  const started=Date.now(),owner=user.id,check=()=>{if(currentUserId()!==owner)throw new Error('Account changed; export stopped to protect your private data.')}
  check();await synchronise();check()
  const sync=syncSnapshot()
  if(sync.running||sync.pending||sync.conflicts||!navigator.onLine||sync.lastSuccess<started)throw new Error('Wait for a completed online synchronisation and resolve conflicts before exporting the full account. Device backups remain available offline.')
  const response=await fetch('/api/me/contributions',{credentials:'include',headers:{'X-Animavidi-Account':owner}});check();if(!response.ok)throw new Error('Could not export your contributions.')
  const contributions=await response.json() as {items:{id:string;draft:{photoType?:string};photo?:string}[]}
  for(const item of contributions.items){if(!item.draft.photoType)continue;check();const photo=await fetch(`/api/me/contributions/${item.id}/photo`,{credentials:'include',headers:{'X-Animavidi-Account':owner}});if(!photo.ok)throw new Error('A contributed photo could not be exported. Please retry.');item.photo=await dataUrl(await photo.blob())}
  check();const backup=JSON.parse(await (await exportLocalBackup()).text()) as Record<string,unknown>,recovery=JSON.parse(await (await downloadRecoveryCopies()).text()) as unknown;check()
  return new Blob([JSON.stringify({...backup,account:user,contributions:contributions.items,recovery})],{type:'application/json'})
}
