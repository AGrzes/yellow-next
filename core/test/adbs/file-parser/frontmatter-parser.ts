import 'mocha'

import { expect } from 'chai'
import { FrontmatterParser } from '../../../src/adbs/file-parser/frontmatter-parser.js'
describe('adbs', () => {
  describe('file-parser', () => {
    describe('FrontmatterParser', () => {
      it('should parse frontmatter', async () => {
        const read = async () => '---\nfoo: bar\n---\ncontent'
        const parser = new FrontmatterParser(read)
        const parsed = await parser.parse('path.mdx')
        expect(parsed).to.deep.equal([{ document: { foo: 'bar' }, id: 'frontmatter' }])
      })

      it('should skip based on extension files', async () => {
        const read = async () => '---\nfoo: bar\n---\ncontent'
        const parser = new FrontmatterParser(read)
        const parsed = await parser.parse('path.md')
        expect(parsed).to.deep.equal([])
      })

      it('should use custom extensions', async () => {
        const read = async () => '---\nfoo: bar\n---\ncontent'
        const parser = new FrontmatterParser(read, ['.md'])
        const parsed = await parser.parse('path.md')
        expect(parsed).to.deep.equal([{ document: { foo: 'bar' }, id: 'frontmatter' }])
      })
    })
  })
})
