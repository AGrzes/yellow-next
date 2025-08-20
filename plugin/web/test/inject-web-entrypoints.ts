import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { injectWebEntrypoints } from '../src/inject-web-entrypoints.js'

const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('web', () => {
    describe('resolveBareFromImporter', () => {
      it('should return a plugin', () => {
        const plugin = injectWebEntrypoints(null as any)
        expect(plugin).to.be.an('object')
        expect(plugin.name).to.equal('inject-web-entrypoints')
        expect(plugin.enforce).to.equal('pre')
        expect(plugin.config).to.be.a('function')
        expect(plugin.transformIndexHtml).to.be.a('function')
      })

      describe('config', () => {
        it('should create new allow list with entrypoints roots', () => {
          const entrypoints = [
            { root: '/path/to/entrypoint1', script: 'script' },
            { root: '/path/to/entrypoint2', script: 'script' },
          ]
          const plugin = injectWebEntrypoints(entrypoints)
          const oldConfig = {} as any
          const newConfig = (plugin.config as any)(oldConfig)
          expect(newConfig).to.deep.equal({
            server: {
              fs: {
                allow: ['/path/to/entrypoint1', '/path/to/entrypoint2'],
              },
            },
          })
        })
        it('should add entrypoints roots to existing fs allow list', () => {
          const entrypoints = [
            { root: '/path/to/entrypoint1', script: 'script' },
            { root: '/path/to/entrypoint2', script: 'script' },
          ]
          const plugin = injectWebEntrypoints(entrypoints)
          const oldConfig = { server: { fs: { allow: ['/existing/path'] } } }
          const newConfig = (plugin.config as any)(oldConfig)

          expect(newConfig).to.deep.equal({
            server: {
              fs: {
                allow: ['/existing/path', '/path/to/entrypoint1', '/path/to/entrypoint2'],
              },
            },
          })
        })
      })
    })
  })
})
