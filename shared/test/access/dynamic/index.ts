import { expect } from 'chai'
import { readFile } from 'fs/promises'
import jsonld from 'jsonld'
import 'mocha'
import { Quad, Store } from 'n3'
import { Model } from '../../../src/access/dynamic/index.js'
import { ModelOptions } from '../../../src/access/dynamic/model.js'

const modelOptions: ModelOptions = {
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
}

const store = new Store(
  (await jsonld.toRDF(JSON.parse(await readFile('test/access/dynamic/books.jsonld', 'utf-8')))) as Quad[]
)
describe('access', () => {
  describe('dynamic', () => {
    describe('Model', () => {
      it('should list all books', () => {
        const model = new Model(store, modelOptions)
        const books = model.all('Book')
        expect(books).to.have.lengthOf(2)
        expect(books[0].title).to.equal('B1')
        expect(books[1].title).to.equal('B2')
      })
      it('should navigate to author', () => {
        const model = new Model(store, modelOptions)
        const books = model.all('Book')
        expect(books[0].author.name).to.equal('A1')
      })
      it('should navigate back book', () => {
        const model = new Model(store, modelOptions)
        const books = model.all('Book')
        expect(books[0].author.books[0].title).to.equal('B1')
      })
      it('should fail on missing class', () => {
        const model = new Model(store, modelOptions)
        expect(() => model.all('Bookz')).to.throw()
      })
    })
  })
})