const context = {
  '@context': {
    yd: 'agrzes:yellow-next:dynamic:',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    label: 'http://www.w3.org/2000/01/rdf-schema#label',
    root: 'agrzes:yellow-next:dynamic:root',
    'rdfs:range': {
      '@type': '@id',
    },
    properties: {
      '@reverse': 'rdfs:domain',
    },
    id_pattern: {
      '@id': 'yd:Class:id_pattern',
    },
    default_property: {
      '@id': 'yd:Class:default_property',
    },
    internal: {
      '@id': 'yd:Class:internal',
    },
    Property: {
      '@id': 'yd:Property',
      '@context': {
        range: {
          '@id': 'rdfs:range',
          '@type': '@id',
        },
        name: 'yd:Property:name',
        reverse_name: 'yd:Property:reverse_name',
        predicate: 'yd:Property:predicate',
        multiplicity: 'yd:Property:multiplicity',
        reverseMultiplicity: 'yd:Property:reverse_multiplicity',
        orderBy: 'yd:Property:order_by',
      },
    },
  },
}

class SchemaBuilder {
  classes: Record<string, any> = {}

  class(name: string, iri?: string) {
    this.classes[name] = { name, iri }
    return this
  }

  build() {
    return {
      graph: {
        '@context': context,
        '@graph': Object.values(this.classes).map((c) => ({ label: c.name, '@id': c.iri })),
      },
    }
  }
}

export function schema() {
  return new SchemaBuilder()
}
