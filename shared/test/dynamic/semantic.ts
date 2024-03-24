import { RDF } from '@inrupt/vocab-common-rdf'
import { expect } from 'chai'
import 'mocha'
import { DataFactory, Quad, Store } from 'n3'
import {
  CLASS_NAME,
  CLASS_TYPE,
  PROPERTY_NAME,
  PROPERTY_REVERSE_NAME,
  ROOT_PREDICATE,
  SemanticClassOptions,
  SemanticMapperOptions,
  SemanticModelOptions,
  SemanticPropertyOptions,
} from '../../src/dynamic/semantic.js'

const BOOK = DataFactory.namedNode('http://agrzes.pl/books#Book')
const BOOK_TITLE = DataFactory.namedNode('http://agrzes.pl/books#Book:title')

describe('access', () => {
  describe('dynamic', () => {
    describe('semantic', () => {
      describe('SemanticModelOptions', () => {
        it('should create classes from store', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK, DataFactory.namedNode(RDF.type), CLASS_TYPE)
          const modelOptions = new SemanticModelOptions(store)
          expect(modelOptions.classes).to.have.length(1)
          expect(modelOptions.classes[0].iri).to.equal('http://agrzes.pl/books#Book')
        })
      })
      describe('SemanticClassOptions', () => {
        it('should return class name', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK, CLASS_NAME, DataFactory.literal('Book'))
          const classOptions = new SemanticClassOptions(store, BOOK.value)
          expect(classOptions).to.have.property('name', 'Book')
        })
        it('should return class name based on label', () => {
          const store = new Store<Quad>()
          store.addQuad(
            BOOK,
            DataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
            DataFactory.literal('Book')
          )
          const classOptions = new SemanticClassOptions(store, BOOK.value)
          expect(classOptions).to.have.property('name', 'Book')
        })
        it('should use iri as class name if no name or label is present', () => {
          const store = new Store<Quad>()
          const classOptions = new SemanticClassOptions(store, BOOK.value)
          expect(classOptions).to.have.property('name', 'http://agrzes.pl/books#Book')
        })
        it('should return properties', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, DataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), BOOK)
          const classOptions = new SemanticClassOptions(store, BOOK.value)
          expect(classOptions.properties).to.have.length(1)
          expect(classOptions.properties[0].iri).to.equal(BOOK_TITLE.value)
        })
        it('should return reverse properties', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, DataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#range'), BOOK)
          const classOptions = new SemanticClassOptions(store, BOOK.value)
          expect(classOptions.properties).to.have.length(1)
          expect(classOptions.properties[0].iri).to.equal(BOOK_TITLE.value)
          expect(classOptions.properties[0].reverse).to.be.true
        })
      })
      describe('SemanticPropertyOptions', () => {
        it('should return property name', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, PROPERTY_NAME, DataFactory.literal('title'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('name', 'title')
        })
        it('should return property name based on label', () => {
          const store = new Store<Quad>()
          store.addQuad(
            BOOK_TITLE,
            DataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
            DataFactory.literal('title')
          )
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('name', 'title')
        })
        it('should use iri as property name if no name or label is present', () => {
          const store = new Store<Quad>()
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('name', 'http://agrzes.pl/books#Book:title')
        })
        it('should return reverse property name', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, PROPERTY_REVERSE_NAME, DataFactory.literal('title'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, true)
          expect(propertyOptions).to.have.property('name', 'title')
        })
        it('should return reverse property name if not defined directly', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, PROPERTY_NAME, DataFactory.literal('title'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, true)
          expect(propertyOptions).to.have.property('name', '^title')
        })
      })
      describe('SemanticMapperOptions', () => {
        it('should list roots', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK, ROOT_PREDICATE, DataFactory.literal('books'))
          store.addQuad(BOOK, CLASS_NAME, DataFactory.literal('Book'))
          const modelOptions = new SemanticMapperOptions(store)
          expect(modelOptions.roots).to.have.property('books', 'Book')
        })
      })
    })
  })
})
