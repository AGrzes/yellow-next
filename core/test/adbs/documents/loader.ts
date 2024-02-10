import 'mocha'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'pouchdb'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { DocumentLoaderService } from '../../../src/adbs/documents/loader.js'
import { MoveEvent, UpdateEvent } from '../../../src/adbs/model.js'
const { expect } = chai.use(chaiAsPromised).use(sinonChai)

describe('DocumentLoaderService', () => {
  it('should add a document', async () => {
    const put = sinon.stub().resolves()
    const database = { put } as unknown as PouchDB.Database
    const loader = new DocumentLoaderService(database, 'instance')
    loader.observer().next!({ kind: 'update', key: 'path', content: { value: 1 } } as UpdateEvent<
      Record<string, any>,
      string
    >)
    expect(put).to.have.been.calledOnce
    expect(put).to.have.been.calledWith({ _id: 'document:instance:path', instance: 'instance', path: 'path', value: 1 })
  })
  it('should update a document', async () => {
    const put = sinon.stub().onFirstCall().rejects({ name: 'conflict' }) //.onSecondCall().resolves()
    const get = sinon.stub().resolves({ _rev: '1' })
    const database = { put, get } as unknown as PouchDB.Database
    const loader = new DocumentLoaderService(database, 'instance')
    await loader.observer().next!({ kind: 'update', key: 'path', content: { value: 1 } } as UpdateEvent<
      Record<string, any>,
      string
    >)
    expect(put).to.have.been.calledTwice
    expect(put.firstCall).to.have.been.calledWith({
      _id: 'document:instance:path',
      instance: 'instance',
      path: 'path',
      value: 1,
    })
    expect(put.secondCall).to.have.been.calledWith({
      _id: 'document:instance:path',
      _rev: '1',
      instance: 'instance',
      path: 'path',
      value: 1,
    })
  })
  it('should handle put errors', async () => {
    const put = sinon.stub().rejects()
    const database = { put } as unknown as PouchDB.Database
    const loader = new DocumentLoaderService(database, 'instance')
    await expect(
      loader.observer().next!({ kind: 'update', key: 'path', content: { value: 1 } } as UpdateEvent<
        Record<string, any>,
        string
      >)
    ).to.be.rejected
  })
  it('should delete a document', async () => {
    const allDocs = sinon.stub().resolves({ rows: [{ id: 'document:instance:path', value: { rev: '1' } }] })
    const remove = sinon.stub().resolves()
    const database = { allDocs, remove } as unknown as PouchDB.Database
    const loader = new DocumentLoaderService(database, 'instance')
    await loader.observer().next!({ kind: 'delete', key: 'path' })
    expect(allDocs).to.have.been.calledOnce
    expect(allDocs).to.have.been.calledWith({
      startkey: 'document:instance:path',
      endkey: 'document:instance:path\uffff',
    })
    expect(remove).to.have.been.calledOnce
    expect(remove).to.have.been.calledWith('document:instance:path', '1')
  })
  it('should handle remove errors', async () => {
    const allDocs = sinon.stub().resolves({ rows: [{ id: 'document:instance:path', value: { rev: '1' } }] })
    const remove = sinon.stub().rejects()
    const database = { allDocs, remove } as unknown as PouchDB.Database
    const loader = new DocumentLoaderService(database, 'instance')
    await expect(loader.observer().next!({ kind: 'delete', key: 'path' })).to.be.rejected
  })
  it('should handle remove conflicts', async () => {
    const allDocs = sinon.stub().resolves({ rows: [{ id: 'document:instance:path', value: { rev: '1' } }] })
    const remove = sinon.stub().rejects({ name: 'conflict' })
    const database = { allDocs, remove } as unknown as PouchDB.Database
    const loader = new DocumentLoaderService(database, 'instance')
    await loader.observer().next!({ kind: 'delete', key: 'path' })
    expect(allDocs).to.have.been.calledOnce
    expect(allDocs).to.have.been.calledWith({
      startkey: 'document:instance:path',
      endkey: 'document:instance:path\uffff',
    })
    expect(remove).to.have.been.calledOnce
    expect(remove).to.have.been.calledWith('document:instance:path', '1')
  })
  it('should move a document', async () => {
    const allDocs = sinon
      .stub()
      .resolves({ rows: [{ id: 'document:instance:path', doc: { value: 1 }, value: { rev: '1' } }] })
    const remove = sinon.stub().resolves()
    const put = sinon.stub().resolves()
    const database = { allDocs, remove, put } as unknown as PouchDB.Database
    const loader = new DocumentLoaderService(database, 'instance')
    await loader.observer().next!({ kind: 'move', key: 'path', newKey: 'newPath' } as MoveEvent<
      Record<string, any>,
      string
    >)
    expect(allDocs).to.have.been.calledOnce
    expect(allDocs).to.have.been.calledWith({
      startkey: 'document:instance:path',
      endkey: 'document:instance:path\uffff',
      include_docs: true,
    })
    expect(remove).to.have.been.calledOnce
    expect(remove).to.have.been.calledWith('document:instance:path', '1')
    expect(database.put).to.have.been.calledOnce
    expect(database.put).to.have.been.calledWith({
      _id: 'document:instance:newPath',
      instance: 'instance',
      path: 'newPath',
      value: 1,
    })
  })
})
