import { factoryForConstructor, factoryFromConstructor } from '../src/utils.js'

import * as chai from 'chai'
import 'mocha'
import sinonChai from 'sinon-chai'
const { expect } = chai.use(sinonChai)

describe('plugin', () => {
  describe('utils', () => {
    describe('factoryForConstructor', () => {
      it('should create a factory function for a constructor', () => {
        class Test {
          constructor(
            public a: number,
            public b: string
          ) {}
        }
        const factory = factoryForConstructor(Test)()
        const instance = factory(42, 'hello')
        expect(instance).to.be.instanceOf(Test)
        expect(instance).to.have.property('a', 42)
        expect(instance).to.have.property('b', 'hello')
      })
    })
    describe('factoryFromConstructor', () => {
      it('should create a factory function for a constructor', () => {
        class Test {
          constructor(
            public a: number,
            public b: string
          ) {}
        }
        const factory = factoryFromConstructor(Test)
        const instance = factory(42, 'hello')
        expect(instance).to.be.instanceOf(Test)
        expect(instance).to.have.property('a', 42)
        expect(instance).to.have.property('b', 'hello')
      })
    })
  })
})
