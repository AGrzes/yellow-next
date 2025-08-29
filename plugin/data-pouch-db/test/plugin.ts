import { ServiceRequest } from '@agrzes/yellow-next-plugin-core'
import { registrationTest } from '@agrzes/yellow-next-plugin-test'
import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { StaticCatalog } from '../src/catalog.js'
import { POUCHDB_CATALOG, POUCHDB_CONFIG } from '../src/index.js'
import plugin, { POUCHDB_FACTORY } from '../src/plugin.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('data-pouch-db', () => {
    describe('PouchDB Factory', () => {
      registrationTest(plugin, POUCHDB_FACTORY, {
        factoryTests: (registrationSource) => {
          it('should register a express', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const registered = await registration.factory([])
            expect(registered).to.be.a('function')
          })
        },
      })
    })
    describe('Catalog', () => {
      registrationTest(plugin, POUCHDB_CATALOG, {
        dependencies: [POUCHDB_FACTORY, ServiceRequest.multiple(POUCHDB_CONFIG)],
        factoryTests: (registrationSource) => {
          it('should register a catalog', async () => {
            const registration = registrationSource()
            expect(registration.factory).to.be.a('function')
            const mockFactory = sinon.stub()
            const registered = await registration.factory([mockFactory, []])
            expect(registered).to.be.instanceOf(StaticCatalog)
          })
        },
      })
    })
  })
})
