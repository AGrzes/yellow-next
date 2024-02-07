import 'mocha'
import 'reflect-metadata'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { watch } from 'chokidar'
import { firstValueFrom } from 'rxjs'
import { mock, stub } from 'sinon'
import sinonChai from 'sinon-chai'
import { FileSource } from '../../src/adbs/file-source'
const expect = chai.use(sinonChai).use(chaiAsPromised).expect

describe('FileSource', () => {
  it('should create watcher', () => {
    const createWatcher: typeof watch = mock().returns({ on: () => {}, close: () => {} })
    const fileSource = new FileSource(createWatcher)
    fileSource.observe('cwd')
    expect(createWatcher).to.have.been.calledWithExactly('.', { cwd: 'cwd' })
  })
  it('should react to add event', async () => {
    const on = stub()
    const createWatcher: typeof watch = stub().returns({ on, close: () => {} })
    const fileSource = new FileSource(createWatcher)
    const observer = fileSource.observe('cwd')
    const first = firstValueFrom(observer)
    on.getCall(0).args[1]('path')
    expect(await first).to.deep.equal({ key: 'path', kind: 'update', hint: 'add' })
  })
  it('should react to change event', async () => {
    const on = stub()
    const createWatcher: typeof watch = stub().returns({ on, close: () => {} })
    const fileSource = new FileSource(createWatcher)
    const observer = fileSource.observe('cwd')
    const first = firstValueFrom(observer)
    on.getCall(1).args[1]('path')
    expect(await first).to.deep.equal({ key: 'path', kind: 'update', hint: 'update' })
  })
  it('should react to addDir event', async () => {
    const on = stub()
    const createWatcher: typeof watch = stub().returns({ on, close: () => {} })
    const fileSource = new FileSource(createWatcher)
    const observer = fileSource.observe('cwd')
    const first = firstValueFrom(observer)
    on.getCall(2).args[1]('path')
    expect(await first).to.deep.equal({ key: 'path', kind: 'update', hint: 'add' })
  })
  it('should react to unlink event', async () => {
    const on = stub()
    const createWatcher: typeof watch = stub().returns({ on, close: () => {} })
    const fileSource = new FileSource(createWatcher)
    const observer = fileSource.observe('cwd')
    const first = firstValueFrom(observer)
    on.getCall(3).args[1]('path')
    expect(await first).to.deep.equal({ key: 'path', kind: 'delete' })
  })
  it('should react to unlinkDir event', async () => {
    const on = stub()
    const createWatcher: typeof watch = stub().returns({ on, close: () => {} })
    const fileSource = new FileSource(createWatcher)
    const observer = fileSource.observe('cwd')
    const first = firstValueFrom(observer)
    on.getCall(4).args[1]('path')
    expect(await first).to.deep.equal({ key: 'path', kind: 'delete' })
  })
  it('should react to error event', async () => {
    const on = stub()
    const close = stub()
    const createWatcher: typeof watch = stub().returns({ on, close })
    const fileSource = new FileSource(createWatcher)
    const observer = fileSource.observe('cwd')
    const first = firstValueFrom(observer)
    on.getCall(5).args[1]('error')
    await expect(first).to.eventually.be.rejectedWith('error')
    expect(close).to.have.been.calledOnce
  })
})
