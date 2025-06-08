import chai from 'chai'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {
  applyYamlPatch,
  FrontmatterHandler,
  parseJsonPatchPath,
} from '../../../../src/adbs/documents/handlers/frontmatter.js'

const { expect } = chai.use(sinonChai)

describe('adbs', () => {
  describe('documents', () => {
    describe('handlers', () => {
      describe('frontmatter', () => {
        describe('FrontmatterHandler', () => {
          describe('get', () => {
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
          describe('put', () => {
            describe('FrontmatterHandler put/patch', () => {
              it('should update frontmatter with put (happy path)', async () => {
                const fs = {
                  readFile: sinon.stub().resolves('---\ntitle: Old\n---\n# Content'),
                  writeFile: sinon.stub().resolves(),
                }
                const handler = new FrontmatterHandler('dir', fs)
                fs.readFile.resolves('---\ntitle: Old\n---\n# Content')
                const newContent = JSON.stringify({ title: 'New' })
                await handler.put('file.md', newContent, {})
                expect(fs.readFile).to.have.been.calledOnceWith('dir/file.md', 'utf-8')
                expect(fs.writeFile).to.have.been.calledOnce
                const written = fs.writeFile.getCall(0).args[1]
                expect(written).to.include('title: New')
                expect(written).to.include('---')
              })
            })
            describe('patch', () => {
              it('should patch frontmatter with patch (happy path)', async () => {
                const fs = {
                  readFile: sinon.stub().resolves('---\ntitle: Old\n---\n# Content'),
                  writeFile: sinon.stub().resolves(),
                }
                const handler = new FrontmatterHandler('dir', fs)
                const patch = JSON.stringify([{ op: 'replace', path: '/title', value: 'Patched' }])
                await handler.patch('file.md', patch, {})
                expect(fs.readFile).to.have.been.calledOnceWith('dir/file.md', 'utf-8')
                expect(fs.writeFile).to.have.been.calledOnce
                const written = fs.writeFile.getCall(0).args[1]
                expect(written).to.include('title: Patched')
                expect(written).to.include('---')
              })
            })
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

        describe('applyYamlPatch', () => {
          let doc: any
          beforeEach(() => {
            doc = {
              setIn: sinon.stub(),
              deleteIn: sinon.stub(),
              getIn: sinon.stub(),
            }
          })
          it('should add a value', () => {
            applyYamlPatch(doc, [{ op: 'add', path: '/baz', value: 42 }])
            expect(doc.setIn).to.have.been.calledOnceWith(['baz'], 42)
          })
          it('should replace a value', () => {
            applyYamlPatch(doc, [{ op: 'replace', path: '/foo', value: 'baz' }])
            expect(doc.setIn).to.have.been.calledOnceWith(['foo'], 'baz')
          })
          it('should remove a value', () => {
            applyYamlPatch(doc, [{ op: 'remove', path: '/foo' }])
            expect(doc.deleteIn).to.have.been.calledOnceWith(['foo'])
          })
          it('should copy a value', () => {
            doc.getIn.withArgs(['foo']).returns('bar')
            applyYamlPatch(doc, [{ op: 'copy', from: '/foo', path: '/copied' }])
            expect(doc.getIn).to.have.been.calledWith(['foo'])
            expect(doc.setIn).to.have.been.calledWith(['copied'], 'bar')
          })
          it('should not call setIn for copy if source is missing', () => {
            doc.getIn.withArgs(['foo']).returns(undefined)
            applyYamlPatch(doc, [{ op: 'copy', from: '/foo', path: '/copied' }])
            expect(doc.getIn).to.have.been.calledWith(['foo'])
            expect(doc.setIn).to.not.have.been.calledWith(['copied'], sinon.match.any)
          })
          it('should move a value', () => {
            doc.getIn.withArgs(['foo']).returns('bar')
            applyYamlPatch(doc, [{ op: 'move', from: '/foo', path: '/moved' }])
            expect(doc.getIn).to.have.been.calledWith(['foo'])
            expect(doc.setIn).to.have.been.calledWith(['moved'], 'bar')
            expect(doc.deleteIn).to.have.been.calledWith(['foo'])
          })
          it('should not call setIn/deleteIn for move if source is missing', () => {
            doc.getIn.withArgs(['foo']).returns(undefined)
            applyYamlPatch(doc, [{ op: 'move', from: '/foo', path: '/moved' }])
            expect(doc.getIn).to.have.been.calledWith(['foo'])
            expect(doc.setIn).to.not.have.been.calledWith(['moved'], sinon.match.any)
            expect(doc.deleteIn).to.not.have.been.calledWith(['foo'])
          })
          it('should work with nested paths', () => {
            applyYamlPatch(doc, [{ op: 'replace', path: '/nested/a', value: 2 }])
            expect(doc.setIn).to.have.been.calledWith(['nested', 'a'], 2)
          })
          it('should work with array indices', () => {
            applyYamlPatch(doc, [{ op: 'replace', path: '/arr/1', value: 99 }])
            expect(doc.setIn).to.have.been.calledWith(['arr', 1], 99)
          })
        })
      })
    })
  })
})
