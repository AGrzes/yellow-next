import 'mocha'

import chai from 'chai'
import { DataFactory, Quad_Graph, Triple } from 'n3'
import { firstValueFrom, lastValueFrom, take } from 'rxjs'
import sinonChai from 'sinon-chai'
import { GraphStore } from '../../../src/adbs/graph/store.js'
import { MoveEvent, UpdateEvent } from '../../../src/adbs/model.js'

const { expect } = chai.use(sinonChai)
const triple = DataFactory.triple(
  DataFactory.namedNode('urn:s'),
  DataFactory.namedNode('urn:p'),
  DataFactory.namedNode('urn:o')
)
const quad = DataFactory.quad(
  DataFactory.namedNode('urn:s'),
  DataFactory.namedNode('urn:p'),
  DataFactory.namedNode('urn:o'),
  DataFactory.namedNode('urn:graph')
)
describe('adbs', () => {
  describe('graph', () => {
    describe('mapper', () => {
      describe('GraphStore', () => {
        it('should react to updates', async () => {
          const store = new GraphStore()
          store.observer.next!({
            key: DataFactory.namedNode('urn:graph'),
            kind: 'update',
            content: [triple],
            hint: 'add',
          } as UpdateEvent<Triple[], Quad_Graph>)
          const storeValue = await firstValueFrom(store.observableStore)
          expect(storeValue.getQuads(null, null, null, DataFactory.namedNode('urn:graph'))).to.deep.equal([quad])
        })
        it('should react to deletes', async () => {
          const store = new GraphStore()
          const lastValue = lastValueFrom(store.observableStore.pipe(take(2)))
          store.observer.next!({
            key: DataFactory.namedNode('urn:graph'),
            kind: 'update',
            content: [triple],
            hint: 'add',
          } as UpdateEvent<Triple[], Quad_Graph>)
          store.observer.next!({
            key: DataFactory.namedNode('urn:graph'),
            kind: 'delete',
          })
          const storeValue = await lastValue
          expect(storeValue.getQuads(null, null, null, DataFactory.namedNode('urn:graph'))).to.deep.equal([])
        })
        it('should react to moves', async () => {
          const store = new GraphStore()
          store.observer.next!({
            key: DataFactory.namedNode('urn:oldGraph'),
            kind: 'update',
            content: [triple],
            hint: 'add',
          } as UpdateEvent<Triple[], Quad_Graph>)
          store.observer.next!({
            key: DataFactory.namedNode('urn:oldGraph'),
            kind: 'move',
            newKey: DataFactory.namedNode('urn:graph'),
          } as MoveEvent<Triple[], Quad_Graph>)
          const storeValue = await firstValueFrom(store.observableStore)
          expect(storeValue.getQuads(null, null, null, DataFactory.namedNode('urn:oldGraph'))).to.deep.equal([])
          expect(storeValue.getQuads(null, null, null, DataFactory.namedNode('urn:graph'))).to.deep.equal([quad])
        })
        it('should remove old quads on update', async () => {
          const store = new GraphStore()
          store.observer.next!({
            key: DataFactory.namedNode('urn:graph'),
            kind: 'update',
            content: [triple],
            hint: 'add',
          } as UpdateEvent<Triple[], Quad_Graph>)
          store.observer.next!({
            key: DataFactory.namedNode('urn:graph'),
            kind: 'update',
            content: [],
            hint: 'replace',
          } as UpdateEvent<Triple[], Quad_Graph>)
          const storeValue = await firstValueFrom(store.observableStore)
          expect(storeValue.getQuads(null, null, null, DataFactory.namedNode('urn:graph'))).to.deep.equal([])
        })
        it('should provide union store', async () => {
          const store = new GraphStore()
          store.observer.next!({
            key: DataFactory.namedNode('urn:graph'),
            kind: 'update',
            content: [triple],
            hint: 'add',
          } as UpdateEvent<Triple[], Quad_Graph>)
          store.observer.next!({
            key: DataFactory.namedNode('urn:graph2'),
            kind: 'update',
            content: [triple],
            hint: 'add',
          } as UpdateEvent<Triple[], Quad_Graph>)
          const storeValue = await firstValueFrom(store.observableUnion)
          expect(storeValue.getQuads(null, null, null, null)).to.have.length(1)
        })
      })
    })
  })
})
