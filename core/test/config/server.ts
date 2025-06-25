import chai from 'chai'
import { Router } from 'express'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ConfigHandler } from '../../src/config/server'

const { expect } = chai.use(sinonChai)

function createRouter() {
  return {
    get: sinon.stub(),
  }
}

describe('config', () => {
  describe('ConfigHandler', () => {
    let originalEnv: NodeJS.ProcessEnv

    beforeEach(() => {
      originalEnv = { ...process.env }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should create a handler', () => {
      const router = createRouter()
      const handler = new ConfigHandler(router as unknown as Router)
      expect(handler).to.be.instanceOf(ConfigHandler)
      expect(router.get).to.have.been.calledOnce
    })

    describe('get /', () => {
      it('should return web config as JS', async () => {
        process.env.WEB_FOO = 'bar'
        process.env.WEB_BAZ = 'qux'
        const router = createRouter()
        new ConfigHandler(router as unknown as Router)
        const res = {
          setHeader: sinon.stub(),
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = {}
        await router.get.getCall(0).args[1](req, res)
        expect(res.setHeader).to.have.been.calledWith('Content-Type', 'application/javascript')
        expect(res.send).to.have.been.calledOnce
        const sent = res.send.getCall(0).args[0]
        expect(sent).to.match(/window.config = /)
        expect(sent).to.include('"foo": "bar"')
        expect(sent).to.include('"baz": "qux"')
        expect(res.status).to.not.have.been.called
      })

      it('should handle error', async () => {
        const router = createRouter()
        new ConfigHandler(router as unknown as Router)
        const res = {
          setHeader: sinon.stub(),
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
        }
        const req = {}
        // Simulate error by making Object.entries throw
        const stub = sinon.stub(Object, 'entries').throws(new Error('fail'))
        await router.get.getCall(0).args[1](req, res)
        expect(res.status).to.have.been.calledOnceWith(500)
        expect(res.send).to.have.been.called
        stub.restore()
      })
    })
  })
})
