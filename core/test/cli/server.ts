import chai from 'chai'
import { Command } from 'commander'
import { Container, ContainerModule } from 'inversify'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ADBS } from '../../src/adbs/adbs.js'
import { DocumentsHandler } from '../../src/adbs/documents/server.js'
import { GraphHandler } from '../../src/adbs/graph/server.js'
import { TocHandler } from '../../src/adbs/toc/server.js'
import { serverCliModule } from '../../src/cli/server.js'
import { ConfigHandler } from '../../src/config/server.js'
import { EmsHandler } from '../../src/ems/server.js'
import { HttpServer } from '../../src/server/server.js'
import { StateHandler } from '../../src/state/server.js'

const expect = chai.use(sinonChai).expect
describe('cli', () => {
  describe('serverCliModule', () => {
    it('should create server command', async () => {
      const container = new Container()
      const setupFileFlow = sinon.stub()
      const setupGraphFlow = sinon.stub()
      const server = { start: sinon.stub(), register: sinon.stub() }
      const graphHandler = sinon.stub()
      const tocHandler = sinon.stub()
      const documentsHandler = sinon.stub()
      const emsHandler = sinon.stub()
      const stateHandler = sinon.stub()

      container.load(
        serverCliModule,
        new ContainerModule((bind) => {
          bind(ADBS).toConstantValue({ setupFileFlow, setupGraphFlow } as unknown as ADBS)
          bind(Command).toConstantValue(new Command()).whenTargetNamed('root')
          bind(HttpServer).toConstantValue(server as unknown as HttpServer)
          bind(GraphHandler).toConstantValue({ handler: graphHandler } as unknown as GraphHandler)
          bind(TocHandler).toConstantValue({ handler: tocHandler } as unknown as TocHandler)
          bind(DocumentsHandler).toConstantValue({ handler: documentsHandler } as unknown as DocumentsHandler)
          bind(EmsHandler).toConstantValue({ handler: emsHandler } as unknown as EmsHandler)
          bind(StateHandler).toConstantValue({ handler: stateHandler } as unknown as StateHandler)
          bind(ConfigHandler).toConstantValue({ handler: sinon.stub() } as unknown as ConfigHandler)
        })
      )
      const serverCommand = container.getNamed(Command, 'server')
      await serverCommand.parseAsync([])
      expect(setupFileFlow).to.have.been.calledOnceWith(['documents'])
      expect(setupGraphFlow).to.have.been.calledOnce
      expect(server.register).to.have.been.calledWith({ handler: graphHandler, path: '/graph' })
      expect(server.register).to.have.been.calledWith({ handler: tocHandler, path: '/toc' })
      expect(server.register).to.have.been.calledWith({ handler: documentsHandler, path: '/', priority: 1000 })
      expect(server.register).to.have.been.calledWith({ handler: emsHandler, path: '/ems' })
      expect(server.register).to.have.been.calledWith({ handler: stateHandler, path: '/state' })
      expect(server.start).to.have.been.calledOnce
    })
  })
})