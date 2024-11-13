import { expect } from 'chai'
import 'mocha'
import sinon from 'sinon'
import { StateService } from '../../src/state/service'
import { Store } from '../../src/state/store'

describe('StateService', () => {
  const mockStore = {
    get: sinon.stub(),
    put: sinon.stub(),
  }
  const service = new StateService(mockStore as unknown as Store<any>)

  beforeEach(() => {
    mockStore.get.reset()
    mockStore.put.reset()
  })

  it('should get all states for entity', async () => {
    mockStore.get.resolves({
      graph: {
        '@context': {},
        '@graph': {
          iri: 'rootIri',
          state: [
            { iri: '1', state: 'state1' },
            { iri: '2', state: 'state2' },
          ],
        },
      },
    })
    const result = await service.getAll('testModel', 'testEntity')
    expect(result).to.deep.equal([
      { iri: '1', state: 'state1' },
      { iri: '2', state: 'state2' },
    ])
  })

  it('should get specific state', async () => {
    mockStore.get.resolves({
      graph: {
        '@context': {},
        '@graph': {
          iri: 'rootIri',
          state: [{ iri: 'testId', state: 'state' }],
        },
      },
    })
    const result = await service.get('testModel', 'testEntity', 'testId')
    expect(result).to.deep.equal({ iri: 'testId', state: 'state' })
  })

  it('should save new state', async () => {
    mockStore.get.resolves({
      graph: {
        '@context': {},
        '@graph': {
          iri: 'rootIri',
          state: [],
        },
      },
    })
    mockStore.put.resolves()
    const result = await service.save('testModel', 'testEntity', { state: 'newState' })
    expect(result).to.deep.equal({ iri: 'newId', state: 'newState' })
  })

  it('should save new state when no existing item in store', async () => {
    mockStore.get.resolves(null)
    mockStore.put.resolves()
    const result = await service.save('testModel', 'testEntity', { state: 'newState' })
    expect(result).to.deep.equal({ iri: 'newId', state: 'newState' })
  })

  it('should update specific state', async () => {
    mockStore.get.resolves({
      graph: {
        '@context': {},
        '@graph': {
          iri: 'rootIri',
          state: [{ iri: 'testId', state: 'state' }],
        },
      },
    })
    mockStore.put.resolves()
    const result = await service.update('testModel', 'testEntity', 'testId', { state: 'updatedState' })
    expect(result).to.deep.equal({ iri: 'testId', state: 'updatedState' })
  })

  it('should delete specific state', async () => {
    mockStore.get.resolves({
      graph: {
        '@context': {},
        '@graph': {
          iri: 'rootIri',
          state: [{ iri: 'testId', state: 'state' }],
        },
      },
    })
    mockStore.put.resolves()
    const result = await service.delete('testModel', 'testEntity', 'testId')
    expect(result).to.deep.equal({ id: 'testId', deleted: true })
  })

  it('should return false when deleting non-existing state', async () => {
    mockStore.get.resolves(null)
    const result = await service.delete('testModel', 'testEntity', 'testId')
    expect(result).to.deep.equal({ id: 'testId', deleted: false })
  })

  it('should return false when deleting state that does not exist in record', async () => {
    mockStore.get.resolves({
      graph: {
        '@context': {},
        '@graph': {
          iri: 'rootIri',
          state: [{ iri: 'existingId', state: 'state' }],
        },
      },
    })
    const result = await service.delete('testModel', 'testEntity', 'nonExistingId')
    expect(result).to.deep.equal({ id: 'nonExistingId', deleted: false })
  })
})
