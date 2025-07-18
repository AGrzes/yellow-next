import * as chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { makeLookupManifest } from '../src/lookup-manifests.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('core', () => {
    describe('lookup-manifest', () => {
      it('should scan for plugin manifests', async () => {
        const requirePaths = sinon.stub().returns(['path/to/plugins'])
        const glob = sinon.stub().resolves([])
        const readFile = sinon.stub()
        const lookupManifest = makeLookupManifest(requirePaths, glob, readFile)
        await lookupManifest()
        expect(requirePaths).to.have.been.calledOnceWith('*')
        expect(glob).to.have.been.calledOnceWith([
          'path/to/plugins/*/yellow-plugin.json',
          'path/to/plugins/@*/*/yellow-plugin.json',
        ])
      })
      it('should load found manifests', async () => {
        const requirePaths = sinon.stub().returns(['path/to/plugins'])
        const glob = sinon.stub().resolves(['path/to/plugins/plugin-a/yellow-plugin.json'])
        const readFile = sinon.stub().resolves(JSON.stringify({ name: 'plugin-a' }))
        const lookupManifest = makeLookupManifest(requirePaths, glob, readFile)
        const manifests = await lookupManifest()
        expect(manifests).to.have.lengthOf(1)
        expect(manifests[0]).to.deep.equal({ name: 'plugin-a', base: 'path/to/plugins/plugin-a' })
        expect(readFile).to.have.been.calledOnceWith('path/to/plugins/plugin-a/yellow-plugin.json', 'utf-8')
      })
      it('should handle errors in manifest loading', async () => {
        const requirePaths = sinon.stub().returns(['path/to/plugins'])
        const glob = sinon.stub().resolves(['path/to/plugins/plugin-a/yellow-plugin.json'])
        const readFile = sinon.stub().rejects(new Error('Failed to read file'))
        const lookupManifest = makeLookupManifest(requirePaths, glob, readFile)
        const manifests = await lookupManifest()
        expect(manifests).to.have.lengthOf(0)
        expect(readFile).to.have.been.calledOnceWith('path/to/plugins/plugin-a/yellow-plugin.json', 'utf-8')
      })
    })
  })
})
