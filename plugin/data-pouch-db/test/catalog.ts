import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { PouchDBFactory, StaticCatalog } from '../src/catalog.js'

const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('data-pouch-db', () => {
    describe('StaticCatalog', () => {
      it('should list names of available databases', () => {
        const catalog = new StaticCatalog(sinon.stub() as PouchDBFactory, [{ name: 'db1' }, { name: 'db2' }] as any)
        expect(catalog.list()).to.deep.equal(['db1', 'db2'])
      })
    })
  })
})
