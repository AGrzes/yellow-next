import { BlankNode, NamedNode } from 'n3'

export interface ClassOptions {
  name: string
  iri: string
  properties: PropertyOptions[]
}

export interface PropertyOptions {
  name: string
  iri: string
  reverse?: boolean
}

export interface ModelOptions {
  classes: ClassOptions[]
}

export interface TypedNode {
  iri: NamedNode | BlankNode
  classes: ClassOptions[]
}
