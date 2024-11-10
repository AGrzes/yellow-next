import chai from 'chai'
import 'mocha'
import { StateService } from '../../src/state/service'

const { expect } = chai

describe('StateService', () => {
  const service = new StateService()

  it('should get all states for entity', async () => {
    const result = await service.getAll('testModel', 'testEntity')
    expect(result).to.deep.equal([
      { id: '1', state: 'state1' },
      { id: '2', state: 'state2' },
    ])
  })

  it('should get specific state', async () => {
    const result = await service.get('testModel', 'testEntity', 'testId')
    expect(result).to.deep.equal({ id: 'testId', state: 'state' })
  })

  it('should save new state', async () => {
    const result = await service.save('testModel', 'testEntity', { state: 'newState' })
    expect(result).to.deep.equal({ id: 'newId', state: 'newState' })
  })

  it('should update specific state', async () => {
    const result = await service.update('testModel', 'testEntity', 'testId', { state: 'updatedState' })
    expect(result).to.deep.equal({ id: 'testId', state: 'updatedState' })
  })

  it('should delete specific state', async () => {
    const result = await service.delete('testModel', 'testEntity', 'testId')
    expect(result).to.deep.equal({ id: 'testId', deleted: true })
  })
})
