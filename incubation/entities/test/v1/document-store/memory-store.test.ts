import { describe, expect, it } from 'vitest'
import { MemoryStore } from '../../../src/v1/document-store/memory-store'

describe('MemoryStore', () => {
  it('returns null when missing', async () => {
    const store = new MemoryStore()

    const missing = await store.get(['missing'])

    expect(missing).toBeUndefined()
  })

  it('stores and retrieves a document', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['doc'], body: { value: 1 } }, (body) => body)

    const stored = await store.get<{ value: number }>(['doc'])

    expect(stored).toEqual({
      key: ['doc'],
      body: { value: 1 },
    })
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

  it('merges using current body when revision matches', async () => {
    const store = new MemoryStore()

    await store.merge({ key: ['item'], body: { value: 1 } }, (body) => body)
    const current = await store.get<{ value: number }>(['item'])

    await store.merge({ key: ['item'], body: { value: 2 } }, (body, existing) => ({
      value: (existing?.value ?? 0) + body.value,
    }))

    const stored = await store.get<{ value: number }>(['item'])

    expect(stored?.body.value).toBe(3)
    expect(stored?.revision).toBe(current?.revision)
  })
})
