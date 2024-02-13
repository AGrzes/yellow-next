import 'mocha'
import 'reflect-metadata'

import chai from 'chai'
import { DataFactory } from 'n3'
import { ReplaySubject, firstValueFrom, map, of } from 'rxjs'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ADBS } from '../../src/adbs/adbs.js'
import { FileParser } from '../../src/adbs/file-parser/file-parser.js'
import { FileSource } from '../../src/adbs/file-source.js'
import { DocumentGraphMapper } from '../../src/adbs/graph/mapper.js'
import { GraphStore } from '../../src/adbs/graph/store.js'
import { ChangeEvent } from '../../src/adbs/model.js'
const { expect } = chai.use(sinonChai)
describe('adbs', () => {
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
      const documentSourceFactory = sinon.stub().returns({ observable: of({}) })
      const storeObserver = new ReplaySubject()
      const adbs = new ADBS(
        fileSource,
        fileParser,
        documentLoaderFactory,
        documentStoreFactory,
        {
          map: () =>
            map((event: ChangeEvent<Record<string, any>, string>) => ({
              ...event,
              key: DataFactory.namedNode('urn:id'),
              content: [
                DataFactory.triple(
                  DataFactory.namedNode('urn:s'),
                  DataFactory.namedNode('urn:p'),
                  DataFactory.namedNode('urn:o')
                ),
              ],
            })),
        } as unknown as DocumentGraphMapper,
        { observer: storeObserver } as unknown as GraphStore,
        documentSourceFactory
      )
      adbs.setupFileFlow(['folder'])
      adbs.setupGraphFlow()
      expect(fileSource.observe).to.be.calledOnceWith('folder')
      expect(parse).to.be.calledOnce
      expect(documentLoaderFactory).to.be.calledOnceWith('store', 'adbs')
      expect(documentStoreFactory).to.be.calledOnceWith('adbs')
      expect(documentSourceFactory).to.be.calledOnceWith('store')
      expect(await firstValueFrom(observer)).to.deep.equal({
        key: 'path',
        kind: 'update',
        content: 'content',
        hint: 'add',
      })
      expect(await firstValueFrom(storeObserver)).to.deep.equal({
        key: DataFactory.namedNode('urn:id'),
        content: [
          DataFactory.triple(
            DataFactory.namedNode('urn:s'),
            DataFactory.namedNode('urn:p'),
            DataFactory.namedNode('urn:o')
          ),
        ],
      })
    })
  })
})