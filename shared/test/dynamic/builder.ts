import { expect } from 'chai'
import 'mocha'
import { schema } from '../../src/dynamic/builder.js'

describe.only('dynamic', () => {
  describe('builder', () => {
    it('should build schema', () => {
      const s = schema()
      const options = s.build()
      expect(options).to.have.property('graph')
    })
  })
})
