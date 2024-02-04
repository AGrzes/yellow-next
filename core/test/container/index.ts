import chai from 'chai'
import { Container } from 'inversify'
import 'mocha'
import createContainer from '../../src/container/index.js'
const expect = chai.expect

describe('container', () => {
  it('should be able to create a container', async () => {
    const container = await createContainer()
    expect(container).to.be.instanceOf(Container)
  })
})
