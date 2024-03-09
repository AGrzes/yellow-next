import { BlankNode, NamedNode } from 'n3'

export interface ClassOptions {
  readonly name: string
  readonly iri: string
  readonly properties: PropertyOptions[]
}

export interface PropertyOptions {
  readonly name: string
  readonly iri: string
  readonly reverse?: boolean
}

export interface ModelOptions {
  readonly classes: ClassOptions[]
}

export interface TypedNode {
  readonly iri: NamedNode | BlankNode
  readonly classes: ClassOptions[]
}
