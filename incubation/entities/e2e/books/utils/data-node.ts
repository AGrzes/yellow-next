import { readFile } from 'node:fs/promises'
import yaml from 'yaml'
import type { Collection, Collections } from '@e2e/books/utils/types'

async function loadEntityCollection(entity: String): Promise<Collection> {
  const filePath = `./e2e/books/data/${entity}.yaml`
  const fileContent = await readFile(filePath, 'utf-8')
  const parsedContent: Collection = yaml.parse(fileContent)
  return parsedContent
}
export const collections: Collections = {
  book: await loadEntityCollection('book'),
  author: await loadEntityCollection('author'),
  series: await loadEntityCollection('series'),
  'reading-entry': await loadEntityCollection('reading-entry'),
}
