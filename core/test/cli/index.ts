import chai from 'chai'
import { Command } from 'commander'
import { Container, ContainerModule } from 'inversify'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import entrypoint, { cliModule } from '../../src/cli/index.js'
const expect = chai.use(sinonChai).expect

describe('cli', () => {
  it('should be able to create a container', async () => {
    const container = new Container()
    container.load(cliModule)
    expect(container.isBoundNamed(Command, 'root')).to.be.true
  })

  it('should be able to run the entrypoint', async () => {
    const container = new Container()
    container.load(cliModule)
    await entrypoint(container, [])
  })
  it('should be able to register child commands', async () => {
    const container = new Container()
    const action = sinon.mock()
    container.load(
      cliModule,
      new ContainerModule((bind) => {
        bind(Command)
          .toDynamicValue((context) => {
            const parent = context.container.getNamed(Command, 'root')
            const command = new Command('child')
            command.action(action)
            parent.exitOverride()
            parent.addCommand(command)
            return command
          })
          .inSingletonScope()
          .whenTargetNamed('child')
      })
    )
    await entrypoint(container, ['', '', 'child'])
    expect(action).to.have.been.calledOnce
  })
})
