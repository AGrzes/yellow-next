import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'mocha'
import sinon from 'sinon'
import { StateModelService, StateService } from '../../src/state/service'
import { Store } from '../../src/state/store'

chai.use(chaiAsPromised)

describe('StateService', () => {
  const mockStore = {
    get: sinon.stub(),
    put: sinon.stub(),
  }
  const mockModelService = {
    has: sinon.stub(),
    get: sinon.stub(),
  }
  const service = new StateService(mockStore as unknown as Store<any>, mockModelService as unknown as StateModelService)

  beforeEach(() => {
    mockStore.get.reset()
    mockStore.put.reset()
    mockModelService.has.reset()
    mockModelService.get.reset()
  })

  it('should get all states for entity', async () => {
    mockModelService.has.returns(true)
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

  it('should return empty array when no record exists for getAll', async () => {
    mockModelService.has.returns(true)
    mockStore.get.resolves(null)
    const result = await service.getAll('testModel', 'testEntity')
    expect(result).to.deep.equal([])
  })

  it('should throw error when model is not known for getAll', async () => {
    mockModelService.has.returns(false)
    await expect(service.getAll('unknownModel', 'testEntity')).to.be.rejectedWith(
      'Model unknownModel is not known to the model service'
    )
  })

  it('should get specific state', async () => {
    mockModelService.has.returns(true)
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

  it('should work when no state exists for get', async () => {
    mockModelService.has.returns(true)
    mockStore.get.resolves(null)
    const result = await service.get('testModel', 'testEntity', 'testId')
    expect(result).not.to.exist
  })

  it('should throw error when model is not known for get', async () => {
    mockModelService.has.returns(false)
    await expect(service.get('unknownModel', 'testEntity', 'testId')).to.be.rejectedWith(
      'Model unknownModel is not known to the model service'
    )
  })

  it('should save new state', async () => {
    mockModelService.has.returns(true)
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
    mockModelService.has.returns(true)
    mockStore.get.resolves(null)
    mockStore.put.resolves()
    const result = await service.save('testModel', 'testEntity', { state: 'newState' })
    expect(result).to.deep.equal({ iri: 'newId', state: 'newState' })
  })

  it('should throw error when model is not known for save', async () => {
    mockModelService.has.returns(false)
    await expect(service.save('unknownModel', 'testEntity', { state: 'newState' })).to.be.rejectedWith(
      'Model unknownModel is not known to the model service'
    )
  })

  it('should update specific state', async () => {
    mockModelService.has.returns(true)
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

  it('should throw error when model is not known for update', async () => {
    mockModelService.has.returns(false)
    await expect(service.update('unknownModel', 'testEntity', 'testId', { state: 'updatedState' })).to.be.rejectedWith(
      'Model unknownModel is not known to the model service'
    )
  })

  it('should delete specific state', async () => {
    mockModelService.has.returns(true)
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
    mockModelService.has.returns(true)
    mockStore.get.resolves(null)
    const result = await service.delete('testModel', 'testEntity', 'testId')
    expect(result).to.deep.equal({ id: 'testId', deleted: false })
  })

  it('should return false when deleting state that does not exist in record', async () => {
    mockModelService.has.returns(true)
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

  it('should throw error when model is not known for delete', async () => {
    mockModelService.has.returns(false)
    await expect(service.delete('unknownModel', 'testEntity', 'testId')).to.be.rejectedWith(
      'Model unknownModel is not known to the model service'
    )
  })
})
