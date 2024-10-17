import 'mocha'

import { expect } from 'chai'
import { ScriptParser } from '../../../src/adbs/file-parser/script-parser.js'
describe('adbs', () => {
  describe('file-parser', () => {
    describe('YamlParser', () => {
      it('should parse ts', async () => {
        const read = async () => ''
        const parser = new ScriptParser()
        const parsed = await parser.parse('test/adbs/file-parser/scripts/object.ts', read)
        expect(parsed).to.deep.equal([{ document: { foo: 'bar' }, id: 'js#0' }])
      })
    })
  })
})
