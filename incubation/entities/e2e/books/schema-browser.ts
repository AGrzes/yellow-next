import yaml from 'yaml'
import type { SerializedType } from '../../src/v1/schema/schema-manager'

async function loadSchema(name: string): Promise<SerializedType> {
  const filePath = `./schemas/${name}.schema.yaml?raw`
  /* @vite-ignore */
  const fileContent = await import(filePath)
  return yaml.parse(fileContent.default) as SerializedType
}

export const schemas: SerializedType[] = [
  await loadSchema('book'),
  await loadSchema('author'),
  await loadSchema('series'),
  await loadSchema('reading-entry'),
]
