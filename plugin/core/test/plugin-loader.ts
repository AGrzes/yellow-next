import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'mocha'
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
    })
  })
})
