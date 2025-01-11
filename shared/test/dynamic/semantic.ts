import { RDF, RDFS } from '@inrupt/vocab-common-rdf'
import { expect } from 'chai'
import 'mocha'
import { DataFactory, Quad, Store } from 'n3'
import {
  CLASS_DEFAULT_PROPERTY,
  CLASS_ID_PATTERN,
  CLASS_INTERNAL,
  CLASS_NAME,
  CLASS_TYPE,
  PROPERTY_INDEX,
  PROPERTY_MULTIPLICITY,
  PROPERTY_NAME,
  PROPERTY_ORDER_BY,
  PROPERTY_PATTERN,
  PROPERTY_PREDICATE,
  PROPERTY_REVERSE_MULTIPLICITY,
  PROPERTY_REVERSE_NAME,
  ROOT_PREDICATE,
  SemanticClassOptions,
  SemanticMapperOptions,
  SemanticModelOptions,
  SemanticPropertyOptions,
} from '../../src/dynamic/semantic.js'

const BOOK = DataFactory.namedNode('http://agrzes.pl/books#Book')
const HARDCOVER = DataFactory.namedNode('http://agrzes.pl/books#Hardcover')
const CLOTH_HARDCOVER = DataFactory.namedNode('http://agrzes.pl/books#ClothHardcover')
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
        it('should return id pattern', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK, CLASS_ID_PATTERN, DataFactory.literal('idPattern'))
          const classOptions = new SemanticClassOptions(store, BOOK.value)
          expect(classOptions).to.have.property('idPattern', 'idPattern')
        })
        it('should return default property', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK, CLASS_DEFAULT_PROPERTY, DataFactory.literal('title'))
          const classOptions = new SemanticClassOptions(store, BOOK.value)
          expect(classOptions).to.have.property('defaultProperty', 'title')
        })
        it('should return internal', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK, CLASS_INTERNAL, DataFactory.literal('true'))
          const classOptions = new SemanticClassOptions(store, BOOK.value)
          expect(classOptions).to.have.property('internal', true)
        })
        it('should return bases', () => {
          const store = new Store<Quad>()
          store.addQuad(HARDCOVER, DataFactory.namedNode(RDFS.subClassOf), BOOK)
          store.addQuad(HARDCOVER, CLASS_NAME, DataFactory.literal('Hardcover'))
          const classOptions = new SemanticClassOptions(store, HARDCOVER.value)
          expect(classOptions.bases).to.have.length(1)
          expect(classOptions.bases[0].iri).to.equal(BOOK.value)
        })
        it('should return ancestors', () => {
          const store = new Store<Quad>()
          store.addQuad(HARDCOVER, DataFactory.namedNode(RDFS.subClassOf), BOOK)
          store.addQuad(CLOTH_HARDCOVER, DataFactory.namedNode(RDFS.subClassOf), HARDCOVER)
          store.addQuad(CLOTH_HARDCOVER, CLASS_NAME, DataFactory.literal('ClothHardcover'))
          const classOptions = new SemanticClassOptions(store, CLOTH_HARDCOVER.value)
          expect(classOptions.ancestors).to.have.length(2)
          expect(classOptions.ancestors[0].iri).to.equal(HARDCOVER.value)
          expect(classOptions.ancestors[1].iri).to.equal(BOOK.value)
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
        it('should return predicate', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, PROPERTY_PREDICATE, DataFactory.namedNode(RDFS.label))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('predicate', RDFS.label)
        })
        it('should return iri as predicate if not defined', () => {
          const store = new Store<Quad>()
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('predicate', BOOK_TITLE.value)
        })
        it('should return type', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, DataFactory.namedNode(RDFS.range), BOOK)
          store.addQuad(BOOK, CLASS_NAME, DataFactory.literal('Book'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('type', 'Book')
        })
        it('should return type for reverse property', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, DataFactory.namedNode(RDFS.domain), BOOK)
          store.addQuad(BOOK, CLASS_NAME, DataFactory.literal('Book'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, true)
          expect(propertyOptions).to.have.property('type', 'Book')
        })
        it('should return multiplicity', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, PROPERTY_MULTIPLICITY, DataFactory.literal('single'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('multiplicity', 'single')
        })
        it('should return any multiplicity if not defined', () => {
          const store = new Store<Quad>()
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('multiplicity', 'any')
        })
        it('should return reverse multiplicity', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, PROPERTY_REVERSE_MULTIPLICITY, DataFactory.literal('single'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, true)
          expect(propertyOptions).to.have.property('reverseMultiplicity', 'single')
        })
        it('should return any reverse multiplicity if not defined', () => {
          const store = new Store<Quad>()
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, true)
          expect(propertyOptions).to.have.property('reverseMultiplicity', 'any')
        })
        it('should return order by', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, PROPERTY_ORDER_BY, DataFactory.literal('title'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('orderBy', 'title')
        })
        it('should return pattern', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, PROPERTY_PATTERN, DataFactory.literal('pattern'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('pattern', 'pattern')
        })
        it('should return index', () => {
          const store = new Store<Quad>()
          store.addQuad(BOOK_TITLE, PROPERTY_INDEX, DataFactory.literal('true'))
          const propertyOptions = new SemanticPropertyOptions(store, BOOK_TITLE.value, false)
          expect(propertyOptions).to.have.property('index', true)
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
