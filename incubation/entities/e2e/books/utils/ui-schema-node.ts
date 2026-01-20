import type { UiSchemaEntry } from '@v1/schema/ui-schema-manager.ts'
import { readFile } from 'node:fs/promises'
import yaml from 'yaml'

async function loadUiSchemas(): Promise<UiSchemaEntry[]> {
  const filePath = `./e2e/books/ui-schemas/ui-schemas.yaml`
  const fileContent = await readFile(filePath, 'utf-8')
  return yaml.parse(fileContent) as UiSchemaEntry[]
}

export const uiSchemas: UiSchemaEntry[] = await loadUiSchemas()
