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
   * Document revision captured at read time, used to detect concurrent changes.
   *
   * If the stored revision differs from the supplied one, the store should treat
   * the merge as a conflict and require a re-read/merge cycle.
   */
  revision?: Revision
}
/**
 * Function that merges document body.
 * @param document - Document body to merge
 * @param current - Current document body, or undefined if it not yet exist
 * @returns Merged document body
 */
export type MergeFunction<Body> = (document: Body, current: Body) => Body
/**
 * Base interface for document change.
 */
export interface ChangeBase {
  key: DocumentKey
  type: 'update' | 'delete'
}
/**
 * Document update change.
 */
export interface Update<Body, Revision> extends ChangeBase {
  type: 'update'
  body: Body
  revision?: Revision
}
/**
 * Document delete change.
 */
export interface Delete extends ChangeBase {
  type: 'delete'
}
/**
 * Document change
 */
export type Change<Body, Revision> = Update<Body, Revision> | Delete
/**
 * Subscription to document changes.
 */
export type Subscription = { 
  /**
   * Unsubscribe from document changes.
   */
  unsubscribe: () => void 
}
/**
 * Document change listener.
 */
export type ChangeListener<Body, Revision> = (change: Change<Body, Revision>) => Promise<void>
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
   * If the supplied document revision matches the stored revision, the merge
   * may be applied directly. If it differs, the store should reject and the
   * caller should re-read, merge, and retry (CouchDB-style).
   *
   * @param document - Document to merge (including the revision it was read with)
   * @param merge - Merge function
   */
  merge<Body>(document: Document<Body, Revision>, merge: MergeFunction<Body>): Promise<void>

  /**
   * Deletes document by its key.
   * @param key - Document key
   * @param revision - Document revision if known
   * @param force - If true, deletes the document even if the revision does not match
   */
  delete(key: DocumentKey, revision?: Revision, force?: boolean): Promise<void>
  /**
   * Subscribes to document changes.
   *
   * @param onChange - Change callback
   * @returns Subscription
   */
  subscribe<Body>(onChange: ChangeListener<Body, Revision>): Subscription
}
