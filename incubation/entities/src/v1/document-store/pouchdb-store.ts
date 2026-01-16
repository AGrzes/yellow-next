import type { Document, DocumentKey, DocumentKeyPrefix, DocumentStore, MergeFunction, Subscription } from './index'
export function documentKeyToPouchDbKey(key: DocumentKey): string {
  return key.map(encodeURIComponent).join('/')
}

export function pouchDbKeyToDocumentKey(pouchDbKey: string): DocumentKey {
  return pouchDbKey.split('/').map(decodeURIComponent)
}

export function pouchDbDocumentToDocument<Body>(doc: PouchDB.Core.Document<any>): Document<Body, string> {
  return {
    key: pouchDbKeyToDocumentKey(doc._id),
    body: doc.body as Body,
    revision: doc._rev,
  }
}

export function documentToPouchDbDocument<Body>(document: Document<Body, string>): PouchDB.Core.Document<any> {
  const pouchDbDoc: PouchDB.Core.Document<any> = {
    _id: documentKeyToPouchDbKey(document.key),
    body: document.body,
  }
  if (document.revision) {
    pouchDbDoc._rev = document.revision
  }
  return pouchDbDoc
}

export class PouchDBStore implements DocumentStore<string> {
  constructor(private readonly db: PouchDB.Database) {}

  async get<Body>(key: DocumentKey): Promise<Document<Body, string> | null> {
    const document = await this.db.get<Body>(documentKeyToPouchDbKey(key))
    return document && pouchDbDocumentToDocument<Body>(document)
  }

  async list<Body>(prefix?: DocumentKeyPrefix): Promise<Document<Body, string>[]> {
    const documents = await this.db.allDocs<Body>({
      include_docs: true,
      startkey: prefix && documentKeyToPouchDbKey(prefix) + '/',
      endkey: prefix && documentKeyToPouchDbKey(prefix) + '/\ufff0',
    })
    return documents.rows.map((row) => pouchDbDocumentToDocument<Body>(row.doc!))
  }

  async merge<Body>(document: Document<Body, string>, merge: MergeFunction<Body>): Promise<void> {
    const pouchDbKey = documentKeyToPouchDbKey(document.key)
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        await this.db.put(documentToPouchDbDocument<Body>(document))
        return
      } catch (error: any) {
        if (error.status === 409) {
          const currentDoc = await this.db.get<Body>(pouchDbKey)
          const mergedBody = merge(document.body, currentDoc)
          document = {
            key: document.key,
            body: mergedBody,
            revision: currentDoc._rev,
          }
        } else {
          throw error
        }
      }
    }
    throw new Error('Failed to merge document after 5 attempts due to conflicts')
  }

  subscribe<Body>(onChange: (change: any) => Promise<void>): Subscription {
    const changes = this.db.changes<Body>({
      since: 'now',
      live: true,
      include_docs: true,
    })
    changes.on('change', async (change) => {
      if (change.deleted) {
        await onChange({
          type: 'delete' as const,
          key: pouchDbKeyToDocumentKey(change.id),
        })
      } else if (change.doc) {
        const document = pouchDbDocumentToDocument<Body>(change.doc)
        await onChange({
          type: 'update' as const,
          key: document.key,
          body: document.body,
          revision: document.revision,
        })
      }
    })
    return {
      unsubscribe: () => {
        changes.cancel()
      },
    }
  }
}
