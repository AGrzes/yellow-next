import 'mocha'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import PouchDB from 'pouchdb'
import pouchDbAdapterMemory from 'pouchdb-adapter-memory'
import { firstValueFrom, take, toArray } from 'rxjs'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { DocumentSource } from '../../../src/adbs/documents/source.js'
const { expect } = chai.use(sinonChai).use(chaiAsPromised)

PouchDB.plugin(pouchDbAdapterMemory)

describe('DocumentSource', () => {
  it('should handle additions', async () => {
    const on = sinon.stub().returnsThis()
    const database = { changes: () => ({ on }) } as unknown as PouchDB.Database
    const source = new DocumentSource(database)
    const observable = source.observable
    expect(on).to.have.been.calledThrice
    on.firstCall.args[1]({ id: 'test', doc: { value: 1 } })
    const change = await firstValueFrom(observable.pipe(take(1), toArray()))
    expect(change).to.deep.equal([{ kind: 'update', key: 'test', content: { value: 1 } }])
  })

  it('should handle deletions', async () => {
    const on = sinon.stub().returnsThis()
    const database = { changes: () => ({ on }) } as unknown as PouchDB.Database
    const source = new DocumentSource(database)
    const observable = source.observable
    expect(on).to.have.been.calledThrice
    on.firstCall.args[1]({ id: 'test', deleted: true })
    const change = await firstValueFrom(observable.pipe(take(1), toArray()))
    expect(change).to.deep.equal([{ kind: 'delete', key: 'test' }])
  })
  it('should handle errors', async () => {
    const on = sinon.stub().returnsThis()
    const database = { changes: () => ({ on }) } as unknown as PouchDB.Database
    const source = new DocumentSource(database)
    const observable = source.observable
    expect(on).to.have.been.calledThrice
    const error = new Error('test')
    on.thirdCall.args[1](error)
    await expect(firstValueFrom(observable.pipe(take(1), toArray()))).to.be.rejectedWith(error)
  })
  it('should handle completion', async () => {
    const on = sinon.stub().returnsThis()
    const database = { changes: () => ({ on }) } as unknown as PouchDB.Database
    const source = new DocumentSource(database)
    const observable = source.observable
    expect(on).to.have.been.calledThrice
    on.secondCall.args[1]()
    expect(await firstValueFrom(observable.pipe(take(1), toArray()))).to.deep.equal([])
  })
})
