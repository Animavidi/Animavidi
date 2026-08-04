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
}

const databaseName = 'animavidi'
const storeName = 'sightings'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)
    request.onerror = () => reject(request.error ?? new Error('Unable to open the local sightings database.'))
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(storeName)) {
        const store = database.createObjectStore(storeName, { keyPath: 'id' })
        store.createIndex('animalId', 'animalId')
        store.createIndex('createdAt', 'createdAt')
      }
    }
  })
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error ?? new Error('The local database request failed.'))
    request.onsuccess = () => resolve(request.result)
  })
}

export const sightingRepository: SightingRepository = {
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
      await requestResult(database.transaction(storeName, 'readwrite').objectStore(storeName).add(sighting))
      return sighting
    } finally {
      database.close()
    }
  },

  async delete(id) {
    const database = await openDatabase()
    try {
      await requestResult(database.transaction(storeName, 'readwrite').objectStore(storeName).delete(id))
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
    const existing = await this.getById(input.id)
    if (!existing) throw new Error('Sighting not found.')
    const sighting: Sighting = { ...input, createdAt: existing.createdAt, syncStatus: 'local', updatedAt: new Date().toISOString() }
    const database = await openDatabase()
    try {
      await requestResult(database.transaction(storeName, 'readwrite').objectStore(storeName).put(sighting))
      return sighting
    } finally { database.close() }
  },
}
