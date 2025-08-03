import { ServiceIdentifier } from '@agrzes/yellow-next-plugin-core'
import { registrationTest } from '@agrzes/yellow-next-plugin-test'
import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { COMMAND, COMMAND_FACTORY, Command, PROGRAM_NAME, ROOT_COMMAND } from '../src/index.js'
import plugin from '../src/plugin.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('cli', () => {
    describe('command factory', () => {
      registrationTest<(name?: string) => Command, readonly []>(plugin, COMMAND_FACTORY, {
        factoryTests: (registrationSource) => {
          it('should register a Command', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const registered = await registration.factory([])
            expect(registered).to.be.a('function')
            expect(registered()).to.be.instanceOf(Command)
          })
        },
      })
    })
    describe('command', () => {
      registrationTest<Command, readonly [ServiceIdentifier<(name?: string) => Command>]>(plugin, COMMAND, {
        dependencies: [COMMAND_FACTORY],
        qualifier: ROOT_COMMAND,
        factoryTests: (registrationSource) => {
          it('should register a root command', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const commandFactory = sinon.stub().returns('root command')
            const registered = await registration.factory([commandFactory])
            expect(registered).to.be.equal('root command')
            expect(commandFactory).to.have.been.calledOnceWithExactly(PROGRAM_NAME)
          })
        },
      })
    })
  })
})
