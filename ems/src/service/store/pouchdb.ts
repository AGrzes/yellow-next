import PouchDB from 'pouchdb'
import pouchDbAdapterHttp from 'pouchdb-adapter-http'
import { Entity, Store } from './index'

PouchDB.plugin(pouchDbAdapterHttp)

export interface PouchDBMetadata {
  _rev: string
}

export type PouchDBReference = string

export class PouchDBStore implements Store<PouchDBMetadata, PouchDBReference> {
  constructor(private db: PouchDB.Database) {}

  async get<Data>(...references: PouchDBReference[]): Promise<Entity<PouchDBReference, PouchDBMetadata, Data>[]> {
    const result = await this.db.allDocs({
      keys: references,
      include_docs: true,
    })
    return result.rows
      .filter(
        (row): row is { doc: PouchDB.Core.ExistingDocument<Data>; id: string; key: string; value: { rev: string } } =>
          'doc' in row && row.doc !== undefined
      )
      .map((row) => ({
        reference: row.doc._id,
        metadata: { _rev: row.doc._rev },
        data: row.doc,
      }))
  }

  async save<Data>(
    ...entities: Entity<PouchDBReference, PouchDBMetadata, Data>[]
  ): Promise<Entity<PouchDBReference, PouchDBMetadata, Data>[]> {
    const docs = entities.map((entity) => ({
      _id: entity.reference,
      _rev: entity.metadata._rev,
      ...entity.data,
    }))
    const results = await this.db.bulkDocs(docs)
    return results.map((result, index) => ({
      ...entities[index],
      metadata: { _rev: result.rev },
    }))
  }
}
