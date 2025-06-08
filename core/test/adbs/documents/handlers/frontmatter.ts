import chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { FrontmatterHandler, parseJsonPatchPath } from '../../../../src/adbs/documents/handlers/frontmatter.js'

const { expect } = chai.use(sinonChai)

describe.only('adbs', () => {
  describe('documents', () => {
    describe('handlers', () => {
      describe('frontmatter', () => {
        describe('FrontmatterHandler', () => {
          it('should extract frontmatter from markdown files', async () => {
            const fs = {
              readFile: sinon.stub().resolves('---\ntitle: Test Document\n---\n# Content'),
              writeFile: sinon.stub().resolves(),
            }
            const handler = new FrontmatterHandler('documents', fs)
            const result = await handler.get('test.md', {})
            expect(result).to.deep.equal(
              JSON.stringify({
                title: 'Test Document',
              })
            )
            expect(fs.readFile).to.have.been.calledOnceWith('documents/test.md', 'utf-8')
          })
        })

        describe('parseJsonPatchPath', () => {
          it('should parse simple path', () => {
            expect(parseJsonPatchPath('/foo/bar')).to.deep.equal(['foo', 'bar'])
          })

          it('should parse root path', () => {
            expect(parseJsonPatchPath('/')).to.deep.equal([''])
          })

          it('should parse numeric segments as numbers', () => {
            expect(parseJsonPatchPath('/foo/0/bar/1')).to.deep.equal(['foo', 0, 'bar', 1])
          })

          it('should unescape ~0 and ~1', () => {
            expect(parseJsonPatchPath('/foo~1bar/~0baz')).to.deep.equal(['foo/bar', '~baz'])
          })

          it('should handle empty string', () => {
            expect(parseJsonPatchPath('')).to.deep.equal([''])
          })

          it('should handle multiple leading slashes', () => {
            expect(parseJsonPatchPath('///foo/bar')).to.deep.equal(['foo', 'bar'])
          })
        })
      })
    })
  })
})
