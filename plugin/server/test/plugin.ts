import {
  ApplicationContext,
  CONTEXT,
  ServiceRegistration,
  ServiceRequest,
  ServiceSelector,
} from '@agrzes/yellow-next-plugin-core'
import * as chai from 'chai'
import { Application, Express } from 'express'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { SERVER } from '../src/index.js'
import plugin, { EXPRESS } from '../src/plugin.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('cli', () => {
    describe('server', () => {
      let registration: ServiceRegistration<Application, readonly [ServiceSelector<ApplicationContext>, typeof EXPRESS]>
      before(() => {
        plugin({
          manifest: {
            base: 'base',
            manifestVersion: '1',
          },
          registry: {
            register: (options) => {
              if (options.identifier === SERVER) {
                registration = options as unknown as ServiceRegistration<
                  Application,
                  readonly [ServiceSelector<ApplicationContext>, typeof EXPRESS]
                >
              }
            },
          },
        })
      })
      it('should register server', () => {
        expect(registration).to.be.an('object')
      })
      it('should declare dependencies', () => {
        expect(registration.dependencies).to.be.deep.equal([ServiceRequest.named(CONTEXT, null), EXPRESS])
      })
      it('should not have provided services', () => {
        expect(registration.provided).to.be.undefined
      })
      it('should not have qualifier', () => {
        expect(registration.qualifier).to.be.undefined
      })
      it('should register a server', async () => {
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
    })
  })
})
