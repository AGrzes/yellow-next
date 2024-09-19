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

  })
})
