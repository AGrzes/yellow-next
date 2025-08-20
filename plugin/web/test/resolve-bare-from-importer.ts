import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { resolveBareFromImporter } from '../src/resolve-bare-from-importer.js'

const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('web', () => {
    describe('resolveBareFromImporter', () => {
      it('should return a plugin', () => {
        const plugin = resolveBareFromImporter(null as any)
        expect(plugin).to.be.an('object')
        expect(plugin.name).to.equal('resolve-bare-from-importer')
        expect(plugin.resolveId).to.be.a('function')
      })

      describe('resolveId', () => {
        it('Should short circuit if the importer is not defined', async () => {
          const resolver = {
            isCore: sinon.stub().returns(false),
            sync: sinon.stub(),
          }
          const plugin = resolveBareFromImporter(resolver as any)
          const id = await (plugin.resolveId as any)('some-module', undefined)
          expect(id).to.be.null
        })
        it('Should short circuit if the source is a core module', async () => {
          const resolver = {
            isCore: sinon.stub().returns(true),
            sync: sinon.stub(),
          }
          const plugin = resolveBareFromImporter(resolver as any)
          const id = await (plugin.resolveId as any)('fs', 'some-importer')
          expect(id).to.be.null
        })
        it('Should resolve the module relative to the importer', async () => {
          const resolver = {
            isCore: sinon.stub().returns(false),
            sync: sinon.stub().returns('/path/to/resolved/module.js'),
          }
          const plugin = resolveBareFromImporter(resolver as any)
          const id = await (plugin.resolveId as any)('some-module', '/path/to/importer.js')
          expect(id).to.equal('/path/to/resolved/module.js')
          expect(resolver.sync).to.be.calledOnceWith('some-module', { basedir: '/path/to' })
        })
        it('Should return null if the module cannot be resolved', async () => {
          const resolver = {
            isCore: sinon.stub().returns(false),
            sync: sinon.stub().throws(new Error('Module not found')),
          }
          const plugin = resolveBareFromImporter(resolver as any)
          const id = await (plugin.resolveId as any)('some-module', '/path/to/importer.js')
          expect(id).to.be.null
          expect(resolver.sync).to.be.calledOnceWith('some-module', { basedir: '/path/to' })
        })
      })
    })
  })
})
