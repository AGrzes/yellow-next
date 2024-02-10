import 'mocha'
import 'reflect-metadata'

import chai from 'chai'
import { ReplaySubject, firstValueFrom, map, of } from 'rxjs'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ADBS } from '../../src/adbs/adbs.js'
import { FileParser } from '../../src/adbs/file-parser/file-parser.js'
import { FileSource } from '../../src/adbs/file-source.js'
import { ChangeEvent } from '../../src/adbs/model.js'
const { expect } = chai.use(sinonChai)

describe('ADBS', () => {
  it('should setup file flow', async () => {
    const observe = sinon.stub().returns(of({ key: 'path', kind: 'update', hint: 'add' }))
    const fileSource = { observe } as unknown as FileSource
    const parse = sinon.stub().returns(
      map<ChangeEvent<void, string>, ChangeEvent<Record<string, any>, string>>((event) => ({
        ...event,
        content: 'content',
      }))
    )
    const fileParser = { parse } as unknown as FileParser
    const observer = new ReplaySubject()
    const documentLoaderFactory = sinon.stub().returns({ observer: () => observer })
    const documentStoreFactory = sinon.stub().returns('store')
    const adbs = new ADBS(fileSource, fileParser, documentLoaderFactory, documentStoreFactory)
    adbs.setupFileFlow(['folder'])
    expect(fileSource.observe).to.be.calledOnceWith('folder')
    expect(parse).to.be.calledOnce
    expect(documentLoaderFactory).to.be.calledOnceWith('store', 'adbs')
    expect(documentStoreFactory).to.be.calledOnceWith('adbs')
    expect(await firstValueFrom(observer)).to.deep.equal({
      key: 'path',
      kind: 'update',
      content: 'content',
      hint: 'add',
    })
  })
})
