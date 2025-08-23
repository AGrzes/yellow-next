import { EventEntry } from '../model/index.js'

export interface EventService {
  create(event: EventEntry): Promise<string>
  get(id: string): Promise<EventEntry | null>
  list(): Promise<EventEntry[]>
}

const STORAGE_KEY = 'events-db'

const data: EventEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

const service: EventService = {
  async create(event: EventEntry) {
    const created = { ...event }
    const id = self.crypto.randomUUID()
    if (!created.createdAt) {
      created.createdAt = new Date().toISOString()
    }
    created.id = id
    data.push(created)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return id
  },
  async get(id: string) {
    return data.find((e) => e.id === id) || null
  },
  async list() {
    return data.slice()
  },
}
export default service
