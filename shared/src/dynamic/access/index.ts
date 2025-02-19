import lodash from 'lodash'
import { BlankNode, DataFactory, NamedNode, Store, Term } from 'n3'
import { ClassOptions, ModelOptions, TypedNode } from '../model.js'
const { sortBy } = lodash

export interface SemanticProxy {
  iri: string
  [x: string]: any
}

export class Model {
  private handler: ProxyHandler<TypedNode>

  constructor(
    private store: Store,
    private options: ModelOptions
  ) {
    this.handler = {
      get: (target, property, receiver) => {
        if (property === 'iri') {
          return target.iri.value
        }
        if (property === 'classes') {
          return target.classes
        }
        const propertyOptions = target.classes.flatMap((c) => c.properties).find((p) => p.name === property)
        if (propertyOptions) {
          const values = propertyOptions.reverse
            ? this.store
                .getSubjects(DataFactory.namedNode(propertyOptions.predicate), target.iri, null)
                .map((iri: NamedNode | BlankNode) => this.proxy(iri))
            : this.store
                .getObjects(target.iri, DataFactory.namedNode(propertyOptions.predicate), null)
                .map((iri: NamedNode | BlankNode) => this.proxy(iri))
          switch (propertyOptions.reverse ? propertyOptions.reverseMultiplicity : propertyOptions.multiplicity) {
            case 'single':
              return values[0]
            case 'multiple':
              if (propertyOptions.orderBy) {
                return sortBy(values, propertyOptions.orderBy)
              }
              return values
            default:
              if (values.length === 1) {
                return values[0]
              } else if (values.length === 0) {
                return undefined
              } else {
                return values
              }
          }
        }
      },
    }
  }

  private proxy(iri: Term): any {
    if (iri.termType === 'Literal') {
      switch (iri.datatype.value) {
        case 'http://www.w3.org/2001/XMLSchema#integer':
          return parseInt(iri.value)
        case 'http://www.w3.org/2001/XMLSchema#decimal':
          return parseFloat(iri.value)
        default:
          return iri.value
      }
    } else {
      const classes = this.store
        .getObjects(iri, DataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), null)
        .map((iri: NamedNode | BlankNode) => this.options.classes.find((c) => c.iri === iri.value))
        .filter((c) => c)
        .flatMap((c) => [c, ...(c.ancestors || [])])
      return new Proxy({ iri, classes }, this.handler)
    }
  }

  all(name: string): SemanticProxy[] {
    const classOptions = this.options.classes.find((c) => c.name === name)

    if (classOptions) {
      return this.store
        .getSubjects(
          DataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          DataFactory.namedNode(classOptions.iri),
          null
        )
        .map((iri: NamedNode | BlankNode) => this.proxy(iri))
    } else {
      throw new Error(`Class ${name} not found`)
    }
  }

  get(className: string, iri: string): SemanticProxy {
    const classOptions = this.options.classes.find((c) => c.name === className)
    if (classOptions) {
      const iriNode = DataFactory.namedNode(iri)
      return this.proxy(iriNode)
    }
  }

  get classes(): ClassOptions[] {
    return this.options.classes
  }
}
