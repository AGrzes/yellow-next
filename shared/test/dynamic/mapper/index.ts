import chai from 'chai'
import chaiSubset from 'chai-subset'
import 'mocha'
import { mapper } from '../../../src/dynamic/mapper/index.js'
import { ClassOptions, MapperOptions } from '../../../src/dynamic/model.js'
const { expect } = chai.use(chaiSubset)

const Book: ClassOptions = {
  iri: 'http://agrzes.pl/books#Book',
  name: 'Book',
  idPattern: 'http://agrzes.pl/books#Book/{{title}}',
  defaultProperty: 'title',
  ancestors: [],
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
    {
      iri: 'http://agrzes.pl/books#Book/chapters',
      predicate: 'http://agrzes.pl/books#Book/chapters',
      name: 'chapters',
      type: 'Chapter',
    },
    {
      iri: 'http://agrzes.pl/books#Book/generated',
      predicate: 'http://agrzes.pl/books#Book/generated',
      name: 'generated',
      pattern: '{{title}}',
    },
    {
      iri: 'http://agrzes.pl/books#Book/generatedRelation',
      predicate: 'http://agrzes.pl/books#Book/generatedRelation',
      name: 'generatedRelation',
      type: 'Author',
      pattern: '{{author}}',
    },
  ],
}

const options: MapperOptions = {
  classes: [
    Book,
    {
      name: 'Chapter',
      ancestors: [],
      iri: 'http://agrzes.pl/books#Chapter',
      idPattern: 'http://agrzes.pl/books#Book/{{$parent.document.title}}/chapter/{{$index}}',
      defaultProperty: 'title',
      properties: [
        {
          iri: 'http://agrzes.pl/books#Chapter/title',
          predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
          name: 'title',
        },
      ],
    },
    {
      name: 'Author',
      ancestors: [],
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
      ancestors: [],
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
    {
      name: 'Hardcover',
      ancestors: [Book],
      bases: [Book],
      iri: 'http://agrzes.pl/books#Hardcover',
      properties: [
        {
          iri: 'http://agrzes.pl/books#Hardcover/binding',
          predicate: 'http://agrzes.pl/books#Book/binding',
          name: 'binding',
          pattern: 'BINDING',
        },
      ],
    },
  ],
  roots: {
    books: 'Book',
    authors: 'Author',
    series: 'Series',
    hardcovers: 'Hardcover',
  },
}

describe('mapper', () => {
  describe('dynamic', () => {
    describe('mapper', () => {
      it('should add  context', () => {
        const document = {}
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@context': {
            iri: '@id',
            a: '@type',
          },
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
        const document = { books: { x: 'b' } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ x: 'b' }],
        })
      })
      it('should handle array roots', () => {
        const document = { books: [{ x: 'b' }] }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ x: 'b' }],
        })
      })
      it('should assign types to roots', () => {
        const document = { books: { x: 'b' } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ x: 'b', a: ['Book'] }],
        })
      })
      it('should assign types to nested objects', () => {
        const document = { books: { author: { c: 'd' } } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ author: { c: 'd', a: ['Author'] } }],
        })
      })
      it('should assign types to objects in arrays', () => {
        const document = { books: { author: [{ c: 'd' }] } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ author: [{ c: 'd', a: ['Author'] }] }],
        })
      })
      it('should handle straight ids', () => {
        const document = { books: { author: 'a' } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ author: { iri: 'a' } }],
        })
      })
      it('should handle straight ids in arrays', () => {
        const document = { books: { author: ['a'] } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ author: [{ iri: 'a' }] }],
        })
      })
      it('should handle default property', () => {
        const document = { books: 'a' }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ title: 'a' }],
        })
      })
      it('should handle default property for array', () => {
        const document = { books: ['a'] }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ title: 'a' }],
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
          '@graph': [{ iri: 'http://agrzes.pl/books#Book/a', title: 'a' }],
        })
      })
      it('should handle id pattern with context', () => {
        const document = { books: { title: 'a', chapters: [{ title: 'b' }] } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ chapters: [{ iri: 'http://agrzes.pl/books#Book/a/chapter/0', title: 'b' }] }],
        })
      })
      it('should handle generated property', () => {
        const document = { books: { title: 'a' } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ generated: 'a' }],
        })
      })
      it('should handle generated property with type', () => {
        const document = { books: { author: ['a'] } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ generatedRelation: { iri: 'a' } }],
        })
      })
      it('should assign inherited types', () => {
        const document = { hardcovers: {} }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ a: ['Book'] }],
        })
      })
      it('should map inherited properties', () => {
        const document = { hardcovers: { author: { x: 'b' } } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ author: { x: 'b', a: ['Author'] } }],
        })
      })
      it('should handle explicit type', () => {
        const document = { books: { a: 'Hardcover' } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ a: ['Hardcover'], binding: 'BINDING' }],
        })
      })
      it('should handle explicit type array', () => {
        const document = { books: { a: ['Hardcover'] } }
        const mapped = mapper(options)(document)
        expect(mapped).to.containSubset({
          '@graph': [{ a: ['Hardcover'], binding: 'BINDING' }],
        })
      })
    })
  })
})
