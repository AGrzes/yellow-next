import 'mocha'

import chai from 'chai'

import { Router } from 'express'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { AccessHandler } from '../../../src/adbs/access/server.js'
import { AccessService } from '../../../src/adbs/access/service.js'

const { expect } = chai.use(sinonChai)

describe('adbs', () => {
  describe('access', () => {
    describe('AccessHandler', () => {
      it('should create a handler', async () => {
        const router = {
          get: sinon.stub(),
        }
        const handler = new AccessHandler({} as AccessService, router as unknown as Router)
        expect(handler).to.be.instanceOf(AccessHandler)
        expect(router.get).to.have.been.calledOnceWith('/access-documents/*', sinon.match.func)
      })
      it('should call service.listFiles and return result', async () => {
        const service = {
          listFiles: sinon.stub().resolves(['file1', 'file2']),
        }
        const router = {
          get: sinon.stub(),
        }
        const handler = new AccessHandler(service as unknown as AccessService, router as unknown as Router)
        const req = { params: { 0: 'subpath' } }
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        await router.get.getCall(0).args[1](req, res)
        expect(service.listFiles).to.have.been.calledOnceWith('subpath')
        expect(res.send).to.have.been.calledOnceWith(['file1', 'file2'])
      })
      it('should handle error', async () => {
        const error = new Error('error')
        const service = {
          listFiles: sinon.stub().rejects(error),
        }
        const router = {
          get: sinon.stub(),
        }
        new AccessHandler(service as unknown as AccessService, router as unknown as Router)
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = { params: { 0: 'subpath' } }
        await router.get.getCall(0).args[1](req, res)
        expect(res.status).to.have.been.calledOnceWith(500)
        expect(res.send).to.have.been.calledOnceWith(error)
      })
    })
  })
})
