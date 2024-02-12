import 'mocha'

import { expect } from 'chai'
import { DocumentStore, documentStoreFactory } from '../../../src/adbs/documents/store.js'
describe('adbs', () => {
  describe('document', () => {
    describe('documentStoreFactory', () => {
      it('should create a document store', () => {
        const store = documentStoreFactory('instance')
        expect(store).to.be.instanceOf(DocumentStore)
      })
    })
  })
})