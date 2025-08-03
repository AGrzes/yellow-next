import {
  ApplicationContext,
  CONTEXT,
  ServiceIdentifier,
  ServiceRegistration,
  ServiceRequest,
  ServiceSelector,
} from '@agrzes/yellow-next-plugin-core'
import * as chai from 'chai'
import express, { Application, Express } from 'express'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { SERVER } from '../src/index.js'
import plugin, { EXPRESS } from '../src/plugin.js'
const { expect } = chai.use(sinonChai)

function registrationTest<T, D extends readonly ServiceRequest<any>[]>(
  identifier: ServiceIdentifier<T>,
  options: {
    factoryTests: (registrationSource: () => ServiceRegistration<T, D>) => void
    dependencies?: D
    provided?: readonly ServiceIdentifier<T>[]
    qualifier?: string
  }
) {
  let registration: ServiceRegistration<T, D>
  before(() => {
    plugin({
      manifest: {
        base: 'base',
        manifestVersion: '1',
      },
      registry: {
        register: (options) => {
          if ((options.identifier as unknown) === identifier) {
            registration = options as unknown as ServiceRegistration<T, D>
          }
        },
      },
    })
  })
  it('should register service', () => {
    expect(registration).to.be.an('object')
  })
  if (options.dependencies) {
    it('should declare dependencies', () => {
      expect(registration.dependencies).to.be.deep.equal(options.dependencies)
    })
  } else {
    it('should declare no dependencies', () => {
      expect(registration.dependencies).to.be.deep.equal([])
    })
  }
  if (options.provided) {
    it('should have provided services', () => {
      expect(registration.provided).to.be.deep.equal(options.provided)
    })
  } else {
    it('should not have provided services', () => {
      expect(registration.provided).to.be.undefined
    })
  }
  if (options.qualifier) {
    it('should have qualifier', () => {
      expect(registration.qualifier).to.be.equals(options.qualifier)
    })
  } else {
    it('should not have qualifier', () => {
      expect(registration.qualifier).to.be.undefined
    })
  }
  if (options.factoryTests) {
    options.factoryTests(() => registration)
  }
}

describe('plugin', () => {
  describe('cli', () => {
    describe('express', () => {
      registrationTest<() => Express, readonly []>(EXPRESS, {
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
      registrationTest<Application, readonly [ServiceSelector<ApplicationContext>, typeof EXPRESS]>(SERVER, {
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
  })
})
