import 'mocha'

import chai from 'chai'
import { DataFactory } from 'n3'
import { firstValueFrom, of } from 'rxjs'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {
  AsyncFunctionMapping,
  DocumentGraphMapper,
  FunctionMapping,
  JSONLDMapping,
} from '../../../src/adbs/graph/mapper.js'
const { expect } = chai.use(sinonChai)
describe('adbs', () => {
  describe('graph', () => {
    describe('mapper', () => {
      describe('FunctionMapping', () => {
        it('should map', async () => {
          const objectToJsonLd = sinon.spy(() => ({ '@id': 'urn:id', '@type': 'urn:type' }))
          const mapper = FunctionMapping(objectToJsonLd)
          const document = {}
          const triples = await mapper(document)
          expect(objectToJsonLd).to.have.been.calledWith(document)
          expect(triples).to.have.length(1)
          expect(triples[0])
            .to.property('subject')
            .that.satisfies((subject) => DataFactory.namedNode('urn:id').equals(subject))
          expect(triples[0])
            .to.property('predicate')
            .that.satisfies((predicate) =>
              DataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type').equals(predicate)
            )
          expect(triples[0])
            .to.property('object')
            .that.satisfies((object) => DataFactory.namedNode('urn:type').equals(object))
        })
        it('should produce unique blank nodes', async () => {
          const objectToJsonLd = () => ({ '@id': '_:id', '@type': 'urn:type' })
          const mapper = FunctionMapping(objectToJsonLd)
          const document = {}
          const triples = await mapper(document)
          const triples2 = await mapper(document)
          expect(triples[0].subject).not.to.satisfy((subject) => triples2[0].subject.equals(subject))
        })
      })

      describe('AsyncFunctionMapping', () => {
        it('should map', async () => {
          const objectToJsonLd = sinon.spy(async () => ({ '@id': 'urn:id', '@type': 'urn:type' }))
          const mapper = AsyncFunctionMapping(objectToJsonLd)
          const document = {}
          const triples = await mapper(document)
          expect(objectToJsonLd).to.have.been.calledWith(document)
          expect(triples).to.have.length(1)
          expect(triples[0])
            .to.property('subject')
            .that.satisfies((subject) => DataFactory.namedNode('urn:id').equals(subject))
          expect(triples[0])
            .to.property('predicate')
            .that.satisfies((predicate) =>
              DataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type').equals(predicate)
            )
          expect(triples[0])
            .to.property('object')
            .that.satisfies((object) => DataFactory.namedNode('urn:type').equals(object))
        })
      })

      describe('JSONLDMapping', () => {
        it('should map root', async () => {
          const path = ''
          const mapper = JSONLDMapping(path)
          const document = { '@id': 'urn:id', '@type': 'urn:type' }
          const triples = await mapper(document)
          expect(triples).to.have.length(1)
          expect(triples[0])
            .to.property('subject')
            .that.satisfies((subject) => DataFactory.namedNode('urn:id').equals(subject))
          expect(triples[0])
            .to.property('predicate')
            .that.satisfies((predicate) =>
              DataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type').equals(predicate)
            )
          expect(triples[0])
            .to.property('object')
            .that.satisfies((object) => DataFactory.namedNode('urn:type').equals(object))
        })
        it('should map nested', async () => {
          const path = 'path'
          const mapper = JSONLDMapping(path)
          const document = { path: { '@id': 'urn:id', '@type': 'urn:type' } }
          const triples = await mapper(document)
          expect(triples).to.have.length(1)
          expect(triples[0])
            .to.property('subject')
            .that.satisfies((subject) => DataFactory.namedNode('urn:id').equals(subject))
          expect(triples[0])
            .to.property('predicate')
            .that.satisfies((predicate) =>
              DataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type').equals(predicate)
            )
          expect(triples[0])
            .to.property('object')
            .that.satisfies((object) => DataFactory.namedNode('urn:type').equals(object))
        })
      })

      describe('DocumentGraphMapper', () => {
        it('should map updates', async () => {
          const triple = DataFactory.triple(
            DataFactory.namedNode('urn:s'),
            DataFactory.namedNode('urn:p'),
            DataFactory.namedNode('urn:o')
          )
          const mapping = sinon.spy(async () => [triple])
          const mapper = new DocumentGraphMapper([mapping])
          const event = {
            key: 'urn:key',
            kind: 'update',
            content: {},
            hint: 'hint',
          }
          const result = await firstValueFrom(of(event).pipe(mapper.map()))
          expect(mapping).to.have.been.calledWith(event.content)
          expect(result).to.deep.equal({
            key: DataFactory.namedNode('urn:key'),
            kind: 'update',
            content: [triple],
            hint: 'hint',
          })
        })
        it('should map deletes', async () => {
          const mapping = sinon.spy(async () => [])
          const mapper = new DocumentGraphMapper([mapping])
          const event = {
            key: 'urn:key',
            kind: 'delete',
          }
          const result = await firstValueFrom(of(event).pipe(mapper.map()))
          expect(mapping).not.to.have.been.called
          expect(result).to.deep.equal({
            key: DataFactory.namedNode('urn:key'),
            kind: 'delete',
          })
        })
        it('should map moves', async () => {
          const mapping = sinon.spy(async () => [])
          const mapper = new DocumentGraphMapper([mapping])
          const event = {
            key: 'urn:key',
            kind: 'move',
            newKey: 'urn:newKey',
          }
          const result = await firstValueFrom(of(event).pipe(mapper.map()))
          expect(mapping).not.to.have.been.called
          expect(result).to.deep.equal({
            key: DataFactory.namedNode('urn:key'),
            kind: 'move',
            newKey: DataFactory.namedNode('urn:newKey'),
          })
        })
        it('should map multiple mappings', async () => {
          const triple = DataFactory.triple(
            DataFactory.namedNode('urn:s'),
            DataFactory.namedNode('urn:p'),
            DataFactory.namedNode('urn:o')
          )
          const mapping = sinon.spy(async () => [triple])
          const mapper = new DocumentGraphMapper([mapping, mapping])
          const event = {
            key: 'urn:key',
            kind: 'update',
            content: {},
            hint: 'hint',
          }
          const result = await firstValueFrom(of(event).pipe(mapper.map()))
          expect(mapping).to.have.been.calledTwice
          expect(result).to.deep.equal({
            key: DataFactory.namedNode('urn:key'),
            kind: 'update',
            content: [triple, triple],
            hint: 'hint',
          })
        })
      })
    })
  })
})
