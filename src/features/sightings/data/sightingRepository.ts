import {currentUserId} from '@/features/accounts/data/personalStorage'
import {openJournal,committed,queueChange} from '@/features/accounts/data/journalDb'
import type { CreateSightingInput, Sighting, UpdateSightingInput } from '@/features/sightings/model/sighting'

export type SightingRepository = {
  countByAnimal(animalId: string): Promise<number>
  countAll(): Promise<number>
  countUniqueSpecies(): Promise<number>
  create(input: CreateSightingInput): Promise<Sighting>
  delete(id: string): Promise<void>
  getAll(): Promise<readonly Sighting[]>
  getById(id: string): Promise<Sighting | undefined>
  update(input: UpdateSightingInput): Promise<Sighting>
  mergeBackup(items: readonly Sighting[]): Promise<number>
}

const storeName = 'sightings'
const openDatabase = openJournal

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error ?? new Error('The local database request failed.'))
    request.onsuccess = () => resolve(request.result)
  })
}

export const sightingRepository: SightingRepository = {
  async mergeBackup(items) {
    const database=await openDatabase()
    try {
      return await new Promise<number>((resolve,reject)=>{
        const transaction=database.transaction([storeName,'queue','meta'],'readwrite'), store=transaction.objectStore(storeName)
        let added=0
        transaction.oncomplete=()=>resolve(added)
        transaction.onabort=()=>reject(transaction.error ?? new Error('Import failed; no sightings were changed.'))
        for(const item of items) { const request=store.get(item.id); request.onsuccess=()=>{if(!request.result){store.add(item);queueChange(transaction,'sighting',item.id,item);added++}} }
      })
    } finally { database.close() }
  },
  async countByAnimal(animalId) {
    const database = await openDatabase()
    try {
      const request = database.transaction(storeName, 'readonly').objectStore(storeName).index('animalId').count(animalId)
      return await requestResult(request)
    } finally {
      database.close()
    }
  },

  async countAll() {
    const database = await openDatabase()
    try {
      return await requestResult(database.transaction(storeName, 'readonly').objectStore(storeName).count())
    } finally { database.close() }
  },

  async countUniqueSpecies() {
    const sightings = await this.getAll()
    return new Set(sightings.map((sighting) => sighting.animalId)).size
  },

  async create(input) {
    const timestamp = new Date().toISOString()
    const sighting: Sighting = {
      ...input,
      createdAt: timestamp,
      id: crypto.randomUUID(),
      syncStatus: 'local',
      updatedAt: timestamp,
    }
    const database = await openDatabase()
    try {
      const tx=database.transaction([storeName,'queue','meta'],'readwrite'),done=committed(tx);tx.objectStore(storeName).add(sighting);queueChange(tx,'sighting',sighting.id,sighting);await done;window.dispatchEvent(new Event('animavidi:journal-changed'))
      return sighting
    } finally {
      database.close()
    }
  },

  async delete(id) {
    const owner=currentUserId()
    const original=await this.getById(id);if(!original)return
    const database = await openDatabase(owner)
    try {
      const tx=database.transaction([storeName,'queue','meta'],'readwrite'),done=committed(tx);tx.objectStore(storeName).delete(id);queueChange(tx,'sighting',id,original,true);await done;window.dispatchEvent(new Event('animavidi:journal-changed'))
    } finally { database.close() }
  },

  async getAll() {
    const database = await openDatabase()
    try {
      return await requestResult(database.transaction(storeName, 'readonly').objectStore(storeName).getAll()) as readonly Sighting[]
    } finally { database.close() }
  },

  async getById(id) {
    const database = await openDatabase()
    try {
      return await requestResult(database.transaction(storeName, 'readonly').objectStore(storeName).get(id)) as Sighting | undefined
    } finally { database.close() }
  },

  async update(input) {
    const owner=currentUserId()
    const existing = await this.getById(input.id)
    if (!existing) throw new Error('Sighting not found.')
    const sighting: Sighting = { ...input, createdAt: existing.createdAt, syncStatus: 'local', updatedAt: new Date().toISOString() }
    const database = await openDatabase(owner)
    try {
      const tx=database.transaction([storeName,'queue','meta'],'readwrite'),done=committed(tx);tx.objectStore(storeName).put(sighting);queueChange(tx,'sighting',sighting.id,sighting);await done;window.dispatchEvent(new Event('animavidi:journal-changed'))
      return sighting
    } finally { database.close() }
  },
}
