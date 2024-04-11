import { expect } from 'chai'
import { readFile } from 'fs/promises'
import jsonld from 'jsonld'
import 'mocha'
import { Quad, Store } from 'n3'
import { Model } from '../../../src/dynamic/access/index.js'
import { ModelOptions } from '../../../src/dynamic/model.js'

const modelOptions: ModelOptions = {
  classes: [
    {
      iri: 'http://agrzes.pl/books#Book',
      name: 'Book',
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
          multiplicity: 'single',
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
          multiplicity: 'multiple',
          orderBy: 'released',
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
          multiplicity: 'multiple',
        },
      ],
    },
  ],
}

const store = new Store(
  (await jsonld.toRDF(JSON.parse(await readFile('test/dynamic/access/books.jsonld', 'utf-8')))) as Quad[]
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
        expect(books[1].author[0].name).to.equal('A1')
      })
      it('should navigate back to book', () => {
        const model = new Model(store, modelOptions)
        const books = model.all('Book')
        expect(books[0].author.books[1].title).to.equal('B1')
      })
      it('should navigate to series', () => {
        const model = new Model(store, modelOptions)
        const books = model.all('Book')
        expect(books[0].series.name).to.equal('S1')
      })
      it('should navigate back to book', () => {
        const model = new Model(store, modelOptions)
        const books = model.all('Book')
        expect(books[0].series.books[0].title).to.equal('B1')
      })
      it('should fail on missing class', () => {
        const model = new Model(store, modelOptions)
        expect(() => model.all('Bookz')).to.throw()
      })
      it('should expose iri', () => {
        const model = new Model(store, modelOptions)
        const books = model.all('Book')
        expect(books[0].iri).to.equal('http://agrzes.pl/books#B1')
      })
    })
  })
})
