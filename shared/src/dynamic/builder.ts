const context = {
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
  subClassOf: {
    '@id': 'rdfs:subClassOf',
    '@type': '@id',
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
      predicate: {
        '@id': 'yd:Property:predicate',
        '@type': '@id',
      },
      multiplicity: 'yd:Property:multiplicity',
      reverseMultiplicity: 'yd:Property:reverse_multiplicity',
      orderBy: 'yd:Property:order_by',
    },
  },
}

class PropertyBuilder {
  constructor(
    private parent: ClassBuilder,
    private options: any
  ) {}

  property(name: string, predicate?: string, iri?: string) {
    return this.parent.property(name, predicate, iri)
  }

  iri(iri: string) {
    this.options.iri = iri
    return this
  }

  multiplicity(multiplicity: 'single' | 'multiple' | 'any', reverseMultiplicity?: 'single' | 'multiple' | 'any') {
    this.options.multiplicity = multiplicity
    if (reverseMultiplicity) {
      this.options.reverseMultiplicity = reverseMultiplicity
    }
    return this
  }
  reverseMultiplicity(multiplicity: 'single' | 'multiple' | 'any') {
    this.options.reverseMultiplicity = multiplicity
    return this
  }

  oneToOne() {
    return this.multiplicity('single', 'single')
  }

  oneToMany() {
    return this.multiplicity('multiple', 'single')
  }

  manyToOne() {
    return this.multiplicity('single', 'multiple')
  }

  manyToMany() {
    return this.multiplicity('multiple', 'multiple')
  }

  orderBy(orderBy: string) {
    this.options.orderBy = orderBy
    return this
  }

  pattern(pattern: string) {
    this.options.pattern = pattern
    return this
  }

  reverse(reverseName: string) {
    this.options.reverseName = reverseName
    return this
  }

  type(type: string) {
    this.options.type = type
    return this
  }

  target(name: string) {
    this.options.target = name
    return this
  }

  predicate(predicate: string) {
    this.options.predicate = predicate
    return this
  }

  accept(visitor: (builder: PropertyBuilder) => void) {
    visitor(this)
    return this
  }

  class(name: string, iri?: string) {
    return this.parent.class(name, iri)
  }

  subClass(name: string, iri?: string) {
    return this.parent.subClass(name, iri)
  }

  build() {
    return this.parent.build()
  }

  get className() {
    return this.parent.className
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

  property(name: string, predicate?: string, iri?: string) {
    this.options.properties = this.options.properties || []
    const property = { name, predicate, iri }
    this.options.properties.push(property)
    return new PropertyBuilder(this, property)
  }

  accept(visitor: (builder: ClassBuilder) => void) {
    visitor(this)
    return this
  }

  class(name: string, iri?: string) {
    return this.schema.class(name, iri)
  }

  subClass(name: string, iri?: string) {
    return this.schema.class(name, iri).extends(this.options.name)
  }

  build() {
    return this.schema.build()
  }

  get className() {
    return this.options.name
  }
}

class SchemaBuilder {
  classes: Record<string, any> = {}
  prefixes: Record<string, string> = {}

  class(name: string, iri?: string) {
    this.classes[name] = this.classes[name] || { name, iri }
    return new ClassBuilder(this, this.classes[name])
  }

  prefix(name: string, iri: string) {
    this.prefixes[name] = iri
    return this
  }

  model(iri: string) {
    return this.prefix('model', iri)
  }

  build() {
    const resolveClassIri = (c) => (c ? c.iri || `model:${c.name}` : undefined)
    return {
      graph: {
        '@context': { ...context, ...this.prefixes },
        '@graph': Object.values(this.classes).map((c) => ({
          label: c.name,
          '@id': resolveClassIri(c),
          '@type': 'yd:Class',
          id_pattern: c.idPattern,
          default_property: c.defaultProperty,
          internal: c.internal,
          subClassOf: c.bases?.map((b) => resolveClassIri(this.classes[b])),
          root: c.root,
          properties: c.properties?.map((p) => ({
            name: p.name,
            '@id': p.iri || `model:${c.name}:${p.name}`,
            '@type': 'Property',
            predicate: p.predicate,
            multiplicity: p.multiplicity,
            reverseMultiplicity: p.reverseMultiplicity,
            orderBy: p.orderBy,
            pattern: p.pattern,
            reverse_name: p.reverseName,
            range: p.type || resolveClassIri(this.classes[p.target]),
          })),
        })),
      },
    }
  }
}

export type Visitor = (builder: ClassBuilder | PropertyBuilder) => void

export const label =
  (name: string = 'label') =>
  (b: ClassBuilder | PropertyBuilder) =>
    b.property(name, 'rdfs:label')

export const comment =
  (name: string = 'comment') =>
  (b: ClassBuilder | PropertyBuilder) =>
    b.property(name, 'rdfs:comment')

export const hierarchy =
  (child: string = 'parts', parent: string = 'partOf') =>
  (b: ClassBuilder | PropertyBuilder) =>
    b.property(child).reverse(parent).target(b.className).oneToMany()

export const relation =
  (target: string, outboundRelation: string = 'outboundRelation'): Visitor =>
  (b) => {
    const relationClass = `${b.className}${target}Relation`
    b.property(outboundRelation).target(relationClass).oneToMany()
    b.class(relationClass)
  }


export function schema() {
  return new SchemaBuilder()
}
