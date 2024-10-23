import { expect } from 'chai'
import 'mocha'
import { mostSpecificClass } from '../../src/dynamic/utils.js'

const A = { name: 'A', iri: 'A', properties: [] }
const B = { name: 'B', iri: 'B', properties: [] }
const C = { name: 'C', iri: 'C', properties: [], ancestors: [A] }

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
      })
    })
  })
})
