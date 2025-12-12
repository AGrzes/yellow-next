export class SchemaManager {
  async getSchema(type: string) {
    const response = await fetch(`/schema/${type}.schema.json`)
    const schema = await response.json()
    return schema
  }
}

export const schemaManager = new SchemaManager()

export class UiSchemaManager {
  async getUiSchema(type: string, variant: string) {
    const response = await fetch(`/ui-schema/${type}-${variant}.uischema.json`)
    const uiSchema = await response.json()
    return uiSchema
  }
}

export const uiSchemaManager = new UiSchemaManager()

export class EntityManager {
  async get(type: string, id: string) {
    const response = await fetch(`/data/${type}.data.json`)
    const list: any[] = await response.json()
    return list.find((item)=> item.id === id)
  }
  async list(type: string) {
    const response = await fetch(`/data/${type}.data.json`)
    const list: any[] = await response.json()
    return list
  }
}
export const entityManager = new EntityManager()
