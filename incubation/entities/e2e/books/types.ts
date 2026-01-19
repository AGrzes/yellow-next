export interface Collection {
  type: string
  items: Array<{ id: string; [key: string]: any }>
}

export interface Collections {
  book: Collection
  author: Collection
  series: Collection
  'reading-entry': Collection
}
