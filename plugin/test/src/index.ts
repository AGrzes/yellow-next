import {
  PluginEntrypoint,
  ServiceIdentifier,
  ServiceRegistration,
  ServiceRequest,
} from '@agrzes/yellow-next-plugin-core'
import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
const { expect } = chai.use(sinonChai)

export function registrationTest<T, D extends readonly ServiceRequest<any>[]>(
  plugin: PluginEntrypoint,
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

export async function withConsoleSpies(callback: () => Promise<void> | void) {
  const consoleSpy = sinon.spy(console)
  try {
    return await callback()
  } finally {
    Object.getOwnPropertyNames(consoleSpy).forEach((method) => {
      if (typeof consoleSpy[method] === 'function') {
        consoleSpy[method].restore()
      }
    })
  }
}
