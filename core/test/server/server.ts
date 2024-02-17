import 'mocha'

import chai from 'chai'
import { Express } from 'express'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { HttpServer } from '../../src/server/server.js'

const { expect } = chai.use(sinonChai)

describe('server', () => {
  describe('HttpServer', () => {
    it('should start server', async () => {
      const express = {
        listen: sinon.stub().callsFake((port, callback) => {
          callback()
        }),
      } as unknown as Express
      const server = new HttpServer(express)
      await server.start()
      expect(express.listen).to.have.been.calledOnceWith(3000, sinon.match.func)
    })
    it('should start server on custom port', async () => {
      const express = {
        listen: sinon.stub().callsFake((port, callback) => {
          callback()
        }),
      } as unknown as Express
      const server = new HttpServer(express)
      await server.start(4000)
      expect(express.listen).to.have.been.calledOnceWith(4000, sinon.match.func)
    })
    it('should start server on port from env', async () => {
      const express = {
        listen: sinon.stub().callsFake((port, callback) => {
          callback()
        }),
      } as unknown as Express
      const server = new HttpServer(express)
      process.env.PORT = '5000'
      await server.start()
      expect(express.listen).to.have.been.calledOnceWith(5000, sinon.match.func)
    })
    it('should register handler', async () => {
      const express = {
        use: sinon.stub(),
        listen: sinon.stub().callsFake((port, callback) => {
          callback()
        }),
      } as unknown as Express
      const server = new HttpServer(express)
      const handler = sinon.stub()
      server.register({ handler })
      await server.start()
      expect(express.use).to.have.been.calledOnceWith('/', handler)
    })
    it('should register handler with path', async () => {
      const express = {
        use: sinon.stub(),
        listen: sinon.stub().callsFake((port, callback) => {
          callback()
        }),
      } as unknown as Express
      const server = new HttpServer(express)
      const handler = sinon.stub()
      server.register({ handler, path: '/test' })
      await server.start()
      expect(express.use).to.have.been.calledOnceWith('/test', handler)
    })
    it('should register handlers in order', async () => {
      const express = {
        use: sinon.stub(),
        listen: sinon.stub().callsFake((port, callback) => {
          callback()
        }),
      }
      const server = new HttpServer(express as unknown as Express)
      const handler1 = sinon.stub()
      const handler2 = sinon.stub()
      server.register({ handler: handler1, priority: 200 })
      server.register({ handler: handler2, priority: 100 })
      await server.start()
      expect(express.use.getCall(1)).to.have.been.calledWith('/', handler1)
      expect(express.use.getCall(0)).to.have.been.calledWith('/', handler2)
    })
  })
})
