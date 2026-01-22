import { describe, expect, it, vi } from 'vitest'
import type { Entity } from '../../../src/v1/entity'
import { EntitySchemaHandler } from '../../../src/v1/entity/entity-schema'
import type { SchemaManager, Type } from '../../../src/v1/schema/schema-manager'

describe('EntitySchemaHandler', () => {
  it('attaches the resolved schema type to entity meta', async () => {
    const resolvedType: Type = { name: 'Book', schema: {}, ancestors: [] }
    const schemaManager = {
      get: vi.fn(async () => resolvedType),
    } as unknown as SchemaManager
    const handler = new EntitySchemaHandler(schemaManager)
    const entity: Entity<{ title: string }> = {
      type: 'Book',
      id: '1',
      body: { title: 'Dune' },
    }

    await handler.handleEntity(entity)

    expect(entity.meta?.type).toBe(resolvedType)
  })

  it('throws when the entity type is unknown', async () => {
    const schemaManager = {
      get: vi.fn(async () => undefined),
    } as unknown as SchemaManager
    const handler = new EntitySchemaHandler(schemaManager)
    const entity: Entity<{ title: string }> = {
      type: 'Book',
      id: '1',
      body: { title: 'Dune' },
    }

    await expect(handler.handleEntity(entity)).rejects.toThrow('Unknown entity type: Book')
  })
})
