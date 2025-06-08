import chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { FrontmatterHandler } from '../../../../src/adbs/documents/handlers/frontmatter.js'

const { expect } = chai.use(sinonChai)

describe('adbs', () => {
  describe('documents', () => {
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
  })
})
