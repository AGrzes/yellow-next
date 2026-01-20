import { describe, expect, it } from 'vitest'
import { collections } from './data-node.ts'
import { schemas } from './schema-node.ts'
import { setupEntityManager } from './setup-entity-manager.ts'

const entityManager = await setupEntityManager(collections, schemas)

describe('Books E2E Test', () => {
  it('should retrieve a book by id', async () => {
    const bookData = collections.book.items[0]
    const doc = await entityManager.get<any>(collections.book.type, bookData.id)
    expect(doc!.body.title).toBe(bookData.title)
  })
  it('should retrieve an author by id', async () => {
    const authorData = collections.author.items[0]
    const doc = await entityManager.get<any>(collections.author.type, authorData.id)
    expect(doc!.body.name).toBe(authorData.name)
  })
  it('should retrieve a series by id', async () => {
    const seriesData = collections.series.items[0]
    const doc = await entityManager.get<any>(collections.series.type, seriesData.id)
    expect(doc!.body.title).toBe(seriesData.title)
  })
  it('should retrieve a reading entry by id', async () => {
    const entryData = collections['reading-entry'].items[0]
    const doc = await entityManager.get<any>(collections['reading-entry'].type, entryData.id)
    expect(doc!.body.bookId).toBe(entryData.bookId)
  })
  it('should list all books', async () => {
    const books = await entityManager.list<any>(collections.book.type)
    collections.book.items.forEach((bookData) => {
      const found = books.find((b) => b.id === bookData.id)
      expect(found).toBeDefined()
      expect(found!.body.title).toBe(bookData.title)
    })
  })
  it('should list all authors', async () => {
    const authors = await entityManager.list<any>(collections.author.type)
    collections.author.items.forEach((authorData) => {
      const found = authors.find((a) => a.id === authorData.id)
      expect(found).toBeDefined()
      expect(found!.body.name).toBe(authorData.name)
    })
  })
  it('should list all series', async () => {
    const seriesList = await entityManager.list<any>(collections.series.type)
    collections.series.items.forEach((seriesData) => {
      const found = seriesList.find((s) => s.id === seriesData.id)
      expect(found).toBeDefined()
      expect(found!.body.title).toBe(seriesData.title)
    })
  })
  it('should list all reading entries', async () => {
    const entries = await entityManager.list<any>(collections['reading-entry'].type)
    collections['reading-entry'].items.forEach((entryData) => {
      const found = entries.find((e) => e.id === entryData.id)
      expect(found).toBeDefined()
      expect(found!.body.bookId).toBe(entryData.bookId)
    })
  })
})
