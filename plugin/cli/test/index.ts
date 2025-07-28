import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { COMMAND, PROGRAM_NAME, ROOT_COMMAND } from '../src/index.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('cli', () => {
    it('should export COMMAND', () => {
      expect(COMMAND).to.be.a('string')
    })
    it('should export ROOT_COMMAND', () => {
      expect(ROOT_COMMAND).to.be.a('string')
    })
    it('should export PROGRAM_NAME', () => {
      expect(PROGRAM_NAME).to.be.a('string')
    })
  })
})
