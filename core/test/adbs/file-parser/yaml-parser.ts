import 'mocha'

import { expect } from 'chai'
import { YamlParser } from '../../../src/adbs/file-parser/yaml-parser.js'
describe('adbs', () => {
  describe('file-parser', () => {
    describe('YamlParser', () => {
      it('should parse yaml', async () => {
        const read = async () => 'foo: bar'
        const parser = new YamlParser()
        const parsed = await parser.parse('path.yaml', read)
        expect(parsed).to.deep.equal([{ document: { foo: 'bar' }, id: 'yaml#0' }])
      })

      it('should parse multiple documents', async () => {
        const read = async () => 'foo: bar\n---\nfoo: baz'
        const parser = new YamlParser()
        const parsed = await parser.parse('path.yaml', read)
        expect(parsed).to.deep.equal([
          { document: { foo: 'bar' }, id: 'yaml#0' },
          { document: { foo: 'baz' }, id: 'yaml#1' },
        ])
      })

      it('should skip based on extension files', async () => {
        const read = async () => 'foo: bar'
        const parser = new YamlParser()
        const parsed = await parser.parse('path.md', read)
        expect(parsed).to.deep.equal([])
      })

      it('should use custom extensions', async () => {
        const read = async () => 'foo: bar'
        const parser = new YamlParser(['.yaml-ld'])
        const parsed = await parser.parse('path.yaml-ld', read)
        expect(parsed).to.deep.equal([{ document: { foo: 'bar' }, id: 'yaml#0' }])
      })
    })
  })
})