import chai from 'chai'
import chaiSubset from 'chai-subset'
import 'mocha'
import { mapper } from '../../../src/dynamic/mapper/index.js'
import { MapperOptions } from '../../../src/dynamic/model.js'
const { expect } = chai.use(chaiSubset)

const options: MapperOptions = {
  classes: [
    {
      iri: 'http://agrzes.pl/books#Book',
      name: 'Book',
      idPattern: 'http://agrzes.pl/books#Book/{{title}}',
      properties: [
        {
          iri: 'http://agrzes.pl/books#Book/pages',
          predicate: 'http://agrzes.pl/books#Book/pages',
          name: 'pages',
        },
        {
          iri: 'http://agrzes.pl/books#Book/released',
          predicate: 'http://agrzes.pl/books#Book/released',
          name: 'released',
        },
        {
          iri: 'http://agrzes.pl/books#Book/title',
          predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
          name: 'title',
        },
        {
          iri: 'http://agrzes.pl/books#Book/author',
          predicate: 'http://agrzes.pl/books#Book/author',
          name: 'author',
          type: 'Author',
        },
        {
          iri: 'http://agrzes.pl/books#Book/series',
          predicate: 'http://agrzes.pl/books#Book/series',
          name: 'series',
          type: 'Series',
        },
      ],
    },
    {
      name: 'Author',
      iri: 'http://agrzes.pl/books#Author',
      properties: [
        {
          iri: 'http://agrzes.pl/books#Author/name',
          predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
          name: 'name',
        },
        {
          name: 'books',
          iri: 'http://agrzes.pl/books#Book/author',
          predicate: 'http://agrzes.pl/books#Book/author',
          reverse: true,
          type: 'Book',
        },
      ],
    },
    {
      name: 'Series',
      iri: 'http://agrzes.pl/books#Series',
      properties: [
        {
          iri: 'http://agrzes.pl/books#Series/name',
          predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
          name: 'name',
        },
        {
          name: 'books',
          iri: 'http://agrzes.pl/books#Book/series',
          predicate: 'http://agrzes.pl/books#Book/series',
          reverse: true,
          type: 'Book',
        },
      ],
    },
  ],
  roots: {
    books: 'Book',
    authors: 'Author',
    series: 'Series',
  },
}

describe('mapper', () => {
  describe('dynamic', () => {
    describe('mapper', () => {
      it('should add  context', () => {
        const document = {}
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@context': {},
        })
      })
      it('should add type definitions to context', () => {
        const document = {}
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@context': {
            Book: {
              '@id': 'http://agrzes.pl/books#Book',
            },
            Author: {
              '@id': 'http://agrzes.pl/books#Author',
            },
            Series: {
              '@id': 'http://agrzes.pl/books#Series',
            },
          },
        })
      })
      it('should add properties to context', () => {
        const document = {}
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@context': {
            Book: {
              '@context': {
                title: { '@id': 'http://www.w3.org/2000/01/rdf-schema#label' },
              },
            },
          },
        })
      })
      it('should add all properties to context', () => {
        const document = {}
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@context': {
            Book: {
              '@context': {
                title: {},
                pages: {},
                released: {},
                author: {},
                series: {},
              },
            },
          },
        })
      })
      it('should handle reverse properties', () => {
        const document = {}
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@context': {
            Author: {
              '@context': {
                books: { '@reverse': 'http://agrzes.pl/books#Book/author' },
              },
            },
          },
        })
      })
      it('should handle roots', () => {
        const document = { books: { a: 'b' } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ a: 'b' }],
        })
      })
      it('should handle array roots', () => {
        const document = { books: [{ a: 'b' }] }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ a: 'b' }],
        })
      })
      it('should assign types to roots', () => {
        const document = { books: { a: 'b' } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ a: 'b', '@type': 'Book' }],
        })
      })
      it('should assign types to nested objects', () => {
        const document = { books: { author: { c: 'd' } } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ author: { c: 'd', '@type': 'Author' } }],
        })
      })
      it('should assign types to objects in arrays', () => {
        const document = { books: { author: [{ c: 'd' }] } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ author: [{ c: 'd', '@type': 'Author' }] }],
        })
      })
      it('should ignore types for non-objects', () => {
        const document = { books: { author: 'a' } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ author: 'a' }],
        })
      })
      it('should ignore types for non-objects in arrays', () => {
        const document = { books: { author: ['a'] } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ author: ['a'] }],
        })
      })
      it('should thro error on unknown class', () => {
        const document = { books: { author: ['a'] } }
        expect(() => mapper({ roots: { books: 'Book' }, classes: [] })(document)).to.throw('Class Book not found')
      })
      it('should handle id pattern', () => {
        const document = { books: { title: 'a' } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ '@id': 'http://agrzes.pl/books#Book/a', title: 'a' }],
        })
      })
    })
  })
})
