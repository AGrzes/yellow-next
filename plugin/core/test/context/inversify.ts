import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { InversifyContext } from '../../src/context/inversify.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('core', () => {
    describe('context', () => {
      describe('inversify', () => {
        describe('InversifyContext', () => {
          describe('get', () => {
            it('should get single service by identifier', async () => {
              const container = {
                getAsync: sinon.stub().resolves('testService'),
              }
              const context = new InversifyContext(container as any)
              const service = await context.get({ identifier: 'testService', qualifier: 'qualifier', optional: false })
              expect(service).to.equal('testService')
              expect(container.getAsync).to.have.been.calledOnceWith('testService', {
                tag: { key: 'qualifier', value: 'qualifier' },
                optional: false,
              })
            })
          })
        })
      })
    })
  })
})
