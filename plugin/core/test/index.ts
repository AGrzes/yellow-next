import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { lookupManifest } from '../src/index.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('core', () => {
    it('should export lookupManifest', () => {
      expect(lookupManifest).to.be.a('function')
    })
  })
})
