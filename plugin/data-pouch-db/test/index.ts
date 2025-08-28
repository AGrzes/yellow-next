import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { POUCHDB_CATALOG } from '../src/index.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('data-pouch-db', () => {
    it('should export POUCHDB_CATALOG', () => {
      expect(POUCHDB_CATALOG).to.be.a('string')
    })
  })
})
