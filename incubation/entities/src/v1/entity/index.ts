import type { DocumentStore } from '../document-store/index.ts'
import type { EntityTypeID } from '../schema/schema-manager.ts'
import type { EntitySchemaHandler } from './entity-schema.ts'

export type EntityID = string
export type Query = Record<string, any>

export interface EntityMeta {}

export interface Entity<Body> {
  type: EntityTypeID
  id: EntityID
  body: Body
  meta?: EntityMeta
}

export interface EntityListMeta {}

export interface EntityList<Body> {
  type?: EntityTypeID
  items: Entity<Body>[]
  meta?: EntityListMeta
}

export interface EntityManager {
  get<Body extends Record<string, any>>(type: EntityTypeID, id: EntityID): Promise<Entity<Body> | null>
  list<Body extends Record<string, any>>(type: EntityTypeID): Promise<EntityList<Body>>
  save<Body extends Record<string, any>>(entity: Entity<Body>): Promise<void>
  findOne<Body extends Record<string, any>>(type: EntityTypeID, query: Query): Promise<Entity<Body>>
  find<Body extends Record<string, any>>(type: EntityTypeID, query: Query): Promise<Entity<Body>[]>
}

function merge<Body extends Record<string, any>>(document: Body, current: Body): Body {
  const result: Body = { ...current }
  for (const key of Object.keys(document) as (keyof Body)[]) {
    if (typeof document[key] === 'object' && typeof current[key] === 'object') {
      result[key] = merge(document[key], current[key])
    } else {
      result[key] = document[key]
    }
  }
  return result
}

export class EntityManagerImpl implements EntityManager {
  constructor(private readonly store: DocumentStore<string>, private readonly schemaHandler: EntitySchemaHandler) {}
  async get<Body extends Record<string, any>>(type: EntityTypeID, id: EntityID): Promise<Entity<Body> | null> {
    const document = await this.store.get<Body>(['entities', type, id])
    if (document) {
      const entity: Entity<Body> = {
        type,
        id,
        body: document.body,
      }
      await this.schemaHandler.handleEntity(entity)
      return entity
    }
    return null
  }

  async list<Body extends Record<string, any>>(type: EntityTypeID): Promise<EntityList<Body>> {
    const documents = await this.store.list<Body>(['entities', type])
    const entities = documents.map((doc) => ({
      type,
      id: doc.key[2],
      body: doc.body,
    }))
    const list: EntityList<Body> = { type, items: entities }
    await this.schemaHandler.handleList(list)
    return list
  }

  async save<Body extends Record<string, any>>(entity: Entity<Body>): Promise<void> {
    await this.store.merge<Body>(
      {
        key: ['entities', entity.type, entity.id],
        body: entity.body,
      },
      merge
    )
  }

  async findOne<Body extends Record<string, any>>(_type: EntityTypeID, _query: Query): Promise<Entity<Body>> {
    throw new Error('Method not implemented.')
  }
  async find<Body extends Record<string, any>>(_type: EntityTypeID, _query: Query): Promise<Entity<Body>[]> {
    throw new Error('Method not implemented.')
  }
}
