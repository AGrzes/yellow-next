import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { Router, ROUTER, SERVER, SERVER_COMMAND, SERVER_COMMAND_NAME } from '../src/index.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('cli', () => {
    it('should export ROUTER', () => {
      expect(ROUTER).to.be.a('string')
    })
    it('should export SERVER', () => {
      expect(SERVER).to.be.a('string')
    })
    it('should export SERVER_COMMAND', () => {
      expect(SERVER_COMMAND).to.be.a('string')
    })
    it('should export SERVER_COMMAND_NAME', () => {
      expect(SERVER_COMMAND_NAME).to.be.a('string')
    })
    it('should export Router', () => {
      expect(Router).to.be.a('function')
    })
  })
})
