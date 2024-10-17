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
      it('should parse js array', async () => {
        const read = async () => '[]'
        const parser = new ScriptParser()
        const parsed = await parser.parse('test/adbs/file-parser/scripts/array.js', read)
        expect(parsed).to.deep.equal([{ document: { foo: 'bar' }, id: 'js#0' }])
      })
      it('should call js function', async () => {
        const read = async () => '() => ({ foo: "bar" })'
        const parser = new ScriptParser()
        const parsed = await parser.parse('test/adbs/file-parser/scripts/function.js', read)
        expect(parsed).to.have.lengthOf(1)
        expect(parsed).to.deep.equal([{ document: 'f', id: 'js#0' }])
      })
      it('should call async js function', async () => {
        const read = async () => 'async () => ({ foo: "bar" })'
        const parser = new ScriptParser()
        const parsed = await parser.parse('test/adbs/file-parser/scripts/async-function.js', read)
        expect(parsed).to.have.lengthOf(1)
        expect(parsed).to.deep.equal([{ document: 'f', id: 'js#0' }])
      })
    })
  })
})
