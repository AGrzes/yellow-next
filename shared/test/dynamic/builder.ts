import { expect } from 'chai'
import 'mocha'
import { schema } from '../../src/dynamic/builder.js'

describe.only('dynamic', () => {
  describe('builder', () => {
    it('should build schema', () => {
      const s = schema()
      const g = s.build()
      expect(g).to.have.property('graph')
    })
    it('should provide context', () => {
      const s = schema()
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@context')
        .containSubset({
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
        })
    })
    it('should define class', () => {
      const s = schema()
      s.class('Book')
      const g = s.build()
      expect(g).to.have.nested.property('graph.@graph.0').containSubset({ label: 'Book' })
    })

    it('should define multiple classes in fluent way', () => {
      const s = schema()
      s.class('Book').class('Author')
      const g = s.build()
      expect(g).to.have.nested.property('graph.@graph.0').containSubset({ label: 'Book' })
      expect(g).to.have.nested.property('graph.@graph.1').containSubset({ label: 'Author' })
    })

    it('should define class with iri', () => {
      const s = schema()
      s.class('Book', 'http://example.com/Book')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0')
        .containSubset({ label: 'Book', '@id': 'http://example.com/Book' })
    })
    it('should define class with iri in fluent way', () => {
      const s = schema()
      s.class('Book').iri('http://example.com/Book')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0')
        .containSubset({ label: 'Book', '@id': 'http://example.com/Book' })
    })
    it('should define class with id pattern', () => {
      const s = schema()
      s.class('Book').idPattern('http://example.com/Book/{{kebab title}}')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0')
        .containSubset({ label: 'Book', id_pattern: 'http://example.com/Book/{{kebab title}}' })
    })

    it('should define class with default property', () => {
      const s = schema()
      s.class('Book').defaultProperty('title')
      const g = s.build()
      expect(g).to.have.nested.property('graph.@graph.0').containSubset({ label: 'Book', default_property: 'title' })
    })

    it('should define internal class', () => {
      const s = schema()
      s.class('Book').internal()
      const g = s.build()
      expect(g).to.have.nested.property('graph.@graph.0').containSubset({ label: 'Book', internal: true })
    })

    it('should define subclass', () => {
      const s = schema()
      s.class('Book', 'http://example.com/Book').class('Hardcover').extends('Book')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.1')
        .containSubset({ label: 'Hardcover', subClassOf: ['http://example.com/Book'] })
    })
    it('should define subclass of class', () => {
      const s = schema()
      s.class('Book', 'http://example.com/Book').subClass('Hardcover')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.1')
        .containSubset({ label: 'Hardcover', subClassOf: ['http://example.com/Book'] })
    })
    it('should define roots', () => {
      const s = schema()
      s.class('Book').root('book')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0')
        .containSubset({ label: 'Book', root: ['book'] })
    })
    it('should define properties', () => {
      const s = schema()
      s.class('Book').property('title')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title' }])
    })
    it('should define properties with iri', () => {
      const s = schema()
      s.class('Book').property('title', undefined, 'http://example.com/Book:title')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title', '@id': 'http://example.com/Book:title' }])
    })
    it('should define properties in fluent way', () => {
      const s = schema()
      s.class('Book').property('title').property('author')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title' }, { name: 'author' }])
    })
    it('define property iri in fluent way', () => {
      const s = schema()
      s.class('Book').property('title').iri('http://example.com/Book:title')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title', '@id': 'http://example.com/Book:title' }])
    })
    it('should define property predicate in fluent way', () => {
      const s = schema()
      s.class('Book').property('title').predicate('http://example.com/Book:title')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title', predicate: 'http://example.com/Book:title' }])
    })
    it('should define property predicate', () => {
      const s = schema()
      s.class('Book').property('title', 'http://example.com/Book:title')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title', predicate: 'http://example.com/Book:title' }])
    })
    it('should define property multiplicity', () => {
      const s = schema()
      s.class('Book').property('title').multiplicity('single')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title', multiplicity: 'single' }])
    })
    it('should define property multiplicity and reverse multiplicity', () => {
      const s = schema()
      s.class('Book').property('title').multiplicity('single', 'single')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title', multiplicity: 'single', reverseMultiplicity: 'single' }])
    })
    it('should define property reverse multiplicity', () => {
      const s = schema()
      s.class('Book').property('title').reverseMultiplicity('single')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title', reverseMultiplicity: 'single' }])
    })
    it('should define property order by', () => {
      const s = schema()
      s.class('Book').property('title').orderBy('title')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title', orderBy: 'title' }])
    })
    it('should define property pattern', () => {
      const s = schema()
      s.class('Book').property('title').pattern('http://example.com/Book/{{kebab title}}')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'title', pattern: 'http://example.com/Book/{{kebab title}}' }])
    })
    it('should define property reverse name', () => {
      const s = schema()
      s.class('Book').property('author').reverse('books')
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'author', reverse_name: 'books' }])
    })
    it('should define one to one relation', () => {
      const s = schema()
      s.class('Book').property('author').oneToOne()
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'author', multiplicity: 'single', reverseMultiplicity: 'single' }])
    })
    it('should define one to many relation', () => {
      const s = schema()
      s.class('Book').property('author').oneToMany()
      const g = s.build()
      expect(g)
        .to.have.nested.property('graph.@graph.0.properties')
        .containSubset([{ name: 'author', multiplicity: 'multiple', reverseMultiplicity: 'single' }])
    })
  })
})
