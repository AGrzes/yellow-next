import { readFile } from 'node:fs/promises'
import yaml from 'yaml'
import type { SerializedType } from '@v1/schema/schema-manager'

async function loadSchema(name: string): Promise<SerializedType> {
  const filePath = `./e2e/books/schemas/${name}.schema.yaml`
  const fileContent = await readFile(filePath, 'utf-8')
  return yaml.parse(fileContent) as SerializedType
}

export const schemas: SerializedType[] = [
  await loadSchema('book'),
  await loadSchema('author'),
  await loadSchema('series'),
  await loadSchema('reading-entry'),
]
