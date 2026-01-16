import { describe, expect, it, vi } from 'vitest'
import type { DocumentKey } from '../../../src/v1/document-store'
import {
  PouchDBStore,
  documentKeyToPouchDbKey,
  pouchDbDocumentToDocument,
  pouchDbKeyToDocumentKey,
} from '../../../src/v1/document-store/pouchdb-store'

type StoredDoc<Body> = {
  _id: string
  _rev?: string
  body: Body
}

describe('PouchDBStore', () => {
  it('round-trips document keys', () => {
    const key: DocumentKey = ['a/b', 'c d']
    const encoded = documentKeyToPouchDbKey(key)
    expect(encoded).toBe('a%2Fb/c%20d')
    expect(pouchDbKeyToDocumentKey(encoded)).toEqual(key)
  })

  it('converts pouch documents', () => {
    const doc: StoredDoc<{ value: number }> = { _id: 'a', _rev: '1-x', body: { value: 1 } }
    expect(pouchDbDocumentToDocument(doc as any)).toEqual({
      key: ['a'],
      body: { value: 1 },
      revision: '1-x',
    })
  })

  it('returns null on missing documents', async () => {
    const db = {
      get: vi.fn(async () => {
        const error: any = new Error('not found')
        error.status = 404
        throw error
      }),
    }
    const store = new PouchDBStore(db as any)

    await expect(store.get(['missing'])).resolves.toBeNull()
  })

  it('throws on non-404 errors from get', async () => {
    const db = {
      get: vi.fn(async () => {
        const error: any = new Error('boom')
        error.status = 500
        throw error
      }),
    }
    const store = new PouchDBStore(db as any)

    await expect(store.get(['err'])).rejects.toThrow('boom')
  })

  it('lists documents with prefix range', async () => {
    const rows = [
      { doc: { _id: 'a/1', _rev: '1-a', body: { value: 'a1' } } },
      { doc: { _id: 'a/2', _rev: '1-b', body: { value: 'a2' } } },
    ]
    const allDocs = vi.fn(async (_options: any) => ({ rows }))
    const db = { allDocs }
    const store = new PouchDBStore(db as any)

    const docs = await store.list<{ value: string }>(['a'])

    expect(allDocs).toHaveBeenCalledWith({
      include_docs: true,
      startkey: 'a/',
      endkey: 'a/\ufff0',
    })
    expect(docs.map((doc) => doc.body.value)).toEqual(['a1', 'a2'])
  })

  it('merges after conflict and uses current body', async () => {
    const get = vi.fn().mockResolvedValueOnce({ _id: 'doc', _rev: '2-x', body: { count: 1 } })
    const put = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('conflict'), { status: 409 }))
      .mockResolvedValueOnce(undefined)
    const db = { get, put }
    const store = new PouchDBStore(db as any)

    await store.merge({ key: ['doc'], body: { count: 1 }, revision: '1-x' }, (next, current) => ({
      count: (current?.count ?? 0) + next.count,
    }))

    expect(put).toHaveBeenCalledTimes(2)
    expect(get).toHaveBeenCalledWith('doc')
  })

  it('surfaces non-conflict errors during merge', async () => {
    const put = vi.fn().mockRejectedValueOnce(Object.assign(new Error('boom'), { status: 500 }))
    const db = { put, get: vi.fn() }
    const store = new PouchDBStore(db as any)

    await expect(store.merge({ key: ['doc'], body: { value: 1 } }, (next) => next)).rejects.toThrow('boom')
  })

  it('gives up after repeated conflicts', async () => {
    const put = vi.fn().mockRejectedValue(Object.assign(new Error('conflict'), { status: 409 }))
    const get = vi.fn().mockResolvedValue({ _id: 'doc', _rev: '2-x', body: { value: 1 } })
    const db = { put, get }
    const store = new PouchDBStore(db as any)

    await expect(store.merge({ key: ['doc'], body: { value: 1 } }, (next) => next)).rejects.toThrow(
      'Failed to merge document after 5 attempts due to conflicts'
    )
    expect(put).toHaveBeenCalledTimes(5)
  })

  it('notifies subscribers on updates and deletes', async () => {
    const listeners = new Set<
      (change: Partial<PouchDB.Core.ChangesResponseChange<{ body: number }>>) => Promise<void>
    >()
    const changes = {
      on: vi.fn((_event: string, handler: any) => {
        listeners.add(handler)
      }),
      cancel: vi.fn(),
    }
    const db = {
      changes: () => changes,
    }
    const store = new PouchDBStore(db as any)
    const onChange = vi.fn(async (_change) => {})

    const subscription = store.subscribe(onChange)

    for (const handler of listeners) {
      await handler({
        doc: { _id: 'doc', _rev: '1-x', body: 1 },
      })
      await handler({ deleted: true, id: 'gone' })
    }
    expect(changes.on).toHaveBeenLastCalledWith('change', expect.any(Function))
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange.mock.calls[0][0]).toMatchObject({
      type: 'update',
      key: ['doc'],
      body: 1,
      revision: '1-x',
    })
    expect(onChange.mock.calls[1][0]).toEqual({
      type: 'delete',
      key: ['gone'],
    })

    subscription.unsubscribe()
    expect(changes.cancel).toHaveBeenCalled()
  })
})
