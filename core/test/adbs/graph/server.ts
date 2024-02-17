import 'mocha'

import chai from 'chai'

import { Router } from 'express'
import { DataFactory } from 'n3'
import { of } from 'rxjs'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { GraphHandler } from '../../../src/adbs/graph/server.js'

const { expect } = chai.use(sinonChai)

describe('adbs', () => {
  describe('graph', () => {
    describe('GraphHandler', () => {
      it('should create a handler', async () => {
        const router = {
          get: sinon.stub(),
        }
        const handler = new GraphHandler(of(), router as unknown as Router)
        expect(handler).to.be.instanceOf(GraphHandler)
        expect(router.get).to.have.been.calledTwice
        expect(router.get.getCall(0)).to.have.been.calledWith('/', sinon.match.func)
        expect(router.get.getCall(1)).to.have.been.calledWith('/:graph', sinon.match.func)
      })
      describe('get /', () => {
        it('should get all graphs', async () => {
          const store = {
            getQuads: sinon
              .stub()
              .returns([
                DataFactory.quad(DataFactory.namedNode('s'), DataFactory.namedNode('p'), DataFactory.namedNode('o')),
              ]),
          }
          const router = {
            get: sinon.stub(),
          }
          new GraphHandler(of(store as any), router as unknown as Router)
          const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
          }
          const req = {}
          await router.get.getCall(0).args[1](req, res)
          expect(store.getQuads).to.have.been.calledOnceWith(null, null, null, null)
          expect(res.send).to.have.been.calledOnceWith([{ '@id': 's', p: [{ '@id': 'o' }] }])
          expect(res.status).to.not.have.been.called
        })
        it('should handle error', async () => {
          const error = new Error('error')
          const store = {
            getQuads: sinon.stub().throws(error),
          }
          const router = {
            get: sinon.stub(),
          }
          new GraphHandler(of(store as any), router as unknown as Router)
          const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
          }
          const req = {}
          await router.get.getCall(0).args[1](req, res)
          expect(store.getQuads).to.have.been.calledOnceWith(null, null, null, null)
          expect(res.send).to.have.been.calledOnceWith(error)
          expect(res.status).to.have.been.calledOnceWith(500)
        })
      })
      describe('get /:graph', () => {
        it('should get a graph', async () => {
          const store = {
            getQuads: sinon
              .stub()
              .returns([
                DataFactory.quad(DataFactory.namedNode('s'), DataFactory.namedNode('p'), DataFactory.namedNode('o')),
              ]),
          }
          const router = {
            get: sinon.stub(),
          }
          new GraphHandler(of(store as any), router as unknown as Router)
          const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
          }
          const req = { params: { graph: 'graph' } }
          await router.get.getCall(1).args[1](req, res)
          expect(store.getQuads).to.have.been.calledOnceWith(null, null, null, DataFactory.namedNode('graph'))
          expect(res.send).to.have.been.calledOnceWith([{ '@id': 's', p: [{ '@id': 'o' }] }])
          expect(res.status).to.not.have.been.called
        })
        it('should handle error', async () => {
          const error = new Error('error')
          const store = {
            getQuads: sinon.stub().throws(error),
          }
          const router = {
            get: sinon.stub(),
          }
          new GraphHandler(of(store as any), router as unknown as Router)
          const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
          }
          const req = { params: { graph: 'graph' } }
          await router.get.getCall(1).args[1](req, res)
          expect(store.getQuads).to.have.been.calledOnceWith(null, null, null, DataFactory.namedNode('graph'))
          expect(res.send).to.have.been.calledOnceWith(error)
          expect(res.status).to.have.been.calledOnceWith(500)
        })
      })
    })
  })
})
