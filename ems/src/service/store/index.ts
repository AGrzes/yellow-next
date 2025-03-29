export interface Entity<Reference, Metadata, Data> {
  reference: Reference
  metadata: Metadata
  data: Data
}

export interface Store<Metadata, Reference> {
  get<Data>(...references: Reference[]): Promise<Entity<Reference, Metadata, Data>[]>
  save<Data>(...entities: Entity<Reference, Metadata, Data>[]): Promise<Entity<Reference, Metadata, Data>[]>
}
