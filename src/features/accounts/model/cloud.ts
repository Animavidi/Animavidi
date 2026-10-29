import type { Sighting } from '@/features/sightings/model/sighting'
export type CloudPhoto={id:string;name:string;type:string;sha256:string;size:number}
export type CloudSighting=Omit<Sighting,'photos'> & {photos:CloudPhoto[]}
export type CloudRecord={id:string;body:CloudSighting|string;revision:number;deleted:number;updatedAt:string}
export type CloudChange=CloudRecord & {sequence:number;kind:'sighting'|'preference'}
export const personalKeys=['animavidi:onboarding-complete','animavidi:demo-user-display-name','animavidi:profile-name','animavidi:visited-camps','animavidi.achievementSoundsEnabled','animavidi.achievement.bigFiveCompletedCelebrated','animavidi.achievements.species.v1'] as const
export function validSighting(value:unknown,id:string):value is CloudSighting {
  if(!value || typeof value!=='object')return false
  const row=value as Record<string,unknown>
  return row.id===id && row.parkId==='kruger' && typeof row.animalId==='string' && /^[a-z0-9-]{2,100}$/.test(row.animalId) && ['createdAt','updatedAt','date','time','location','notes'].every(key=>typeof row[key]==='string' && row[key].length<=10000) && Number.isSafeInteger(row.count) && Number(row.count)>0 && Number(row.count)<=100000 && ['calling','drinking','feeding','hunting','other','playing','resting','walking'].includes(String(row.behaviour)) && ['family-group','female-with-young','group','male','pair','single','unknown'].includes(String(row.composition)) && Array.isArray(row.photos) && row.photos.length<=5 && row.photos.every((photo:unknown)=>{
    if(!photo || typeof photo!=='object')return false
    const p=photo as Record<string,unknown>
    return typeof p.id==='string' && /^[a-f0-9-]{36}$/.test(p.id) && typeof p.sha256==='string' && /^[a-f0-9]{64}$/.test(p.sha256) && typeof p.name==='string' && p.name.length<=500 && typeof p.type==='string' && p.type.startsWith('image/') && p.type.length<=80 && Number.isSafeInteger(p.size) && Number(p.size)>0 && Number(p.size)<=10*1024*1024
  })
}
