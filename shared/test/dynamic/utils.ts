import { expect } from 'chai'
import 'mocha'
import { mostSpecificClass } from '../../src/dynamic/utils.js'

const A = { name: 'A', iri: 'A', properties: [] }
const B = { name: 'B', iri: 'B', properties: [] }
const C = { name: 'C', iri: 'C', properties: [], ancestors: [B] }

describe('dynamic', () => {
  describe('accass', () => {
    describe('utils', () => {
      describe('mostSpecificClass', () => {
        it('should return only class accepted', () => {
          expect(mostSpecificClass(A)).to.equal(A)
        })
        it('should return first of unrelated classes', () => {
          expect(mostSpecificClass(A, B)).to.equal(A)
        })
        it('should return most specific of related classes', () => {
          expect(mostSpecificClass(B, C)).to.equal(C)
        })
      })
    })
  })
})
