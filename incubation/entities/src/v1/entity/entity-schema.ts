import type { Entity } from '.'
import type { SchemaManager, Type } from '../schema/schema-manager'
declare module './index' {
  interface EntityMeta {
    type?: Type
  }
}

export class EntitySchemaHandler {
  constructor(private readonly schemaManager: SchemaManager) {}
  async apply<Body extends Record<string, any>>(entity: Entity<Body>): Promise<void> {
    const type = await this.schemaManager.get(entity.type)
    if (!type) {
      throw new Error(`Unknown entity type: ${entity.type}`)
    }
    entity.meta = entity.meta || {}
    entity.meta.type = type
  }
}
