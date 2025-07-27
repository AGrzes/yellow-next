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
          it('should create Inverisfy container', async () => {
            const containerFactory = sinon.stub()
            const inversifyContextFactory = sinon.stub()
            const lookupManifestsRef = sinon.stub().resolves([])
            const loadPluginRef = sinon.stub().resolves(() => {})
            const setupContext = createSetupContext(
              containerFactory as any,
              inversifyContextFactory as any,
              lookupManifestsRef as any,
              loadPluginRef as any
            )
            await setupContext()
            expect(containerFactory).to.have.been.calledOnce
          })
          it('should cerate Inversify context', async () => {
            const containerFactory = sinon.stub().returns('container')
            const inversifyContextFactory = sinon.stub()
            const lookupManifestsRef = sinon.stub().resolves([])
            const loadPluginRef = sinon.stub().resolves(() => {})
            const setupContext = createSetupContext(
              containerFactory as any,
              inversifyContextFactory as any,
              lookupManifestsRef as any,
              loadPluginRef as any
            )
            await setupContext()
            expect(inversifyContextFactory).to.have.been.calledOnceWith('container')
          })
          it('should lookup manifests', async () => {
            const containerFactory = sinon.stub().returns('container')
            const inversifyContextFactory = sinon.stub().returns('context')
            const lookupManifestsRef = sinon.stub().resolves(['manifest1', 'manifest2'])
            const loadPluginRef = sinon.stub().resolves(() => {})
            const setupContext = createSetupContext(
              containerFactory as any,
              inversifyContextFactory as any,
              lookupManifestsRef as any,
              loadPluginRef as any
            )
            await setupContext()
            expect(lookupManifestsRef).to.have.been.calledOnce
          })
          it('should load plugins', async () => {
            const containerFactory = sinon.stub().returns('container')
            const inversifyContextFactory = sinon.stub().returns('context')
            const lookupManifestsRef = sinon.stub().resolves(['manifest1', 'manifest2'])
            const loadPluginRef = sinon.stub().resolves(() => {})
            const setupContext = createSetupContext(
              containerFactory as any,
              inversifyContextFactory as any,
              lookupManifestsRef as any,
              loadPluginRef as any
            )
            await setupContext()
            expect(loadPluginRef).to.have.been.calledTwice // once for each manifest
          })
          it('should run entrypoint with manifest and context', async () => {
            const containerFactory = sinon.stub().returns('container')
            const inversifyContextFactory = sinon.stub().returns('context')
            const lookupManifestsRef = sinon.stub().resolves(['manifest'])
            const entrypoint = sinon.stub().resolves()
            const loadPluginRef = sinon.stub().resolves(entrypoint)
            const setupContext = createSetupContext(
              containerFactory as any,
              inversifyContextFactory as any,
              lookupManifestsRef as any,
              loadPluginRef as any
            )
            await setupContext()
            expect(entrypoint).to.have.been.calledWith({
              manifest: 'manifest',
              registry: 'context',
            })
          })
          it('should call extensions with context', async () => {
            const containerFactory = sinon.stub().returns('container')
            const inversifyContextFactory = sinon.stub().returns('context')
            const lookupManifestsRef = sinon.stub().resolves(['manifest'])
            const loadPluginRef = sinon.stub().resolves(() => {})
            const extension = sinon.stub()
            const setupContext = createSetupContext(
              containerFactory as any,
              inversifyContextFactory as any,
              lookupManifestsRef as any,
              loadPluginRef as any,
              [extension]
            )
            await setupContext()
            expect(extension).to.have.been.calledOnceWith('context')
          })
        })

      })
    })
  })
})
