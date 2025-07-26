import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { lookupManifests, setupContext } from '../src/index.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('core', () => {
    it('should export lookupManifest', () => {
      expect(lookupManifests).to.be.a('function')
    })
    it('should export setupContext', () => {
      expect(setupContext).to.be.a('function')
    })
  })
})
