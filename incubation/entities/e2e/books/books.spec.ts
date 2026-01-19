import { readFile } from 'node:fs/promises'
import PouchDB from 'pouchdb'
import PouchDBAdapterMemory from 'pouchdb-adapter-memory'
import { describe, expect, it } from 'vitest'
import yaml from 'yaml'
import { PouchDBStore } from '../../src/v1/document-store/pouchdb-store'
import { EntityManagerImpl } from '../../src/v1/entity'

PouchDB.plugin(PouchDBAdapterMemory)
const ENTITIES = ['book', 'author', 'series', 'reading-entry']
async function loadData(): Promise<Record<string, Collection>> {
  return Object.fromEntries(
    await Promise.all(
      ENTITIES.map(async (entity) => {
        const filePath = `./e2e/books/data/${entity}.yaml`
        const fileContent = await readFile(filePath, 'utf-8')
        const parsedContent: Collection = yaml.parse(fileContent)
        return [entity, parsedContent]
      })
    )
  )
}

interface Collection {
  type: string
  items: Array<{ id: string; [key: string]: any }>
}

const data = await loadData()
const db = new PouchDB('books-e2e-test-db', { adapter: 'memory' })

async function insertItem(database: PouchDB.Database, type: string, id: string, body: any) {
  await database.put({
    _id: `entities/${type}/${id}`,
    body,
  })
}

async function insertCollection(database: PouchDB.Database, collection: Collection) {
  for (const item of collection.items) {
    const { id, ...body } = item
    await insertItem(database, collection.type, id, body)
  }
}

await Promise.all(ENTITIES.map((entity) => insertCollection(db, data[entity])))

const entityManager = new EntityManagerImpl(new PouchDBStore(db))

describe('Books E2E Test', () => {
  it('should retrieve a book by id', async () => {
    const bookData = data['book'].items[0]
    const doc = await entityManager.get<any>(data['book'].type, bookData.id)
    expect(doc!.body.title).toBe(bookData.title)
  })
  it('should retrieve an author by id', async () => {
    const authorData = data['author'].items[0]
    const doc = await entityManager.get<any>(data['author'].type, authorData.id)
    expect(doc!.body.name).toBe(authorData.name)
  })
  it('should retrieve a series by id', async () => {
    const seriesData = data['series'].items[0]
    const doc = await entityManager.get<any>(data['series'].type, seriesData.id)
    expect(doc!.body.title).toBe(seriesData.title)
  })
  it('should retrieve a reading entry by id', async () => {
    const entryData = data['reading-entry'].items[0]
    const doc = await entityManager.get<any>(data['reading-entry'].type, entryData.id)
    expect(doc!.body.bookId).toBe(entryData.bookId)
  })
  it('should list all books', async () => {
    const books = await entityManager.list<any>(data['book'].type)
    data.book.items.forEach((bookData) => {
      const found = books.find((b) => b.id === bookData.id)
      expect(found).toBeDefined()
      expect(found!.body.title).toBe(bookData.title)
    })
  })
  it('should list all authors', async () => {
    const authors = await entityManager.list<any>(data['author'].type)
    data.author.items.forEach((authorData) => {
      const found = authors.find((a) => a.id === authorData.id)
      expect(found).toBeDefined()
      expect(found!.body.name).toBe(authorData.name)
    })
  })
  it('should list all series', async () => {
    const seriesList = await entityManager.list<any>(data['series'].type)
    data.series.items.forEach((seriesData) => {
      const found = seriesList.find((s) => s.id === seriesData.id)
      expect(found).toBeDefined()
      expect(found!.body.title).toBe(seriesData.title)
    })
  })
  it('should list all reading entries', async () => {
    const entries = await entityManager.list<any>(data['reading-entry'].type)
    data['reading-entry'].items.forEach((entryData) => {
      const found = entries.find((e) => e.id === entryData.id)
      expect(found).toBeDefined()
      expect(found!.body.bookId).toBe(entryData.bookId)
    })
  })
})
