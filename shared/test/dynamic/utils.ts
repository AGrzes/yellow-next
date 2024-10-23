import { expect } from 'chai'
import 'mocha'
import { mostSpecificClass } from '../../src/dynamic/utils.js'

const A = { name: 'A', iri: 'A', properties: [] }

describe('dynamic', () => {
  describe('accass', () => {
    describe('utils', () => {
      describe('mostSpecificClass', () => {
        it('should return only class accepted', () => {
          expect(mostSpecificClass(A)).to.equal(A)
        })
      })
    })
  })
})
