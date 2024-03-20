import { BlankNode, DataFactory, NamedNode, Store, Term } from 'n3'
import { ModelOptions, TypedNode } from './model.js'

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
        const propertyOptions = target.classes.flatMap((c) => c.properties).find((p) => p.name === property)
        if (propertyOptions) {
          const values = propertyOptions.reverse
            ? this.store
                .getSubjects(DataFactory.namedNode(propertyOptions.iri), target.iri, null)
                .map((iri: NamedNode | BlankNode) => this.proxy(iri))
            : this.store
                .getObjects(target.iri, DataFactory.namedNode(propertyOptions.iri), null)
                .map((iri: NamedNode | BlankNode) => this.proxy(iri))
          if (values.length === 1) {
            return values[0]
          } else {
            return values
          }
        }
      },
    }
  }

  private proxy(iri: Term): any {
    if (iri.termType === 'Literal') {
      return iri.value
    } else {
      const classes = this.store
        .getObjects(iri, DataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), null)
        .map((iri: NamedNode | BlankNode) => this.options.classes.find((c) => c.iri === iri.value))
        .filter((c) => c)
      return new Proxy({ iri, classes }, this.handler)
    }
  }

  all(name: string) {
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
}
