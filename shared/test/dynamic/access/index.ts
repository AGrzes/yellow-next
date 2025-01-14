import chai from 'chai'
import chaiSubset from 'chai-subset'
import { readFile } from 'fs/promises'
import jsonld from 'jsonld'
import 'mocha'
import { Quad, Store } from 'n3'
import { Model } from '../../../src/dynamic/access/index.js'
import { ClassOptions, ModelOptions } from '../../../src/dynamic/model.js'
const { expect } = chai.use(chaiSubset)
const Book: ClassOptions = {
  iri: 'http://agrzes.pl/books#Book',
  name: 'Book',
  properties: [
    {
      iri: 'http://agrzes.pl/books#Book/pages',
      predicate: 'http://agrzes.pl/books#Book/pages',
      name: 'pages',
    },
    {
      iri: 'http://agrzes.pl/books#Book/price',
      predicate: 'http://agrzes.pl/books#Book/price',
      name: 'price',
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
}
const modelOptions: ModelOptions = {
  classes: [
    Book,
    {
      name: 'Hardcover',
      iri: 'http://agrzes.pl/books#Hardcover',
      properties: [],
      bases: [Book],
      ancestors: [Book],
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
          reverseMultiplicity: 'multiple',
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
          reverseMultiplicity: 'multiple',
        },
      ],
    },
  ],
}

const store = new Store(
  (await jsonld.toRDF(JSON.parse(await readFile('test/dynamic/access/books.jsonld', 'utf-8')))) as Quad[]
)
describe('dynamic', () => {
  describe('access', () => {
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
      it('should expose list of instance classes', () => {
        const model = new Model(store, modelOptions)
        const books = model.all('Book')
        expect(books[0].classes).to.have.lengthOf(1)
        expect(books[0].classes).to.containSubset([{ name: 'Book' }])
      })
      it('should expose list of model classes', () => {
        const model = new Model(store, modelOptions)
        expect(model.classes).to.have.lengthOf(4)
        expect(model.classes).to.containSubset([{ name: 'Book' }, { name: 'Author' }, { name: 'Series' }])
      })
      it('should expose list of entity classes based on ancestors', () => {
        const model = new Model(store, modelOptions)
        const hardcover = model.get('Hardcover', 'http://agrzes.pl/books#H1')
        expect(hardcover.classes).to.have.lengthOf(2)
        expect(hardcover.classes).to.containSubset([{ name: 'Book' }, { name: 'Hardcover' }])
      })

      it('should get by iri', () => {
        const model = new Model(store, modelOptions)
        const book = model.get('Book', 'http://agrzes.pl/books#B1')
        expect(book.title).to.equal('B1')
      })
      it('should handle empty property gracefully', () => {
        const model = new Model(store, modelOptions)
        const book = model.get('Hardcover', 'http://agrzes.pl/books#H1')
        expect(book.title).to.be.undefined
      })
      it('should return integer as number', () => {
        const model = new Model(store, modelOptions)
        const book = model.get('Book', 'http://agrzes.pl/books#B1')
        expect(book.pages).to.equal(1)
      })
      it('should return float as number', () => {
        const model = new Model(store, modelOptions)
        const book = model.get('Book', 'http://agrzes.pl/books#B1')
        expect(book.price).to.equal(1.23)
      })
    })
  })
})
