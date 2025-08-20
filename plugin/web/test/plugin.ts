import { MultipleServiceSelector, ServiceRequest } from '@agrzes/yellow-next-plugin-core'
import { Router, ROUTER, ROUTER_FACTORY } from '@agrzes/yellow-next-plugin-server'
import { registrationTest } from '@agrzes/yellow-next-plugin-test'
import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { createServer, Plugin } from 'vite'
import { VITE_PLUGIN, VITE_ROUTER } from '../src/index.js'
import plugin, { VITE_SERVER_FACTORY } from '../src/plugin.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('web', () => {
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
      registrationTest<
        Router,
        readonly [typeof VITE_SERVER_FACTORY, typeof ROUTER_FACTORY, MultipleServiceSelector<Plugin>]
      >(plugin, VITE_ROUTER, {
        provided: [ROUTER],
        dependencies: [VITE_SERVER_FACTORY, ROUTER_FACTORY, ServiceRequest.multiple(VITE_PLUGIN)],
        factoryTests: (registrationSource) => {
          it('should register a vite server', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const middlewares = sinon.stub()
            const viteServerFactory = sinon.stub().resolves({
              middlewares,
            })
            const router = {
              use: sinon.stub(),
            }
            const routerFactory = sinon.stub().returns(router) as unknown as () => Router
            const plugins = ['plugin1']
            const registered = await registration.factory([
              viteServerFactory,
              routerFactory,
              plugins as unknown as Plugin[],
            ])
            expect(registered).to.be.equals(router)
            expect(viteServerFactory).to.be.calledOnceWith(
              sinon.match({
                plugins,
                root: 'base/web',
                server: {
                  middlewareMode: true,
                },
              })
            )
            expect(routerFactory).to.be.calledOnce
            expect(router.use).to.be.calledOnceWith(middlewares)
          })
        },
      })
    })
  })
})
