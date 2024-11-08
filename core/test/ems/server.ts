import chai from 'chai'
import { Router } from 'express'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { EmsHandler } from '../../src/ems/server'
import { EmsService } from '../../src/ems/service'

const { expect } = chai.use(sinonChai)

function createRouter() {
  return {
    get: sinon.stub(),
    put: sinon.stub(),
    post: sinon.stub(),
  }
}

const error = new Error('error')

describe('ems', () => {
  describe('EmsHandler', () => {
    let service: sinon.SinonStubbedInstance<EmsService>

    beforeEach(() => {
      service = sinon.createStubInstance(EmsService)
    })

    it('should create a handler', async () => {
      const router = createRouter()
      const handler = new EmsHandler(router as unknown as Router, service)
      expect(handler).to.be.instanceOf(EmsHandler)
      expect(router.get).to.have.been.calledOnceWith('/:kind/:iri', sinon.match.func)
      expect(router.put).to.have.been.calledOnceWith('/:kind/:iri', sinon.match.func, sinon.match.func)
      expect(router.post).to.have.been.calledOnceWith('/:kind', sinon.match.func, sinon.match.func)
    })

    describe('get /:kind/:iri', () => {
      it('should get kind and iri', async () => {
        const router = createRouter()
        new EmsHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { kind: 'testKind', iri: 'testIri' } }
        service.get.resolves({ kind: 'testKind', iri: 'testIri' })
        await router.get.getCall(0).args[1](req, res)
        expect(res.send).to.have.been.calledOnceWith({ kind: 'testKind', iri: 'testIri' })
        expect(res.status).to.not.have.been.called
      })

      it('should handle error', async () => {
        const router = createRouter()
        new EmsHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { kind: 'testKind', iri: 'testIri' } }
        service.get.rejects(error)
        await router.get.getCall(0).args[1](req, res)
        expect(res.send).to.have.been.calledWith(error)
        expect(res.status).to.have.been.calledOnceWith(500)
      })
    })

    describe('put /:kind/:iri', () => {
      it('should update kind and iri', async () => {
        const router = createRouter()
        new EmsHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { kind: 'testKind', iri: 'testIri' }, body: { data: 'testData' } }
        service.put.resolves({ data: 'testData', kind: 'testKind', iri: 'testIri' })
        await router.put.getCall(0).args[2](req, res)
        expect(res.send).to.have.been.calledOnceWith({ data: 'testData', kind: 'testKind', iri: 'testIri' })
        expect(res.status).to.not.have.been.called
      })

      it('should handle error', async () => {
        const router = createRouter()
        new EmsHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { kind: 'testKind', iri: 'testIri' }, body: { data: 'testData' } }
        service.put.rejects(error)
        await router.put.getCall(0).args[2](req, res)
        expect(res.send).to.have.been.calledWith(error)
        expect(res.status).to.have.been.calledOnceWith(500)
      })
    })

    describe('post /:kind', () => {
      it('should create kind with uuid', async () => {
        const router = createRouter()
        new EmsHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { kind: 'testKind' }, body: { data: 'testData' } }
        service.post.resolves({ data: 'testData', kind: 'testKind', iri: 'uuid:testUuid' })
        await router.post.getCall(0).args[2](req, res)
        expect(res.send).to.have.been.calledOnceWith(
          sinon.match({ data: 'testData', kind: 'testKind', iri: 'uuid:testUuid' })
        )
        expect(res.status).to.not.have.been.called
      })

      it('should handle error', async () => {
        const router = createRouter()
        new EmsHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { kind: 'testKind' }, body: { data: 'testData' } }
        service.post.rejects(error)
        await router.post.getCall(0).args[2](req, res)
        expect(res.send).to.have.been.calledWith(error)
        expect(res.status).to.have.been.calledOnceWith(500)
      })
    })
  })
})
