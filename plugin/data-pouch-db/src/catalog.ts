import type PouchDB = require('pouchdb-node')

export interface Catalog {
  list(): string[]
  get<T>(name: string): PouchDB.Database<T>
}
export type PouchDBOptions = ConstructorParameters<typeof PouchDB>[1]
export type PouchDBFactory = <T extends {}>(...args: ConstructorParameters<typeof PouchDB>) => PouchDB.Database<T>

export interface PouchDbConfig {
  name: string
  options?: PouchDBOptions
  dbName?: string
}

export class StaticCatalog implements Catalog {
  private readonly databases: Record<string, PouchDB.Database<any>> = {}
  private config: Record<string, PouchDbConfig> = {}
  constructor(
    private readonly factory: PouchDBFactory,
    config: PouchDbConfig[]
  ) {
    this.config = config.reduce((acc, cur) => {
      acc[cur.name] = cur
      return acc
    }, this.config)
  }

  list(): string[] {
    return Array.from(Object.keys(this.config))
  }
  get<T>(name: string): PouchDB.Database<T> {
    if (!this.databases[name]) {
      if (this.config[name]) {
        this.databases[name] = this.factory<T>(this.config[name].dbName, this.config[name].options)
      }
    }
    return this.databases[name]
  }
}
