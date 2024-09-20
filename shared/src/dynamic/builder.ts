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

class PropertyBuilder {
  constructor(
    private parent: ClassBuilder,
    private options: any
  ) {}

  property(name: string, iri?: string) {
    return this.parent.property(name, iri)
  }

  iri(iri: string) {
    this.options.iri = iri
    return this
  }

  predicate(predicate: string) {
    this.options.predicate = predicate
    return this
  }
}

class ClassBuilder {
  constructor(
    private schema: SchemaBuilder,
    private options: any
  ) {}

  iri(iri: string) {
    this.options.iri = iri
    return this
  }

  idPattern(pattern: string) {
    this.options.idPattern = pattern
    return this
  }

  defaultProperty(name: string) {
    this.options.defaultProperty = name
    return this
  }

  internal(internal = true) {
    this.options.internal = internal
    return this
  }

  extends(name: string) {
    this.options.bases = this.options.bases || []
    this.options.bases.push(name)
    return this
  }

  root(...roots: string[]) {
    this.options.root = this.options.root || []
    this.options.root.push(...roots)
    return this
  }

  property(name: string, iri?: string) {
    this.options.properties = this.options.properties || []
    const property = { name, iri }
    this.options.properties.push(property)
    return new PropertyBuilder(this, property)
  }

  class(name: string, iri?: string) {
    return this.schema.class(name, iri)
  }

  subClass(name: string, iri?: string) {
    return this.schema.class(name, iri).extends(this.options.name)
  }
}

class SchemaBuilder {
  classes: Record<string, any> = {}

  class(name: string, iri?: string) {
    this.classes[name] = { name, iri }
    return new ClassBuilder(this, this.classes[name])
  }

  build() {
    return {
      graph: {
        '@context': context,
        '@graph': Object.values(this.classes).map((c) => ({
          label: c.name,
          '@id': c.iri,
          id_pattern: c.idPattern,
          default_property: c.defaultProperty,
          internal: c.internal,
          subClassOf: c.bases?.map((b) => this.classes[b].iri),
          root: c.root,
          properties: c.properties?.map((p) => ({
            name: p.name,
            '@id': p.iri,
            predicate: p.predicate,
          })),
        })),
      },
    }
  }
}

export function schema() {
  return new SchemaBuilder()
}
