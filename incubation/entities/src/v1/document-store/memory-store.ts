import type { Document, DocumentKey, DocumentKeyPrefix, DocumentStore, MergeFunction } from './index'

function get(object: Record<string, any>, path: string[]): any {
  return object ? (path.length === 0 ? object : get(object[path[0]], path.slice(1))) : undefined
}

function set(object: Record<string, any>, path: string[], value: any): void {
  if (path.length === 1) {
    object[path[0]] = value
  } else {
    object[path[0]] = object[path[0]] || {}
    set(object[path[0]], path.slice(1), value)
  }
}

export class MemoryStore implements DocumentStore<void> {
  private readonly root = {}

  async get<Body>(key: DocumentKey): Promise<Document<Body, void> | null> {
    return get(this.root, key) as Document<Body, void> | null
  }

  async list<Body>(prefix?: DocumentKeyPrefix): Promise<Document<Body, void>[]> {
    return Object.values(get(this.root, prefix ?? []) as Document<Body, void>[])
  }

  async merge<Body>(document: Document<Body, void>, merge: MergeFunction<Body>): Promise<void> {
    const current = await this.get<Body>(document.key)
    const nextBody = merge(document.body, current?.body)
    set(this.root, document.key, {
      key: document.key,
      body: nextBody,
      revision: document.revision,
    })
  }
}
