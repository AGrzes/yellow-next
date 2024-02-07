export interface ChangeEvent<T, K> {
  kind: string
  key: K
}

export interface UpdateEvent<T, K> extends ChangeEvent<T, K> {
  kind: 'update'
  content: T
  hint?: 'add' | 'update' | 'replace'
}

export interface DeleteEvent<T, K> extends ChangeEvent<T, K> {
  kind: 'delete'
}

export interface MoveEvent<T, K> extends ChangeEvent<T, K> {
  kind: 'move'
  newKey: K
}
