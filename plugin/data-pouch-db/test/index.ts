import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { POUCHDB_CATALOG, POUCHDB_CONFIG } from '../src/index.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('data-pouch-db', () => {
    it('should export POUCHDB_CATALOG', () => {
      expect(POUCHDB_CATALOG).to.be.a('string')
    })
    it('should export POUCHDB_CONFIG', () => {
      expect(POUCHDB_CONFIG).to.be.a('string')
    })
  })
})
