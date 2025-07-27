import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { aware, CONTEXT } from '../../src/context/aware.js'
const { expect } = chai.use(sinonChai).use(chaiAsPromised)

describe('plugin', () => {
  describe('core', () => {
    describe('context', () => {
      describe('aware', () => {
        it('should register context in itself', () => {
          const context = {
            register: sinon.stub(),
          }
          aware(context as any)
          expect(context.register).to.have.been.calledOnceWith({
            identifier: CONTEXT,
            factory: sinon.match.func,
            qualifier: 'default',
          })
          const factory = context.register.getCall(0).args[0].factory
          expect(factory()).to.equal(context)
        })
      })
    })
  })
})
