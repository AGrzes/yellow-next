import type {
  ChangeListener,
  Document,
  DocumentKey,
  DocumentKeyPrefix,
  DocumentStore,
  MergeFunction,
  Subscription,
} from './index'

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

function remove(object: Record<string, any>, path: string[]): boolean {
  if (path.length === 1) {
    delete object[path[0]]
    return true
  }

  const child = object[path[0]] as Record<string, any>
  const removed = remove(child, path.slice(1))
  if (removed && Object.keys(child).length === 0) {
    delete object[path[0]]
  }
  return removed
}

export class MemoryStore implements DocumentStore<void> {
  private readonly root = {}
  subscriptions: Set<ChangeListener<any, void>> = new Set()

  async get<Body>(key: DocumentKey): Promise<Document<Body, void> | null> {
    return (get(this.root, key) as Document<Body, void> | undefined) ?? null
  }

  async list<Body>(prefix?: DocumentKeyPrefix): Promise<Document<Body, void>[]> {
    const node = get(this.root, prefix ?? [])
    return node ? Object.values(node as Record<string, Document<Body, void>>) : []
  }

  async merge<Body>(document: Document<Body, void>, merge: MergeFunction<Body>): Promise<void> {
    const current = await this.get<Body>(document.key)

    const nextBody = current ? merge(document.body, current.body) : document.body
    set(this.root, document.key, {
      key: document.key,
      body: nextBody,
      revision: document.revision,
    })

    const change = {
      type: 'update' as const,
      key: document.key,
      body: nextBody,
      revision: document.revision,
    }

    for (const listener of this.subscriptions) {
      await listener(change)
    }
  }

  async delete(key: DocumentKey, revision?: void, force?: boolean): Promise<void> {
    const current = await this.get(key)
    if (!current) {
      return
    }
    if (!force && revision !== undefined && current.revision !== revision) {
      throw new Error('Revision mismatch')
    }

    remove(this.root, key)

    const change = {
      type: 'delete' as const,
      key,
    }

    for (const listener of this.subscriptions) {
      await listener(change)
    }
  }
  subscribe<Body>(onChange: ChangeListener<Body, void>): Subscription {
    this.subscriptions.add(onChange)
    return {
      unsubscribe: () => {
        this.subscriptions.delete(onChange)
      },
    }
  }
}
