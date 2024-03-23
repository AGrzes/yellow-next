import chai from 'chai'
import chaiSubset from 'chai-subset'
import 'mocha'
import { mapper } from '../../../src/mapper/dynamic/index.js'
import { MapperOptions } from '../../../src/mapper/dynamic/model.js'
const { expect } = chai.use(chaiSubset)

const options: MapperOptions = {
  classes: [
    {
      iri: 'http://agrzes.pl/books#Book',
      name: 'Book',
      properties: [
        {
          iri: 'http://agrzes.pl/books#Book/pages',
          name: 'pages',
        },
        {
          iri: 'http://agrzes.pl/books#Book/released',
          name: 'released',
        },
        {
          iri: 'http://www.w3.org/2000/01/rdf-schema#label',
          name: 'title',
        },
        {
          iri: 'http://agrzes.pl/books#Book/author',
          name: 'author',
        },
        {
          iri: 'http://agrzes.pl/books#Book/series',
          name: 'series',
        },
      ],
    },
    {
      name: 'Author',
      iri: 'http://agrzes.pl/books#Author',
      properties: [
        {
          iri: 'http://www.w3.org/2000/01/rdf-schema#label',
          name: 'name',
        },
        {
          name: 'books',
          iri: 'http://agrzes.pl/books#Book/author',
          reverse: true,
        },
      ],
    },
    {
      name: 'Series',
      iri: 'http://agrzes.pl/books#Series',
      properties: [
        {
          iri: 'http://www.w3.org/2000/01/rdf-schema#label',
          name: 'name',
        },
        {
          name: 'books',
          iri: 'http://agrzes.pl/books#Book/series',
          reverse: true,
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
    })
  })
})
