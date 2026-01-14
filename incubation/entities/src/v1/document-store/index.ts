/**
 * Hierarchical key made up of string-identified container IDs and the final document ID.
 */
export type DocumentKey = string[]
/**
 * Part of hierarchical key made up of string-identified container IDs.
 */
export type DocumentKeyPrefix = string[]
/**
 * Store specific revision identifier for optimistic concurrency control.
 */

export interface Document<Body, Revision> {
  key: DocumentKey
  body: Body
  revision: Revision
}

export interface DocumentStore<Revision = string> {
  get<Body>(key: DocumentKey): Promise<Document<Body, Revision> | null>

  list<Body>(prefix?: DocumentKeyPrefix): Promise<Document<Body, Revision>[]>

  merge<Body>(document: Document<Body, Revision>, merge: (document: Body, current?: Body) => Body): Promise<void>
}
