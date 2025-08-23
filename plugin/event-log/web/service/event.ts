import { EventEntry } from '../model/index.js'

export interface EventService {
  create(event: EventEntry): Promise<string>
  get(id: string): Promise<EventEntry | null>
  list(): Promise<EventEntry[]>
}

const data: EventEntry[] = []

const service: EventService = {
  async create(event: EventEntry) {
    const created = { ...event }
    const id = self.crypto.randomUUID()
    if (!created.createdAt) {
      created.createdAt = new Date().toISOString()
    }
    created.id = id
    data.push(created)
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
