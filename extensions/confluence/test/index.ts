import { expect, use } from 'chai'
import lodash from 'lodash'
import 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { ConfluenceClient } from '../src/client'
import { Confluence } from '../src/index.js'
const { isEqual } = lodash
use(sinonChai)

function matchRelativeUrl(path: string, query: Record<string, string | string[]>) {
  return sinon.match((v: string) => {
    const search = new URLSearchParams(v.split('?')[1])
    return (
      v.startsWith(path) &&
      Object.entries(query).every(([key, value]) =>
        Array.isArray(value)
          ? isEqual(search.getAll(key).toSorted(), value.toSorted())
          : search.getAll(key).includes(value)
      )
    )
  })
}

describe('confluence', () => {
  describe('Confluence', () => {
    it('should create instance', () => {
      const client = sinon.createStubInstance(ConfluenceClient)
      const confluence = new Confluence(client)
      expect(confluence).to.be.instanceOf(Confluence)
    })
    describe('spaceId', () => {
      it('should get space id', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.resolves({ body: { id: 123 }, status: 200 })
        const spaceId = await confluence.spaceId('test-space')
        expect(spaceId).to.be.equal(123)
        expect(client.get).to.have.been.calledWith('wiki/rest/api/space/test-space')
      })
    })
    describe('page', () => {
      it('should get draft page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [{ id: 123, version: { number: 1 }, status: 'draft' }] },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title')
        expect(page).to.be.deep.equal({ id: 123, version: 1, title: 'test-title', status: 'draft' })
        expect(client.get).to.have.been.calledOnceWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            status: 'draft',
            expand: ['version'],
          })
        )
      })
      it('should get published page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [] },
          status: 200,
        })
        client.get.onSecondCall().resolves({
          body: { results: [{ id: 123, version: { number: 1 }, status: 'draft' }] },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title')
        expect(page).to.be.deep.equal({ id: 123, version: 1, title: 'test-title', status: 'draft' })
        expect(client.get).to.have.been.calledTwice
        expect(client.get).to.have.been.calledWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            status: 'draft',
            expand: ['version'],
          })
        )
        expect(client.get).to.have.been.calledWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            expand: ['version'],
          })
        )
      })
      it('should return undefined for non existing page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.resolves({
          body: { results: [] },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title')
        expect(page).to.be.undefined
        expect(client.get).to.have.been.calledTwice
      })
      it('should return body if asked for', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: {
            results: [
              {
                id: 123,
                version: { number: 1 },
                status: 'draft',
                body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) } },
              },
            ],
          },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title', true)
        expect(page).to.be.deep.equal({
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
        })
        expect(client.get).to.have.been.calledOnceWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            status: 'draft',
            expand: 'version,body.atlas_doc_format',
          })
        )
      })
      it('should return body of published page if asked for', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.onFirstCall().resolves({
          body: { results: [] },
          status: 200,
        })
        client.get.onSecondCall().resolves({
          body: {
            results: [
              {
                id: 123,
                version: { number: 1 },
                status: 'draft',
                body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) } },
              },
            ],
          },
          status: 200,
        })
        const page = await confluence.page('test-space', 'test-title', true)
        expect(page).to.be.deep.equal({
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
        })
        expect(client.get).to.have.been.calledTwice
        expect(client.get).to.have.been.calledWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            status: 'draft',
            expand: 'version,body.atlas_doc_format',
          })
        )
        expect(client.get).to.have.been.calledWith(
          matchRelativeUrl('wiki/rest/api/content/', {
            type: 'page',
            spaceKey: 'test-space',
            title: 'test-title',
            expand: 'version,body.atlas_doc_format',
          })
        )
      })
    })
    describe('createPage', () => {
      it('should create page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.get.resolves({
          body: { id: 321 },
          status: 200,
        })
        client.post.resolves({
          body: {
            id: 123,
            version: { number: 1 },
            status: 'draft',
            body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) } },
          },
          status: 200,
        })
        const page = await confluence.createPage('test-space', {
          content: { foo: 'bar' },
          title: 'test-title',
          status: 'draft',
        })
        expect(page).to.be.deep.equal({
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
        })
        expect(client.post).to.have.been.calledOnceWith('wiki/api/v2/pages', {
          spaceId: 321,
          status: 'draft',
          title: 'test-title',
          body: {
            value: JSON.stringify({ foo: 'bar' }),
            representation: 'atlas_doc_format',
          },
        })
      })
    })
    describe('updatePage', () => {
      it('should update page', async () => {
        const client = sinon.createStubInstance(ConfluenceClient)
        const confluence = new Confluence(client)
        client.put.resolves({
          body: {
            id: 123,
            version: { number: 2 },
            status: 'draft',
            title: 'test-title',
            body: { atlas_doc_format: { value: JSON.stringify({ foo: 'bar' }) } },
          },
          status: 200,
        })
        const page = await confluence.updatePage({
          id: 123,
          version: 1,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
        })
        expect(page).to.be.deep.equal({
          id: 123,
          version: 2,
          title: 'test-title',
          status: 'draft',
          content: { foo: 'bar' },
        })
        expect(client.put).to.have.been.calledOnceWith('wiki/api/v2/pages/123', {
          id: 123,
          type: 'page',
          status: 'draft',
          title: 'test-title',
          body: {
            value: JSON.stringify({ foo: 'bar' }),
            representation: 'atlas_doc_format',
          },
          version: {
            number: 1,
          },
        })
      })
    })
  })
})
