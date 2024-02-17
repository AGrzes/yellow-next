import chai from 'chai'
import { Command } from 'commander'
import { Container, ContainerModule } from 'inversify'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ADBS } from '../../src/adbs/adbs.js'
import { GraphHandler } from '../../src/adbs/graph/server.js'
import { serverCliModule } from '../../src/cli/server.js'
import { HttpServer } from '../../src/server/server.js'

const expect = chai.use(sinonChai).expect
describe('cli', () => {
  describe('serverCliModule', () => {
    it('should create server command', async () => {
      const container = new Container()
      const setupFileFlow = sinon.stub()
      const setupGraphFlow = sinon.stub()
      const server = { start: sinon.stub(), register: sinon.stub() }
      const handler = sinon.stub()
      container.load(
        serverCliModule,
        new ContainerModule((bind) => {
          bind(ADBS).toConstantValue({ setupFileFlow, setupGraphFlow } as unknown as ADBS)
          bind(Command).toConstantValue(new Command()).whenTargetNamed('root')
          bind(HttpServer).toConstantValue(server as unknown as HttpServer)
          bind(GraphHandler).toConstantValue({ handler } as unknown as GraphHandler)
        })
      )
      const serverCommand = container.getNamed(Command, 'server')
      await serverCommand.parseAsync([])
      expect(setupFileFlow).to.have.been.calledOnceWith(['documents'])
      expect(setupGraphFlow).to.have.been.calledOnce
      expect(server.register).to.have.been.calledOnceWith({ handler, path: '/graph' })
      expect(server.start).to.have.been.calledOnce
    })
  })
})