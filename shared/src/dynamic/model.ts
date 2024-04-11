import { BlankNode, NamedNode } from 'n3'

export interface ClassOptions {
  readonly name: string
  readonly iri: string
  readonly properties: PropertyOptions[]
  readonly idPattern?: string
  readonly defaultProperty?: string
}

export type Multiplicity = 'single' | 'multiple' | 'any'

export interface PropertyOptions {
  readonly name: string
  readonly iri: string
  readonly predicate: string
  readonly reverse?: boolean
  readonly type?: string
  readonly multiplicity?: Multiplicity
  readonly orderBy?: string
}

export interface ModelOptions {
  readonly classes: ClassOptions[]
}

export interface TypedNode {
  readonly iri: NamedNode | BlankNode
  readonly classes: ClassOptions[]
}

export interface MapperOptions extends ModelOptions {
  roots: Record<string, string>
}
