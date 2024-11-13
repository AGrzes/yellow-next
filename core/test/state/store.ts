import chai, { expect } from 'chai'
import yaml from 'js-yaml'
import 'mocha'
import path from 'path'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { FileStore } from '../../src/state/store'

chai.use(sinonChai)
describe('state', () => {
  describe('store', () => {
    describe('FileStore', () => {
      const baseDir = '/tmp/store'
      let store: FileStore<any>
      let fsMock: any

      beforeEach(() => {
        fsMock = {
          readFile: sinon.stub(),
          writeFile: sinon.stub(),
          mkdir: sinon.stub(),
        }
        store = new FileStore(baseDir, fsMock)
      })

      afterEach(() => {
        sinon.restore()
      })

      describe('get', () => {
        it('should read and parse YAML file', async () => {
          const key = ['test']
          const filePath = path.join(baseDir, ...key) + '.yaml'
          const fileContent = yaml.dump({ foo: 'bar' })
          fsMock.readFile.resolves(fileContent)

          const result = await store.get(key)

          expect(fsMock.readFile).to.have.been.calledWith(filePath, 'utf8')
          expect(result).to.deep.equal({ foo: 'bar' })
        })
      })

      describe('put', () => {
        it('should write YAML file and create directories if needed', async () => {
          const key = ['test']
          const value = { foo: 'bar' }
          const filePath = path.join(baseDir, ...key) + '.yaml'
          const dirPath = path.dirname(filePath)
          const fileContent = yaml.dump(value)

          await store.put(key, value)

          expect(fsMock.mkdir).to.have.been.calledWith(dirPath, { recursive: true })
          expect(fsMock.writeFile).to.have.been.calledWith(filePath, fileContent, 'utf8')
        })
      })
    })
  })
})