import type { Item } from '@model/item.ts'
import PouchDBBrowser from 'pouchdb-browser'
export type LabelOptions = Record<string, string>

export interface InboxService {
  labels(): Promise<Record<string, LabelOptions>>
  list(): Promise<Item[]>
}

import { createContext, useContext } from 'react'

export const DatabaseContext = createContext<InboxService>(null as any)

export const InboxServiceProvider = DatabaseContext.Provider
export function useInboxService() {
  return useContext(DatabaseContext)
}

export function createInboxService(): InboxService {
  return new PouchDBInboxService(
    new PouchDBBrowser(import.meta.env.VITE_COUCHDB_URL + 'inbox'),
    new PouchDBBrowser(import.meta.env.VITE_COUCHDB_URL + 'events')
  )
}

export class PouchDBInboxService implements InboxService {
  constructor(private inboxDb: PouchDB.Database, private eventsDb: PouchDB.Database) {}
  async labels(): Promise<Record<string, LabelOptions>> {
    this.eventsDb
    return {}
  }
  async list(): Promise<Item[]> {
    const docs = await this.inboxDb.allDocs<Item>({ include_docs: true })
    return docs.rows.map((row) => row.doc!)
  }
}
