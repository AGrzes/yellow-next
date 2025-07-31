import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { VITE_ROUTER } from '../src/index.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('cli', () => {
    it('should export VITE_ROUTER', () => {
      expect(VITE_ROUTER).to.be.a('string')
    })
  })
})
