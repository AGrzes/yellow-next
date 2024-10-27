import { expect, use } from 'chai'
import 'mocha'
import Sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ConfluenceClient } from '../src/client'
import { Confluence } from '../src/index.js'
use(sinonChai)

describe('confluence', () => {
  describe('Confluence', () => {
    it('should create instance', () => {
      const client = Sinon.createStubInstance(ConfluenceClient)
      const confluence = new Confluence(client)
      expect(confluence).to.be.instanceOf(Confluence)
    })
    describe('spaceId', () => {
      it('should get space id', async () => {
        const client = Sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.resolves({ body: { id: 123 }, status: 200 })
        const spaceId = await confluence.spaceId('test-space')
        expect(spaceId).to.be.equal(123)
        expect(client.get).to.have.been.calledWith('wiki/rest/api/space/test-space')
      })
    })
    describe('page', () => {
      it('should get draft page', async () => {
        const client = Sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [{ id: 123, version: { number: 1 } }] },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title')
        expect(page).to.be.deep.equal({ id: 123, version: 1 })
        expect(client.get).to.have.been.calledOnceWith(
          'wiki/rest/api/content/?type=page&spaceKey=test-space&title=test-title&status=draft&expand=version'
        )
      })
      it('should get published page', async () => {
        const client = Sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [] },
          status: 200,
        })
        client.get.onSecondCall().resolves({
          body: { results: [{ id: 123, version: { number: 1 } }] },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title')
        expect(page).to.be.deep.equal({ id: 123, version: 1 })
        expect(client.get).to.have.been.calledTwice
        expect(client.get).to.have.been.calledWith(
          'wiki/rest/api/content/?type=page&spaceKey=test-space&title=test-title&status=draft&expand=version'
        )
        expect(client.get).to.have.been.calledWith(
          'wiki/rest/api/content/?type=page&spaceKey=test-space&title=test-title&expand=version'
        )
      })
    })
  })
})
