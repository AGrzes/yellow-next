export type DocumentKey = string | string[]
export type Revision = string

export interface Document<Body> {
  key: DocumentKey
  body: Body
  revision: Revision
}

export interface DocumentStore {
  get<Body>(key: DocumentKey): Promise<Document<Body> | null>

  list<Body>(startKey: DocumentKey, endKey: DocumentKey): Promise<Document<Body>[]>

  merge<Body>(
    key: DocumentKey,
    merge: (current: Document<Body> | null) => Body,
    expectedRevision?: Revision
  ): Promise<void>
}
