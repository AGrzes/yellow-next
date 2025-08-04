import { Router, ROUTER } from '@agrzes/yellow-next-plugin-server'
import { registrationTest } from '@agrzes/yellow-next-plugin-test'
import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { createServer } from 'vite'
import { VITE_ROUTER } from '../src/index.js'
import plugin, { VITE_SERVER_FACTORY } from '../src/plugin.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('cli', () => {
    describe('vite server factory', () => {
      registrationTest<typeof createServer, readonly []>(plugin, VITE_SERVER_FACTORY, {
        factoryTests: (registrationSource) => {
          it('should register a vite server factory', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const registered = await registration.factory([])
            expect(registered).to.be.a('function')
            expect(registered).to.be.equal(createServer)
          })
        },
      })
    })
    describe('vite router', () => {
      registrationTest<Router, readonly [typeof VITE_SERVER_FACTORY]>(plugin, VITE_ROUTER, {
        provided: [ROUTER],
        dependencies: [VITE_SERVER_FACTORY],
        factoryTests: (registrationSource) => {
          it('should register a vite server', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const middlewares = sinon.stub()
            const viteServerFactory = sinon.stub().resolves({
              middlewares,
            })
            const registered = await registration.factory([viteServerFactory])
            expect(registered).to.be.a('function')
            expect(viteServerFactory).to.be.calledOnceWith({
              root: 'base/web',
              server: {
                middlewareMode: true,
              },
            })
          })
        },
      })
    })
  })
})
