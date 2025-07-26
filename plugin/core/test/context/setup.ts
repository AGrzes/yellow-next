import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { createSetupContext } from '../../src/context/setup.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('core', () => {
    describe('context', () => {
      describe('setup', () => {
        describe('createSetupContext', () => {
          it('should create Inverisfy context', async () => {
            const ContainerClass = sinon.stub()
            const InversifyContextClass = sinon.stub()
            const lookupManifestsRef = sinon.stub().resolves([])
            const loadPluginRef = sinon.stub().resolves(() => {})
            const setupContext = createSetupContext(
              ContainerClass as any,
              InversifyContextClass as any,
              lookupManifestsRef as any,
              loadPluginRef as any
            )
            const context = await setupContext()
            expect(ContainerClass).to.have.been.calledOnceWith({ defaultScope: 'Singleton' })
          })
        })
      })
    })
  })
})
