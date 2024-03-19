import { RDF, RDFS } from '@inrupt/vocab-common-rdf'
import { DataFactory, Store } from 'n3'
import { ClassOptions, ModelOptions, PropertyOptions } from './model.js'

export const CLASS_TYPE = DataFactory.namedNode('agrzes:yellow-next:dynamic:Class')
export const CLASS_NAME = DataFactory.namedNode('agrzes:yellow-next:dynamic:Class:name')
export const PROPERTY_NAME = DataFactory.namedNode('agrzes:yellow-next:dynamic:Property:name')
export const PROPERTY_REVERSE_NAME = DataFactory.namedNode('agrzes:yellow-next:dynamic:Property:reverse_name')

export class SemanticPropertyOptions implements PropertyOptions {
  constructor(
    private store: Store,
    public iri: string,
    public reverse: boolean
  ) {}

  private get forwardName(): string {
    return (
      this.store.getObjects(DataFactory.namedNode(this.iri), PROPERTY_NAME, null)[0]?.value ||
      this.store.getObjects(DataFactory.namedNode(this.iri), RDFS.label, null)[0]?.value ||
      this.iri
    )
  }

  get name(): string {
    if (this.reverse) {
      return (
        this.store.getObjects(DataFactory.namedNode(this.iri), PROPERTY_REVERSE_NAME, null)[0]?.value ||
        `^${this.forwardName}`
      )
    } else {
      return this.forwardName
    }
  }
}

export class SemanticClassOptions implements ClassOptions {
  constructor(
    private store: Store,
    public iri: string
  ) {}

  get name(): string {
    return (
      this.store.getObjects(DataFactory.namedNode(this.iri), CLASS_NAME, null)[0]?.value ||
      this.store.getObjects(DataFactory.namedNode(this.iri), RDFS.label, null)[0]?.value ||
      this.iri
    )
  }

  get properties(): PropertyOptions[] {
    return [
      ...this.store
        .getSubjects(RDFS.domain, DataFactory.namedNode(this.iri), null)
        .map((iri) => new SemanticPropertyOptions(this.store, iri.value, false)),
      ...this.store
        .getSubjects(RDFS.range, DataFactory.namedNode(this.iri), null)
        .map((iri) => new SemanticPropertyOptions(this.store, iri.value, true)),
    ]
  }
}

export class SemanticModelOptions implements ModelOptions {
  constructor(private store: Store) {}

  get classes(): ClassOptions[] {
    return this.store
      .getSubjects(RDF.type, CLASS_TYPE, null)
      .map((iri) => new SemanticClassOptions(this.store, iri.value))
  }
}
