import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'mocha'
import { AccessService } from '../../../src/adbs/access/service'

const { expect } = chai.use(chaiAsPromised)

describe('adbs', () => {
  describe('access', () => {
    describe('AccessService', () => {
      it('should list files in the directory', async () => {
        const service = new AccessService('test-documents', {
          readdir: async () => ['file1.txt', 'file2.txt'],
        } as any)
        const files = await service.listFiles()
        expect(files).to.deep.equal([
          { name: 'file1.txt', path: 'file1.txt', formats: [] },
          { name: 'file2.txt', path: 'file2.txt', formats: [] },
        ])
      })
      it('should list files in the subdirectory', async () => {
        const service = new AccessService('test-documents', {
          readdir: async () => ['file1.txt', 'file2.txt'],
        } as any)
        const files = await service.listFiles('subpath')
        expect(files).to.deep.equal([
          { name: 'file1.txt', path: 'subpath/file1.txt', formats: [] },
          { name: 'file2.txt', path: 'subpath/file2.txt', formats: [] },
        ])
      })
    })
  })
})
