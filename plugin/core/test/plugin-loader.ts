import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'mocha'
import { cwd } from 'process'
import sinonChai from 'sinon-chai'
import { loadPlugin } from '../src/plugin-loader.js'
const { expect } = chai.use(sinonChai).use(chaiAsPromised)

describe('plugin', () => {
  describe('core', () => {
    describe('plugin-loader', () => {
      /*
        should reject invalid manifest version
        should load plugin with default export function
        should load plugin with whole module as function
        should throw error if entrypoint does not export a function
        should throw error if module fails to load
      */
      it('should reject invalid manifest version', async () => {
        const manifest = { manifestVersion: '2', base: 'path/to/plugin', entrypoint: 'index.js' }
        await expect(loadPlugin(manifest as any)).to.be.rejectedWith('Unsupported plugin manifest version: 2')
      })
      it('should load plugin with default export function', async () => {
        const manifest = { manifestVersion: '1', base: cwd(), entrypoint: 'test/sample/default.mjs' }
        const plugin = await loadPlugin(manifest)
        expect(plugin).to.be.a('function')
      })
      it('should load plugin with whole exports as function (cjs style)', async () => {
        const manifest = { manifestVersion: '1', base: cwd(), entrypoint: 'test/sample/module.cjs' }
        const plugin = await loadPlugin(manifest)
        expect(plugin).to.be.a('function')
      })
      it('should throw error if entrypoint does not export a function', async () => {
        const manifest = {
          manifestVersion: '1',
          name: 'no-entrypoint',
          base: cwd(),
          entrypoint: 'test/sample/no-entrypoint.mjs',
        }
        await expect(loadPlugin(manifest)).to.be.rejectedWith(
          'Plugin no-entrypoint does not export an entrypoint function'
        )
      })
      it('should throw error if module fails to load', async () => {
        const manifest = { manifestVersion: '1', base: cwd(), entrypoint: 'test/sample/missing.mjs' }
        await expect(loadPlugin(manifest)).to.be.rejectedWith(`Cannot find module '${cwd()}/test/sample/missing.mjs'`)
      })
    })
  })
})
