/**
 * Hierarchical key made up of string-identified container IDs and the final document ID.
 */
export type DocumentKey = string[]
/**
 * Part of hierarchical key made up of string-identified container IDs.
 */
export type DocumentKeyPrefix = string[]
/**
 * Document stored in DocumentStore.
 */
export interface Document<Body, Revision> {
  /**
   * Document key.
   */
  key: DocumentKey
  /**
   * Document body.
   */
  body: Body
  /**
   * Document revision for optimistic concurrency control.
   */
  revision: Revision
}
/**
 * Function that merges document body.
 * @param document - Document body to merge
 * @param current - Current document body, or undefined if it not yet exist
 * @returns Merged document body
 */
export type MergeFunction<Body> = (document: Body, current?: Body) => Body

/**
 * Interface for a hierarchical document store supporting optimistic concurrency control.
 */
export interface DocumentStore<Revision = string> {
  /**
   * Returns specific document by its key.
   *
   * @param key - Document key
   * @returns The document with the specified key, or null if it does not exist.
   */
  get<Body>(key: DocumentKey): Promise<Document<Body, Revision> | null>

  /**
   * Returns list of documents inside container specified by the prefix and nested containers.
   *
   * @param prefix - Document key prefix
   * @returns List of documents
   */
  list<Body>(prefix?: DocumentKeyPrefix): Promise<Document<Body, Revision>[]>

  /**
   * Merges document body using the provided merge function.
   *
   * @param document - Document to merge
   * @param merge - Merge function
   */
  merge<Body>(document: Document<Body, Revision>, merge: MergeFunction<Body>): Promise<void>
}
