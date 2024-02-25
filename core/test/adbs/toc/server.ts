import 'mocha'

import chai from 'chai'

import { Router } from 'express'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { TocHandler } from '../../../src/adbs/toc/server.js'
import { TocService } from '../../../src/adbs/toc/service.js'

const { expect } = chai.use(sinonChai)

describe('adbs', () => {
  describe('toc', () => {
    describe('TocHandlr', () => {
      it('should create a handler', async () => {
        const router = {
          get: sinon.stub(),
        }
        const handler = new TocHandler({} as TocService, router as unknown as Router)
        expect(handler).to.be.instanceOf(TocHandler)
        expect(router.get).to.have.been.calledOnceWith('/', sinon.match.func)
      })
      describe('get /', () => {
        it('should get toc', async () => {
          const tocService = {
            toc: [],
          } as unknown as TocService
          const router = {
            get: sinon.stub(),
          }
          new TocHandler(tocService, router as unknown as Router)
          const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
          }
          const req = {}
          await router.get.getCall(0).args[1](req, res)
          expect(res.send).to.have.been.calledOnceWith([])
          expect(res.status).to.not.have.been.called
        })
        it('should handle error', async () => {
          const error = new Error('error')
          const tocService = {
            get toc() {
              throw error
            },
          } as unknown as TocService
          const router = {
            get: sinon.stub(),
          }
          new TocHandler(tocService, router as unknown as Router)
          const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
          }
          const req = {}
          await router.get.getCall(0).args[1](req, res)
          expect(res.send).to.have.been.calledOnceWith(error)
          expect(res.status).to.have.been.calledOnceWith(500)
        })
      })
    })
  })
})
