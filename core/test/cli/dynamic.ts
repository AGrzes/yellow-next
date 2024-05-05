import chai from 'chai'
import { Command } from 'commander'
import { Container } from 'inversify'
import 'mocha'
import { join } from 'path'
import { cwd } from 'process'
import sinonChai from 'sinon-chai'
import { dynamicCliModule } from '../../src/cli/dynamic.js'
import testCommandFactory from './commands/test.js'

const expect = chai.use(sinonChai).expect
describe('cli', () => {
  describe('dynamicCliModule', () => {
    it('should create server command', async () => {
      const container = new Container()
      container.bind(Command).toConstantValue(new Command('root')).whenTargetNamed('root')
      await container.loadAsync(dynamicCliModule(join(cwd(), 'test', 'cli', 'commands')))
      const testCommand = await container.getNamedAsync(Command, 'test')
      expect(testCommandFactory).to.be.calledOnce
      expect(testCommand.name()).to.be.equal('test')
    })
    it('should fail on invalid path', async () => {
      const container = new Container()
      container.bind(Command).toConstantValue(new Command('root')).whenTargetNamed('root')
      await expect(container.loadAsync(dynamicCliModule('\0'))).to.be.rejectedWith(Error)
    })
  })
})
