import 'mocha'

import { expect } from 'chai'
import { FrontmatterParser } from '../../../src/adbs/file-parser/frontmatter-parser.js'
describe('adbs', () => {
  describe('file-parser', () => {
    describe('FrontmatterParser', () => {
      it('should parse frontmatter', async () => {
        const read = async () => '---\nfoo: bar\n---\ncontent'
        const parser = new FrontmatterParser()
        const parsed = await parser.parse('path.mdx', read)
        expect(parsed).to.deep.equal([{ document: { foo: 'bar' }, id: 'frontmatter' }])
      })

      it('should skip based on extension files', async () => {
        const read = async () => '---\nfoo: bar\n---\ncontent'
        const parser = new FrontmatterParser()
        const parsed = await parser.parse('path.mxd', read)
        expect(parsed).to.deep.equal([])
      })

      it('should use custom extensions', async () => {
        const read = async () => '---\nfoo: bar\n---\ncontent'
        const parser = new FrontmatterParser(['.md'])
        const parsed = await parser.parse('path.md', read)
        expect(parsed).to.deep.equal([{ document: { foo: 'bar' }, id: 'frontmatter' }])
      })
    })
  })
})
