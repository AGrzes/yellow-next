import chai from 'chai'
import { Command } from 'commander'
import { Container, ContainerModule } from 'inversify'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ADBS } from '../../src/adbs/adbs.js'
import { serverCliModule } from '../../src/cli/server.js'

const expect = chai.use(sinonChai).expect
describe('cli', () => {
  describe('serverCliModule', () => {
    it('should create server command', async () => {
      const container = new Container()
      const setupFileFlow = sinon.stub()
      container.load(
        serverCliModule,
        new ContainerModule((bind) => {
          bind(ADBS).toConstantValue({ setupFileFlow } as unknown as ADBS)
          bind(Command).toConstantValue(new Command()).whenTargetNamed('root')
        })
      )
      const serverCommand = container.getNamed(Command, 'server')
      await serverCommand.parseAsync([])
    })
  })
})