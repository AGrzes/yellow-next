import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
import { ServiceRequest } from '../../src/context/model.js'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('core', () => {
    describe('context', () => {
      describe('model', () => {
        describe('ServiceRequest', () => {
          describe('simple', () => {
            it('should create a simple service request', () => {
              const request = ServiceRequest.simple('testService')
              expect(request).to.deep.equal({ identifier: 'testService' })
            })
          })
          describe('named', () => {
            it('should create a named service request', () => {
              const request = ServiceRequest.named('testService', 'testName')
              expect(request).to.deep.equal({ identifier: 'testService', qualifier: 'testName' })
            })
          })
          describe('optional', () => {
            it('should create an optional service request', () => {
              const request = ServiceRequest.optional('testService')
              expect(request).to.deep.equal({ identifier: 'testService', optional: true })
            })
          })
          describe('multiple', () => {
            it('should create a multiple service request', () => {
              const request = ServiceRequest.multiple('testService')
              expect(request).to.deep.equal({ identifier: 'testService', multiple: true, optional: true })
            })
            it('should create a mandatory multiple service request', () => {
              const request = ServiceRequest.multiple('testService', false)
              expect(request).to.deep.equal({ identifier: 'testService', multiple: true, optional: false })
            })
          })
        })
      })
    })
  })
})
