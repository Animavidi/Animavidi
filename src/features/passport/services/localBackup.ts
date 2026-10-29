import { sightingRepository } from '@/features/sightings/data/sightingRepository'
import type { Sighting, SightingPhoto } from '@/features/sightings/model/sighting'

const toDataUrl=(blob:Blob)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>typeof reader.result==='string' ? resolve(reader.result) : reject(new Error('Invalid photograph export.'));reader.onerror=()=>reject(new Error('Could not export a photograph.'));reader.readAsDataURL(blob)})
const preferenceKeys=['animavidi:onboarding-complete','animavidi:demo-user-display-name','animavidi:profile-name','animavidi:visited-camps','animavidi.achievementSoundsEnabled','animavidi.achievement.bigFiveCompletedCelebrated','animavidi.achievements.species.v1']
export async function exportLocalBackup():Promise<Blob> {
  const sightings=await sightingRepository.getAll()
  const rows=await Promise.all(sightings.map(async(item)=>({...item,photos:await Promise.all(item.photos.map(async(photo)=>({id:photo.id,name:photo.name,type:photo.type,data:await toDataUrl(photo.blob)})))})))
  return new Blob([JSON.stringify({format:'animavidi-local-backup',version:1,exportedAt:new Date().toISOString(),sightings:rows,preferences:Object.fromEntries(preferenceKeys.map((key)=>[key,localStorage.getItem(key)]))})],{type:'application/json'})
}
export async function importLocalBackup(file:File):Promise<number> {
  if(file.size>100*1024*1024)throw new Error('Backup exceeds the 100 MB import limit.')
  const data:unknown=JSON.parse(await file.text())
  if(!data || typeof data!=='object' || !('format' in data) || data.format!=='animavidi-local-backup' || !('version' in data) || data.version!==1 || !('sightings' in data) || !Array.isArray(data.sightings) || data.sightings.length>10000)throw new Error('Choose a supported Animavidi backup.')
  const rows:Sighting[]=[];const ids=new Set<string>()
  for(const raw of data.sightings as unknown[]) {
    if(!raw || typeof raw!=='object')throw new Error('Invalid sighting in backup.')
    const item=raw as Record<string,unknown>
    if(!['id','animalId','createdAt','updatedAt','date','time','location','notes','behaviour','composition'].every((key)=>typeof item[key]==='string') || !/^[a-z0-9-]{2,100}$/.test(String(item.animalId)) || !/^[a-f0-9-]{36}$/.test(String(item.id)) || item.parkId!=='kruger' || !Number.isSafeInteger(item.count) || Number(item.count)<1 || Number(item.count)>100000 || !Array.isArray(item.photos) || ids.has(String(item.id)))throw new Error('Invalid or duplicate sighting in backup; nothing was imported.')
    if(!['calling','drinking','feeding','hunting','other','playing','resting','walking'].includes(String(item.behaviour)) || !['family-group','female-with-young','group','male','pair','single','unknown'].includes(String(item.composition)) || !/^\d{4}-\d{2}-\d{2}$/.test(String(item.date)) || !/^\d{2}:\d{2}$/.test(String(item.time)))throw new Error('Invalid observation fields in backup.')
    ids.add(String(item.id))
    const photos:SightingPhoto[]=[]
    for(const rawPhoto of item.photos as unknown[]) {
      if(!rawPhoto || typeof rawPhoto!=='object')throw new Error('Invalid photograph in backup.')
      const photo=rawPhoto as Record<string,unknown>
      if(typeof photo.id!=='string' || typeof photo.name!=='string' || typeof photo.type!=='string' || typeof photo.data!=='string' || !/^data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(photo.data))throw new Error('Unsupported photograph in backup.')
      const [header,encoded]=photo.data.split(',');const bytes=Uint8Array.from(atob(encoded),(character)=>character.charCodeAt(0));const type=header.slice(5,-7)
      photos.push({id:photo.id,name:photo.name,type,blob:new Blob([bytes],{type})})
    }
    rows.push({...item,photos,syncStatus:'local'} as unknown as Sighting)
  }
  const count=await sightingRepository.mergeBackup(rows)
  // Existing local preferences always win. A backup cannot replace another journal.
  if('preferences' in data && data.preferences && typeof data.preferences==='object')for(const key of preferenceKeys){const value=(data.preferences as Record<string,unknown>)[key];if(typeof value==='string' && localStorage.getItem(key)===null)try{localStorage.setItem(key,value)}catch{/* Sightings are already safely committed. */}}
  return count
}
