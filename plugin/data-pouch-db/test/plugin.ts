import { registrationTest } from '@agrzes/yellow-next-plugin-test'
import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { PouchDBFactory } from '../src/catalog.js'
import plugin, { POUCHDB_FACTORY } from '../src/plugin.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('data-pouch-db', () => {
    describe('PouchDB Factory', () => {
      registrationTest<PouchDBFactory, readonly []>(plugin, POUCHDB_FACTORY, {
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
  })
})
