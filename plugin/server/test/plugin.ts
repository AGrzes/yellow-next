import { Command, COMMAND, COMMAND_FACTORY, ROOT_COMMAND } from '@agrzes/yellow-next-plugin-cli'
import { ApplicationContext, CONTEXT, ServiceRequest, ServiceSelector } from '@agrzes/yellow-next-plugin-core'
import { registrationTest, withConsoleSpies } from '@agrzes/yellow-next-plugin-test'
import * as chai from 'chai'
import express, { Application, Express } from 'express'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { SERVER, SERVER_COMMAND, SERVER_COMMAND_NAME } from '../src/index.js'
import plugin, { EXPRESS } from '../src/plugin.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('cli', () => {
    describe('express', () => {
      registrationTest<() => Express, readonly []>(plugin, EXPRESS, {
        factoryTests: (registrationSource) => {
          it('should register a express', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const registered = await registration.factory([])
            expect(registered).to.be.equals(express)
          })
        },
      })
    })
    describe('server', () => {
      registrationTest<Application, readonly [ServiceSelector<ApplicationContext>, typeof EXPRESS]>(plugin, SERVER, {
        dependencies: [ServiceRequest.named(CONTEXT, null), EXPRESS],
        factoryTests: (registrationSource) => {
          it('should register a server', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const context = {
              get: sinon.stub().resolves([]),
            } as unknown as ApplicationContext
            const appMock = {
              use: sinon.stub(),
            }
            const appFactory = sinon.stub().returns(appMock) as unknown as () => Express
            const app = await registration.factory([context, appFactory])
            expect(app).to.be.equals(appMock)
          })
          it('should register a routes with server', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const context = {
              get: sinon.stub().resolves(['route']),
            }
            const appMock = {
              use: sinon.stub(),
            }
            const appFactory = sinon.stub().returns(appMock) as unknown as () => Express
            await registration.factory([context as unknown as ApplicationContext, appFactory])
            expect(context.get).to.have.been.calledWith(ServiceRequest.multiple('server.router'))
            expect(appMock.use).to.have.been.calledWith('route')
          })
        },
      })
    })
    describe('command', () => {
      registrationTest(plugin, SERVER_COMMAND, {
        qualifier: SERVER_COMMAND_NAME,
        dependencies: [ServiceRequest.named(COMMAND, ROOT_COMMAND), SERVER, COMMAND_FACTORY],
        provided: [COMMAND],
        factoryTests: (registrationSource) => {
          it('should register a server command', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const rootCommand = {
              addCommand: sinon.stub(),
            } as unknown as Command
            const serverMock = {} as unknown as Application
            const command = {
              description: sinon.stub().returnsThis(),
              action: sinon.stub(),
            }
            const commandFactory = sinon.stub().returns(command) as unknown as (name: string) => Command
            await registration.factory([rootCommand, serverMock, commandFactory])
            expect(commandFactory).to.have.been.calledWith(SERVER_COMMAND_NAME)
            expect(rootCommand.addCommand).to.have.been.calledOnceWith(command)
          })
          it('should start server on action', async () => {
            const registration = registrationSource()
            const rootCommand = {
              addCommand: sinon.stub(),
            }
            const serverMock = {
              listen: sinon.stub(),
            }
            const command = {
              description: sinon.stub().returnsThis(),
              action: sinon.stub(),
            }
            const commandFactory = sinon.stub().returns(command) as unknown as (name: string) => Command
            await registration.factory([
              rootCommand as unknown as Command,
              serverMock as unknown as Application,
              commandFactory,
            ])
            await command.action.firstCall.args[0]()
            expect(serverMock.listen).to.have.been.calledWith(process.env.PORT || 3000)
            withConsoleSpies(() => {
              serverMock.listen.firstCall.args[1]()
              expect(console.log).to.have.been.calledWith(
                `Server is running on http://localhost:${process.env.PORT || 3000}`
              )
            })
          })
        },
      })
    })
  })
})
