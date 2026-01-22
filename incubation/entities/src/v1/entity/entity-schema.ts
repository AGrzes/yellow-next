import type { Entity, EntityList } from '.'
import type { SchemaManager, Type } from '../schema/schema-manager'
declare module './index' {
  interface EntityMeta {
    type?: Type
  }
  interface EntityListMeta {
    type?: Type
  }
}

export class EntitySchemaHandler {
  constructor(private readonly schemaManager: SchemaManager) {}
  async handleEntity<Body extends Record<string, any>>(entity: Entity<Body>): Promise<void> {
    const type = await this.schemaManager.get(entity.type)
    if (!type) {
      throw new Error(`Unknown entity type: ${entity.type}`)
    }
    entity.meta = entity.meta || {}
    entity.meta.type = type
  }
  async handleList<Body extends Record<string, any>>(list: EntityList<Body>): Promise<void> {
    if (list.type) {
      const type = await this.schemaManager.get(list.type)
      if (!type) {
        throw new Error(`Unknown entity type: ${list.type}`)
      }
      list.meta = list.meta || {}
      list.meta.type = type
    }
    await Promise.all(list.items.map((entity) => this.handleEntity(entity)))
  }
}
