import { RDF, RDFS } from '@inrupt/vocab-common-rdf'
import { DataFactory, NamedNode, Store } from 'n3'
import { ClassOptions, MapperOptions, ModelOptions, Multiplicity, PropertyOptions } from './model.js'

export const CLASS_TYPE: NamedNode = DataFactory.namedNode('agrzes:yellow-next:dynamic:Class')
export const CLASS_NAME: NamedNode = DataFactory.namedNode('agrzes:yellow-next:dynamic:Class:name')
export const CLASS_ID_PATTERN: NamedNode = DataFactory.namedNode('agrzes:yellow-next:dynamic:Class:id_pattern')
export const PROPERTY_NAME: NamedNode = DataFactory.namedNode('agrzes:yellow-next:dynamic:Property:name')
export const PROPERTY_PREDICATE: NamedNode = DataFactory.namedNode('agrzes:yellow-next:dynamic:Property:predicate')
export const PROPERTY_MULTIPLICITY: NamedNode = DataFactory.namedNode(
  'agrzes:yellow-next:dynamic:Property:multiplicity'
)
export const PROPERTY_REVERSE_NAME: NamedNode = DataFactory.namedNode(
  'agrzes:yellow-next:dynamic:Property:reverse_name'
)

export const ROOT_PREDICATE: NamedNode = DataFactory.namedNode('agrzes:yellow-next:dynamic:root')

function lookupClassName(store: Store, iri: string): string {
  return (
    store.getObjects(DataFactory.namedNode(iri), CLASS_NAME, null)[0]?.value ||
    store.getObjects(DataFactory.namedNode(iri), RDFS.label, null)[0]?.value ||
    iri
  )
}

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
  get type(): string {
    if (this.reverse) {
      return lookupClassName(
        this.store,
        this.store.getObjects(DataFactory.namedNode(this.iri), RDFS.domain, null)[0]?.value
      )
    } else {
      return lookupClassName(
        this.store,
        this.store.getObjects(DataFactory.namedNode(this.iri), RDFS.range, null)[0]?.value
      )
    }
  }
  get predicate(): string {
    return this.store.getObjects(DataFactory.namedNode(this.iri), PROPERTY_PREDICATE, null)[0]?.value || this.iri
  }
  get multiplicity(): Multiplicity {
    return (
      (this.store.getObjects(DataFactory.namedNode(this.iri), PROPERTY_MULTIPLICITY, null)[0]?.value as Multiplicity) ||
      'any'
    )
  }
}

export class SemanticClassOptions implements ClassOptions {
  constructor(
    private store: Store,
    public iri: string
  ) {}

  get name(): string {
    return lookupClassName(this.store, this.iri)
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

  get idPattern(): string {
    return this.store.getObjects(DataFactory.namedNode(this.iri), CLASS_ID_PATTERN, null)[0]?.value
  }
}

export class SemanticModelOptions implements ModelOptions {
  constructor(protected store: Store) {}

  get classes(): ClassOptions[] {
    return this.store
      .getSubjects(RDF.type, CLASS_TYPE, null)
      .map((iri) => new SemanticClassOptions(this.store, iri.value))
  }
}

export class SemanticMapperOptions extends SemanticModelOptions implements MapperOptions {
  constructor(store: Store) {
    super(store)
  }
  get roots(): Record<string, string> {
    return Object.fromEntries(
      this.store
        .getQuads(null, ROOT_PREDICATE, null, null)
        .map((quad) => [quad.object.value, lookupClassName(this.store, quad.subject.value)])
    )
  }
}