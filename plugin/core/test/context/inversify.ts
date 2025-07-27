import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { InversifyContext } from '../../src/context/inversify.js'
const { expect } = chai.use(sinonChai).use(chaiAsPromised)

describe('plugin', () => {
  describe('core', () => {
    describe('context', () => {
      describe('inversify', () => {
        describe('InversifyContext', () => {
          describe('get', () => {
            it('should get single service by identifier', async () => {
              const container = {
                getAsync: sinon.stub().resolves('testService'),
              }
              const context = new InversifyContext(container as any)
              const service = await context.get({ identifier: 'testService', qualifier: 'qualifier', optional: false })
              expect(service).to.equal('testService')
              expect(container.getAsync).to.have.been.calledOnceWith('testService', {
                tag: { key: 'qualifier', value: 'qualifier' },
                optional: false,
              })
            })
            it('should get multiple services by identifier', async () => {
              const container = {
                getAllAsync: sinon.stub().resolves(['service1', 'service2']),
              }
              const context = new InversifyContext(container as any)
              const services = await context.get({
                identifier: 'testService',
                qualifier: 'qualifier',
                multiple: true,
                optional: false,
              })
              expect(services).to.deep.equal(['service1', 'service2'])
              expect(container.getAllAsync).to.have.been.calledOnceWith('testService', {
                tag: { key: 'qualifier', value: 'qualifier' },
                optional: false,
              })
            })
            it('should handle string as identifier', async () => {
              const container = {
                getAsync: sinon.stub().resolves('testService'),
              }
              const context = new InversifyContext(container as any)
              const service = await context.get('testService')
              expect(service).to.equal('testService')
              expect(container.getAsync).to.have.been.calledOnceWith('testService', {
                tag: undefined,
                optional: undefined,
              })
            })
            it('should handle unqualified service requests', async () => {
              const container = {
                getAsync: sinon.stub().resolves('testService'),
              }
              const context = new InversifyContext(container as any)
              const service = await context.get({ identifier: 'testService', optional: true })
              expect(service).to.equal('testService')
              expect(container.getAsync).to.have.been.calledOnceWith('testService', {
                tag: undefined,
                optional: true,
              })
            })
            it('should handle unqualified service requests for multiple services', async () => {
              const container = {
                getAllAsync: sinon.stub().resolves(['testService']),
              }
              const context = new InversifyContext(container as any)
              const service = await context.get({ identifier: 'testService', multiple: true })
              expect(service).to.deep.equal(['testService'])
              expect(container.getAllAsync).to.have.been.calledOnceWith('testService', {
                tag: undefined,
                optional: undefined,
              })
            })
          })
          describe('register', () => {
            it('should register a service', () => {
              const container = {
                bind: sinon.stub().returnsThis(),
                toDynamicValue: sinon.stub().returnsThis(),
                inSingletonScope: sinon.stub().returnsThis(),
                when: sinon.stub().returnsThis(),
              }
              const context = new InversifyContext(container as any)
              const factory = sinon.stub().returns('createdService')
              context.register({
                identifier: 'testService',
                dependencies: [],
                factory,
              })
              expect(container.bind).to.have.been.calledOnceWith('testService')
              expect(container.toDynamicValue).to.have.been.calledOnce
              expect(container.inSingletonScope).to.have.been.calledOnce
              expect(container.when).to.have.been.calledOnce
            })
            it('should filter unqualified services', () => {
              const container = {
                bind: sinon.stub().returnsThis(),
                toDynamicValue: sinon.stub().returnsThis(),
                inSingletonScope: sinon.stub().returnsThis(),
                when: sinon.stub().returnsThis(),
              }
              const context = new InversifyContext(container as any)
              const factory = sinon.stub().returns('createdService')
              context.register({
                identifier: 'testService',
                dependencies: [],
                factory,
              })
              expect(container.when).to.have.been.calledOnce
              const constraint = container.when.getCall(0).args[0]
              expect(constraint({ tags: new Map() })).to.be.true
              expect(constraint({ tags: new Map([['qualifier', 'testQualifier']]) })).to.be.false
            })
            it('should register a service with qualifier', () => {
              const container = {
                bind: sinon.stub().returnsThis(),
                toDynamicValue: sinon.stub().returnsThis(),
                inSingletonScope: sinon.stub().returnsThis(),
                when: sinon.stub().returnsThis(),
              }
              const context = new InversifyContext(container as any)
              const factory = sinon.stub().returns('createdService')
              context.register({
                identifier: 'testService',
                dependencies: [],
                factory,
                qualifier: 'testQualifier',
              })
              expect(container.when).to.have.been.calledOnce
            })
            it('should filter qualified services', () => {
              const container = {
                bind: sinon.stub().returnsThis(),
                toDynamicValue: sinon.stub().returnsThis(),
                inSingletonScope: sinon.stub().returnsThis(),
                when: sinon.stub().returnsThis(),
              }
              const context = new InversifyContext(container as any)
              const factory = sinon.stub().returns('createdService')
              context.register({
                identifier: 'testService',
                qualifier: 'testQualifier',
                dependencies: [],
                factory,
              })
              expect(container.when).to.have.been.calledOnce
              const constraint = container.when.getCall(0).args[0]
              expect(constraint({ tags: new Map() })).to.be.true
              expect(constraint({ tags: new Map([['qualifier', 'testQualifier']]) })).to.be.true
              expect(constraint({ tags: new Map([['qualifier', 'otherQualifier']]) })).to.be.false
            })
            it('should register a service with provided identifiers', async () => {
              const container = {
                bind: sinon.stub().returnsThis(),
                toDynamicValue: sinon.stub().returnsThis(),
                inSingletonScope: sinon.stub().returnsThis(),
                when: sinon.stub().returnsThis(),
                toService: sinon.stub().returnsThis(),
                getAsync: sinon.stub().resolves('dependencyServiceImpl'),
              }
              const context = new InversifyContext(container as any)
              context.register({
                identifier: 'testService',
                provided: ['providedService1', 'providedService2'],
                dependencies: [],
                factory: () => 'createdService',
              })
              expect(container.bind).to.have.been.calledWith('providedService1')
              expect(container.bind).to.have.been.calledWith('providedService2')
              expect(container.toDynamicValue.callCount).to.be.equals(3)
            })
            it('should resolve aliases to the registered service', async () => {
              const container = {
                bind: sinon.stub().returnsThis(),
                toDynamicValue: sinon.stub().returnsThis(),
                inSingletonScope: sinon.stub().returnsThis(),
                when: sinon.stub().returnsThis(),
                toService: sinon.stub().returnsThis(),
                getAsync: sinon.stub().resolves('registeredService'),
              }
              const context = new InversifyContext(container as any)
              context.register({
                identifier: 'testService',
                provided: ['providedService'],
                dependencies: [],
                factory: () => 'createdService',
              })
              expect(container.toDynamicValue.callCount).to.be.equals(2)
              const alias = container.toDynamicValue.getCall(1).args[0]
              const service = await alias()
              expect(container.getAsync).to.have.been.calledWith('testService', {
                tag: undefined,
                optional: undefined,
              })
              expect(service).to.equal('registeredService')
            })

            it('should create service without dependencies', async () => {
              const container = {
                bind: sinon.stub().returnsThis(),
                toDynamicValue: sinon.stub().returnsThis(),
                inSingletonScope: sinon.stub().returnsThis(),
                when: sinon.stub().returnsThis(),
              }
              const context = new InversifyContext(container as any)
              const factory = sinon.stub().returns('createdService')
              context.register({
                identifier: 'testService',
                factory,
              })
              const initializer = container.toDynamicValue.getCall(0).args[0]
              const instance = await initializer()
              expect(instance).to.equal('createdService')
              expect(factory).to.have.been.calledOnceWith([])
            })
            it('should construct service with dependencies', async () => {
              const container = {
                bind: sinon.stub().returnsThis(),
                toDynamicValue: sinon.stub().returnsThis(),
                inSingletonScope: sinon.stub().returnsThis(),
                when: sinon.stub().returnsThis(),
                getAsync: sinon.stub().resolves('dependencyServiceImpl'),
              }
              const context = new InversifyContext(container as any)
              const factory = sinon.stub().returns('createdService')
              context.register({
                identifier: 'testService',
                dependencies: [{ identifier: 'dependencyService' }],
                factory,
              })
              const initializer = container.toDynamicValue.getCall(0).args[0]
              const instance = await initializer()
              expect(instance).to.equal('createdService')
              expect(factory).to.have.been.calledOnceWith(['dependencyServiceImpl'])
              expect(container.getAsync).to.have.been.calledOnceWith('dependencyService', {
                tag: undefined,
                optional: undefined,
              })
            })
          })
          describe('startup', () => {
            it('should call all startup services', async () => {
              const startupStub = sinon.stub().resolves()
              const container = {
                getAllAsync: sinon.stub().resolves([startupStub]),
              }
              const context = new InversifyContext(container as any)
              await context.startup()
              expect(startupStub).to.have.been.calledOnce
            })
          })
          describe('shutdown', () => {
            it('should call all shutdown services', async () => {
              const shutdownStub = sinon.stub().resolves()
              const container = {
                getAllAsync: sinon.stub().resolves([shutdownStub]),
              }
              const context = new InversifyContext(container as any)
              await context.shutdown()
              expect(shutdownStub).to.have.been.calledOnce
            })
            it('should handle errors in shutdown services', async () => {
              const error = new Error('Shutdown failed')
              const shutdownStub = sinon.stub().rejects(error)
              const container = {
                getAllAsync: sinon.stub().resolves([shutdownStub]),
              }
              const context = new InversifyContext(container as any)
              expect(context.shutdown()).to.be.rejectedWith('Errors during shutdown')
            })
          })
        })
      })
    })
  })
})
