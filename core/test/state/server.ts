import chai from 'chai'
import { Router } from 'express'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { StateHandler } from '../../src/state/server'
import { StateService } from '../../src/state/service'

const { expect } = chai.use(sinonChai)

function createRouter() {
  return {
    get: sinon.stub(),
    put: sinon.stub(),
    post: sinon.stub(),
    delete: sinon.stub(),
  }
}

const error = new Error('error')

describe('state', () => {
  describe('StateHandler', () => {
    let service: sinon.SinonStubbedInstance<StateService>

    beforeEach(() => {
      service = sinon.createStubInstance(StateService)
    })

    it('should create a handler', async () => {
      const router = createRouter()
      const handler = new StateHandler(router as unknown as Router, service)
      expect(handler).to.be.instanceOf(StateHandler)
      expect(router.get).to.have.been.calledTwice
      expect(router.put).to.have.been.calledOnce
      expect(router.post).to.have.been.calledOnce
      expect(router.delete).to.have.been.calledOnce
    })

    describe('get /:model/:entity', () => {
      it('should get all states for entity', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { model: 'testModel', entity: 'testEntity' } }
        service.getAll.resolves([
          { id: '1', state: 'state1' },
          { id: '2', state: 'state2' },
        ])
        await router.get.getCall(0).args[1](req, res)
        expect(res.send).to.have.been.calledOnceWith([
          { id: '1', state: 'state1' },
          { id: '2', state: 'state2' },
        ])
        expect(res.status).to.not.have.been.called
      })

      it('should handle error', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { model: 'testModel', entity: 'testEntity' } }
        service.getAll.rejects(error)
        await router.get.getCall(0).args[1](req, res)
        expect(res.send).to.have.been.calledWith(error)
        expect(res.status).to.have.been.calledOnceWith(500)
      })
    })

    describe('get /:model/:entity/:id', () => {
      it('should get specific state', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { model: 'testModel', entity: 'testEntity', id: 'testId' } }
        service.get.resolves({ id: 'testId', state: 'state' })
        await router.get.getCall(1).args[1](req, res)
        expect(res.send).to.have.been.calledOnceWith({ id: 'testId', state: 'state' })
        expect(res.status).to.not.have.been.called
      })

      it('should handle error', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { model: 'testModel', entity: 'testEntity', id: 'testId' } }
        service.get.rejects(error)
        await router.get.getCall(1).args[1](req, res)
        expect(res.send).to.have.been.calledWith(error)
        expect(res.status).to.have.been.calledOnceWith(500)
      })
    })

    describe('post /:model/:entity', () => {
      it('should save new state', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { model: 'testModel', entity: 'testEntity' }, body: { state: 'newState' } }
        service.save.resolves({ id: 'newId', state: 'newState' })
        await router.post.getCall(0).args[2](req, res)
        expect(res.send).to.have.been.calledOnceWith({ id: 'newId', state: 'newState' })
        expect(res.status).to.not.have.been.called
      })

      it('should handle error', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { model: 'testModel', entity: 'testEntity' }, body: { state: 'newState' } }
        service.save.rejects(error)
        await router.post.getCall(0).args[2](req, res)
        expect(res.send).to.have.been.calledWith(error)
        expect(res.status).to.have.been.calledOnceWith(500)
      })
    })

    describe('put /:model/:entity/:id', () => {
      it('should update specific state', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = {
          params: { model: 'testModel', entity: 'testEntity', id: 'testId' },
          body: { state: 'updatedState' },
        }
        service.update.resolves({ id: 'testId', state: 'updatedState' })
        await router.put.getCall(0).args[2](req, res)
        expect(res.send).to.have.been.calledOnceWith({ id: 'testId', state: 'updatedState' })
        expect(res.status).to.not.have.been.called
      })

      it('should handle error', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = {
          params: { model: 'testModel', entity: 'testEntity', id: 'testId' },
          body: { state: 'updatedState' },
        }
        service.update.rejects(error)
        await router.put.getCall(0).args[2](req, res)
        expect(res.send).to.have.been.calledWith(error)
        expect(res.status).to.have.been.calledOnceWith(500)
      })
    })

    describe('delete /:model/:entity/:id', () => {
      it('should delete specific state', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { model: 'testModel', entity: 'testEntity', id: 'testId' } }
        service.delete.resolves({ id: 'testId', deleted: true })
        await router.delete.getCall(0).args[1](req, res)
        expect(res.send).to.have.been.calledOnceWith({ id: 'testId', deleted: true })
        expect(res.status).to.not.have.been.called
      })

      it('should handle error', async () => {
        const router = createRouter()
        new StateHandler(router as unknown as Router, service)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { model: 'testModel', entity: 'testEntity', id: 'testId' } }
        service.delete.rejects(error)
        await router.delete.getCall(0).args[1](req, res)
        expect(res.send).to.have.been.calledWith(error)
        expect(res.status).to.have.been.calledOnceWith(500)
      })
    })
  })
})
