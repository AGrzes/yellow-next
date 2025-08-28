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
      it('should create database instances when asked for a name', () => {
        const factory = sinon.stub().returns('created')
        const catalog = new StaticCatalog(factory, [
          { name: 'db1', dbName: 'name1', options: { adapter: 'http' } },
        ] as any)
        const db = catalog.get('db1')
        expect(db).to.equal('created')
        expect(factory).to.have.been.calledOnceWithExactly('name1', { adapter: 'http' })
      })
      it('should return the same database instance when asked multiple times', () => {
        const factory = sinon.stub().returns('created')
        const catalog = new StaticCatalog(factory, [
          { name: 'db1', dbName: 'name1', options: { adapter: 'http' } },
        ] as any)
        const db1 = catalog.get('db1')
        const db2 = catalog.get('db1')
        expect(db1).to.equal(db2)
        expect(factory).to.have.been.calledOnce
      })
      it('should return undefined when asked for a non-existing database', () => {
        const factory = sinon.stub().returns('created')
        const catalog = new StaticCatalog(factory, [
          { name: 'db1', dbName: 'name1', options: { adapter: 'http' } },
        ] as any)
        const db = catalog.get('db2')
        expect(db).to.be.undefined
        expect(factory).not.to.have.been.called
      })
    })
  })
})
