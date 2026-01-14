import { describe, expect, it, vi } from 'vitest'
import { Change } from '../../../src/v1/document-store/index.ts'
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
    const listener = vi.fn(async (change: Change<{ value: number }, void>) => {})

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
})
