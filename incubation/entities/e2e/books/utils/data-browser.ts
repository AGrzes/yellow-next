import yaml from 'yaml'
import { Collection, Collections } from './types.ts'

async function loadEntityCollection(entity: String): Promise<Collection> {
  const filePath = `../data/${entity}.yaml?raw`
  /* @vite-ignore */
  const fileContent = await import(filePath)
  const parsedContent: Collection = yaml.parse(fileContent.default)
  console.log('Loaded content for', parsedContent)
  return parsedContent
}
export const collections: Collections = {
  book: await loadEntityCollection('book'),
  author: await loadEntityCollection('author'),
  series: await loadEntityCollection('series'),
  'reading-entry': await loadEntityCollection('reading-entry'),
}
