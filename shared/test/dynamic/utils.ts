import { expect } from 'chai'
import 'mocha'
import { classHierarchy, mostSpecificClass } from '../../src/dynamic/utils.js'

const A = { name: 'A', iri: 'A', properties: [] }
const B = { name: 'B', iri: 'B', properties: [] }
const C = { name: 'C', iri: 'C', properties: [], ancestors: [B] }
const D = { name: 'D', iri: 'D', properties: [], ancestors: [C, B] }
const E = { name: 'E', iri: 'E', properties: [], ancestors: [A] }
const F = { name: 'F', iri: 'F', properties: [], ancestors: [E, A] }

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
        it('should return first of unrelated classes even if it have less ancestors', () => {
          expect(mostSpecificClass(E, D)).to.equal(E)
        })
      })
      describe('classHierarchy', () => {
        it('should return a class for a class without ancestors', () => {
          expect(classHierarchy(A)).to.deep.equal([A])
        })
        it('should return a class and its ancestors', () => {
          expect(classHierarchy(C)).to.deep.equal([C, B])
        })
        it('should not place ancestors inside hierarchy', () => {
          expect(classHierarchy(B, C)).to.deep.equal([C, B])
        })
        it('should list ancestors breadth first', () => {
          expect(classHierarchy(D, F)).to.deep.equal([D, F, C, E, B, A])
        })
      })
    })
  })
})
