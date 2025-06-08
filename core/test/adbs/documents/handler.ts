import chai from 'chai'
import { Router } from 'express'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { HandlerAggregator } from '../../../src/adbs/documents/handler.js'

const { expect } = chai.use(sinonChai)

describe('adbs', () => {
  describe('documents', () => {
    describe('HandlerAggregator', () => {
      function createRouter() {
        return { use: sinon.stub() }
      }
      const fakeHandler = {
        profile: 'test',
        extensions: ['.txt'],
        contentType: 'text/plain',
        get: sinon.stub().resolves('content'),
        put: sinon.stub().resolves(),
        patch: sinon.stub().resolves(),
      }
      it('should register the route', () => {
        const router = createRouter()
        new HandlerAggregator([fakeHandler], router as unknown as Router)
        expect(router.use).to.have.been.calledOnceWith('{*documentPath}', sinon.match.func)
      })
      it('should handle GET with matching handler', async () => {
        const router = createRouter()
        new HandlerAggregator([fakeHandler], router as unknown as Router)
        const handler = router.use.getCall(0).args[1]
        const req = { method: 'GET', params: { documentPath: ['file.txt'] }, query: { profile: 'test' } }
        const res = { type: sinon.stub(), send: sinon.stub() }
        await handler(req, res, sinon.stub())
        expect(fakeHandler.get).to.have.been.calledOnceWith('file.txt', {})
        expect(res.type).to.have.been.calledOnceWith('text/plain')
        expect(res.send).to.have.been.calledOnceWith('content')
      })
      it('should handle PUT with matching handler', async () => {
        const router = createRouter()
        new HandlerAggregator([fakeHandler], router as unknown as Router)
        const handler = router.use.getCall(0).args[1]
        const req = { method: 'PUT', params: { documentPath: ['file.txt'] }, query: { profile: 'test' }, body: 'abc' }
        const res = { sendStatus: sinon.stub() }
        await handler(req, res, sinon.stub())
        expect(fakeHandler.put).to.have.been.calledOnceWith('file.txt', 'abc', {})
        expect(res.sendStatus).to.have.been.calledOnceWith(204)
      })
      it('should handle PATCH with matching handler', async () => {
        const router = createRouter()
        new HandlerAggregator([fakeHandler], router as unknown as Router)
        const handler = router.use.getCall(0).args[1]
        const req = { method: 'PATCH', params: { documentPath: ['file.txt'] }, query: { profile: 'test' }, body: 'abc' }
        const res = { sendStatus: sinon.stub() }
        await handler(req, res, sinon.stub())
        expect(fakeHandler.patch).to.have.been.calledOnceWith('file.txt', 'abc', {})
        expect(res.sendStatus).to.have.been.calledOnceWith(204)
      })
      it('should call next if no profile', async () => {
        const router = createRouter()
        new HandlerAggregator([fakeHandler], router as unknown as Router)
        const handler = router.use.getCall(0).args[1]
        const req = { method: 'GET', params: { documentPath: ['file.txt'] }, query: {} }
        const next = sinon.stub()
        await handler(req, {}, next)
        expect(next).to.have.been.calledOnce
      })
      it('should call next if no handler matches', async () => {
        const router = createRouter()
        new HandlerAggregator([], router as unknown as Router)
        const handler = router.use.getCall(0).args[1]
        const req = { method: 'GET', params: { documentPath: ['file.txt'] }, query: { profile: 'notfound' } }
        const next = sinon.stub()
        await handler(req, {}, next)
        expect(next).to.have.been.calledOnce
      })
      it('should call next for unsupported method', async () => {
        const router = createRouter()
        new HandlerAggregator([fakeHandler], router as unknown as Router)
        const handler = router.use.getCall(0).args[1]
        const req = { method: 'DELETE', params: { documentPath: ['file.txt'] }, query: { profile: 'test' } }
        const next = sinon.stub()
        await handler(req, {}, next)
        expect(next).to.have.been.calledOnce
      })
    })
  })
})
