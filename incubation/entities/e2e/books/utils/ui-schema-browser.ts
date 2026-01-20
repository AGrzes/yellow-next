import type { UiSchemaEntry } from '@v1/schema/ui-schema-manager.ts'
import yaml from 'yaml'

async function loadUiSchemas(): Promise<UiSchemaEntry[]> {
  const filePath = `../ui-schemas/ui-schemas.yaml?raw`
  const fileContent = await import(filePath)
  return yaml.parse(fileContent.default) as UiSchemaEntry[]
}

export const uiSchemas: UiSchemaEntry[] = await loadUiSchemas()
