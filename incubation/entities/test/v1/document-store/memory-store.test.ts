import { describe, expect, it, vi } from 'vitest'
import { type Change } from '../../../src/v1/document-store'
import { MemoryStore } from '../../../src/v1/document-store/memory-store'

describe('MemoryStore', () => {
  it('returns null when missing', async () => {
    const store = new MemoryStore()

    const missing = await store.get(['missing'])

    expect(missing).toBeNull()
  })

  it('stores and retrieves a document', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['doc'], body: { value: 1 } }, (body) => body)

    const stored = await store.get<{ value: number }>(['doc'])

    expect(stored?.key).toEqual(['doc'])
    expect(stored?.body).toEqual({ value: 1 })
    expect(stored?.revision).toBeUndefined()
  })

  it('lists documents under a prefix', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['a', '1'], body: { value: 'a1' } }, (body) => body)
    await store.merge({ key: ['a', '2'], body: { value: 'a2' } }, (body) => body)
    await store.merge({ key: ['b', '1'], body: { value: 'b1' } }, (body) => body)

    const docs = await store.list<{ value: string }>(['a'])

    expect(docs.length).toBe(2)
    expect(docs.map((doc) => doc.body.value).sort()).toEqual(['a1', 'a2'])
  })

  it('lists all documents when no prefix is provided', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['a'], body: { value: 'a' } }, (body) => body)
    await store.merge({ key: ['b'], body: { value: 'b' } }, (body) => body)

    const docs = await store.list<{ value: string }>()

    expect(docs.length).toBe(2)
    const keys = docs.map((doc) => doc.key.join('/')).sort()
    expect(keys).toEqual(['a', 'b'])
  })

  it('returns empty list when prefix is missing', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['exists'], body: { value: 1 } }, (body) => body)

    const docs = await store.list<{ value: number }>(['missing'])

    expect(docs).toEqual([])
  })

  it('notifies subscribers on updates and stops after unsubscribe', async () => {
    const store = new MemoryStore()
    const listener = vi.fn(async (_change: Change<{ value: number }, void>) => {})

    const subscription = store.subscribe(listener)

    await store.merge({ key: ['doc'], body: { value: 1 } }, (body) => body)

    expect(listener).toHaveBeenCalledTimes(1)
    const change = listener.mock.calls[0][0]
    expect(change).toMatchObject({
      type: 'update',
      key: ['doc'],
      body: { value: 1 },
    })
    subscription.unsubscribe()
    await store.merge({ key: ['doc'], body: { value: 2 } }, (body) => body)

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('deletes documents and notifies subscribers', async () => {
    const store = new MemoryStore()
    const listener = vi.fn(async (_change: Change<{ value: number }, void>) => {})

    store.subscribe(listener)

    await store.merge({ key: ['doc'], body: { value: 1 } }, (body) => body)
    await store.delete(['doc'])

    const stored = await store.get<{ value: number }>(['doc'])

    expect(stored).toBeNull()
    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener.mock.calls[1][0]).toEqual({ type: 'delete', key: ['doc'] })
  })

  it('deletes a top-level document', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['root'], body: { value: 1 } }, (body) => body)
    await store.delete(['root'])

    expect(await store.get(['root'])).toBeNull()
  })

  it('rejects delete on revision mismatch unless forced', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['doc'], body: { value: 1 } }, (body) => body)

    await expect(store.delete(['doc'], 'rev' as any)).rejects.toThrow('Revision mismatch')
    await expect(store.delete(['doc'], 'rev' as any, true)).resolves.toBeUndefined()
  })

  it('prunes empty containers after delete', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['a', 'b'], body: { value: 1 } }, (body) => body)
    await store.delete(['a', 'b'])

    expect(await store.list(['a'])).toEqual([])
    expect(await store.list()).toEqual([])
  })

  it('keeps container when other documents remain', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['a', 'b'], body: { value: 1 } }, (body) => body)
    await store.merge({ key: ['a', 'c'], body: { value: 2 } }, (body) => body)

    await store.delete(['a', 'b'])

    const docs = await store.list<{ value: number }>(['a'])
    expect(docs.map((doc) => doc.body.value)).toEqual([2])
  })

  it('does nothing when deleting a missing document', async () => {
    const store = new MemoryStore()

    await store.delete(['missing'])

    const docs = await store.list()
    expect(docs).toEqual([])
  })
})
