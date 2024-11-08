import chai from 'chai'
import 'mocha'
import { EmsService } from '../../src/ems/service'

const { expect } = chai

describe('EmsService', () => {
  const service = new EmsService()

  it('should get kind and iri', async () => {
    const result = await service.get('testKind', 'testIri')
    expect(result).to.deep.equal({ kind: 'testKind', iri: 'testIri' })
  })

  it('should update kind and iri', async () => {
    const result = await service.put('testKind', 'testIri', { data: 'testData' })
    expect(result).to.deep.equal({ data: 'testData', kind: 'testKind', iri: 'testIri' })
  })

  it('should create kind with uuid', async () => {
    const result = await service.post('testKind', { data: 'testData' })
    expect(result).to.have.property('kind', 'testKind')
    expect(result).to.have.property('data', 'testData')
    expect(result)
      .to.have.property('iri')
      .that.matches(/^uuid:/)
  })
})
